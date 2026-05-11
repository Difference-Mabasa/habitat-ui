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

```bash
npm install
npm run dev        # http://localhost:5173 — /api proxies to http://localhost:8080
npm run build
npm run lint
npm run typecheck
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

## Design system

Tokens (CSS variables) and utility classes (`.btn`, `.chip`, `.badge`, `.card`, `.input`, `.ph`, `.display`, `.eyebrow`, `.mono`, `.tabular`) are loaded globally from `src/styles/`. Light/dark themes toggle via `[data-theme="dark"]` on `<html>`.

## Design source

The pixel-perfect source of truth is the handoff bundle at:
`C:\Users\mabas\Downloads\Backroom Web-handoff\backroom-web\project\`

43 prototype `.jsx` artboards (one per screen), plus `styles.css`, `primitives.jsx`, `nav.jsx`, and `Backroom Redesign.html` (the canvas that wires them all together).
