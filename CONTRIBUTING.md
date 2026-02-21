# How to Write Code in This Project

This guide explains how everything works. Follow this and your code will be clean, consistent, and production-ready.

## Table of Contents

- [Project Architecture](#project-architecture)
- [Creating a New Module](#creating-a-new-module)
- [Routes — How to Define Endpoints](#routes--how-to-define-endpoints)
- [Controllers — Thin, No Logic](#controllers--thin-no-logic)
- [Services — All Business Logic](#services--all-business-logic)
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
Request → Route (validate) → Controller (thin) → Service (logic) → Model (DB)
                                    ↓
                              Response (sendSuccess / sendError)

Error at any point → Caught by catchAsync → errorHandler → JSON response
```

**Key idea:** Each layer has ONE job. Don't mix them.

| Layer          | Job                                    | Lines per method |
| -------------- | -------------------------------------- | ---------------- |
| **Route**      | URL mapping + validation middleware    | 1-3              |
| **Controller** | Parse req, call service, send response | 5-10             |
| **Service**    | Business logic, DB calls, throw errors | 10-50            |
| **Model**      | Schema definition, indexes, methods    | —                |

---

## Creating a New Module

Every feature lives in `src/modules/{feature}/`. Here's how to create one:

### Step 1: Create the folder structure

```
src/modules/user/
├── index.ts               ← Barrel export
├── user.routes.ts         ← Endpoints
├── user.controller.ts     ← Req/Res handling
├── user.service.ts        ← Business logic
├── user.model.ts          ← Mongoose schema
└── dto/
    ├── create-user.dto.ts ← Zod validation schema
    └── update-user.dto.ts
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
- **NO direct `res.json()`** — use `sendSuccess()` / `sendPaginated()`
- Max **5-10 lines** per method

---

## Services — All Business Logic

Services contain all business logic. They throw errors when something goes wrong.

```ts
// src/modules/user/user.service.ts
import { UserModel } from './user.model';
import { NotFoundError, ConflictError } from '../../common/errors';
import { paginate, PaginationOptions } from '../../common/utils';

export class UserService {
  async findAll(query: PaginationOptions) {
    const { skip, limit, meta } = paginate(query);
    const [users, total] = await Promise.all([UserModel.find({ isActive: true }).skip(skip).limit(limit), UserModel.countDocuments({ isActive: true })]);
    return { data: users, pagination: meta(total) };
  }

  async findById(id: string) {
    const user = await UserModel.findById(id);
    if (!user) throw new NotFoundError('User not found');
    return user;
  }

  async create(data: { name: string; email: string }) {
    const exists = await UserModel.exists({ email: data.email });
    if (exists) throw new ConflictError('Email already registered');
    return UserModel.create(data);
  }

  async update(id: string, data: Partial<{ name: string; email: string }>) {
    const user = await UserModel.findByIdAndUpdate(id, data, { new: true });
    if (!user) throw new NotFoundError('User not found');
    return user;
  }

  async delete(id: string) {
    const user = await UserModel.findByIdAndDelete(id);
    if (!user) throw new NotFoundError('User not found');
  }
}
```

### Rules:

- **Throw specific errors** — `NotFoundError`, `ConflictError`, `ValidationError`, etc.
- **Never import `req` or `res`** — services don't know about HTTP
- **Don't catch errors** unless you need to transform them

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
import { paginate } from '../../common/utils';

async findAll(query: { page?: number; limit?: number }) {
  const { skip, limit, meta } = paginate(query);

  const [data, total] = await Promise.all([
    UserModel.find().skip(skip).limit(limit),
    UserModel.countDocuments(),
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

async transferCredits(fromId: string, toId: string, amount: number) {
  return withTransaction(async (session) => {
    await WalletModel.updateOne(
      { userId: fromId },
      { $inc: { balance: -amount } },
      { session },
    );
    await WalletModel.updateOne(
      { userId: toId },
      { $inc: { balance: amount } },
      { session },
    );
    return { fromId, toId, amount };
  });
  // If any operation fails, ALL are rolled back
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
  const user = await UserModel.findByIdAndUpdate(userId, data, { new: true });
  eventBus.emitAsync('user:updated', { userId });  // Non-blocking, response pehle jaata hai
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
import { UserService } from './user.service';
import { UserModel } from './user.model';
```

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

### 2. Inconsistent response format

```ts
// BAD — every endpoint returns different shape
res.json({ data: user });
res.json({ result: users, count: 10 });
res.json({ status: 'ok', user });

// GOOD — always same format
sendSuccess(res, user, 'User fetched');
sendPaginated(res, users, pagination);
```

### 3. Catching errors unnecessarily

```ts
// BAD — catching and re-throwing, catchAsync already does this
try {
  const user = await userService.findById(id);
  sendSuccess(res, user);
} catch (err) {
  next(err);
}

// GOOD — let catchAsync handle errors
const user = await userService.findById(id);
sendSuccess(res, user);
```

### 4. Direct process.env access

```ts
// BAD — could be undefined, no type safety
const secret = process.env.JWT_SECRET;

// GOOD — validated, typed, guaranteed to exist
import { env } from '../../config/env.config';
const secret = env.JWT_SECRET;
```

### 5. N+1 queries (loop mein DB call)

```ts
// BAD — 1 query per item = 100 items = 100 queries
const forms = await FormModel.find({ userId });
for (const form of forms) {
  form.recordCount = await RecordModel.countDocuments({ formId: form._id });
}

// GOOD — single aggregation = 1 query
const forms = await FormModel.aggregate([
  { $match: { userId } },
  {
    $lookup: {
      from: 'records',
      localField: '_id',
      foreignField: 'formId',
      as: 'records',
    },
  },
  { $addFields: { recordCount: { $size: '$records' } } },
  { $project: { records: 0 } },
]);
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

// Transaction — in services
await withTransaction(async (session) => { ... });

// EventBus — in services
eventBus.emitAsync('event:name', { key: 'value' });
```
