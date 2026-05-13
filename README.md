# Backroom UI (habitat-ui)

Frontend for **Backroom** — a property rental platform. Talks to `backroom-api` (Spring Boot, `localhost:8080`).

> The repo is named `habitat-ui` to avoid clashing with the legacy `backroom-ui` (Angular) — but the product, brand, and API are all still **Backroom**.

This is a fresh rebuild from the Backroom Web design handoff: pixel-perfect React implementation of the 43-screen design system.

## Stack

- React 18 + TypeScript
- Vite 5
- React Router 6
- CSS variables + global utility classes (ported from the design system in `src/styles/`)

## Getting started

Two ways to run it locally:

- **`npm run dev`** — fastest iteration. Hot-module reload; Vite proxies `/api` to whatever's on `localhost:8080`. Use this when you're iterating on UI code.
- **Full-stack Docker** — Postgres + Redis + API + UI in containers, no IDE needed. See [`../habitat-stack/README.md`](../habitat-stack/README.md) for the command list. Use this when you want a clean, IDE-free environment for manual testing or for testing the production build (the Docker UI is the nginx-served Vite build, not the dev server).

```bash
npm install
npm run dev        # http://localhost:5173 — /api proxies to http://localhost:8080
npm run build
npm run lint
npm run typecheck
npm test           # Vitest + RTL component tests
npm run e2e        # Playwright headless run (requires the API + UI to be up)
npm run e2e:ui     # Playwright UI mode — best dev loop
```

## Build order

The phased implementation plan lives in [`build-order.md`](./build-order.md). Tick items off as they ship; each phase ends with a green build + a commit.

## Project layout

```
src/
  components/   shared primitives (Icon, Button, Chip, Badge, Card, Photo, Logo, Nav)
  screens/      one folder per screen (landing, browse, property, ...)
  lib/          api client, hooks, utilities
  styles/       global design tokens + utility classes
```

## API

The dev server proxies `/api/*` to `http://localhost:8080`. The API client (`src/lib/api.ts`) calls `/api/v1` by default; override with `VITE_API_BASE_URL` in `.env`.

## Environment variables

Copy `.env.example` to `.env` (gitignored) and fill in the values you need. Vite reads them at build time and injects `VITE_*` ones into the bundle.

| Var | What it's for | Behaviour when unset |
|---|---|---|
| `VITE_API_BASE_URL` | Override the default `/api/v1` base. Set in production builds; leave blank in dev so the Vite proxy handles it. | Falls back to the relative `/api/v1` (proxied to `localhost:8080` in dev). |
| `VITE_GOOGLE_MAPS_KEY` | Google Places SDK key used by `AddressLookup` (and later by `/browse` and `/property-detail` map views). Substituted into `index.html` via Vite's `%placeholder%` syntax. Restricted by HTTP referrer in Google Cloud Console — never commit the actual value. | `AddressLookup` falls back to Nominatim (OpenStreetMap). Slower and patchier SA suburb data, but the form keeps working. |

For Docker builds, the same vars are forwarded as build args from `habitat-stack/.env` — see that repo's README for the docker-compose wiring.

## Design system

Tokens (CSS variables) and utility classes (`.btn`, `.chip`, `.badge`, `.card`, `.input`, `.ph`, `.display`, `.eyebrow`, `.mono`, `.tabular`) are loaded globally from `src/styles/`. Light/dark themes toggle via `[data-theme="dark"]` on `<html>`.

## Design source

The pixel-perfect source of truth is the handoff bundle at:
`C:\Users\mabas\Downloads\Backroom Web-handoff\backroom-web\project\`

43 prototype `.jsx` artboards (one per screen), plus `styles.css`, `primitives.jsx`, `nav.jsx`, and `Backroom Redesign.html` (the canvas that wires them all together).
