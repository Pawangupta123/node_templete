# How to Write Code in This Project

This guide explains how everything works. Follow this and your code will be clean, consistent, and production-ready.

## Table of Contents

- [Project Architecture](#project-architecture)
- [Creating a New Module](#creating-a-new-module)
- [Routes — How to Define Endpoints](#routes--how-to-define-endpoints)
- [Controllers — Thin, No Logic](#controllers--thin-no-logic)
- [Services — Pure Business Logic](#services--pure-business-logic)
- [Repositories — All Database Queries](#repositories--all-database-queries)
- [Models — Mongoose Schemas](#models--mongoose-schemas)
- [Validation — Zod DTOs](#validation--zod-dtos)
- [Error Handling — Throw, Don't Catch](#error-handling--throw-dont-catch)
- [Response Format — Always Consistent](#response-format--always-consistent)
- [Pagination — List Endpoints](#pagination--list-endpoints)
- [Database Transactions](#database-transactions)
- [EventBus — Fire and Forget](#eventbus--fire-and-forget)
- [Redis Cache — When to Use](#redis-cache--when-to-use)
- [File Rules](#file-rules)
- [Import Conventions](#import-conventions)
- [Common Mistakes to Avoid](#common-mistakes-to-avoid)

---

## Project Architecture

```
Request → Route (validate) → Controller (thin) → Service (logic) → Repository (DB) → Model (schema)
                                    ↓
                              Response (sendSuccess / sendError)

Error at any point → Caught by catchAsync → errorHandler → JSON response
```

**Key idea:** Each layer has ONE job. Don't mix them. (Principle: Single Responsibility, Separation of Concerns)

| Layer          | Job                                     | Knows about        | Lines per method |
| -------------- | --------------------------------------- | ------------------ | ---------------- |
| **Route**      | URL mapping + validation middleware     | Express Router     | 1-3              |
| **Controller** | Parse req, call service, send response  | req, res, service  | 5-10             |
| **Service**    | Business logic, decisions, flow control | repository, errors | 10-50            |
| **Repository** | Database queries, caching               | Model, Redis       | 5-20             |
| **Model**      | Schema definition, indexes, statics     | Mongoose           | —                |

### Why 5 Layers?

```
Controller → "User create karna hai"
Service    → "Pehle check karo email duplicate toh nahi, fir create karo"  (WHAT to do)
Repository → "Plan.findOne({ email }), Plan.create(data)"                  (HOW to do in DB)
```

- **Service ko pata nahi** data MongoDB se aa raha hai ya Redis se — usse farak nahi padta
- **Repository ko pata nahi** ye data kyun chahiye — wo bas query run karta hai
- Agar kal caching add karni ho — sirf repository change, service untouched
- Agar kal DB switch karni ho — sirf repository change, service untouched
- Testing easy — repository mock karo, business logic independently test karo

---

## Creating a New Module

Every feature lives in `src/modules/{feature}/`. Here's how to create one:

### Step 1: Create the folder structure

```
src/modules/user/
├── index.ts                ← Barrel export
├── user.routes.ts          ← Endpoints + Swagger JSDoc
├── user.controller.ts      ← Req/Res handling (thin)
├── user.service.ts         ← Business logic ONLY
├── user.repository.ts      ← Database queries ONLY
├── user.model.ts           ← Mongoose schema + types
└── dto/
    ├── create-user.dto.ts  ← Zod validation schema
    └── update-user.dto.ts
```

For big modules (300+ lines in any file), add a `helpers/` folder:

```
src/modules/record/
├── record.service.ts
├── record.repository.ts
└── helpers/
    ├── filter-builder.ts   ← Complex query filter construction
    ├── search-builder.ts   ← Search query builder (ReDoS safe)
    └── aggregation.ts      ← Heavy aggregation pipelines
```

### Step 2: Register in app.routes.ts

```ts
// src/app.routes.ts
import { Router } from 'express';
import { healthRoutes } from './modules/health';
import userRoutes from './modules/user/user.routes';

const router = Router();
router.use(healthRoutes);
router.use('/users', userRoutes); // Add your module here

export default router;
```

That's it. Your module is now live at `/api/v1/users/*`.

---

## Routes — How to Define Endpoints

```ts
// src/modules/user/user.routes.ts
import { Router } from 'express';
import { UserController } from './user.controller';
import { catchAsync } from '../../common/helpers';
import { validate } from '../../common/validators';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';

const router = Router();

// No validation needed
router.get('/', catchAsync(UserController.list));
router.get('/:id', catchAsync(UserController.getById));

// With body validation
router.post('/', validate(CreateUserDto), catchAsync(UserController.create));
router.patch('/:id', validate(UpdateUserDto), catchAsync(UserController.update));

// With query validation
// router.get('/search', validate(SearchQueryDto, 'query'), catchAsync(UserController.search));

// With params validation
// router.get('/:id', validate(ParamsDto, 'params'), catchAsync(UserController.getById));

router.delete('/:id', catchAsync(UserController.delete));

export default router;
```

### Rules:

- Always wrap controller methods with `catchAsync()` — errors auto-forward to error handler
- Always validate request body with `validate(ZodSchema)` — controller gets clean data
- `validate()` supports 3 sources: `'body'` (default), `'query'`, `'params'`

---

## Controllers — Thin, No Logic

Controllers only do 3 things: **read request → call service → send response**.

```ts
// src/modules/user/user.controller.ts
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { sendSuccess, sendPaginated } from '../../common/helpers';

const userService = new UserService();

export class UserController {
  static async list(req: Request, res: Response) {
    const result = await userService.findAll(req.query);
    sendPaginated(res, result.data, result.pagination);
  }

  static async getById(req: Request, res: Response) {
    const user = await userService.findById(req.params.id);
    sendSuccess(res, user, 'User fetched');
  }

  static async create(req: Request, res: Response) {
    const user = await userService.create(req.body);
    sendSuccess(res, user, 'User created', 201);
  }

  static async update(req: Request, res: Response) {
    const user = await userService.update(req.params.id, req.body);
    sendSuccess(res, user, 'User updated');
  }

  static async delete(req: Request, res: Response) {
    await userService.delete(req.params.id);
    sendSuccess(res, null, 'User deleted');
  }
}
```

### Rules:

- **NO try-catch** — `catchAsync` handles it
- **NO validation** — `validate()` middleware handles it
- **NO business logic** — service handles it
- **NO database queries** — service + repository handle it
- **NO direct `res.json()`** — use `sendSuccess()` / `sendPaginated()`
- Max **5-10 lines** per method

---

## Services — Pure Business Logic

Services contain ONLY business logic. They use repositories for all database access. They throw errors when something goes wrong. Services DO NOT import Mongoose models directly.

```ts
// src/modules/user/user.service.ts
import { UserRepository } from './user.repository';
import { NotFoundError, ConflictError } from '../../common/errors';
import { paginate, PaginationOptions } from '../../common/utils';
import { CreateUserDtoType } from './dto/create-user.dto';

export class UserService {
  constructor(private userRepo = new UserRepository()) {}

  async findAll(query: PaginationOptions) {
    const { skip, limit, meta } = paginate(query);
    const [users, total] = await Promise.all([this.userRepo.findActive({ skip, limit }), this.userRepo.countActive()]);
    return { data: users, pagination: meta(total) };
  }

  async findById(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundError('User not found');
    return user;
  }

  async create(data: CreateUserDtoType) {
    // Business decision: check duplicate
    const exists = await this.userRepo.existsByEmail(data.email);
    if (exists) throw new ConflictError('Email already registered');

    // Business decision: assign default role
    return this.userRepo.create(data);
  }

  async update(id: string, data: Partial<CreateUserDtoType>) {
    const user = await this.userRepo.updateById(id, data);
    if (!user) throw new NotFoundError('User not found');
    return user;
  }

  async delete(id: string) {
    const user = await this.userRepo.deleteById(id);
    if (!user) throw new NotFoundError('User not found');
  }
}
```

### Rules:

- **Never import Mongoose models** — use repository
- **Never import `req` or `res`** — services don't know about HTTP
- **Throw specific errors** — `NotFoundError`, `ConflictError`, etc.
- **Don't catch errors** unless you need to transform them
- **Business logic only** — decisions, validations, calculations, flow control
- Repository is injected via constructor (Dependency Inversion principle — easy to mock in tests)

---

## Repositories — All Database Queries

Repositories are the ONLY place where Mongoose models are used. They handle all database reads, writes, and caching. Services call repositories — never Mongoose directly.

```ts
// src/modules/user/user.repository.ts
import { UserModel, IUser } from './user.model';
import { CreateUserDtoType } from './dto/create-user.dto';

export class UserRepository {
  async findById(id: string): Promise<IUser | null> {
    return UserModel.findById(id);
  }

  async findActive(options: { skip: number; limit: number }): Promise<IUser[]> {
    return UserModel.find({ isActive: true }).sort({ createdAt: -1 }).skip(options.skip).limit(options.limit);
  }

  async countActive(): Promise<number> {
    return UserModel.countDocuments({ isActive: true });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const doc = await UserModel.exists({ email });
    return doc !== null;
  }

  async create(data: CreateUserDtoType): Promise<IUser> {
    return UserModel.create(data);
  }

  async updateById(id: string, data: Partial<CreateUserDtoType>): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteById(id: string): Promise<IUser | null> {
    return UserModel.findByIdAndDelete(id);
  }
}
```

### When to add caching (in repository, service doesn't change):

```ts
// user.repository.ts — with Redis caching
import { redisClient } from '../../config/redis.config';

export class UserRepository {
  private CACHE_TTL = 300; // 5 minutes

  async findById(id: string): Promise<IUser | null> {
    // Check cache first
    const cached = await redisClient.get(`user:${id}`);
    if (cached) return JSON.parse(cached);

    // Cache miss — query DB
    const user = await UserModel.findById(id);
    if (user) {
      await redisClient.setex(`user:${id}`, this.CACHE_TTL, JSON.stringify(user));
    }
    return user;
  }

  async updateById(id: string, data: Partial<CreateUserDtoType>): Promise<IUser | null> {
    const user = await UserModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    // Invalidate cache after update
    await redisClient.del(`user:${id}`);
    return user;
  }
}
// Service ko pata bhi nahi caching ho rahi hai — clean separation
```

### Rules:

- **Only file that imports Mongoose models** — no other file should
- **No business logic** — just query and return
- **One query per method** — keep methods focused
- **Method names describe the query** — `findActive()`, `countByFormId()`, `existsByEmail()`
- **Caching goes here** — service doesn't know about Redis cache
- **Return raw data** — let service decide what to do with it

### Repository for complex queries (helpers):

When repository gets big (record module, form module), extract query builders:

```ts
// src/modules/record/helpers/filter-builder.ts
export function buildRecordFilters(query: RecordQueryDto): FilterQuery<IRecord> {
  const filters: FilterQuery<IRecord> = {};
  if (query.status) filters.status = query.status;
  if (query.search) {
    // ReDoS safe — escape special regex characters
    const escaped = query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filters.title = { $regex: escaped, $options: 'i' };
  }
  if (query.dateFrom || query.dateTo) {
    filters.createdAt = {};
    if (query.dateFrom) filters.createdAt.$gte = new Date(query.dateFrom);
    if (query.dateTo) filters.createdAt.$lte = new Date(query.dateTo);
  }
  return filters;
}

// src/modules/record/record.repository.ts
import { buildRecordFilters } from './helpers/filter-builder';

export class RecordRepository {
  async findByForm(formId: string, query: RecordQueryDto, options: { skip: number; limit: number }) {
    const filters = buildRecordFilters(query);
    return RecordModel.find({ formId, ...filters })
      .sort({ createdAt: -1 })
      .skip(options.skip)
      .limit(options.limit);
  }
}
```

---

## Models — Mongoose Schemas

```ts
// src/modules/user/user.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Indexes — ALWAYS add indexes for fields you query/filter/sort by
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1, isActive: 1 });
UserSchema.index({ createdAt: -1 });

export const UserModel = mongoose.model<IUser>('User', UserSchema);
```

### Rules:

- Always define a TypeScript `interface` for the document
- Always add `{ timestamps: true }` — auto `createdAt` + `updatedAt`
- Always add **indexes** for fields you filter/sort by (without index = slow full scan)
- Use `select: false` for sensitive fields (passwords, tokens)
- Use `trim: true` for string fields
- Use `lowercase: true` for email
- Models are ONLY imported in repository files

---

## Validation — Zod DTOs

```ts
// src/modules/user/dto/create-user.dto.ts
import { z } from 'zod';

export const CreateUserDto = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
  email: z.string().email('Invalid email address').toLowerCase(),
  role: z.enum(['admin', 'user']).default('user'),
});

export const UpdateUserDto = CreateUserDto.partial(); // All fields optional

// Export types for use in services
export type CreateUserDtoType = z.infer<typeof CreateUserDto>;
export type UpdateUserDtoType = z.infer<typeof UpdateUserDto>;
```

### Rules:

- One DTO file per operation (or group related ones)
- Export the Zod schema (for middleware) AND the TypeScript type (for services)
- Add meaningful error messages: `.min(2, 'Name too short')`
- Use `.trim()`, `.toLowerCase()` in the schema — data comes clean to controller

---

## Error Handling — Throw, Don't Catch

Available error classes in `src/common/errors/`:

| Error                  | Status Code | When to use                 |
| ---------------------- | ----------- | --------------------------- |
| `AppError`             | any         | Custom status code          |
| `NotFoundError`        | 404         | Resource doesn't exist      |
| `ValidationError`      | 400         | Invalid data                |
| `UnauthorizedError`    | 401         | Not logged in               |
| `ForbiddenError`       | 403         | Logged in but no permission |
| `ConflictError`        | 409         | Duplicate resource          |
| `TooManyRequestsError` | 429         | Rate limit exceeded         |

### How errors flow:

```
Service throws → catchAsync catches → errorHandler formats → JSON response
```

```ts
// In service — just throw
throw new NotFoundError('User not found');

// Client receives:
// HTTP 404
// { "success": false, "message": "User not found" }
```

### Rules:

- **Never** return error responses manually — throw an error instead
- **Never** use `try-catch` in controllers — `catchAsync` does it
- Use `try-catch` in services **only** when you need to transform an error

---

## Response Format — Always Consistent

Every endpoint returns the same format. Use these helpers from `src/common/helpers/`:

```ts
import { sendSuccess, sendError, sendPaginated } from '../../common/helpers';

// Success — data + message
sendSuccess(res, user, 'User fetched');
// → { success: true, message: "User fetched", data: { ... } }

// Success with custom status code
sendSuccess(res, user, 'User created', 201);

// Paginated list
sendPaginated(res, users, pagination);
// → { success: true, message: "Success", data: [...], pagination: { page, limit, total, totalPages } }

// Errors (usually you throw instead, but for edge cases):
sendError(res, 'Something went wrong', 500);
// → { success: false, message: "Something went wrong" }
```

---

## Pagination — List Endpoints

```ts
// In service — uses repository for DB calls
async findAll(query: { page?: number; limit?: number }) {
  const { skip, limit, meta } = paginate(query);

  const [data, total] = await Promise.all([
    this.userRepo.findActive({ skip, limit }),
    this.userRepo.countActive(),
  ]);

  return { data, pagination: meta(total) };
}
```

- Default: page 1, limit 20
- Max limit: 100 (prevents someone requesting 10,000 items at once)
- Always use `Promise.all` for data + count (runs in parallel, faster)

---

## Database Transactions

When multiple DB operations must succeed or fail together:

```ts
import { withTransaction } from '../../common/utils';

// In service
async transferCredits(fromId: string, toId: string, amount: number) {
  return withTransaction(async (session) => {
    await this.walletRepo.debit(fromId, amount, session);
    await this.walletRepo.credit(toId, amount, session);
    return { fromId, toId, amount };
  });
  // If any operation fails, ALL are rolled back
}

// In repository — accept session parameter
async debit(userId: string, amount: number, session?: ClientSession) {
  return WalletModel.updateOne(
    { userId },
    { $inc: { balance: -amount } },
    { session },
  );
}
```

**Note:** MongoDB transactions require a replica set. Standalone MongoDB doesn't support them.

---

## EventBus — Fire and Forget

For side-effects that shouldn't block the response (logging, cache invalidation, notifications):

```ts
import { eventBus } from '../../common/events/event-bus';

// EMIT — in service, after the main operation is done
async updateProfile(userId: string, data: UpdateProfileDto) {
  const user = await this.userRepo.updateById(userId, data);
  eventBus.emitAsync('user:updated', { userId });  // Non-blocking
  return user;
}

// LISTEN — register once (in module init or main.ts)
eventBus.register('user:updated', async (payload) => {
  // Invalidate cache, log activity, etc.
});
```

### EventBus vs BullMQ:

|                   | EventBus                                         | BullMQ                       |
| ----------------- | ------------------------------------------------ | ---------------------------- |
| Use for           | Cache invalidation, activity logs, notifications | Email, file import, payments |
| If server crashes | Event lost (that's okay)                         | Job retried (reliable)       |
| Speed             | Instant                                          | Redis round-trip             |

---

## Redis Cache — When to Use

| Use Redis for                                    | Don't use Redis for             |
| ------------------------------------------------ | ------------------------------- |
| User role/permissions (avoid DB hit per request) | One-time lookups                |
| Subscription/plan status (5-min TTL)             | Simple config values (use env)  |
| Rate limiting (already configured)               | Data that changes every request |
| Presigned S3 URLs                                |                                 |
| BullMQ job queues                                |                                 |

**Important:** Caching logic goes in the **repository**, not in the service. Service should not know whether data comes from Redis or MongoDB.

---

## File Rules

1. **Max 300-400 lines per file** — if larger, split into helpers/
2. **Max 2 levels of nesting** in response data
3. **No fat controllers** — controller methods should be 5-10 lines
4. **No magic strings** — use constants or enums
5. **Meaningful names** — `activePayment` not `ap`, `isExpired` not `exp`

---

## Import Conventions

```ts
// 1. Node.js built-ins
import { EventEmitter } from 'events';

// 2. External packages
import { Router } from 'express';
import mongoose from 'mongoose';

// 3. Config
import { env } from '../../config/env.config';

// 4. Common (helpers, errors, utils)
import { sendSuccess } from '../../common/helpers';
import { NotFoundError } from '../../common/errors';
import { paginate } from '../../common/utils';

// 5. Same module
import { UserRepository } from './user.repository';
import { CreateUserDtoType } from './dto/create-user.dto';
```

### Who imports what:

| File              | Can import                          | CANNOT import              |
| ----------------- | ----------------------------------- | -------------------------- |
| **routes.ts**     | controller, validators, catchAsync  | service, repository, model |
| **controller.ts** | service, response helpers           | repository, model          |
| **service.ts**    | repository, errors, utils, eventBus | model, req, res            |
| **repository.ts** | model, Redis client                 | service, controller, req   |
| **model.ts**      | mongoose only                       | everything else            |

---

## Common Mistakes to Avoid

### 1. Fat controller

```ts
// BAD — validation, DB calls, error handling all in controller
static async create(req: Request, res: Response) {
  try {
    const { name, email } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const existing = await UserModel.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email exists' });
    const user = await UserModel.create({ name, email });
    res.status(201).json({ success: true, data: user });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
}

// GOOD — thin controller, service does the work
static async create(req: Request, res: Response) {
  const user = await userService.create(req.body);
  sendSuccess(res, user, 'User created', 201);
}
```

### 2. DB queries in service (bypassing repository)

```ts
// BAD — service directly uses Mongoose model
async findById(id: string) {
  const user = await UserModel.findById(id);  // Model imported in service!
  if (!user) throw new NotFoundError();
  return user;
}

// GOOD — service uses repository
async findById(id: string) {
  const user = await this.userRepo.findById(id);  // Repository handles DB
  if (!user) throw new NotFoundError();
  return user;
}
```

### 3. Business logic in repository

```ts
// BAD — repository making business decisions
async createUser(data: CreateUserDtoType) {
  const exists = await UserModel.exists({ email: data.email });
  if (exists) throw new ConflictError('Email taken');  // Business logic!
  return UserModel.create(data);
}

// GOOD — repository just queries, service decides
// repository
async existsByEmail(email: string): Promise<boolean> {
  const doc = await UserModel.exists({ email });
  return doc !== null;
}
async create(data: CreateUserDtoType) {
  return UserModel.create(data);
}

// service
async create(data: CreateUserDtoType) {
  const exists = await this.userRepo.existsByEmail(data.email);
  if (exists) throw new ConflictError('Email taken');  // Decision in service
  return this.userRepo.create(data);
}
```

### 4. Inconsistent response format

```ts
// BAD — every endpoint returns different shape
res.json({ data: user });
res.json({ result: users, count: 10 });
res.json({ status: 'ok', user });

// GOOD — always same format
sendSuccess(res, user, 'User fetched');
sendPaginated(res, users, pagination);
```

### 5. Direct process.env access

```ts
// BAD — could be undefined, no type safety
const secret = process.env.JWT_SECRET;

// GOOD — validated, typed, guaranteed to exist
import { env } from '../../config/env.config';
const secret = env.JWT_SECRET;
```

### 6. N+1 queries (loop mein DB call)

```ts
// BAD — 1 query per item = 100 items = 100 queries
const forms = await this.formRepo.findByUser(userId);
for (const form of forms) {
  form.recordCount = await this.recordRepo.countByForm(form._id);
}

// GOOD — single aggregation in repository = 1 query
const forms = await this.formRepo.findByUserWithRecordCount(userId);
```

---

## Layer Summary — Who Does What

```
┌─────────────────────────────────────────────────┐
│  ROUTE          Validation + routing             │
│  ↓                                               │
│  CONTROLLER     req/res handling (5-10 lines)    │
│  ↓                                               │
│  SERVICE        Business logic + decisions       │
│  ↓              (no DB, no HTTP awareness)       │
│  REPOSITORY     Database queries + caching       │
│  ↓              (no business logic)              │
│  MODEL          Schema definition + indexes      │
└─────────────────────────────────────────────────┘
```

---

## Quick Reference

```ts
// Response helpers
sendSuccess(res, data, message?, statusCode?)
sendError(res, message?, statusCode?, errors?)
sendPaginated(res, data[], pagination, message?)

// Error classes — just throw them
throw new NotFoundError('User not found');       // 404
throw new ValidationError('Invalid email');      // 400
throw new UnauthorizedError('Login required');   // 401
throw new ForbiddenError('Admin only');          // 403
throw new ConflictError('Email already taken');  // 409

// Validation — in routes
validate(ZodSchema)             // validates req.body
validate(ZodSchema, 'query')    // validates req.query
validate(ZodSchema, 'params')   // validates req.params

// Pagination — in services
const { skip, limit, meta } = paginate({ page: 1, limit: 20 });

// Transaction — in services (repository methods accept session)
await withTransaction(async (session) => { ... });

// EventBus — in services
eventBus.emitAsync('event:name', { key: 'value' });
```
