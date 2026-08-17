# Northline Roofing & Exteriors — Config-Driven Estimator

This is my submission for the Wantace assignment. I built a full-stack, configuration-driven roofing estimator with two main parts: a public estimator for customers and an authenticated Owner Panel for managing the estimator configuration and captured leads.

The application uses a persisted MongoDB database, and the pricing calculation is handled on the backend so that pricing data and business rules are not exposed or calculated in the browser.

## Live URLs

* **Frontend:** `https://northline-roofing-estimator.vercel.app`
* **Backend:** `https://northline-roofing-api.onrender.com`
* **Owner Panel:** `https://northline-roofing-estimator.vercel.app/admin/login`

> Replace the above URLs with the actual deployed URLs before final submission.

## Tech Stack

* **Frontend:** React + Vite
* **Backend:** Node.js + Express.js
* **Database:** MongoDB + Mongoose
* **Authentication:** JWT stored in an HTTP-only cookie
* **Styling:** CSS
* **Deployment:** Vercel for frontend and Render for backend

## Requirements

Before running the project locally, make sure the following are installed:

* Node.js 18 or higher
* Git
* Docker Desktop
* A code editor such as VS Code

## Run Locally

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd roof-estimator-monorepo
```

### 2. Start MongoDB

I use Docker for the local MongoDB database.

```bash
docker compose up -d
```

Check that the MongoDB container is running before continuing.

### 3. Configure the backend

Go to the server directory:

```bash
cd server
```

Create the environment file:

**Windows:**

```cmd
copy .env.example .env
```

**macOS/Linux:**

```bash
cp .env.example .env
```

The local environment can use the default MongoDB connection provided in `.env.example`.

For deployment, I recommend changing the JWT secret and admin password.

### 4. Install dependencies

Go back to the repository root:

```bash
cd ..
npm install
npm run install:all
```

### 5. Seed the database

Run:

```bash
npm run seed
```

This creates the initial Northline Roofing configuration in MongoDB.

### 6. Start the application

Run:

```bash
npm run dev
```

The applications will be available at:

* **Frontend:** http://localhost:5173
* **Backend API:** http://localhost:5000
* **API Health Check:** http://localhost:5000/health
* **Owner Panel:** http://localhost:5173/admin/login

## Admin Login

The local test credentials are:

```text
Username: admin
Password: roofing2026!
```

For production deployment, these credentials should be stored as environment variables and the password should be changed.

## Environment Variables

The backend uses the following variables in `server/.env`:

```env
MONGODB_URI=
PORT=5000
CLIENT_ORIGIN=
JWT_SECRET=
ADMIN_USERNAME=
ADMIN_PASSWORD=
```

The frontend can use:

```env
VITE_API_BASE_URL=
```

For production, `VITE_API_BASE_URL` should point to the deployed backend API and end with `/api`.

Example:

```env
VITE_API_BASE_URL=https://your-api.example.com/api
```

## How the Application Works

### Public Estimator

1. The customer opens the public estimator.
2. The frontend requests the active configuration from `/api/config`.
3. The API returns the currently active questions, labels, options and limits from MongoDB.
4. The React application generates the form from this configuration.
5. The customer enters the required roof information and contact details.
6. The frontend submits the answers to `/api/estimate`.
7. The backend loads the current configuration again.
8. The backend validates the submitted answers.
9. The backend calculates the estimate.
10. The lead and submitted answers are stored in MongoDB.
11. The calculated estimate range is returned to the customer.

The frontend does not contain the business pricing rates or perform the pricing calculation.

### Owner Panel

1. The owner opens the admin login page.
2. The credentials are verified by the backend.
3. A JWT is stored in an HTTP-only cookie.
4. Protected admin endpoints become available.
5. The owner can update questions, labels, options, rates, multipliers and active/inactive states.
6. The owner can view captured leads and their submitted answers.
7. Saving a configuration creates a new configuration version.
8. Existing leads retain the configuration version used when their estimate was calculated.

## Pricing Formula

The pricing calculation is performed only on the backend.

```text
Base Material Cost =
Area × Material Rate × (1 + Waste Factor)

Tear-Off Cost =
Area × Tear-Off Rate

Adjusted Subtotal =
(Base Material Cost + Tear-Off Cost)
× Pitch Multiplier
× Stories Multiplier

Midpoint Estimate =
Adjusted Subtotal + Permit Fee

