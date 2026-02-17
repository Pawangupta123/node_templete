# Contributing to NestJS Backend

First off, thank you for considering contributing to NestJS Backend! It's people like you that make this project great.

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
- pnpm 8+
- PostgreSQL 16+
- Git

### Setup

1. Fork the repository
2. Clone your fork:

   ```bash
   git clone https://github.com/YOUR_USERNAME/NestJS-Backend.git
   cd NestJS-Backend
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Set up environment variables:

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. Run the development server:

   ```bash
   pnpm run start:swc
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
# Start development server (fastest with SWC)
pnpm run start:swc

# Run tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Run E2E tests
pnpm run test:e2e

# Lint code
pnpm run lint

# Format code
pnpm run format

# Type check
tsc --noEmit

# Build for production
pnpm run build
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode in `tsconfig.json`
- Avoid using `any` - use proper types or `unknown`
- Use interfaces for object shapes
- Use type aliases for unions and primitives

### NestJS Conventions

- Follow NestJS architecture patterns
- Use dependency injection
- Keep controllers thin, services fat
- Use DTOs for data validation
- Use guards for authentication/authorization
- Use interceptors for cross-cutting concerns

### File Structure

```
src/
├── modules/
│   └── user/
│       ├── entities/
│       │   └── user.entity.ts
│       ├── dto/
│       │   ├── create-user.dto.ts
│       │   └── update-user.dto.ts
│       ├── domain/
│       │   └── user.domain.ts
│       ├── presentation/
│       │   └── admin/
│       │       └── admin-user.presentation.ts
│       ├── user.service.ts
│       ├── user.controller.ts
│       └── user.module.ts
```

### Code Style

We use ESLint and Prettier for code formatting. Your code must pass linting before being merged.

**Key points:**

- Single quotes for strings
- 2 spaces for indentation
- Trailing commas in objects/arrays
- Semicolons required
- 120 character line length (soft limit)

### Naming Conventions

- **Classes**: PascalCase (e.g., `UserService`, `CreateUserDto`)
- **Interfaces**: PascalCase with `I` prefix for custom interfaces (e.g., `IUserResponse`)
- **Functions/Methods**: camelCase (e.g., `getUserById`, `validateEmail`)
- **Variables**: camelCase (e.g., `userEmail`, `isValid`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRY_COUNT`)
- **Files**: kebab-case (e.g., `user-service.ts`, `create-user.dto.ts`)

### Comments

- Use JSDoc for public APIs
- Explain "why" not "what" in comments
- Keep comments up-to-date with code changes

```typescript
/**
 * Creates a new user account with email verification
 * @param createUserDto - User registration data
 * @returns Created user entity
 * @throws ConflictException if email already exists
 */
async createUser(createUserDto: CreateUserDto): Promise<User> {
  // Implementation
}
```

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/).

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test additions/updates
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes

### Examples

```
feat(user): add email verification

Implement email verification using JWT tokens.
Sends verification email on user registration.

Closes #123
```

```
fix(auth): prevent token expiration bug

Fixed issue where tokens were expiring immediately
after refresh due to incorrect timezone calculation.

Fixes #456
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
   pnpm run lint
   pnpm run format
   tsc --noEmit
   pnpm run test
   ```

3. **Commit your changes** following commit guidelines

4. **Push to your fork**:

   ```bash
   git push origin your-branch
   ```

5. **Create a Pull Request** on GitHub

6. **Fill out the PR template** completely

7. **Wait for review** - Address any feedback

8. **Squash and merge** once approved

### PR Requirements

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] No merge conflicts
- [ ] Reviewed by at least one maintainer

## Testing

### Unit Tests

- Write tests for all business logic
- Use Jest for testing
- Aim for 80%+ code coverage
- Test edge cases and error handling

```typescript
describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should create a user', async () => {
    const createUserDto = { email: 'test@example.com' };
    const result = await service.create(createUserDto);
    expect(result).toBeDefined();
  });
});
```

### E2E Tests

- Test complete user flows
- Use test database
- Clean up after each test

### Running Tests

```bash
# Unit tests
pnpm run test

# Watch mode
pnpm run test:watch

# Coverage
pnpm run test:cov

# E2E tests
pnpm run test:e2e
```

## Documentation

### Code Documentation

- Add JSDoc comments for public APIs
- Document complex algorithms
- Update README for new features

### API Documentation

- Update Swagger annotations
- Document all endpoints
- Include example requests/responses

```typescript
@ApiOperation({ summary: 'Create a new user' })
@ApiResponse({ status: 201, description: 'User created successfully' })
@ApiResponse({ status: 400, description: 'Bad request' })
@Post()
async create(@Body() createUserDto: CreateUserDto) {
  return this.userService.create(createUserDto);
}
```

### Changelog

- Update CHANGELOG.md for significant changes
- Follow Keep a Changelog format

## Questions?

- Open an issue for bugs or feature requests
- Join our Discord/Slack for discussions
- Email the maintainers for private concerns

## License

By contributing, you agree that your contributions will be licensed under the project's license.

---

**Thank you for contributing! 🎉**
