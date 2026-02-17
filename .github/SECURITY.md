# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of NestJS Backend seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please DO NOT

- Open a public GitHub issue for security vulnerabilities
- Disclose the vulnerability publicly before it has been addressed

### Please DO

**Report security vulnerabilities via email to**: [security@nestjs.com]

Please include the following information in your report:

1. **Type of vulnerability** (e.g., SQL injection, XSS, authentication bypass)
2. **Full paths of affected source files** (if known)
3. **Location of the affected source code** (tag/branch/commit or direct URL)
4. **Step-by-step instructions to reproduce** the vulnerability
5. **Proof-of-concept or exploit code** (if possible)
6. **Impact of the vulnerability** including how an attacker might exploit it

### What to Expect

- **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours
- **Updates**: We will send you regular updates about our progress
- **Verification**: We will work to verify and reproduce the vulnerability
- **Timeline**: We aim to release a fix within 90 days of receiving the report
- **Credit**: We will credit you for the discovery when we announce the fix (unless you prefer to remain anonymous)

## Security Best Practices

### For Contributors

1. **Never commit secrets**
   - No API keys, passwords, or tokens in code
   - Use environment variables for sensitive data
   - Check `.gitignore` includes common secret files

2. **Input validation**
   - Always validate and sanitize user input
   - Use DTOs with class-validator decorators
   - Never trust client-side data

3. **SQL Injection prevention**
   - Use TypeORM query builders or prepared statements
   - Never concatenate user input into SQL queries
   - Use parameterized queries

4. **Authentication & Authorization**
   - Implement proper JWT token validation
   - Use guards for all protected routes
   - Verify user permissions before sensitive operations
   - Implement rate limiting on auth endpoints

5. **Dependency management**
   - Keep dependencies up to date
   - Review Dependabot alerts
   - Run `pnpm audit` regularly
   - Use lock files (`pnpm-lock.yaml`)

### For Deployment

1. **Environment Configuration**

   ```bash
   # Use strong secrets
   JWT_SECRET=<strong-random-string-minimum-32-characters>

   # Enable CORS appropriately
   CORS_ORIGIN=https://your-domain.com

   # Use secure database credentials
   DATABASE_URL=postgresql://user:password@host:5432/db?ssl=true
   ```

2. **HTTPS Only**
   - Always use HTTPS in production
   - Redirect HTTP to HTTPS
   - Use secure cookies (`secure: true, httpOnly: true`)

3. **Rate Limiting**
   - Implement rate limiting on all endpoints
   - Extra strict limits on auth endpoints
   - Use IP-based and user-based limits

4. **Security Headers**
   - Use Helmet.js for security headers
   - Configure CSP appropriately
   - Enable HSTS

5. **Monitoring & Logging**
   - Log security events
   - Monitor for suspicious activity
   - Set up alerts for critical events
   - Never log sensitive information (passwords, tokens)

## Known Security Considerations

### Database

- All database queries use TypeORM's query builder or repository methods
- Parameterized queries prevent SQL injection
- Database credentials stored in environment variables

### Authentication

- JWT tokens with expiration
- Refresh token rotation
- Password hashing with bcrypt (cost factor 10+)
- Rate limiting on login attempts

### API Security

- CORS configured for specific origins
- Helmet.js for security headers
- Request validation with class-validator
- Rate limiting with @nestjs/throttler

## Security Updates

We will announce security updates through:

1. GitHub Security Advisories
2. Email to registered users (if applicable)
3. CHANGELOG.md with `[SECURITY]` prefix

## Compliance

This project aims to comply with:

- OWASP Top 10
- SANS Top 25
- CWE/SANS Top 25 Most Dangerous Software Errors

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NestJS Security Best Practices](https://docs.nestjs.com/security/helmet)
- [Node.js Security Checklist](https://github.com/goldbergyoni/nodebestpractices#6-security-best-practices)

## Hall of Fame

We thank the following researchers for responsibly disclosing security vulnerabilities:

<!-- Add security researchers who have reported vulnerabilities -->

---

**Last Updated**: 2025-01-11
