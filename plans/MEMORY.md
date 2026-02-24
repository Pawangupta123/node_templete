# Project Memory

## What This Project Is
- **New optimized backend template** at `c:\Users\HP\nestjs-boilerplate`
- Built from NestJS boilerplate → converted to **Express + TypeScript + MongoDB + Redis**
- Purpose: Replace existing production backend (`C:\Users\HP\easemyresearch_backend_v1`)

## Template Tech Stack (Already Built)
- Express + TypeScript (strict mode)
- MongoDB/Mongoose + IORedis + BullMQ
- Swagger (`swagger-jsdoc` + `swagger-ui-express`) at `/api-docs`
- Winston logger (console + file), Morgan (HTTP logs)
- Zod env validation, Helmet, Compression, CORS
- Rate limiting (Redis-backed), Graceful shutdown
- Centralized error handling (`AppError` class)

## Architecture — 5 Layers (MANDATORY)
```
Route → Controller → Service → Repository → Model
```
| Layer | Job | Imports |
|-------|-----|---------|
| Route | Validation + routing | controller, validators |
| Controller | req/res only (5-10 lines) | service, helpers |
| Service | Business logic ONLY | repository, errors, utils |
| Repository | DB queries + caching | model, Redis |
| Model | Schema + indexes | mongoose only |

**Key:** Service NEVER imports Model. Repository NEVER has business logic. Caching lives in Repository.

## Template Structure
```
src/
├── main.ts, app.routes.ts, api-docs.ts
├── config/ (env, db, redis, cors, rate-limit, logger, bullmq)
├── common/middleware/error-handler.ts
├── common/errors/index.ts (AppError, NotFoundError, etc.)
├── common/helpers/ (sendSuccess, catchAsync, response.helper)
├── common/validators/ (Zod validate middleware)
├── common/utils/ (pagination, transaction)
├── common/events/event-bus.ts
├── common/guards/, common/decorators/
├── modules/health/ (example module)
├── modules/ (feature modules go here)
├── utils/, types/
```

## Module Structure (EVERY module follows this)
```
src/modules/{feature}/
├── index.ts                ← Barrel export
├── {feature}.routes.ts     ← Router + Swagger + validation
├── {feature}.controller.ts ← Thin — req/res only
├── {feature}.service.ts    ← Business logic ONLY
├── {feature}.repository.ts ← DB queries ONLY
├── {feature}.model.ts      ← Mongoose schema + types
├── dto/                    ← Zod validation schemas
└── helpers/                ← Complex query builders (if needed)
```

## 49 Backend Principles — RULEBOOK
See `memory/backend-principles.md` for full list. ALL must be followed.

## Migration Plan — See `plans/deep-zooming-moonbeam.md`
- 20-day roadmap, 1 feature/day
- Backward compatible (purana backend chalta rahega)
- Response: `{ success, message, data }`
- Same DB, same endpoints, same payloads

## Core Rules
1. Max 300-400 lines per file
2. Flat response (max 2 levels nesting)
3. Loosely coupled modules
4. Redis: auth cache, rate limit, subscription cache, BullMQ, presigned URLs
5. Clean code for new developers
6. Repository pattern MANDATORY — no DB queries in service
7. Service = business logic, Repository = data access

## User Preferences
- Speaks Hinglish (Hindi + English mix)
- Wants production-grade, company-level code quality
- Very concerned about existing user impact — zero downtime migration
- Backward compatible approach chosen
- Plans to do 1 module per day
- **ALWAYS show ALL approaches/options — user decides, not me**
- **NEVER skip principles — follow all 49, no shortcuts**
- **Don't overthink — just do what user says**

## Key Issues Found in Existing Backend
- See `plans/deep-zooming-moonbeam.md` for full list
- Critical: password/OTP leaks, no rate limiting, timing attacks, fat controllers
- Schema bugs: bio default=true, invalid mongoose refs, no indexes
- Redundant models: payments+paymentHistory, statisticalTable+survivalAnalysis
- Dashboard API returns shared forms (should be separate endpoint)
