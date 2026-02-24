# EaseMyResearch Backend — Daily Migration Roadmap

## Context
Migrate `easemyresearch_backend_v1` (plain JS Express) into the new optimized template (Express + TypeScript + MongoDB). One feature/service per day. API contracts same rakhne hain (endpoints, payloads), but internally sab optimize hoga — security, error handling, validation, performance.

**Template ready at:** `c:\Users\HP\nestjs-boilerplate` (already converted to Express+TS+Mongo)

---

## Core Rules (EVERY file, EVERY module)

### 1. Max 300-400 Lines Per File
- Current: authController 925 lines, recordController 2000+, formController 1457
- New: STRICT limit. Agar logic bada hai → helpers/ me todho
- Naya developer 5 min me samajh sake — ye goal hai

### 2. Flat Response Structure (No Deep Nesting)
```ts
// GOOD — flat, predictable
{ success: true, message: "Records fetched", data: [...], pagination: { page, limit, total } }

// BAD — nested, confusing
{ data: { rows: [...], columns: [...], pagination: {...} }, formMetadata: {...} }
```
- Same format har endpoint pe
- Nesting max 2 levels deep

### 3. Loosely Coupled — No Tight Dependencies
- Modules ek dusre ko directly import nahi karenge
- Shared logic → `src/common/` me
- Cross-module communication → service layer se, not controller-to-controller
- Agar auth service chahiye record module me → inject via function params, not direct import of internals

### 4. Redis — Optimal Use (Not Random)
Where to use Redis:
- **Auth:** Cache user role/permissions (avoid 2 DB queries per request)
- **Rate Limiting:** Already done (Redis-backed store)
- **Subscription Status:** Cache active plan (5-min TTL)
- **BullMQ:** Job queues (import, email, bulk operations)
- **Presigned URLs:** Cache S3 URLs (replace in-memory Map leak)
- **Session data:** If needed later

Where NOT to use Redis:
- Simple config values (use env)
- One-time lookups (just query DB)

### 5. Clean Code for New Developers
- Har file ka purpose ek line me clear ho
- Controller = sirf req/res handle karo, 10-15 lines per method max
- Service = business logic, testable independently
- Helper = pure utility functions, no side effects
- No magic strings — constants file use karo
- Meaningful variable names — `activePayment` not `ap`

---

## Current Backend Issues Found

### 🔴 CRITICAL (Security/Money)
- Timing attacks on payment/webhook signature verification (`!==` instead of `timingSafeEqual`)
- No webhook idempotency — duplicate charges possible
- Race conditions in subscription updates (multiple `findOneAndUpdate` not atomic)
- Password/OTP exposed in API responses (authController lines 839, 500, 707)
- No rate limiting on any endpoint
- CORS allows `origin: "*"`
- Add-on costs from client not re-verified from DB
- ReDoS in search (`new RegExp(userInput)` unsanitized)
- File upload: no type validation, 100MB limit, `.any()` accepts everything

### 🟠 HIGH (Reliability)
- Fat controllers (authController 925 lines, recordController 2000+ lines, formController 1457 lines)
- N+1 queries (dashboard loops countDocuments per form, presigned URL per record)
- Import worker: 30,000 retry attempts, entire-import-in-one-transaction
- S3 presigned URL cache = in-memory Map (memory leak, no TTL)
- No centralized error handling or response format
- Active payment query duplicated 8 times across codebase

### 🟡 MEDIUM (Code Quality)
- Inconsistent HTTP status codes (200 for errors)
- No TypeScript, no API docs, no logging
- No graceful shutdown

---

## WEEK 1: Security & Foundation

### Day 1 — Auth Module
**From:** `controllers/auth/authController.js` + `middleware/auth.js` + `models/users.js`

```
src/modules/auth/
├── index.ts
├── auth.routes.ts
├── auth.controller.ts       ← Thin, delegates to service
├── auth.service.ts          ← Login, register, OTP, social auth, token refresh
├── auth.model.ts            ← User + UserSession schemas (TypeScript)
├── auth.middleware.ts        ← JWT verify + role check (Redis-cached)
├── dto/
│   ├── login.dto.ts         ← Zod validation schemas
│   ├── register.dto.ts
│   └── verify-otp.dto.ts
└── auth.validator.ts
```

**Key fixes:**
- `crypto.timingSafeEqual()` for comparisons
- Rate limit on login/register/OTP endpoints
- Never return password/OTP — TypeScript enforced
- Cache user role in Redis (remove 2 DB queries per request)
- Standardized response: `{ success, message, data }`

**Endpoints (same):** `POST /api/v1/auth/email-login`, `/email-register`, `/social-login`, `/verify-otp`, `/forgot-password`, `/reset-password`

---

### Day 2 — Common Helpers (Response, Errors, Validation)
**Create:** shared utilities every module needs

```
src/common/
├── middleware/
│   └── error-handler.ts     ← Already done ✅
├── helpers/
│   ├── response.helper.ts   ← sendSuccess(), sendError()
│   └── async-handler.ts     ← try-catch wrapper for all controllers
├── validators/
│   └── validate.ts          ← Zod middleware factory
└── types/
    └── response.types.ts    ← Standard response interfaces
```

**Response format (all endpoints follow this):**
```ts
{ success: true, message: "...", data: {...} }                    // Success
{ success: false, message: "...", errors?: [...] }                // Error
{ success: true, data: [...], pagination: { page, limit, total }} // Paginated
```

