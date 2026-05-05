# OfficeAtlas Backend

OfficeAtlas backend is an Express API that connects the frontend to Supabase for users and location data. It handles account registration, login, JWT refresh, protected location fetching, rate-limited login attempts, and an auth availability check used by the portfolio demo.

## Tech Stack

- Express
- TypeScript
- Supabase
- bcrypt
- JSON Web Tokens
- express-validator
- express-rate-limit

## Endpoints

```text
GET  /                Health check for the API server
GET  /auth/status     Checks whether Supabase-backed auth is available
POST /register        Creates a new user
POST /login           Logs in a user and returns access/refresh tokens
POST /refresh         Refreshes an access token
GET  /locations       Returns locations for authenticated users
```

`/locations` requires a bearer token:

```text
Authorization: Bearer <token>
```

## Environment

Create a `.env` file:

```bash
PORT=3001
FRONTEND_URL=http://localhost:3000
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPER_SECRET_KEY=your_access_token_secret
REFRESH_SECRET_KEY=your_refresh_token_secret
```

`FRONTEND_URL` is optional for local development, but should be set for deployed frontends so CORS allows the production portfolio URL.

## Supabase Data

Seed data lives in:

```text
db/seed-data.json
```

The frontend also has separate static demo data for portfolio fallback mode. That keeps the public demo available even when Supabase is paused, while this backend remains the real implementation for account and database-backed flows.

## Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build TypeScript:

```bash
npm run build
```

## Project Status

This API is the real backend for OfficeAtlas. For the current portfolio version, the frontend can fall back to demo mode when Supabase is unavailable. Future development can continue adding persistent user features here without breaking the always-available portfolio demo.
