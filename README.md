<p align="center"> <img src="https://nodejs.org/static/images/logo.svg" width="110" alt="Node.js Logo" /> </p> <p align="center"> Scalable and modular <b>Node.js + Express</b> backend template for building production-ready APIs. </p> <p align="center"> <img src="https://img.shields.io/badge/Node.js-Backend-green" /> <img src="https://img.shields.io/badge/Express.js-API-black" /> <img src="https://img.shields.io/badge/Architecture-Clean-blue" /> <img src="https://img.shields.io/badge/Status-Active-success" /> </p>

## Tech Stack

- **Runtime:** Node.js 20 + TypeScript (strict mode)
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Cache/Queue:** Redis (IORedis) + BullMQ
- **Logging:** Winston (console + file) + Morgan (HTTP)
- **Validation:** Zod (env + request body/query/params)
- **API Docs:** Swagger UI at `/api-docs`
- **Security:** Helmet, CORS, Rate Limiting (Redis-backed)
- **Error Handling:** Custom error classes + global error handler

## Project Structure

```
src/
├── main.ts                        Server bootstrap + middleware chain
├── app.routes.ts                  Central route aggregator
├── api-docs.ts                    Swagger setup
│
├── config/                        All configurations
│   ├── env.config.ts              Zod env validation (crash early)
│   ├── db.config.ts               MongoDB connection
│   ├── redis.config.ts            Redis connection (IORedis)
│   ├── cors.config.ts             CORS options
│   ├── rate-limit.config.ts       Rate limiter (Redis-backed)
│   ├── logger.config.ts           Winston logger
│   └── bullmq.config.ts           Queue/Worker factory
│
├── common/                        Shared utilities (har module use karega)
│   ├── errors/                    Custom error classes
│   │   └── index.ts               AppError, NotFound, Validation, Unauthorized, etc.
│   ├── helpers/
│   │   ├── response.helper.ts     sendSuccess(), sendError(), sendPaginated()
│   │   ├── catch-async.ts         catchAsync() — no try-catch in controllers
│   │   └── index.ts               Barrel export
│   ├── validators/
│   │   ├── validate.ts            Zod middleware factory — validate(Schema, 'body'|'query'|'params')
│   │   └── index.ts
│   ├── utils/
│   │   ├── pagination.ts          paginate({ page, limit }) → { skip, limit, meta }
│   │   ├── transaction.ts         withTransaction(async (session) => { ... })
│   │   └── index.ts
│   ├── events/
│   │   └── event-bus.ts           EventBus — fire-and-forget in-process events
│   ├── middleware/
│   │   └── error-handler.ts       Global error handler + 404 handler
│   ├── guards/                    Auth guards (RBAC)
│   └── decorators/                Custom decorators
│
└── modules/                       Feature modules
    └── health/                    Example module
        ├── index.ts               Barrel export
        ├── health.routes.ts       Router + Swagger JSDoc
        ├── health.controller.ts   Thin — delegates to service
        └── health.service.ts      Business logic
```

## Module Pattern

Every feature follows this structure (5 layers — each has ONE job):

```
src/modules/{feature}/
├── index.ts                 Barrel export
├── {feature}.routes.ts      Router + Swagger JSDoc + validation middleware
├── {feature}.controller.ts  Thin — req/res only (5-10 lines per method)
├── {feature}.service.ts     Business logic ONLY (no DB queries)
├── {feature}.repository.ts  Database queries ONLY (no business logic)
├── {feature}.model.ts       Mongoose schema (TypeScript interfaces)
├── dto/                     Zod validation schemas
└── helpers/                 Query builders, complex logic (if needed)
```

## Architecture Flow

```
Route → Controller → Service → Repository → Model
         (req/res)   (logic)    (DB query)   (schema)
```

```ts
// Routes — validation + error wrapping at route level
router.post('/register', validate(RegisterDto), catchAsync(controller.register));

// Controller — THIN, no try-catch, no validation
static async register(req: Request, res: Response) {
  const result = await authService.register(req.body);
  sendSuccess(res, result, 'Registered', 201);
}

// Service — business logic only, uses repository for DB
async register(dto: RegisterDtoType) {
  const exists = await this.authRepo.existsByEmail(dto.email);
  if (exists) throw new ConflictError('Email already registered');
  return this.authRepo.createUser(dto);
}

// Repository — database queries only
async existsByEmail(email: string): Promise<boolean> {
  const doc = await UserModel.exists({ email });
  return doc !== null;
}
```

## Getting Started

```bash
# Install dependencies
npm install

# Copy env file
cp .env.example .env

# Development (with hot reload)
npm run dev

# Build
npm run build

# Production
npm start
```

## Docker

```bash
# Start MongoDB + Redis + App
docker-compose up -d

# Stop
docker-compose down

# Logs
docker-compose logs -f
```

## Scripts

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start dev server (nodemon + ts-node) |
| `npm run build`     | Compile TypeScript to `dist/`        |
| `npm start`         | Run compiled app                     |
| `npm run lint`      | Lint + fix                           |
| `npm run typecheck` | Type check without build             |
| `npm test`          | Run tests                            |
| `npm run test:e2e`  | Run e2e tests                        |

## API Response Format

All endpoints follow the same response structure:

```json
// Success
{ "success": true, "message": "User fetched", "data": { ... } }

// Error
{ "success": false, "message": "Validation failed", "errors": { "email": "Invalid email" } }

// Paginated
{ "success": true, "message": "Success", "data": [...], "pagination": { "page": 1, "limit": 20, "total": 150, "totalPages": 8 } }
```

## Endpoints

| Endpoint             | Description                           |
| -------------------- | ------------------------------------- |
| `GET /api/v1/health` | Health check (MongoDB + Redis status) |
| `GET /api-docs`      | Swagger UI                            |

## Environment Variables

See [.env.example](.env.example) for all available variables.

## Documentation

- [CONTRIBUTING.md](CONTRIBUTING.md) — How to write code in this project (must read for new devs)
- [.github/COMMIT_CONVENTION.md](.github/COMMIT_CONVENTION.md) — Commit message format
- [.github/SECURITY.md](.github/SECURITY.md) — Security policy

## License

MIT