Low Estimate =
Midpoint Estimate × (1 - Spread)

High Estimate =
Midpoint Estimate × (1 + Spread)
```

The pricing inputs are loaded from the active database configuration.

This means that changing a rate in the Owner Panel changes future estimates without changing frontend code or redeploying the application.

## Database

The application uses MongoDB with Mongoose.

The main data stored by the application includes:

* Configuration versions
* Business information
* Dynamic questions
* Question options
* Pricing rates
* Multipliers
* Global pricing modifiers
* Customer leads
* Submitted answers
* Calculated estimate ranges
* Configuration version used for each estimate
* API request logs

The database is persisted and is not based on local JSON files.

## Configuration Versioning

Each configuration has a version number.

When the owner saves a configuration change:

1. The new configuration is stored.
2. The configuration version is incremented.
3. The previous configuration is no longer active.
4. New estimates use the new active configuration.
5. Existing leads retain the configuration version that was used for their estimate.

This allows previous estimates to remain traceable even after pricing changes.

## API Endpoints

### Public Endpoints

```text
GET /api/config
POST /api/estimate
```

### Authentication

```text
POST /api/auth/login
```

### Protected Owner Endpoints

```text
GET /api/admin/config
PUT /api/admin/config
GET /api/admin/leads
```

### Health Check

```text
GET /health
```

## API Logging

API requests are logged for traceability.

The application records information such as:

* HTTP method
* Request path
* Response status
* Request duration
* IP address
* User agent
* Authenticated actor information when available

Sensitive information such as passwords, JWT tokens and request bodies is not intentionally persisted in the API logs.

## Version 3 Seed Data

The assignment specifies a Version 3 seed configuration but the supplied reference document does not contain the complete Version 3 data table.

Because of this, I included an executable Version 3 baseline using the example values explicitly shown in the assignment, including values such as `asphalt_3tab` and `4.25`.

The values are editable through the Owner Panel.

If the assessor provides the complete official Version 3 seed data separately, the seed configuration can be replaced with that official dataset without changing the application architecture.

## Deployment

### Backend

The backend can be deployed to Render, Railway or another Node.js hosting provider.

For Render, use the `server` directory as the root directory.

Build/install command:

```bash
npm install
```

Start command:

```bash
npm start
```

Configure the required backend environment variables in the hosting provider.

The production MongoDB connection should point to a cloud MongoDB instance such as MongoDB Atlas.

### Frontend

The frontend can be deployed to Vercel or Netlify.

Use the `client` directory as the project root.

Build command:

```bash
npm run build
```

Output directory:

```text
dist
```

Set:

```env
VITE_API_BASE_URL=https://your-backend-url/api
```

The backend CORS configuration should allow the deployed frontend origin.

## Verification Checklist

Before submitting the project, I verify the following:

* [ ] Public estimator loads successfully.
* [ ] `/api/config` returns the active configuration.
* [ ] Questions and options are generated dynamically from the API.
* [ ] Pricing rates are not hardcoded in the frontend.
* [ ] Pricing is calculated on the backend.
* [ ] Customer contact information is captured.
* [ ] Leads are saved in MongoDB.
* [ ] Configuration version is stored with each lead.
* [ ] Owner Panel requires authentication.
* [ ] Owner can update pricing configuration.
* [ ] Owner can activate/deactivate questions.
* [ ] Owner can update labels and options.
* [ ] Changing a rate changes the next estimate without a redeployment.
* [ ] Existing leads remain associated with their original configuration version.
* [ ] API logging is working.
* [ ] `README.md` is included.
* [ ] `DECISIONS.md` is included.
* [ ] `AI_LOG.md` is included.
* [ ] Frontend and backend are deployed.
* [ ] Live URLs have been added to this README.
* [ ] Git repository contains meaningful commits.

## Project Structure

```text
roof-estimator-monorepo/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── package.json
│   └── ...
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── services/
│   │   └── index.js
│   ├── package.json
│   └── .env.example
│
├── DECISIONS.md
├── AI_LOG.md
├── DEPLOYMENT.md
├── README.md
├── docker-compose.yml
└── package.json
```

## Submission Notes

This project was developed to satisfy the main functional and architectural requirements of the Wantace assignment.

The main design decision was to keep the estimator configuration and pricing logic on the server side. This allows the business owner to change pricing and question settings without modifying or redeploying the frontend, while also preventing client-side manipulation of the core pricing calculation.
