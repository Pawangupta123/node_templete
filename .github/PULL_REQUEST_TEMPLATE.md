## Description

<!-- Provide a brief description of the changes in this PR -->

## Type of Change

<!-- Mark the relevant option with an "x" -->

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Refactoring (no functional changes)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code cleanup
- [ ] Dependency update

## Related Issues

<!-- Link related issues here -->

Closes #
Fixes #
Related to #

## Changes Made

<!-- Provide a detailed list of changes -->

-
-
-

## Testing

<!-- Describe the tests you ran and how to reproduce them -->

### Test Configuration

- **Node version**:
- **Database**: MongoDB
- **Environment**:

### Test Steps

1.
2.
3.

## Screenshots (if applicable)

<!-- Add screenshots here -->

## Checklist

<!-- Mark completed items with an "x" -->

### Code Quality

- [ ] My code follows the project's code style guidelines (see CONTRIBUTING.md)
- [ ] I have performed a self-review of my code
- [ ] Controllers are thin (5-10 lines per method, no try-catch)
- [ ] Business logic is in services, not controllers
- [ ] I have removed any console.logs and debugging code
- [ ] My changes generate no new warnings or errors
- [ ] I have checked for TypeScript errors (`npm run typecheck`)
- [ ] All files are under 300-400 lines

### Response & Error Handling

- [ ] Using `sendSuccess()` / `sendPaginated()` for responses (not raw `res.json()`)
- [ ] Throwing custom errors (`NotFoundError`, `ConflictError`, etc.) instead of manual error responses
- [ ] All routes use `catchAsync()` wrapper
- [ ] Request body/query/params validated with `validate(ZodSchema)` middleware

### Testing

- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] I have tested the changes manually
- [ ] I have verified the changes work in different environments (if applicable)

### Documentation

- [ ] I have made corresponding changes to the documentation
- [ ] I have updated the README.md (if needed)
- [ ] I have updated Swagger JSDoc comments on routes
- [ ] I have updated CONTRIBUTING.md (if patterns changed)

### Database & Models

- [ ] Mongoose schemas have proper indexes for queried fields
- [ ] Sensitive fields use `select: false` (passwords, tokens)
- [ ] Transactions used where multiple writes must be atomic
- [ ] N/A — No database changes

### Security

- [ ] I have reviewed the code for security vulnerabilities
- [ ] I have not exposed any sensitive information (API keys, passwords, etc.)
- [ ] User inputs validated with Zod schemas before DB operations
- [ ] No raw `req.body` passed directly to MongoDB queries
- [ ] Using `env.config` instead of `process.env` directly

### Performance

- [ ] I have considered the performance impact of my changes
- [ ] No N+1 queries (no DB calls inside loops)
- [ ] Using `Promise.all()` for parallel independent queries
- [ ] Added appropriate Redis caching (if needed)
- [ ] N/A — No performance concerns

## Deployment Notes

<!-- Any special deployment considerations? -->

- [ ] Requires environment variable updates
- [ ] Requires dependency installation (`npm install`)
- [ ] Requires server restart
- [ ] No special deployment steps needed

## Breaking Changes

<!-- If this PR introduces breaking changes, describe them here and the migration path -->

## Additional Notes

<!-- Any additional information that reviewers should know -->
