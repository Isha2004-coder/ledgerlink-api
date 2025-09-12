# LedgerLink API

A minimal REST API to showcase backend depth: authentication, REST endpoints, SQL database, validation, and deployment.

## Tech
- Node.js, Express
- PostgreSQL (users, transactions)
- JWT auth
- Zod validation
- Docker & docker-compose
- Deployed to Render/Heroku (instructions below)

## Quickstart (Local)

```bash
# 1) Install deps
npm install

# 2) Copy env file
cp .env.example .env

# 3) Start Postgres locally in Docker and the API in dev mode
docker compose up -d db
npm run dev

# 4) (In a separate terminal) create tables
psql postgres://postgres:postgres@localhost:5432/ledgerlink -f schema.sql
```

## API

### Signup
```bash
curl -X POST http://localhost:5000/auth/signup -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"secret"}'
```

### Login
```bash
curl -X POST http://localhost:5000/auth/login -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"secret"}'
# -> returns { "token": "..." }
```

### Me
```bash
curl http://localhost:5000/users/me -H "Authorization: Bearer <TOKEN>"
```

### Create Transaction
```bash
curl -X POST http://localhost:5000/transactions -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{"amount": 49.99, "description": "Book"}'
```

### Get My Transactions
```bash
curl http://localhost:5000/transactions -H "Authorization: Bearer <TOKEN>"
```

## Deploying to Render

1. Push this repo to GitHub.
2. Create a **Render > Web Service**: connect repo, choose Node 18, build command `npm install && npm run build`, start command `npm start`.
3. Create a **Render > PostgreSQL** instance and copy its **Internal Connection URL**.
4. In the Web Service **Environment**, set:
   - `DATABASE_URL` = (Render Postgres Internal URL)
   - `JWT_SECRET` = a long random string
   - `PORT` = `5000`
5. Redeploy. After healthy, hit `/health` and `/docs` (when added).

Live API: https://ledgerlink-api-mrpk.onrender.com
Try: /health, /auth/signup, /auth/login, /users/me, /transactions


## Notes
- This is intentionally small but production-leaning: validation, JWT, rate limiting, logging.
- Extend with Swagger docs, pagination, and more tests if you like.
