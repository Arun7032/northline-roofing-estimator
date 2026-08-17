# Deployment Checklist

## Backend

1. Create a MongoDB Atlas database.
2. Deploy the `server` directory to Render/Railway.
3. Set `MONGODB_URI`, `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `CLIENT_ORIGIN`, and `PORT`.
4. Run `npm install` and use `npm start`.
5. Verify `/health` returns `{ "status": "ok" }`.

## Frontend

1. Deploy the `client` directory to Vercel/Netlify.
2. Set `VITE_API_BASE_URL=https://YOUR-API-DOMAIN/api`.
3. Build with `npm run build`.
4. Set the backend `CLIENT_ORIGIN` to the exact frontend origin.

## Final review

Use an incognito window to confirm `/admin` cannot be opened without login. Change a material rate in the Owner Panel and submit a new estimator request to verify the database-driven update.
