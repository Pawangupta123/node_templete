# VSCode Configuration

This directory contains VSCode workspace settings, extensions, debugging configurations, and tasks for optimal NestJS development.

## Files Overview

### 1. `settings.json`
Workspace-specific settings that configure:
- **Auto-formatting** with Prettier on save
- **ESLint** auto-fix on save
- **TypeScript** settings with workspace SDK
- **File nesting** for better project organization
- **Path aliases** for `@/*` imports
- **Editor preferences** (tabs, rulers, word wrap)

### 2. `extensions.json`
Recommended extensions for NestJS development:
- **Essential**: ESLint, Prettier, TypeScript
- **NestJS**: Jest Runner, Testing tools
- **Productivity**: Path Intellisense, Auto Import, Todo Tree
- **Database**: Database Client, REST Client
- **Git**: GitLens, Git Graph
- **Quality**: SonarLint, Coverage Gutters

### 3. `launch.json`
Debugging configurations:
- **Debug NestJS (SWC)** - Main debug configuration with hot reload
- **Debug NestJS (Current File)** - Debug specific file
- **Attach to Process** - Attach to running Node process
- **Jest: Current File** - Debug current test file
- **Jest: All Tests** - Debug all tests
- **Jest: Watch Mode** - Run tests in watch mode
- **E2E Tests** - Debug end-to-end tests

### 4. `tasks.json`
Common development tasks:
- **Build**: SWC build, production build, clean build
- **Dev**: Start dev server with SWC
- **Test**: Run tests, watch mode, coverage, E2E
- **Quality**: Lint, format, type check
- **Generate**: NestJS schematics (module, controller, service)
- **Database**: TypeORM migrations

### 5. `nestjs.code-snippets`
NestJS-specific code snippets for faster development:
- `nest-controller` - Full CRUD controller
- `nest-service` - Service with repository
- `nest-module` - Module definition
- `nest-entity` - TypeORM entity
- `nest-dto` - DTO with validation
- `nest-resource-module` - Resource module configuration
- `nest-guard`, `nest-interceptor`, `nest-pipe` - Common decorators
- `nest-test` - Test suite template

## Quick Start

### 1. Install Recommended Extensions

When you open this workspace, VSCode will prompt you to install recommended extensions. Click "Install All" or:

1. Press `Ctrl+Shift+P` (Cmd+Shift+P on Mac)
2. Type "Extensions: Show Recommended Extensions"
3. Install all recommendations

### 2. Start Debugging

**Method 1: Using Debug Panel**
1. Press `F5` or click Debug icon in sidebar
2. Select "Debug NestJS (SWC)" from dropdown
3. Click green play button

**Method 2: Keyboard Shortcut**
- Press `F5` to start debugging
- Press `Shift+F5` to stop debugging
- Press `Ctrl+Shift+F5` to restart debugging

### 3. Run Tasks

**Method 1: Command Palette**
1. Press `Ctrl+Shift+P`
2. Type "Tasks: Run Task"
3. Select a task (e.g., "Start Dev (SWC)")

**Method 2: Terminal Menu**
- Click "Terminal" → "Run Task..."
- Select your task

**Keyboard Shortcut**: `Ctrl+Shift+B` runs the default build task

### 4. Use Code Snippets

1. Create a new `.ts` file
2. Type a snippet prefix (e.g., `nest-controller`)
3. Press `Tab` to expand the snippet
4. Fill in the placeholders

## Common Workflows

### Development Workflow

```bash
# Start dev server with SWC (fastest)
Ctrl+Shift+P → Tasks: Run Task → Start Dev (SWC)

# Or use terminal
pnpm run start:swc
```

### Debugging Workflow

1. Set breakpoints in your code (click line number gutter)
2. Press `F5` to start debugging
3. Use Debug toolbar:
   - Continue (`F5`)
   - Step Over (`F10`)
   - Step Into (`F11`)
   - Step Out (`Shift+F11`)
   - Restart (`Ctrl+Shift+F5`)
   - Stop (`Shift+F5`)

### Testing Workflow

**Run all tests:**
```bash
Ctrl+Shift+P → Tasks: Run Task → Run Tests
```

**Run tests in watch mode:**
```bash
Ctrl+Shift+P → Tasks: Run Task → Run Tests (Watch)
```

**Debug specific test:**
1. Open test file
2. Press `F5`
3. Select "Jest: Current File"

**View coverage:**
```bash
Ctrl+Shift+P → Tasks: Run Task → Run Tests (Coverage)
```
Then install "Coverage Gutters" extension to see coverage in editor.

### Code Quality Workflow

**Lint code:**
```bash
Ctrl+Shift+P → Tasks: Run Task → Lint
```

**Format code:**
- Auto: Save file (`Ctrl+S`) - formats automatically
- Manual: `Ctrl+Shift+P` → "Format Document"

**Type check:**
```bash
Ctrl+Shift+P → Tasks: Run Task → Type Check
```

### Generate Code with NestJS CLI

**Generate module:**
```bash
Ctrl+Shift+P → Tasks: Run Task → Generate Module
```

