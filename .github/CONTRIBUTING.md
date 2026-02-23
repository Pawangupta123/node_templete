# Contributing to NodeJS Backend

First off, thank you for considering contributing! This guide covers the workflow. For **how to write code**, see [CONTRIBUTING.md](../CONTRIBUTING.md) in the project root.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- MongoDB 7+
- Redis 7+
- Git

### Setup

1. Fork the repository
2. Clone your fork:

   ```bash
   git clone https://github.com/YOUR_USERNAME/nestjs-boilerplate.git
   cd nestjs-boilerplate
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables:

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. Run the development server:

   ```bash
   npm run dev
   ```

6. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Branch Naming Convention

- `feature/` - New features (e.g., `feature/add-user-authentication`)
- `fix/` - Bug fixes (e.g., `fix/login-validation-error`)
- `refactor/` - Code refactoring (e.g., `refactor/user-service`)
- `docs/` - Documentation updates (e.g., `docs/update-readme`)
- `test/` - Test additions/updates (e.g., `test/add-user-tests`)
- `chore/` - Maintenance tasks (e.g., `chore/update-dependencies`)

### Development Commands

```bash
# Start development server (hot reload)
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Lint code
npm run lint

# Type check
npm run typecheck

# Build for production
npm run build
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Strict mode is enabled in `tsconfig.json`
- Avoid using `any` — use proper types or `unknown`
- Use interfaces for object shapes
- Use type aliases for unions and primitives

### Architecture Conventions

- Follow modular architecture patterns (see [CONTRIBUTING.md](../CONTRIBUTING.md))
- Keep controllers thin (5-10 lines per method)
- Business logic goes in services (NO DB queries in service)
- Database queries go in repositories (NO business logic in repository)
- Use Zod DTOs for request validation
- Use guards for authentication/authorization
- Use `catchAsync()` wrapper for all route handlers

### File Structure

```
src/modules/{feature}/
├── {feature}.routes.ts         ← Router + Swagger + validation middleware
├── {feature}.controller.ts     ← Thin — req/res only
├── {feature}.service.ts        ← Business logic ONLY (no DB queries)
├── {feature}.repository.ts     ← Database queries ONLY (no business logic)
├── {feature}.model.ts          ← Mongoose schema
├── dto/                        ← Zod validation schemas
└── index.ts                    ← Barrel export
```

### Code Style

We use ESLint and Prettier for code formatting. Your code must pass linting before being merged.

**Key points:**

- Single quotes for strings
- 2 spaces for indentation
- Trailing commas in objects/arrays
- Semicolons required
- 120 character line length (soft limit)
- LF line endings (auto-configured)

### Naming Conventions

- **Classes**: PascalCase (e.g., `UserService`, `AuthController`)
- **Interfaces**: PascalCase with `I` prefix (e.g., `IUser`, `IPayment`)
- **Functions/Methods**: camelCase (e.g., `getUserById`, `validateEmail`)
- **Variables**: camelCase (e.g., `userEmail`, `isValid`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRY_COUNT`)
- **Files**: dot-separated (e.g., `user.service.ts`, `create-user.dto.ts`)

### Comments

- Explain "why" not "what" in comments
- Keep comments up-to-date with code changes
- Use JSDoc for service methods that aren't self-explanatory

## Commit Guidelines

We follow a commit message convention — see [COMMIT_CONVENTION.md](./COMMIT_CONVENTION.md) for full details.

### Quick Reference

```
🔥 feat: Add user profile picture upload
🐛 bug: Fix incorrect price calculation
⚡ perf: Optimize dashboard aggregation query
🧹 chore: Update dependencies
📚 docs: Update API documentation
♻️ refactor: Extract payment logic into service
```

## Pull Request Process

1. **Update your branch** with the latest from main:

   ```bash
   git checkout main
   git pull upstream main
   git checkout your-branch
   git rebase main
   ```

2. **Run all checks**:

   ```bash
   npm run lint
   npm run typecheck
   npm test
   ```

3. **Commit your changes** following commit guidelines

4. **Push to your fork**:

   ```bash
   git push origin your-branch
   ```

5. **Create a Pull Request** on GitHub

6. **Fill out the PR template** completely

7. **Wait for review** — Address any feedback

8. **Squash and merge** once approved

### PR Requirements

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Controllers are thin (no try-catch, no validation, no DB queries)
- [ ] Services have no Mongoose model imports (use repository)
- [ ] Repositories have no business logic (just queries + caching)
- [ ] Using `sendSuccess()` / `sendPaginated()` for responses
- [ ] Zod validation on all request inputs
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] No merge conflicts
- [ ] Files under 300-400 lines

## Testing

### Unit Tests

- Write tests for all business logic in services
- Use Jest for testing
- Aim for 80%+ code coverage
- Test edge cases and error handling

```typescript
describe('UserService', () => {
  it('should throw NotFoundError for invalid ID', async () => {
    const service = new UserService();
    await expect(service.findById('invalid-id')).rejects.toThrow(NotFoundError);
  });

  it('should throw ConflictError for duplicate email', async () => {
    const service = new UserService();
    await expect(service.create({ email: 'existing@test.com' })).rejects.toThrow(ConflictError);
  });
});
```

### E2E Tests

- Test complete user flows
- Use test database
- Clean up after each test

### Running Tests

```bash
npm test             # Unit tests
npm run test:watch   # Watch mode
npm run test:cov     # Coverage
npm run test:e2e     # E2E tests
```

## Documentation

### Code Documentation

- Document complex business logic in services
- Update README for new features
- Update CONTRIBUTING.md if patterns change

### API Documentation

- Add Swagger JSDoc comments to route files
- Document all endpoints with request/response examples

```typescript
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *       409:
 *         description: Email already exists
 */
router.post('/', validate(CreateUserDto), catchAsync(UserController.create));
```

## Questions?

- Open an issue for bugs or feature requests
- Email the maintainers for private concerns

## License

By contributing, you agree that your contributions will be licensed under the project's license.
