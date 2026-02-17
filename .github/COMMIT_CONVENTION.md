# Commit Message Convention

This project follows a commit message convention inspired by [Fiber](https://github.com/gofiber/fiber) for clear, consistent, and visually identifiable commit history.

## Quick Reference

| Emoji | Type | Description |
|-------|------|-------------|
| 🔥 | `feat` | New features |
| 🐛 | `bug` | Bug fixes |
| ⚡ | `perf` | Performance improvements |
| 🧹 | `chore` | Maintenance, cleanup |
| 📚 | `docs` | Documentation |
| ♻️ | `refactor` | Code refactoring |
| 🚨 | `hotfix` | Critical fixes |
| ✅ | `test` | Tests |
| 🔧 | `config` | Configuration |
| 🗑️ | `remove` | Removing code/files |
| 🚀 | `deploy` | Deployment |
| 💄 | `style` | Code formatting |

## Format

```
<emoji> <type>: <description>

[optional body]

[optional footer]
```

## Detailed Type Descriptions

### 🔥 feat - New Features
Use when adding new functionality to the application.

```bash
🔥 feat: Add user profile picture upload
🔥 feat: Implement course recommendation engine
🔥 feat: Add payment retry mechanism
```

### 🐛 bug - Bug Fixes
Use when fixing a bug that affects users.

```bash
🐛 bug: Fix incorrect price calculation in cart
🐛 bug: Resolve memory leak in WebSocket connection
🐛 bug: Fix pagination offset error in course list
```

### ⚡ perf - Performance Improvements
Use when improving performance without changing functionality.

```bash
⚡ perf: Optimize database queries for dashboard
⚡ perf: Add Redis caching for frequently accessed data
⚡ perf: Reduce bundle size by lazy loading modules
```

### 🧹 chore - Maintenance
Use for routine tasks, dependency updates, and cleanup.

```bash
🧹 chore: Update dependencies to latest versions
🧹 chore: Clean up unused imports
🧹 chore: Configure ESLint rules
```

### 📚 docs - Documentation
Use when only documentation is changed.

```bash
📚 docs: Update API documentation
📚 docs: Add JSDoc comments to utility functions
📚 docs: Update README with setup instructions
```

### ♻️ refactor - Code Refactoring
Use when restructuring code without changing behavior.

```bash
♻️ refactor: Extract payment logic into separate service
♻️ refactor: Convert callbacks to async/await
♻️ refactor: Reorganize module structure
```

### 🚨 hotfix - Critical Fixes
Use for urgent fixes that need immediate deployment.

```bash
🚨 hotfix: Fix production database connection issue
🚨 hotfix: Patch security vulnerability in auth
🚨 hotfix: Restore accidentally deleted user data
```

### ✅ test - Tests
Use when adding or modifying tests.

```bash
✅ test: Add unit tests for payment service
✅ test: Update e2e tests for new API endpoints
✅ test: Improve test coverage for user module
```

### 🔧 config - Configuration
Use for configuration file changes.

```bash
🔧 config: Update TypeORM migration settings
🔧 config: Add new environment variables
🔧 config: Configure CI/CD pipeline
```

### 🗑️ remove - Removing Code
Use when removing deprecated or unused code.

```bash
🗑️ remove: Delete legacy payment provider
🗑️ remove: Remove deprecated API endpoints
🗑️ remove: Clean up unused components
```

### 🚀 deploy - Deployment
Use for deployment-related changes.

```bash
🚀 deploy: Update Docker configuration
🚀 deploy: Add Kubernetes manifests
🚀 deploy: Configure auto-scaling rules
```

### 💄 style - Code Style
Use for formatting changes that don't affect logic.

```bash
💄 style: Format code with Prettier
💄 style: Fix indentation in service files
💄 style: Apply consistent naming convention
```

## Guidelines

### DO

- ✅ Keep the first line under 50 characters
- ✅ Use imperative mood ("Add" not "Added" or "Adds")
- ✅ Reference issue numbers: `🐛 bug: Fix login error (#123)`
- ✅ Be specific about what changed
- ✅ Add body for complex changes

### DON'T

- ❌ End the subject line with a period
- ❌ Use vague descriptions like "Fix bug" or "Update code"
- ❌ Mix multiple types in one commit
- ❌ Write overly long commit messages

## Breaking Changes

For breaking changes, add `BREAKING:` after the type:

```bash
🔥 feat: BREAKING: Change authentication to OAuth2

This changes the authentication flow from JWT to OAuth2.
All existing tokens will be invalidated.

Migration guide: docs/migration/oauth2.md
```

## Multi-line Commits

For complex changes, add a body:

```bash
🔥 feat: Add rate limiting to API endpoints

Implement rate limiting using express-rate-limit to prevent abuse.

Changes:
- 100 requests per 15 minutes for authenticated users
- 20 requests per 15 minutes for anonymous users
- Custom error messages for rate limit exceeded

Closes #456
Related: #123, #789
```

## Commit Message Template

You can set up a commit template by creating `.gitmessage`:

```
# <emoji> <type>: <description>
# |<---- Use 50 chars max --->|

# Body (optional)
# |<---- Use 72 chars max per line ---->|

# Footer (optional)
# Closes #123
# Related: #456, #789
```

Configure git to use it:

```bash
git config commit.template .gitmessage
```

## Emoji Keyboard Shortcuts

### Windows
- `Win + .` to open emoji picker

### macOS
- `Cmd + Ctrl + Space` to open emoji picker

### VS Code
- Install "Emoji" extension for quick insertion

## Examples from Real Commits

```bash
# Feature with scope
🔥 feat: Add video progress tracking for courses

# Bug fix with issue reference
🐛 bug: Fix subscription expiry calculation (#234)

# Performance with metrics
⚡ perf: Reduce API response time by 40%

# Chore with details
🧹 chore: Upgrade NestJS from 9.x to 10.x

# Docs update
📚 docs: Add Swagger annotations to user endpoints

# Refactor with reasoning
♻️ refactor: Split monolithic service into microservices

# Test coverage
✅ test: Achieve 80% coverage for payment module
```
