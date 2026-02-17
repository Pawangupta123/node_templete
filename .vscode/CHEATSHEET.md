# VSCode + NestJS Cheatsheet

Quick reference for common tasks and shortcuts.

## 🚀 Quick Start

### Start Development Server
```bash
# Fastest (SWC)
pnpm run start:swc

# Standard
pnpm run dev
```

### Debug Application
1. Press `F5`
2. Select "Debug NestJS (SWC)"
3. Set breakpoints by clicking line numbers

## ⌨️ Essential Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| **Command Palette** | `Ctrl+Shift+P` |
| **Quick Open File** | `Ctrl+P` |
| **Toggle Terminal** | `` Ctrl+` `` |
| **Toggle Sidebar** | `Ctrl+B` |
| **Search Files** | `Ctrl+Shift+F` |
| **Go to Definition** | `F12` |
| **Rename Symbol** | `F2` |
| **Format Document** | `Shift+Alt+F` |
| **Multi-cursor** | `Ctrl+Alt+↓/↑` |
| **Select Next Match** | `Ctrl+D` |

## 🐛 Debugging

| Action | Shortcut |
|--------|----------|
| Start Debug | `F5` |
| Step Over | `F10` |
| Step Into | `F11` |
| Step Out | `Shift+F11` |
| Continue | `F5` |
| Stop | `Shift+F5` |
| Restart | `Ctrl+Shift+F5` |
| Toggle Breakpoint | `F9` |

## 📝 Code Snippets

Type these prefixes and press `Tab`:

| Prefix | Creates |
|--------|---------|
| `nest-controller` | Full CRUD controller |
| `nest-service` | Service with repository |
| `nest-module` | Module definition |
| `nest-entity` | TypeORM entity |
| `nest-dto` | DTO with validation |
| `nest-resource-module` | Resource module |
| `nest-guard` | Guard class |
| `nest-interceptor` | Interceptor class |
| `nest-pipe` | Pipe class |
| `nest-test` | Test suite |

## 🎯 Common Tasks

### Run via Command Palette (`Ctrl+Shift+P`)

```
Tasks: Run Task →
  ├─ Start Dev (SWC)          # Start dev server
  ├─ Build (SWC)              # Build with SWC
  ├─ Run Tests                # Run all tests
  ├─ Run Tests (Watch)        # Watch mode
  ├─ Run Tests (Coverage)     # With coverage
  ├─ Lint                     # Run ESLint
  ├─ Format Code              # Format with Prettier
  ├─ Type Check               # TypeScript check
  ├─ Generate Module          # NestJS CLI
  ├─ Generate Controller      # NestJS CLI
  └─ Generate Service         # NestJS CLI
```

### Build & Run

```bash
# Development
pnpm run start:swc          # Fast dev with SWC
pnpm run start:debug        # Debug mode

# Production
pnpm run build              # Build for production
pnpm run start:prod         # Run production build
```

### Testing

```bash
pnpm run test               # Run all tests
pnpm run test:watch         # Watch mode
pnpm run test:cov           # With coverage
pnpm run test:e2e           # E2E tests
```

### Code Quality

```bash
pnpm run lint               # Check linting
pnpm run lint --fix         # Fix linting issues
pnpm run format             # Format code
tsc --noEmit                # Type check only
```

## 🔍 Search & Navigation

### Quick Open (`Ctrl+P`)
```
# Quick file search
Ctrl+P → filename

# Go to symbol in file
Ctrl+P → @ → symbol name

# Go to workspace symbol
Ctrl+P → # → symbol name

# Go to line
Ctrl+P → : → line number
```

### Search
```
Ctrl+F          # Find in current file
Ctrl+H          # Find and replace
Ctrl+Shift+F    # Find in all files
Ctrl+Shift+H    # Replace in all files
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

## 🎨 Code Editing

### Multi-Cursor
```
Ctrl+Alt+↓/↑    # Add cursor above/below
Alt+Click       # Add cursor at position
Ctrl+D          # Select next occurrence
Ctrl+Shift+L    # Select all occurrences
```

### Lines
```
Ctrl+X          # Cut line (no selection)
Ctrl+C          # Copy line (no selection)
Alt+↓/↑         # Move line down/up
Shift+Alt+↓/↑   # Copy line down/up
Ctrl+Shift+K    # Delete line
```

### Code Actions
```
Ctrl+.          # Quick fix / refactor
F2              # Rename symbol
Shift+Alt+F     # Format document
Ctrl+/          # Toggle line comment
Shift+Alt+A     # Toggle block comment
```

## 🧪 Testing

### Run Tests
```
# From command palette
Ctrl+Shift+P → Jest: Current File
Ctrl+Shift+P → Jest: All Tests

# From debug panel
F5 → Jest: Current File
F5 → Jest: Watch Mode
```

