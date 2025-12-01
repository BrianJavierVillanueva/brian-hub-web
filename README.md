# Brian Hub Web

Angular 20 single-page application that consumes the Brian Hub API to display the public portfolio and run the project admin console.

## Tech Stack

- Angular 20 (standalone components)
- TypeScript 5.8
- RxJS 7

## Prerequisites

- Node.js 20+
- npm 10+

## Getting Started

```bash
cd brian-hub-web
npm install
npm start
```

The dev server listens on `http://localhost:4200` and reloads automatically. Ensure the API is running on `http://localhost:8080` or update the environment configuration accordingly.

## Environment Configuration

| File | Purpose | Default API |
|------|---------|-------------|
| `src/environments/environment.ts` | Local development | `http://localhost:8080/api` |
| `src/environments/environment.prod.ts` | Production build | `https://<your-api-host>/api` |

When deploying the frontend to a different origin, add that origin to the backend property `app.cors.allowed-origins`.

## Available Scripts

- `npm start` – `ng serve` with live reload.
- `npm run build` – Production build artifacts in `dist/`.
- `npm run test` – Unit tests via Karma/Jasmine.

## Key Modules

- `src/app/services/projects.ts` – Public project feed client.
- `src/app/services/admin-projects.ts` – Admin CRUD client that injects HTTP Basic credentials.
- `src/app/pages/portfolio` – Portfolio listing with incremental loading.
- `src/app/pages/admin` – Basic admin dashboard for project management.

> Blog admin endpoints are now exposed by the API. Extend the SPA with new services/forms when you're ready to manage posts from the browser.
