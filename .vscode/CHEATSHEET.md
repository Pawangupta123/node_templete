# VSCode + Express/TS Cheatsheet

Quick reference for common tasks and shortcuts.

## Quick Start

### Start Development Server

```bash
npm run dev      # nodemon + ts-node (hot reload)
```

### Build & Run Production

```bash
npm run build    # Compile TypeScript → dist/
npm start        # Run compiled app
```

## Essential Keyboard Shortcuts

| Action                | Shortcut           |
| --------------------- | ------------------ |
| **Command Palette**   | `Ctrl+Shift+P`     |
| **Quick Open File**   | `Ctrl+P`           |
| **Toggle Terminal**   | `` Ctrl+` ``       |
| **Toggle Sidebar**    | `Ctrl+B`           |
| **Search Files**      | `Ctrl+Shift+F`     |
| **Go to Definition**  | `F12`              |
| **Rename Symbol**     | `F2`               |
| **Format Document**   | `Shift+Alt+F`      |
| **Multi-cursor**      | `Ctrl+Alt+Down/Up` |
| **Select Next Match** | `Ctrl+D`           |

## Debugging

| Action            | Shortcut        |
| ----------------- | --------------- |
| Start Debug       | `F5`            |
| Step Over         | `F10`           |
| Step Into         | `F11`           |
| Step Out          | `Shift+F11`     |
| Continue          | `F5`            |
| Stop              | `Shift+F5`      |
| Restart           | `Ctrl+Shift+F5` |
| Toggle Breakpoint | `F9`            |

## Common Tasks

### Development

```bash
npm run dev          # Dev server with hot reload
npm run build        # Compile TypeScript
npm start            # Run production build
```

### Testing

```bash
npm test             # Run all tests
npm run test:watch   # Watch mode
npm run test:cov     # With coverage
npm run test:e2e     # E2E tests
```

### Code Quality

```bash
npm run lint         # Check + fix linting
npm run typecheck    # TypeScript type check only
```

### Docker

```bash
docker-compose up -d         # Start MongoDB + Redis + App
docker-compose down          # Stop
docker-compose logs -f       # View logs
```

## Creating a New Module

1. Create folder: `src/modules/{feature}/`
2. Create files:
   - `{feature}.routes.ts` — Endpoints
   - `{feature}.controller.ts` — Req/Res (thin)
   - `{feature}.service.ts` — Business logic
   - `{feature}.model.ts` — Mongoose schema
   - `dto/` — Zod validation schemas
   - `index.ts` — Barrel export
3. Register in `src/app.routes.ts`

### Module Pattern

```ts
// Routes — validate + catchAsync
router.post('/', validate(CreateDto), catchAsync(controller.create));

// Controller — thin, no try-catch
static async create(req: Request, res: Response) {
  const result = await service.create(req.body);
  sendSuccess(res, result, 'Created', 201);
}

// Service — throw errors
async create(data: CreateDtoType) {
  if (await this.exists(data.email)) throw new ConflictError('Email taken');
  return Model.create(data);
}
```

## Search & Navigation

### Quick Open (`Ctrl+P`)

```
Ctrl+P → filename          # Quick file search
Ctrl+P → @ → symbol name   # Go to symbol in file
Ctrl+P → # → symbol name   # Go to workspace symbol
Ctrl+P → : → line number   # Go to line
```

### Navigation

```
F12             # Go to definition
Alt+F12         # Peek definition
Shift+F12       # Find all references
Ctrl+T          # Go to symbol
Ctrl+-          # Go back
Ctrl+Shift+-    # Go forward
```

## Code Editing

### Multi-Cursor

```
Ctrl+Alt+Down/Up    # Add cursor above/below
Alt+Click           # Add cursor at position
Ctrl+D              # Select next occurrence
Ctrl+Shift+L        # Select all occurrences
```

### Lines

```
Ctrl+X          # Cut line (no selection needed)
Alt+Down/Up     # Move line down/up
Shift+Alt+Down  # Copy line down
Ctrl+Shift+K    # Delete line
Ctrl+/          # Toggle line comment
```

## REST Client

Create `.http` files to test your API:

```http
### Health Check
GET http://localhost:3001/api/v1/health

### Create User
POST http://localhost:3001/api/v1/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

Click "Send Request" above each request to test.

## Key Files

| File                       | Purpose                           |
| -------------------------- | --------------------------------- |
| `src/main.ts`              | Server bootstrap                  |
| `src/app.routes.ts`        | All module routes registered here |
| `src/config/env.config.ts` | Environment variable validation   |
| `src/common/helpers/`      | sendSuccess, catchAsync           |
| `src/common/errors/`       | Custom error classes              |
| `src/common/validators/`   | Zod validation middleware         |
| `CONTRIBUTING.md`          | Full coding guide                 |

## Troubleshooting

### Restart TypeScript Server

```
Ctrl+Shift+P → TypeScript: Restart TS Server
```

### Reload Window

```
Ctrl+Shift+P → Developer: Reload Window
```

### CRLF Line Ending Errors

Already configured: `.prettierrc` has `endOfLine: "lf"`, format on save converts automatically.

---

**Keep this handy!**
