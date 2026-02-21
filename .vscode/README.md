# VSCode Configuration

This directory contains VSCode workspace settings, extensions, and debugging configurations for Express + TypeScript development.

## Files Overview

### 1. `settings.json`

Workspace-specific settings that configure:

- **Auto-formatting** with Prettier on save (LF line endings enforced)
- **ESLint** auto-fix on save
- **TypeScript** settings with workspace SDK
- **File nesting** for better project organization
- **Path aliases** for `@/*` imports
- **Editor preferences** (tabs, rulers, word wrap)
- **files.eol** set to `\n` (LF) to prevent CRLF issues on Windows

### 2. `extensions.json`

Recommended extensions:

- **Essential**: ESLint, Prettier, TypeScript
- **Productivity**: Path Intellisense, Auto Import, Todo Tree
- **Database**: MongoDB extension, REST Client
- **Git**: GitLens, Git Graph
- **Quality**: SonarLint, Coverage Gutters

### 3. `launch.json`

Debugging configurations:

- **Debug App** — Debug with ts-node
- **Attach to Process** — Attach to running Node process
- **Jest: Current File** — Debug current test file
- **Jest: All Tests** — Debug all tests

### 4. `tasks.json`

Common development tasks:

- **Dev**: Start dev server with nodemon
- **Build**: Compile TypeScript
- **Test**: Run tests, watch mode, coverage
- **Quality**: Lint, format, type check

## Quick Start

### 1. Install Recommended Extensions

When you open this workspace, VSCode will prompt you to install recommended extensions. Click "Install All" or:

1. Press `Ctrl+Shift+P`
2. Type "Extensions: Show Recommended Extensions"
3. Install all recommendations

### 2. Start Development

```bash
npm run dev    # nodemon + ts-node with hot reload
```

### 3. Run Tasks

1. Press `Ctrl+Shift+P`
2. Type "Tasks: Run Task"
3. Select a task (e.g., "dev", "build", "lint")

### 4. Debug

1. Set breakpoints in your code (click line number gutter)
2. Press `F5` to start debugging
3. Use Debug toolbar for step over, step into, continue

## Common Workflows

### Development Workflow

```bash
# Terminal
npm run dev

# Or via VSCode
Ctrl+Shift+P → Tasks: Run Task → dev
```

### Testing Workflow

```bash
npm test             # Run all tests
npm run test:watch   # Watch mode
npm run test:cov     # With coverage
```

### Code Quality Workflow

- **Auto**: Save file (`Ctrl+S`) — formats automatically with Prettier
- **Manual lint**: `npm run lint`
- **Type check**: `npm run typecheck`

## Key Keyboard Shortcuts

| Action            | Shortcut       |
| ----------------- | -------------- |
| Command Palette   | `Ctrl+Shift+P` |
| Quick Open File   | `Ctrl+P`       |
| Toggle Terminal   | `` Ctrl+` ``   |
| Go to Definition  | `F12`          |
| Rename Symbol     | `F2`           |
| Format Document   | `Shift+Alt+F`  |
| Start Debug       | `F5`           |
| Toggle Breakpoint | `F9`           |

## Troubleshooting

### TypeScript Intellisense Not Working

1. Press `Ctrl+Shift+P`
2. Type "TypeScript: Select TypeScript Version"
3. Select "Use Workspace Version"

### ESLint Not Working

1. Ensure ESLint extension is installed
2. Reload window: `Ctrl+Shift+P` → "Developer: Reload Window"

### Prettier Not Formatting

1. Ensure Prettier extension is installed
2. Check default formatter: `Ctrl+,` → search "default formatter" → select "Prettier"
3. Enable format on save (already set in workspace settings)

### CRLF Line Ending Errors (Delete ␍)

Already handled — `.prettierrc` has `endOfLine: "lf"` and `settings.json` has `files.eol: "\n"`. Files are auto-converted on save.

## Resources

- [VSCode Docs](https://code.visualstudio.com/docs)
- [Express.js Docs](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Mongoose Docs](https://mongoosejs.com/docs/)
- [CONTRIBUTING.md](../CONTRIBUTING.md) — How to write code in this project