**Generate controller:**
```bash
Ctrl+Shift+P → Tasks: Run Task → Generate Controller
```

**Generate service:**
```bash
Ctrl+Shift+P → Tasks: Run Task → Generate Service
```

## Keyboard Shortcuts Reference

### Essential Shortcuts

| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| Command Palette | `Ctrl+Shift+P` | `Cmd+Shift+P` |
| Quick Open File | `Ctrl+P` | `Cmd+P` |
| Toggle Terminal | `` Ctrl+` `` | `` Cmd+` `` |
| Toggle Sidebar | `Ctrl+B` | `Cmd+B` |
| Multi-cursor | `Ctrl+Alt+↓/↑` | `Cmd+Option+↓/↑` |
| Find in Files | `Ctrl+Shift+F` | `Cmd+Shift+F` |
| Go to Definition | `F12` | `F12` |
| Peek Definition | `Alt+F12` | `Option+F12` |
| Rename Symbol | `F2` | `F2` |
| Format Document | `Shift+Alt+F` | `Shift+Option+F` |

### Debugging Shortcuts

| Action | Shortcut |
|--------|----------|
| Start/Continue | `F5` |
| Step Over | `F10` |
| Step Into | `F11` |
| Step Out | `Shift+F11` |
| Restart | `Ctrl+Shift+F5` |
| Stop | `Shift+F5` |
| Toggle Breakpoint | `F9` |

### Custom Tasks Shortcuts

You can add custom keyboard shortcuts for frequently used tasks:

1. Press `Ctrl+K Ctrl+S` to open keyboard shortcuts
2. Search for "Tasks: Run Task"
3. Click the `+` icon to add keybinding
4. Assign your preferred shortcut

## Customization

### Personal Settings

To override workspace settings:
1. Press `Ctrl+,` to open settings
2. Switch to "User" tab (workspace settings are in "Workspace" tab)
3. Modify as needed

### Additional Extensions

Install more extensions based on your needs:
- **GraphQL**: `graphql.vscode-graphql`
- **MongoDB**: `mongodb.mongodb-vscode`
- **AWS**: `amazonwebservices.aws-toolkit-vscode`
- **Docker**: `ms-azuretools.vscode-docker`

### Custom Snippets

To add your own snippets:
1. Press `Ctrl+Shift+P`
2. Type "Configure User Snippets"
3. Select "nestjs.code-snippets" or create a new file
4. Add your snippets in JSON format

## Troubleshooting

### TypeScript Intellisense Not Working

1. Press `Ctrl+Shift+P`
2. Type "TypeScript: Select TypeScript Version"
3. Select "Use Workspace Version"

### Debugger Not Stopping at Breakpoints

1. Ensure source maps are enabled in `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "sourceMap": true
     }
   }
   ```
2. Restart the debug session (`Ctrl+Shift+F5`)
3. Check that `.swcrc` has `"sourceMaps": true`

### ESLint Not Working

1. Ensure ESLint extension is installed
2. Reload window: `Ctrl+Shift+P` → "Developer: Reload Window"
3. Check ESLint output: `Ctrl+Shift+U` → Select "ESLint" from dropdown

### Prettier Not Formatting

1. Ensure Prettier extension is installed
2. Check that Prettier is set as default formatter:
   - Press `Ctrl+,`
   - Search "default formatter"
   - Select "Prettier - Code formatter"
3. Enable format on save:
   - Search "format on save"
   - Check the box

### Path Aliases Not Resolving

Ensure `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## Tips & Tricks

### 1. Multi-Cursor Editing
- `Ctrl+Alt+↓/↑` - Add cursor above/below
- `Ctrl+D` - Select next occurrence
- `Alt+Click` - Add cursor at position

### 2. Quick File Navigation
- `Ctrl+P` then type filename
- `Ctrl+P` then `@` to see symbols in file
- `Ctrl+P` then `#` to search workspace symbols

### 3. Refactoring
- `F2` - Rename symbol across all files
- `Ctrl+.` - Quick fix / refactor suggestions
- Right-click → "Extract to function/variable"

### 4. Terminal Management
- `` Ctrl+` `` - Toggle terminal
- `Ctrl+Shift+` `` - New terminal
- `Ctrl+\` - Split terminal

### 5. Git Integration
- `Ctrl+Shift+G` - Open source control
- Click line number gutter - See git blame
- GitLens shows inline blame and history

### 6. Zen Mode
- `Ctrl+K Z` - Enter zen mode (distraction-free)
- `Esc Esc` - Exit zen mode

### 7. REST Client
Create `.http` files to test your API:
```http
### Get all users
GET http://localhost:3000/admin/users

### Create user
POST http://localhost:3000/admin/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

Press "Send Request" above each request to test.

## Resources

- [VSCode Docs](https://code.visualstudio.com/docs)
- [NestJS Docs](https://docs.nestjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Jest Docs](https://jestjs.io/docs/getting-started)
- [TypeORM Docs](https://typeorm.io/)

## Support

If you encounter issues with VSCode configuration:
1. Check this README
2. Search VSCode docs
3. Check extension documentation
4. Ask the team

---

**Happy Coding! 🚀**
