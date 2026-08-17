# Northline Roofing & Exteriors — Config-Driven Estimator

Submission-ready full-stack implementation of the Wantace assignment. It contains a public estimator and an authenticated Owner Panel backed by a persisted MongoDB database.

## Live URLs

- Frontend demo: `https://northline-roofing-estimator.vercel.app` *(replace with your deployed frontend URL before submission)*
- Backend demo: `https://northline-roofing-api.onrender.com` *(replace with your deployed backend URL before submission)*
- Owner Panel: `<frontend-url>/admin/login`

## Stack

- React + Vite
- Express.js / Node.js
- MongoDB + Mongoose
- JWT stored in an HTTP-only cookie
- Vite-compatible CSS (no pricing data in frontend)

## Requirements

- Node.js 18+
- Git
- Docker Desktop (recommended for local MongoDB)

## Run locally

### 1. Clone

```bash
git clone <your-repository-url>
cd roof-estimator-monorepo
```

### 2. Start MongoDB

```bash
docker compose up -d
```

### 3. Configure backend

```bash
cd server
copy .env.example .env
```

For macOS/Linux use `cp .env.example .env`.

The default local values are already suitable. Change `JWT_SECRET` for real deployment.

### 4. Install and seed

From the repository root:

```bash
npm install
npm run install:all
npm run seed
```

### 5. Start both applications

```bash
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:5000
- API health: http://localhost:5000/health
- Owner Panel: http://localhost:5173/admin/login

## Admin test credentials

- Username: `admin`
- Password: `roofing2026!`

For production, store these in deployment environment variables and change the password.

## Environment variables

`server/.env`:

- `MONGODB_URI`
- `PORT`
- `CLIENT_ORIGIN`
- `JWT_SECRET`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

Optional frontend variable:

- `VITE_API_BASE_URL` — public API base URL, e.g. `https://your-api.example.com/api`

## Functional flow

1. Public page requests `/api/config` at runtime.
2. Only active questions are returned, ordered by configuration.
3. The React form renders fields entirely from the returned schema.
4. Contact fields are also returned by the API.
5. The browser submits answers to `/api/estimate`.
6. The API reloads the active database configuration, validates the payload, calculates the estimate, and stores the lead with the configuration version.
7. Owner login creates an HTTP-only JWT cookie.
8. Protected admin endpoints allow configuration updates and lead review.
9. Saving a configuration creates a new version and deactivates the previous version, so existing leads retain the version used for their estimate.

## Pricing formula

`Base Material = Area × Material Rate × (1 + Waste)`

`Tear-Off = Area × Tear-Off Rate`

`Adjusted Subtotal = (Base Material + Tear-Off) × Pitch Multiplier × Stories Multiplier`

`Midpoint = Adjusted Subtotal + Permit Fee`

`Low = Midpoint × (1 - Spread)`

`High = Midpoint × (1 + Spread)`

All calculation inputs are read from the active database configuration. The frontend never performs pricing calculations.

## Database notes

The supplied assignment document requires Version 3 seed data but does not include the complete Version 3 table. The project therefore includes an executable Version 3 baseline using the example values explicitly shown in the brief (including `asphalt_3tab` and `4.25`) and marks all values as editable in the Owner Panel. Replace the seed values with the official Version 3 table if the assessor supplies it separately.

## API logging

Morgan writes request logs to stdout, and `ApiLog` persists method, path, status, duration, IP, user-agent and actor information in MongoDB. The logger intentionally does not persist request bodies, passwords or JWTs.

## Deployment

### Backend

Deploy `server` to Render/Railway or another Node host. Set all server environment variables. Start command:

```bash
npm start
```

### Frontend

Deploy `client` to Vercel/Netlify. Build command:

```bash
npm run build
```

Set `VITE_API_BASE_URL` to the deployed API URL ending in `/api`.

Configure the backend CORS `CLIENT_ORIGIN` to the deployed frontend origin.

## Verification checklist

- [ ] `/api/config` contains dynamic questions/options and no secrets.
- [ ] Frontend source contains no pricing rates or calculation formula.
- [ ] Changing a rate in Owner Panel changes the next public estimate without a redeploy.
- [ ] `/admin` is blocked without authentication.
- [ ] Leads show submitted answers and configuration version.
- [ ] `DECISIONS.md`, `AI_LOG.md`, and `README.md` are present.
- [ ] Deploy frontend and backend and replace placeholder URLs above.
- [ ] Create progressive Git commits before pushing the final repository.
