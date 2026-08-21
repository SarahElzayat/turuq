# User Profile API — Backend Technical Assessment

A RESTful, JWT-protected CRUD API for managing User Profiles, built with
Express, TypeScript, and MongoDB (Mongoose). See
[`DELIVERY_SLOT_PSEUDOCODE.md`](./DELIVERY_SLOT_PSEUDOCODE.md) for Task 2.

## Stack

- Express 4 + TypeScript (strict mode)
- MongoDB via Mongoose
- JWT auth (`jsonwebtoken`)
- Validation: `zod`
- Docs: `swagger-jsdoc` + `swagger-ui-express`
- Tests: `jest` + `supertest` + `mongodb-memory-server`

## Setup

Requires Node 20+ and either a local MongoDB instance or `docker compose`.

```bash
cd backend
npm install
cp .env.example .env      # then edit values as needed
npm run dev                # http://localhost:4000
```

`npm run dev` expects a reachable MongoDB at `MONGO_URI`. Either run MongoDB
yourself (`mongod` locally, or an Atlas connection string), or start just the
database via Docker:

```bash
docker compose up mongo
```

Or run the whole stack (API + Mongo) in containers:

```bash
docker compose up --build
```

### Getting a token

The spec requires the User endpoints to be JWT-protected, not a full
registration system, so there's a single demo token endpoint that trades a
shared seed key (`SEED_API_KEY` in `.env`) for a JWT:

```bash
curl -X POST http://localhost:4000/auth/token \
  -H "Content-Type: application/json" \
  -d '{"apiKey":"change-this-seed-key"}'
```

Use the returned `token` as `Authorization: Bearer <token>` on every
`/users/*` request. This is intentionally minimal — see
[Design notes](#design-notes) below for why.

### API docs

Interactive Swagger UI (with a working "Authorize" button for the bearer
token) is served at **http://localhost:4000/api-docs** once the server is
running.

### Example requests

```bash
TOKEN=<paste token from /auth/token>

curl -X POST http://localhost:4000/users \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","age":30}'

curl "http://localhost:4000/users?page=1&limit=10&age=30" \
  -H "Authorization: Bearer $TOKEN"

curl http://localhost:4000/users/<id> -H "Authorization: Bearer $TOKEN"

curl -X PUT http://localhost:4000/users/<id> \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"age":31}'

curl -X DELETE http://localhost:4000/users/<id> -H "Authorization: Bearer $TOKEN"
```

### Tests

```bash
npm test              # unit + integration
npm run test:unit
npm run test:integration
```

Integration tests spin up an in-memory MongoDB (`mongodb-memory-server`) —
no external database needed to run the suite.

### Lint / build

```bash
npm run lint
npm run build && npm start
```

## Task decomposition & prioritization

The task was broken down and built in this order, so that the app stayed
runnable and independently verifiable at every step rather than needing a
single "big bang" integration at the end:

1. **Bootable skeleton first** — env validation, DB connection, and a
   `/health` route, before any real feature. Nothing else is worth building
   until `npm run dev` reliably boots.
2. **Data model** — the `User` schema, since every other piece depends on its
   shape (indexes on `email`/`age` decided here, up front).
3. **Error handling pipeline before features** — `ApiError`, `catchAsync`,
   the centralized error middleware, and the 404 handler were wired in before
   a single real route existed, so every route written afterwards could
   `throw` and rely on consistent error responses immediately, instead of
   error handling being retrofitted at the end.
4. **Validation layer** — zod schemas + a validation middleware factory,
   built before the controllers that use them.
5. **CRUD without auth** — all five endpoints implemented and manually
   verified against MongoDB first, deliberately *before* adding
   authentication, so CRUD bugs and auth bugs are never debugged at the same
   time.
6. **Pagination + age filtering** — layered onto the working `GET /users`
   once the base endpoint worked.
7. **Auth last, on top of working CRUD** — the `/auth/token` endpoint and the
   JWT middleware were added once the resource endpoints already worked
   unauthenticated, then the middleware was mounted on the user router.
8. **Security hardening sweep** — `helmet`, `cors`, `express-mongo-sanitize`,
   and rate limiting added once the request pipeline was stable, since they
   wrap the whole app rather than any single feature.
9. **Tests** — unit tests alongside each module (pagination math, auth
   middleware token cases, error middleware per error type, controller query
   construction against a mocked model), then integration tests exercising
   the full HTTP surface against a real (in-memory) MongoDB.
10. **Docs (Swagger)** — added once the route surface was stable, so the
    OpenAPI annotations didn't need to be rewritten mid-build.
11. **Deployment artifacts** — `Dockerfile` / `docker-compose.yml` last,
    since they package already-working code rather than shape it.
12. **Task 2 pseudocode** — independent of the API code, written in
    parallel; see that file for its own internal structure.

## Design notes

- **Auth is deliberately minimal.** The spec asks for JWT-protected
  endpoints, not a user-management system, so `POST /auth/token` trades one
  shared `SEED_API_KEY` for a token rather than implementing
  registration/login/password-reset — building the latter would have been
  out-of-scope work the spec never asked for.
- **Response envelope.** `GET /users` returns `{ data, pagination }`; every
  error returns `{ error: { message, details? } }`. The spec doesn't dictate
  a shape, so this was a deliberate, documented choice rather than an
  incidental one.
- **Age filtering** is an exact match (`?age=30`). The spec says "filtering
  by age" without specifying range vs. exact; exact match is the literal
  reading. A `?ageMin=&ageMax=` range filter would be the natural extension
  if that's what's actually wanted.
- **Security scope.** Included: input validation, Mongo operator-injection
  sanitization, rate limiting, `helmet`, CORS. Deliberately **not** included:
  CSRF protection (no cookie session — N/A for a bearer-token API), RBAC,
  refresh-token rotation, account lockout — all out of proportion for this
  assessment's size; noted here so the omissions read as scoped decisions,
  not oversights.
- **Env validation fails fast.** `src/config/env.ts` validates `process.env`
  with zod at boot, so a missing `JWT_SECRET` or `MONGO_URI` is a clear
  startup error instead of a confusing runtime failure later.

## Deployment

`Dockerfile` and `docker-compose.yml` build/run the API (and a local Mongo)
in containers, and are what a host like Render/Railway would run. Actually
deploying to a live URL requires an account on one of those services, which
wasn't set up as part of this submission — the general steps for e.g. Render
would be: push this repo, create a new Web Service pointing at `backend/`,
set the env vars from `.env.example` (using a real MongoDB Atlas URI for
`MONGO_URI`), and let Render build from the `Dockerfile`.