---

### Day 3 — Payment Module
**From:** `controllers/paymentController.js` + `controllers/webhookController.js`

```
src/modules/payment/
├── index.ts
├── payment.routes.ts
├── payment.controller.ts
├── payment.service.ts       ← Order creation, verification, idempotency
├── payment.model.ts         ← Payment + PaymentHistory schemas
├── webhook.controller.ts
├── webhook.service.ts       ← Event sequencing, duplicate detection
├── webhook-log.model.ts     ← NEW: Track processed webhook IDs
├── dto/
└── payment.validator.ts
```

**Key fixes:**
- `crypto.timingSafeEqual()` for signature
- `WebhookLog` model — check event ID before processing (idempotency)
- Atomic updates with aggregation pipelines
- Re-verify costs from DB
- Coupon: atomic `$inc` with `$lt` (race condition fix)

---

### Day 4 — User Module
**From:** `controllers/userController.js`

```
src/modules/user/
├── index.ts
├── user.routes.ts
├── user.controller.ts
├── user.service.ts          ← Profile CRUD, dashboard, shared forms
├── dto/
└── user.validator.ts
```

**Key fixes:**
- Dashboard: single aggregation (not N+1 loop)
- Extract "active payment fetch" to shared service (used 8x currently)
- Never expose password in response

---

### Day 5 — Plan & Subscription Module
**From:** `controllers/planController.js` + `services/usageService.js`

```
src/modules/plan/
├── index.ts
├── plan.routes.ts
├── plan.controller.ts
├── plan.service.ts          ← Plans, quotas, usage tracking
├── plan.model.ts
└── dto/
```

**Key fixes:**
- Redis cache for subscription status (5-min TTL)
- Atomic quota updates

---

## WEEK 2: Core Business Logic

### Day 6 — Form Module
**From:** `controllers/formController.js` (1457 lines)

```
src/modules/form/
├── index.ts
├── form.routes.ts
├── form.controller.ts
├── form.service.ts
├── form.model.ts
├── dto/
├── form.validator.ts
└── helpers/
    ├── field-processor.ts   ← flattenFields(), field type logic
    └── transform.helper.ts  ← Derived field calculations
```

**Key fixes:** Break 547-line updateForm into service methods, XSS sanitization

---

### Day 7 — Record Module
**From:** `controllers/recordController.js` (2000+ lines)

```
src/modules/record/
├── index.ts
├── record.routes.ts
├── record.controller.ts
├── record.service.ts
├── record.model.ts
├── dto/
└── helpers/
    ├── filter-builder.ts
    ├── sort-builder.ts
    └── search-builder.ts   ← Fix ReDoS, escape regex
```

**Key fixes:** ReDoS fix, batch S3 URLs, chunk Promise.all, fix date comparison bug

---

### Day 8 — Import Module (BullMQ)
**From:** `services/queue/` + `services/workers/` + `controllers/importController.js`

```
src/modules/import/
├── index.ts
├── import.routes.ts
├── import.controller.ts
├── import.service.ts
├── import.model.ts
├── queue/
│   ├── import.queue.ts      ← Fix: 3 attempts (not 30K)
│   └── import.worker.ts     ← Fix: chunked transactions
└── helpers/
    ├── type-detector.ts     ← Fix unique value cap bug
    └── excel-processor.ts
```

---

### Day 9 — File/S3 Module
**From:** `utils/uploadFileToS3.js`, `config/aws-config.js`, `config/multer-config.js`

```
src/modules/file/
├── index.ts
├── file.routes.ts
├── file.controller.ts
├── file.service.ts          ← S3 operations
├── file.config.ts           ← AWS client
├── multer.config.ts         ← Whitelist, 10MB limit
└── helpers/
    └── presigned-cache.ts   ← Redis-backed (not in-memory Map)
```

**Key fixes:** Path traversal fix, file type whitelist, Redis cache for presigned URLs

---

### Day 10 — Share & Permission Module
**From:** `controllers/shareController.js` + permission middleware

---

## WEEK 3: Supporting Features

### Day 11 — Blog Module
### Day 12 — Support/Ticket Module
### Day 13 — Analytics/Graph Module
### Day 14 — Statistical Table + Survival Analysis
### Day 15 — Email Module (XSS fix, retry logic, rate limiting)

---

## WEEK 4: Admin & Polish

### Day 16 — Admin Module
### Day 17 — Coupon Module
### Day 18 — Activity Log Module
### Day 19 — Mentor & College Module
### Day 20 — Final: Docker test, CI/CD, Swagger complete, load testing

---

## Standard Module Pattern

```
src/modules/{feature}/
├── index.ts                 ← Barrel export
├── {feature}.routes.ts      ← Router + Swagger JSDoc
├── {feature}.controller.ts  ← Thin — only req/res, delegates to service
├── {feature}.service.ts     ← All business logic
├── {feature}.model.ts       ← Mongoose schema (TypeScript)
├── {feature}.validator.ts   ← Zod schemas
├── dto/                     ← Request/Response types
└── helpers/                 ← Module-specific utilities (if needed)
```

## Per-Module Verification
1. `npm run typecheck` — zero errors
2. API responds same as before (Postman/curl)
3. Response format: `{ success, message, data }`
4. Proper HTTP status codes (not 200 for errors)
5. No password/OTP/secrets in response
6. Swagger docs updated
