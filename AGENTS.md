# AGENTS.md

## Overview

Single-file Express API for "FrameSpace" (studio listings): `index.js` is the entire app — all routes, MongoDB connection, and server startup live there. Git repo root is this `backend/` folder; there is no separate frontend, tests, lint, or CI in this repo.

## Running

```bash
npm install
node index.js        # no npm start script; run the file directly
```

- `PORT` env var overrides the default 5000 (hardcoded fallback in `index.js`).
- **`.env` is required before startup**: it must define `MONGODB_URI` (gitignored). The `MongoClient.connect()` runs via top-level `await` at module load, so `node index.js` hangs/fails without a reachable MongoDB and a valid URI.
- Database name `frame-space` and collections `studios` / `category` are hardcoded in `index.js`.

## Conventions & gotchas

- No ESLint/prettier configured. `"type": "module"` is set in `package.json` — use ESM `import` syntax only (CommonJS `require` will fail).
- Tests: `npm test` is a placeholder that exits 1. No test framework installed.
- Error handling is minimal: every route wraps logic in `try/catch` that only `console.log`s — no error responses sent back to clients. Preserve this pattern when adding routes unless asked otherwise.
- Response shape convention (keep consistent): `{ status: 200, message: "success", data?: ... }` — but `/category/:category` returns the raw array instead.
- `package.json` dependencies are loose ranges (`^`); `package-lock.json` is the source of truth for versions.