### Coverage
```bash
pnpm run test:cov

# Then install Coverage Gutters extension
# View → Command Palette → Coverage Gutters: Display Coverage
```

## 🔧 NestJS CLI

### Generate Resources
```bash
nest generate module users
nest generate controller users
nest generate service users
nest generate class users/dto/create-user.dto --no-spec
nest generate interface users/interface/user.interface --no-spec
```

### Using Tasks
```
Ctrl+Shift+P → Tasks: Run Task →
  ├─ Generate Module
  ├─ Generate Controller
  └─ Generate Service
```

## 📁 File Management

### Explorer
```
Ctrl+Shift+E    # Focus explorer
Ctrl+N          # New file
Ctrl+Shift+N    # New window
Ctrl+W          # Close file
Ctrl+K Ctrl+W   # Close all files
Ctrl+Shift+T    # Reopen closed file
```

### File Nesting
Files are automatically nested:
```
user.entity.ts
  ├─ user.entity.spec.ts
  └─ user.repository.ts

user.controller.ts
  └─ user.controller.spec.ts
```

## 🌐 REST Client

Create `.http` files:

```http
### Local environment
@baseUrl = http://localhost:3000

### Get all users
GET {{baseUrl}}/admin/users
Authorization: Bearer {{token}}

### Create user
POST {{baseUrl}}/admin/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}

### Update user
PUT {{baseUrl}}/admin/users/1
Content-Type: application/json

{
  "name": "Jane Doe"
}
```

Click "Send Request" above each request to test.

## 🔄 Git

```
Ctrl+Shift+G    # Open source control
Ctrl+Enter      # Commit
Ctrl+Shift+P → Git: Pull
Ctrl+Shift+P → Git: Push
Ctrl+Shift+P → Git: Sync
```

### GitLens Features
- Hover over line → See git blame
- Click line number → See commit details
- File history, compare, and more

## 🎯 Resource Module (Custom)

### Basic Usage
```typescript
import { ResourceModule } from '@/core/resource';

ResourceModule.forFeature({
  entity: User,
  routePath: 'users',
  routeOptions: {
    dto: { create: CreateUserDto }
  },
  module: {
    imports: [AdminCrudDomain]
  }
})
```

### With Builder
```typescript
import { ResourceConfigBuilder } from '@/core/resource/helpers';

ResourceConfigBuilder
  .create(User, 'users')
  .withDto(CreateUserDto)
  .withGuards(AuthGuard, RolesGuard)
  .withPagination(20, 100)
  .withSoftDelete()
  .beforeCreate(async (data) => {
    data.slug = slugify(data.name);
    return data;
  })
  .build()
```

### With Presets
```typescript
import { ResourcePresets } from '@/core/resource/helpers';

ResourcePresets.authenticated(
  User,
  'users',
  CreateUserDto,
  [AuthGuard, RolesGuard]
)
```

## 💡 Pro Tips

### 1. Zen Mode
```
Ctrl+K Z        # Enter zen mode
Esc Esc         # Exit zen mode
```

### 2. Split Editor
```
Ctrl+\          # Split editor
Ctrl+1/2/3      # Focus editor group
```

### 3. Workspace Symbols
```
Ctrl+T          # Search all symbols
# Type @ClassName or #functionName
```

### 4. Integrated Terminal
```
Ctrl+`          # Toggle terminal
Ctrl+Shift+`    # New terminal
Ctrl+PageUp/Dn  # Switch terminal
```

### 5. Quick Fixes
```
Ctrl+.          # Show quick fixes
# Auto-import missing imports
# Implement interface
# Generate getters/setters
```

### 6. Breadcrumbs
```
Ctrl+Shift+.    # Focus breadcrumbs
# Navigate file structure
```

### 7. Problems Panel
```
Ctrl+Shift+M    # Toggle problems panel
F8              # Next problem
Shift+F8        # Previous problem
```

### 8. Emmet
```
# In .html or .tsx files
div.container>ul>li*3
# Press Tab to expand
```

## 🛠️ Troubleshooting

### Restart TypeScript Server
```
Ctrl+Shift+P → TypeScript: Restart TS Server
```

### Reload Window
```
Ctrl+Shift+P → Developer: Reload Window
```

### Clear Terminal
```
Ctrl+K (in terminal)
```

### Reset All Settings
```
Ctrl+Shift+P → Preferences: Open Settings (JSON)
# Delete workspace settings if needed
```

## 📚 Resources

- [Full VSCode Documentation](./.vscode/README.md)
- [SWC Guide](../SWC_GUIDE.md)
- [Resource Module Examples](../src/core/resource/examples.md)
- [NestJS Docs](https://docs.nestjs.com/)

---

**Print this and keep it handy! 📌**
