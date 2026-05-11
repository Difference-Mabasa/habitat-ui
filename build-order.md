# Backroom UI — Build Order

> **Source of truth**: `C:\Users\mabas\Downloads\Backroom Web-handoff\backroom-web\project\` — 43 React/JSX prototype artboards.
>
> **Product name**: Backroom (the repo is just named `habitat-ui` for separation from the legacy Angular `backroom-ui`).
>
> **API**: backroom-api on `localhost:8080/api/v1` (proxied via `/api` in dev).

Tick items off as they ship. Each phase ends with **all of**: `npm run typecheck` green, `npm run lint` green, `npm run build` green, dev-server smoke test in browser, single commit with phase name in the message.

---

## Setup ✅ (project bootstrap)

- [x] Vite + React 18 + TypeScript project initialised
- [x] React Router 6 wired in `main.tsx`
- [x] `/api` dev proxy → `http://localhost:8080`
- [x] Design tokens ported to `src/styles/tokens.css`
- [x] Utility classes ported to `src/styles/utilities.css`
- [x] `src/lib/api.ts` — typed fetch wrapper with `ApiError`
- [x] ESLint flat config, strict TS, `@/*` path alias
- [x] `.env.example`, `.gitignore`
- [x] `README.md` + this `build-order.md`

---

## Phase 0 — Component audit ✅

> Goal: read all 43 prototype screens and catalogue every reusable pattern. No code; only the catalogue. **Anything appearing in 2+ screens must be built once and reused — no duplication.**

- [x] Read every `screen-*.jsx` + `nav.jsx` + `primitives.jsx`.
- [x] Cataloged ~58 reusable components into [`component-audit.md`](./component-audit.md).
- [x] Assigned each a **build tier**:
  - **Tier A** (15) — foundation primitives, built in Phase 1.
  - **Tier B** (15) — layout/shell primitives, built in Phase 1.
  - **Tier C** (15) — domain cards/rows, built when their first screen ships.
  - **Tier D** (13) — screen-internal complex widgets, live in their owning screen folder.
- [x] Logged convergence issues — patterns currently implemented multiple ways (PropertyCard 3 layouts, Stepper 2 orientations, Tabs vs chips, etc.) that must collapse to one component.
- [x] Logged gaps — components not in the handoff but required (ToastHost, ConfirmDialog, Tooltip, Popover, Mobile sheet).

**No screen work begins until Phase 1 is done.** This is the rule that prevents duplication.

---

## Phase 1 — Foundation + layout primitives (Tier A + Tier B)

Goal: ship the 30 components in `component-audit.md` Tier A and Tier B. Every later phase consumes these — no screen should re-implement a button, a card, a page header, a stepper.

### Tier A — foundation primitives (15)

- [x] `src/components/Icon.tsx` — typed wrapper, all ~50 outlines from `primitives.jsx`. `name: IconName` union.
- [x] `src/components/Photo.tsx` — cross-hatch placeholder (`.ph`). Props: `ratio`, `label`, `src`.
- [x] `src/components/Logo.tsx` — Backroom wordmark + faceted house. Variants: light, invert.
- [x] `src/components/Button.tsx` — variants: primary/accent/secondary/ghost; sizes: sm/md/lg; `iconOnly`, `leftIcon`, `rightIcon`, `loading`, `as`.
- [x] `src/components/IconButton.tsx` — shortcut for `<Button iconOnly>` with optional `badge` count.
- [x] `src/components/Chip.tsx` — filter pill with `active`, `leftIcon`, `count`, `onToggle`.
- [x] `src/components/Badge.tsx` — tones: neutral/success/warn/danger/accent. Helper `scoreTone(n)` exported alongside.
- [x] `src/components/Card.tsx` — `padding`, `interactive`, `as`.
- [x] `src/components/Input.tsx` + `Textarea.tsx` + `Select.tsx` — `label`, `helper`, `error`, `leftIcon`, `rightSlot`.
- [x] `src/components/Checkbox.tsx` + `Radio.tsx` + `Toggle.tsx`.
- [x] `src/components/FormField.tsx` — composite: label + control + helper + error. Forms always use this.
- [x] `src/components/Eyebrow.tsx` + `src/components/Hairline.tsx` — small atoms.
- [x] `src/components/Stepper.tsx` — `orientation: "vertical" | "horizontal"`, `steps`, `currentStep`, optional `aside`.
- [x] `src/components/ProgressBar.tsx` — `value`, `tone`, `height`.
- [x] `src/components/StarRating.tsx` — display or interactive, `value`, `count`, `size`.
- [x] `src/components/Avatar.tsx` — `src`, `name` (initials fallback), `size`, `tone`.
- [x] `src/components/PriceDisplay.tsx` — `amount`, `period`, `currency="R"`, `size`, `tone`.
- [x] `src/components/KeyValueRow.tsx` — `label`, `value`, `tone`, `divider`.

