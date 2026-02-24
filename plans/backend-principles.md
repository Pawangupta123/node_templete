# 49 Backend Principles — RULEBOOK

These are MANDATORY. Follow ALL of them when writing code, reviewing, or making architectural decisions.

---

## SOLID (5)
1. **Single Responsibility** — Ek class, ek kaam
2. **Open/Closed** — Extend karo, modify mat karo
3. **Liskov Substitution** — Child parent ki jagah kaam kare
4. **Interface Segregation** — Sirf zaroori cheez expose karo
5. **Dependency Inversion** — Abstraction pe depend karo, implementation pe nahi

## Code Design (7)
6. **DRY** — Ek baar likho, baar baar use karo
7. **KISS** — Simple solution prefer karo
8. **YAGNI** — Jo abhi chahiye wahi banao, future ke liye mat banao
9. **Law of Demeter** — Apne close dost se baat karo, unke doston se nahi
10. **Fail Fast** — Problem jaldi pakdo, silently mat chalo
11. **Separation of Concerns** — Har layer apna kaam kare
12. **Convention over Configuration** — Defaults sensible rakho

## Architecture (7)
13. **CQRS** — Read aur Write path alag rakho
14. **Event-Driven** — Kaam hua → event emit karo → listeners handle karein
15. **Repository Pattern** — DB queries ek jagah, controllers/services mein direct nahi
16. **Factory Pattern** — Object banane ka kaam ek jagah
17. **Observer Pattern** — Ek change hua → sab notify ho jayen
18. **Middleware Pattern** — Request/Response ke beech mein processing
19. **Dependency Injection** — Dependencies bahar se do, andar mat banao

## API Design (6)
20. **REST Conventions** — Nouns use karo, HTTP verbs sahi lagao
21. **Versioning** — /api/v1/ — breaking changes safe ho jayen
22. **Idempotency** — Same request baar baar bhejo — same result aaye
23. **Backward Compatibility** — Purana frontend todna band karo
24. **Fail Gracefully** — Error aaye toh proper message do, crash mat karo
25. **Pagination** — Ek saath sab mat bhejo

## Distributed Systems (7)
26. **CAP Theorem** — Consistency, Availability, Partition — sirf 2 choose karo
27. **BASE** — Basically Available, Soft state, Eventually consistent
28. **Idempotency** — Queue mein same message 2 baar aaye toh bhi safe ho
29. **Circuit Breaker** — Service down ho toh fail fast, retry mat karo blindly
30. **Bulkhead** — Ek service fail ho toh poora system mat gire
31. **Retry with Backoff** — Fail hua? Thoda wait karo, phir retry karo
32. **Rate Limiting** — Ek user zyada requests mat karne de

## Security (6)
33. **Least Privilege** — Sirf utna access do jitna zaroori hai
34. **Defense in Depth** — Ek layer fail ho toh doosri bachaye
35. **Fail Secure** — Error aaye toh secure default lo
36. **Never Trust Input** — Har input validate karo — frontend ne bheja ho tab bhi
37. **Secrets in Env** — Passwords/keys code mein mat likho kabhi
38. **Crash Early** — Missing config? App start hi mat hone do

## Performance (6)
39. **Cache Aggressively** — Baar baar same DB query mat karo
40. **Async First** — Blocking operations async karo
41. **Index Your Queries** — Bina index ke DB = full table scan
42. **Lazy Loading** — Jo chahiye tab load karo, pehle se nahi
43. **N+1 Problem Avoid** — Loop mein DB call mat karo
44. **TTL on Everything** — Cache/Sessions/Logs — sab expire hone chahiye

## Testing (5)
45. **Test Pyramid** — Unit > Integration > E2E
46. **Arrange-Act-Assert** — Test ka structure clear rakho
47. **Test One Thing** — Ek test, ek behaviour
48. **Mock Dependencies** — DB/Redis test mein mock karo
49. **Test Edge Cases** — Happy path ke saath sad path bhi

---

## How These Map to Our Architecture

| Principle | Where it applies |
|-----------|-----------------|
| SRP (#1) | Controller=req/res, Service=logic, Repository=DB, Model=schema |
| Repository Pattern (#15) | `{feature}.repository.ts` — all DB queries isolated |
| Separation of Concerns (#11) | 5 layers: Route → Controller → Service → Repository → Model |
| DI (#19) | Repository injected into Service via constructor |
| DRY (#6) | Common errors, helpers, validators in `src/common/` |
| Fail Fast (#10) | Zod validation at route level, env validation at startup |
| Event-Driven (#14) | EventBus for lightweight, BullMQ for reliable |
| Cache (#39) | Repository layer handles caching (service doesn't know) |
| N+1 (#43) | Use aggregation pipelines, Promise.all, batch queries |
| Never Trust Input (#36) | Zod validates everything before it reaches controller |
