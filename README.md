<p align="center"> <img src="https://nodejs.org/static/images/logo.svg" width="110" alt="Node.js Logo" /> </p> <p align="center"> Scalable and modular <b>Node.js + Express</b> backend template for building production-ready APIs. </p> <p align="center"> <img src="https://img.shields.io/badge/Node.js-Backend-green" /> <img src="https://img.shields.io/badge/Express.js-API-black" /> <img src="https://img.shields.io/badge/Architecture-Clean-blue" /> <img src="https://img.shields.io/badge/Status-Active-success" /> </p>

## Tech Stack

- **Runtime:** Node.js 20 + TypeScript (strict mode)
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Cache/Queue:** Redis (IORedis) + BullMQ
- **Logging:** Winston (console + file)
- **Validation:** Zod (env + request)
- **API Docs:** Swagger UI at `/api-docs`
- **Security:** Helmet, CORS, Rate Limiting (Redis-backed)

## Project Structure

```
src/
├── main.ts                    Server bootstrap
├── app.routes.ts              Central route aggregator
├── api-docs.ts                Swagger setup
├── config/                    All configurations
│   ├── env.config.ts          Zod env validation
│   ├── db.config.ts           MongoDB connection
│   ├── redis.config.ts        Redis connection
│   ├── cors.config.ts         CORS options
│   ├── rate-limit.config.ts   Rate limiter
│   ├── logger.config.ts       Winston logger
│   └── bullmq.config.ts       Queue/Worker helpers
├── common/                    Shared utilities
│   ├── middleware/             Error handler
│   ├── guards/                Auth guards
│   └── decorators/            Custom decorators
└── modules/                   Feature modules
    └── health/                Example module
        ├── index.ts
        ├── health.routes.ts
        ├── health.controller.ts
        └── health.service.ts
```

## Module Pattern

Each feature follows this structure:

```
src/modules/{feature}/
├── index.ts                 Barrel export
├── {feature}.routes.ts      Router + Swagger JSDoc
├── {feature}.controller.ts  Thin — req/res only
├── {feature}.service.ts     Business logic
├── {feature}.model.ts       Mongoose schema
├── {feature}.validator.ts   Zod validation
└── dto/                     Request/Response types
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

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (nodemon + ts-node) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled app |
| `npm run lint` | Lint + fix |
| `npm run typecheck` | Type check without build |
| `npm test` | Run tests |
| `npm run test:e2e` | Run e2e tests |

## Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Health check (MongoDB + Redis status) |
| `GET /api-docs` | Swagger UI |
| `GET /api/v1/*` | API routes |

## Environment Variables

See [.env.example](.env.example) for all available variables.

## License

MIT