### Tier B — layout/shell primitives (15)

- [x] `src/components/Nav.tsx` — port `nav.jsx:4-102`. Role variants (tenant/landlord/agent/admin), search, chat/notif buttons.
- [x] `src/components/DrawerShell.tsx` — top-right dropdown panel (NotifDrawer + ChatDrawer share this).
- [x] `src/components/NotificationDrawer.tsx` — uses NotificationRow rows (Tier C, built when first needed).
- [x] `src/components/ChatDrawer.tsx` — uses MessageBubble preview rows.
- [x] `src/components/PageShell.tsx` — Nav + optional Sidebar + content max-width 1440, padding 32.
- [x] `src/components/Sidebar.tsx` — 240px landlord/agency/admin nav with icon + label + count items.
- [x] `src/components/TwoColumnSplit.tsx` — main + sticky right rail.
- [x] `src/components/ThreeColumnLayout.tsx` — left rail + center + right rail.
- [x] `src/components/PageHeader.tsx` — eyebrow + title + subtitle + actions.
- [x] `src/components/SectionHeader.tsx` — smaller, in-content header with optional `<InlineLink>` action. (Merge `SectionActionHeader` — same thing.)
- [x] `src/components/Breadcrumbs.tsx` — chevron-separated path items.
- [x] `src/components/Tabs.tsx` — `variant: "pill" | "underline" | "segmented"`, `tabs`, `value`, `onChange`. Converges chip-tabs and button-group tabs.
- [x] `src/components/InlineLink.tsx` — text link with optional icon.
- [x] `src/components/EmptyState.tsx` — icon + title + description + CTA.
- [x] `src/components/Alert.tsx` — banner with tone (error/warn/info/success).
- [x] `src/components/LoadingSkeleton.tsx` — shimmer placeholder.
- [x] `src/components/Modal.tsx` + `src/components/ConfirmDialog.tsx` — overlay primitives.
- [x] `src/components/ToastHost.tsx` + `src/lib/toast.ts` — imperative `toast.success(msg)` / `toast.error(msg)`.
- [x] `src/components/Footer.tsx` — dark-bg footer (used by landing).

### Infrastructure for Phase 1

- [x] `src/hooks/useTheme.ts` — set `data-theme` + `--accent` on `<html>`.
- [x] `src/routes.ts` — single source of truth for all 43 routes. `{ id, label, path, group }`. Drives `<Routes>` and the dev gallery index.
- [x] `src/App.tsx` — replaced placeholder with `<Routes>`; each unimplemented screen renders a `Placeholder` until its phase ships. Lazy imports added when real screens land.
- [x] `src/screens/_gallery/` — dev-only landing page (`/`) plus `/_routes` lists every screen route in groups, mirrors the prototype's `DesignCanvas` sections.
- [x] `src/screens/_gallery/Components.tsx` — `/_components` shows every Tier A + B primitive in every variant. Manual Storybook substitute.

**Exit criteria**:
- All 30 Tier A + B components exist with TS types and at least one usage in `_components/` gallery.
- Dev gallery at `/` lists 43 routes with placeholder pages.
- `npm run typecheck && npm run lint && npm run build` green.
- Light/dark theme toggle works.
- Commit: `phase 1: foundation + layout primitives`.

