# Multi-stage: Vite build, then nginx-served static assets with a /api proxy.
# The runtime image has no Node — just nginx and the built dist/.

# ── Stage 1: build ──────────────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /workspace

# Build-time secrets. Vite reads VITE_* vars from process.env during `vite build`
# and substitutes %VITE_*% placeholders in index.html. The compose file passes
# these in via `build.args`; CI does the same from its own secret store.
# Unset is fine — AddressLookup falls back to Nominatim when the key is empty.
ARG VITE_GOOGLE_MAPS_KEY=""
ENV VITE_GOOGLE_MAPS_KEY=$VITE_GOOGLE_MAPS_KEY

# Install deps with the lockfile; layer cached unless deps change.
COPY package.json package-lock.json ./
RUN npm ci

# Copy sources needed by tsc + vite (skip e2e/, test/, dist/, etc. — see .dockerignore)
COPY . .
RUN npm run build

# ── Stage 2: runtime ────────────────────────────────────────────────────────
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
