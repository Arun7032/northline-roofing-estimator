# AI Usage Log

## Tools used

- ChatGPT: assignment analysis, architecture planning, implementation scaffolding, documentation and verification checklist.
- Local editor / terminal: file creation, dependency setup and local verification.

## Example of an AI output that required correction

An initial implementation approach could easily place the pricing calculation in React because it is convenient for immediate UI feedback. That would violate the assignment's security requirement. The final implementation deliberately keeps all calculation inputs and arithmetic in `server/src/services/calculator.js` and sends only the result to the browser.

Another common failure mode is treating select values as trusted. The final backend validates each select answer against the currently active database option list before calculating.

## What was authored/verified directly

- MongoDB schemas for configuration, leads and API logs.
- Server-side validation and pricing engine.
- JWT cookie authentication middleware.
- Configuration versioning behavior.
- Dynamic React question renderer.
- Owner configuration editor and lead table.
- Local Docker Compose database setup.
- README, DECISIONS and this AI log.

## AI boundaries

AI assistance was used as a development aid. Before submission, the reviewer should run the local verification checklist, replace deployment placeholders with actual URLs, confirm the official Version 3 seed data if it is supplied separately, and create meaningful Git commits reflecting the development process.