---

## Phase 2 — Core flows (6 screens, artboards 01–06)

Highest-load-bearing screens; the user-journey backbone. Tier C components get extracted as they're first needed (PropertyCard variants, PriceDisplay usage, KpiTile, ActionItem, NotificationRow, etc.).

- [x] `01` Landing (landlord acquisition) — `screen-landing.jsx` → `src/screens/landing/`. Extracts: `Hero` (D), `ValueGrid` (D), `StatTile` (C), `PropertyCard` grid variant (C).
- [x] `02` Landlord dashboard — `screen-landlord.jsx` → `src/screens/landlord-dashboard/`. Extracts: `KpiTile` (C), `ActionItem` (C), `PropertyTable` (D), `ApplicationPipeline` (D), `Sidebar` (B, already built).
- [x] `03` Browse + map (split) — `screen-browse.jsx` → `src/screens/browse/`. Extracts: `FilterBar` (C), `PropertyCard` row variant (C), `MapPin` (C).
- [x] `04` Property detail — `screen-property.jsx` → `src/screens/property-detail/`. Extracts: `PriceDisplay` already exists; `RatingDisplay` (C), `AgentCard` (C).
- [x] `05` Apply flow (step 3) — `screen-apply.jsx` → `src/screens/apply/`. Extracts: `DocumentStatusRow` (C), `FileUploadZone` (C). Uses `Stepper` vertical.
- [x] `06` Tenant portal (My Rental) — `screen-tenant.jsx` → `src/screens/tenant-portal/`.

**Exit**: 6 routes render pixel-perfect with inline mock data. Responsive at 1440 fixed-width. `npm run lint/typecheck/build` green.

---

## Phase 3 — Landlord surfaces (10 screens, artboards 07–10, 21–26)

- [x] `07` List a property wizard (step 3) — `screen-wizard.jsx`. Uses Stepper horizontal, FileUploadZone.
- [x] `08` Applicant detail — `screen-applicant.jsx`. Extracts: `ScoreBreakdown` (Tier C — reused in onboarding Phase 4).
- [x] `09` Mandates & agents — `screen-mandates.jsx`. Reuses KpiTile, Avatar, Badge.
- [x] `10` Viewings calendar — `screen-viewings.jsx`. Extracts: `ViewingCalendarGrid` (D).
- [x] `21` Full map view — `screen-map.jsx`. Reuses MapPin (added `tone="accent"` for hot pins).
- [x] `22` Inbox / messaging — `screen-inbox.jsx`. Extracts: `InboxThreadList` (D). Reuses MessageBubble.
- [x] `23` Statements & payouts — `screen-statements.jsx`. Extracts: `StatementsTable` (D), `MonthlyCollectionChart` (D). Reuses KpiTile.
- [x] `24` Property analytics — `screen-analytics.jsx`. Reuses KpiTile; inline ConversionFunnel + DailyViewsChart.
- [x] `25` Agency portfolio — `screen-agency.jsx`. Extracts: `AgencyTable` (D — different columns from PropertyTable).
- [x] `26` Notifications — `screen-notifications.jsx`. NotificationRow extended with `variant: "drawer" | "page"`.

---

## Phase 4 — Tenant surfaces (10 screens, artboards 11–20)

- [x] `11` My applications — `screen-my-apps.jsx`. Extracts: `ApplicationStatusTimeline` (D).
- [x] `12` Lease review & sign — `screen-lease.jsx`. Extracts: `LeaseDocument` (D — paginated reader).
- [x] `13` Payment receipt — `screen-payment.jsx`. Reuses Card, Button, Eyebrow.
- [x] `14` Communities — `screen-communities.jsx`. Reuses MessageBubble + Avatar in a 3-col layout.
- [x] `15` Saved searches & wishlist — `screen-saved.jsx`. Extracts: `SavedSearchCard` (C).
- [x] `16` Compare drawer — `screen-compare.jsx`. Extracts: `ComparisonTable` (D — generic property comparison).
- [x] `17` Report maintenance — `screen-maintenance.jsx`. Reuses FormField, Select, Textarea, Photo.
- [x] `18` Deposit return — `screen-deposit.jsx`. Extracts: `DepositReturnChecklist` (D); `totalDeductions` helper in `lib/deposit.ts`.
- [x] `19` Reviews — `screen-reviews.jsx`. Extracts: `RatingReviewForm` (D); reuses StarRating, Chip, RatingDisplay.
- [x] `20` Tenant onboarding — `screen-onboarding.jsx`. Reuses Stepper, Avatar, ProgressBar, Badge.

