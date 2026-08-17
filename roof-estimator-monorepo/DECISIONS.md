# Architectural Decisions

## 1. Objective

The application follows the assignment's central requirement: configuration, questions, options, limits and pricing inputs are persisted in a database and fetched at runtime. The browser only renders the schema and submits answers; the server owns validation and pricing.

## 2. Stack decision

### React + Vite

React provides a small, maintainable dynamic form engine. Vite keeps the local development workflow simple and produces a static frontend suitable for Vercel or Netlify.

### Express + Node.js

Express provides straightforward REST endpoints, middleware, authentication and request logging. The pricing engine is isolated as a server-side service so it cannot be changed by browser users.

### MongoDB + Mongoose

MongoDB satisfies the assignment's persisted-database requirement and maps naturally to a configuration document containing nested questions and options. Mongoose provides schema validation and clean model definitions.

### JWT HTTP-only cookie

The Owner Panel uses an eight-hour JWT in an HTTP-only, same-site cookie. JavaScript cannot read the token, while protected API routes can verify it. Production deployment should use HTTPS, a strong secret and a production cookie configuration.

## 3. Configuration versioning

A configuration update never overwrites the active configuration. The API creates the next integer `config_version`, marks the previous configuration inactive and stores the new configuration as active. Leads record the version used for their estimate, preserving historical calculation context.

## 4. Pricing formula

The server follows the assignment formula exactly:

1. `Base Material Cost = Area × Material Rate × (1 + Waste Factor)`
2. `Tear-Off Cost = Area × Tear-Off Rate`
3. `Adjusted Subtotal = (Base Material Cost + Tear-Off Cost) × Pitch Multiplier × Stories Multiplier`
4. `Midpoint = Adjusted Subtotal + Permit Fee`
5. `Low = Midpoint × (1 - Spread)`
6. `High = Midpoint × (1 + Spread)`

The assignment specifies default waste of 10%, permit fee of $350 and range spread of 12%. These values are stored as configuration rather than embedded in the frontend.

## 5. Validation and integrity

The API validates required fields, numeric ranges and select values against the active configuration before calculation. It then reloads the active configuration from MongoDB and calculates the estimate on the server. This prevents a modified browser payload from choosing an arbitrary rate.

## 6. Dynamic form design

Public question labels, units, limits, options and contact-field labels are returned by `/api/config`. The React renderer has only generic knowledge of supported field types (`number` and `select`); it does not know business-specific questions or pricing values.

## 7. API logging

Two layers are used: Morgan for operational console logs and a MongoDB `ApiLog` collection for durable request metadata. Request bodies, passwords and authentication tokens are intentionally excluded.

## 8. Out of scope

- Multi-tenancy
- Complex role/permission matrix
- Customer accounts
- Online payments
- Appointment scheduling
- Automated contractor dispatch
- Production-grade CRM integrations
- Full audit history UI for every individual field change

The assignment names Dale and Marcus but does not require differentiated permissions, so the implementation uses one owner role.

## 9. Seed-data ambiguity

The supplied assignment document says that Version 3 seed data is provided in the brief, but the supplied document does not contain a complete Version 3 data table. It does explicitly show `asphalt_3tab`, `4.25`, and an example string multiplier of `1.12`. The project seed uses those explicit values and provides a complete editable baseline so the application runs end-to-end. If an official Version 3 table is supplied separately, it should replace only `server/src/config/seed.js`; the application architecture does not need to change.

## 10. Questions for Dale before production

1. What geographic service area and currency should be shown to customers?
2. What are the approved production material rates and exact option labels?
3. How are roof measurements obtained and how should unusual roof shapes be handled?
4. Are permit fees always flat or do they vary by city/county?
5. Should the 12% spread be fixed or editable?
6. Which customer fields are mandatory and what consent language is required?
7. How long should lead data be retained?
8. Should Marcus have the same access as Dale or should roles be separated?
9. What notification workflow should happen after a lead is captured?
10. What is the production domain and deployment ownership?