---

## Phase 5 — Account, system, mobile (5 screens, artboards 27–31)

- [x] `27` Sign in — `screen-auth.jsx`. Split-pane with espresso pitch panel + sign-in form.
- [x] `28` Profile & verification — `screen-profile.jsx`. Extracts: `SubNav` (Tier C — section-level rail, also used by settings).
- [x] `29` Settings & billing — `screen-settings.jsx`. Reuses SubNav.
- [x] `30` Empty / loading / error states — `screen-states.jsx`. Gallery composed of Phase 1 `EmptyState`, `LoadingSkeleton`.
- [x] `31` Mobile (Browse · Property · Rental triad) — `screen-mobile.jsx`. Extracts: `PhoneFrame` (D — phone chrome reused across the 3 frames).

---

## Phase 6 — Growth & discovery (5 screens, artboards 32–36)

- [x] `32` Landlord pricing & plans — `screen-pricing.jsx`. Inline `PricingTier` (Tier D); featured tier overlays a tag pill.
- [x] `33` Refer & earn — `screen-referral.jsx`. Espresso pitch card + earnings card + referrals table.
- [x] `34` Landlord onboarding — `screen-llonboarding.jsx`. Celebration banner + checklist + tip cards.
- [x] `35` Neighbourhood (Soweto) — `screen-neighbourhood.jsx`. Reuses `AreaCard` (newly extracted Tier C, shared with landing's FeaturedAreas).
- [x] `36` Agent public profile — `screen-agent.jsx`. Reuses Tabs (underline variant), RatingDisplay.

---

## Phase 7 — Trust, safety & support (3 screens, artboards 37–39)

- [x] `37` FICA / POPIA verification — `screen-verification.jsx`. Reuses vertical Stepper, FileUploadZone, Alert danger.
- [x] `38` Help & support center — `screen-help.jsx`. Espresso search hero + categories grid + FAQ + contact card.
- [x] `39` Admin / moderation queue — `screen-admin.jsx`. KPI stats + Tabs filters + moderation table with priority/state badges.

---

## Phase 8 — Documents & notifications (3 screens, artboards 40–42)

Print-optimised A4 layouts + email templates.

- [x] `40` Lease PDF (A4 print) — `screen-leasepdf.jsx`. 794px-wide A4 page with watermark, header, sections, signature block, footer.
- [x] `41` Tax invoice (A4 print) — `screen-invoice.jsx`. From/to grid + line-items table + totals + footer.
- [x] `42` Email templates — `screen-email.jsx`. 4 email layouts (application / approved / new applicant / receipt) with shared Email wrapper.

---

## Phase 9 — Final: gallery + new sections (23 added screens)

The v2 handoff added 22 new screens across 6 new sections plus the unbuilt cards gallery — 23 screens total. All shipped in this phase, no new shared component extracts (these screens compose existing primitives).

### Component gallery (1)
- [x] `43` Property card variations — `screen-cards.jsx` → `src/screens/cards/`. Showcases PropertyCard variants, MapPin variants (default/active/cluster/sold), EmptyState.

### Lease lifecycle (4)
- [x] `44` Lease renewal — `screen-renewal.jsx`. Offer card with current vs new rent, term row table, counter-offer.
- [x] `45` Move-out inspection — `screen-moveout.jsx`. Room list + active-room photos + condition checklist.
- [x] `46` Vacate notice — `screen-vacate.jsx`. Form + reason chips + cooling-off card.
- [x] `47` Waitlist — `screen-waitlist.jsx`. Filled-spot join page with similar spots grid.

### Trust & money (4)
- [x] `48` Landlord KYC — `screen-ll-kyc.jsx`. 4-step verification rail + upload dropzone.
- [x] `49` Failed payment — `screen-failed.jsx`. Danger card + late-fee timer + retry/plan options + attempts log.
- [x] `50` Rent guarantee — `screen-guarantee.jsx`. Espresso hero + coverage card + 4-step how-it-works.
- [x] `51` Credit / TPN — `screen-credit.jsx`. Score with gradient bar, factors list, share-link card.

### Content & brand (4)
- [x] `52` Blog — `screen-blog.jsx`. Featured article + tag chips + 3-col grid + newsletter CTA.
- [x] `53` About — `screen-about.jsx`. Hero + stats + story + founders + milestones + press.
- [x] `54` Careers — `screen-careers.jsx`. Values + roles table + benefits panel.
- [x] `55` Landlord case study — `screen-case.jsx`. Hero + metrics + article body + pullquote.

### Communication (3)
- [x] `56` Live viewing video call — `screen-video.jsx`. Full-bleed video + self preview + chat panel + control bar. Added `mic` + `video` icons to Icon.tsx.
- [x] `57` Push & SMS templates — `screen-push.jsx`. Two columns of phone notifications + preference toggle matrix.
- [x] `58` Newsletter digest — `screen-newsletter.jsx`. Standalone email mock (Tuesday Digest format).

### Mobile & power users (4)
- [x] `59` Tenant mobile dashboard — `screen-tmobile.jsx`. Two phone frames: home + rent breakdown.
- [x] `60` Landlord mobile ops — `screen-lmobile.jsx`. Two phone frames: dashboard + applicant card. Added `wrench` + `arrL` icons.
- [x] `61` PWA install + offline — `screen-pwa.jsx`. Install prompt + offline state cards. Added `refresh` icon.
- [x] `62` Command palette ⌘K — `screen-cmdk.jsx`. Overlay with grouped commands + keyboard hints.

### System & inclusion (3)
- [x] `63` Localisation — `screen-i18n.jsx`. 3-locale hero cards + 8-language coverage table with progress bars.
- [x] `64` Design tokens spec — `screen-tokens.jsx`. Color swatches + type scale + spacing/radii + shadows.
- [x] `65` Accessibility audit — `screen-a11y.jsx`. WCAG 2.2 AA summary + focus rings + contrast pairs + touch targets + reduced motion.

### Deferred to a later release

- [ ] Auth flow wired to backroom-api: `POST /auth/login`, `POST /auth/register`, `POST /auth/refresh`, `GET /users/me`. Token in memory; refresh interceptor in `src/lib/api.ts`.
- [ ] Paginated lists wired (`PageResponse<T>` shape).
- [ ] Global error boundary; toast on API errors via existing ToastHost.
- [ ] Replace `Photo` placeholders with real image upload + display.
- [ ] Browser smoke test of every screen, dark mode pass, accent variants pass.
- [ ] `npm audit` triage, dependency bump round.

---

## Conventions during build-out

- **TypeScript**: strict mode, no `any` unless commented. `interface` for object shapes, `type` for unions.
- **Components**: function components with `export default`. Co-locate scoped CSS only when utility classes can't express it (`Component.module.css`).
- **No duplication**: if you're writing JSX that looks like an existing pattern, stop and check `component-audit.md`. The audit is the single source of truth for what's reusable.
- **Naming**: `kebab-case` for screen folders (`landlord-dashboard/`), `PascalCase` for component files.
- **Routes**: every screen route lives in `src/routes.ts`; never hardcode a path in `<Link>`. Use route ID constants.
- **API**: never call `fetch` directly from a component — go through `src/lib/api.ts` or a domain service in `src/lib/<domain>.ts`.
- **Strings**: user-facing copy can live inline in screens (prototypes do too); extract to `src/copy/` only if duplication grows.
- **Icons**: never inline SVG in a screen — always `<Icon name="…" />`.
- **Commits**: one commit per checked phase, message format `phase N: <name>`.
