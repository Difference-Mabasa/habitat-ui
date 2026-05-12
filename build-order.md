# Habitat UI — Build Order

> **Design source**: `C:\Users\mabas\Downloads\Backroom Web-handoff 2\backroom-web\project\` — 65 React/JSX prototype artboards (the v1 43-screen bundle in the original `Backroom Web-handoff` folder is superseded).
>
> **Product name**: Habitat (rebranded 2026-05-12 from the original "Backroom" brand on the frontend only — backend is still `backroom-api`). Property-type "backroom" lowercase noun is preserved.
>
> **API**: backroom-api on `localhost:8080/api/v1` (proxied via `/api` in dev).
>
> **Status**: Phases 1–9 shipped (65 prototype screens). Phase 10a shipped 2026-05-12 (+15 parity screens, +1 shared component → 80 routes total). Phase 10c (UI-only depth gaps on 10 existing screens) shipped 2026-05-12. **10b (backend service wiring) is the only remaining work in Phase 10.**

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

## Phase 10 — Parity with the legacy `backroom-ui` Angular app

The handoff designs covered 65 prototype screens. The legacy Angular app at `~/IdeaProjects/backroom-ui` ships several features that aren't in any prototype — gaps surfaced by an audit of that codebase on 2026-05-12. Each item below is a real flow already implemented (and presumably wired to `backroom-api`) that the Habitat React rebuild does not yet cover.

The agent who ran the audit summarised it cleanly:

> Backroom-UI is a substantially more complete rental marketplace than habitat-ui's 65-screen list suggests. Core gaps: agent-tenant direct marketplace, mandate lifecycle, multi-org agency support, fine-grained verification, advanced viewing scheduling, financial depth (invoices/payouts), typed notification taxonomy, role-based agent economics.

### 10a — New screens not in any prototype ✅ (all shipped 2026-05-12 — routes 66–80, group `parity`)

- [x] **66 Room request job board** (`/job-board`, role=agent) — `JobBoard.tsx`. Reuses: BriefCard (new Tier C), KpiTile×4, Tabs (status filter), EmptyState, PageHeader.
- [x] **67 Tenant room request creation** (`/room-request`) — `RoomRequest.tsx`. Reuses: Chip×3 groups, FormField, Input, Textarea, Toggle, Card, Avatar, KeyValueRow, Alert.
- [x] **68 Agent request management** (`/agent-requests`) — `AgentRequests.tsx`. Reuses: BriefCard with per-state action slots, KpiTile, Tabs.
- [x] **69 My agency setup & editing** (`/my-agency`) — `MyAgency.tsx`. Reuses: FormField×8, Input, Textarea, Chip area picker, Card team table with Avatar + Badge per row, KpiTile.
- [x] **70 Public agency browse & profile** (`/agency-browse`) — `AgencyBrowse.tsx`. Reuses: espresso hero (matches Auth & AgentProfile), Tabs filter, Card grid, RatingDisplay, Badge.
- [x] **71 Mandate approvals** (`/mandate-approvals`) — `MandateApprovals.tsx`. Reuses: KpiTile, Tabs, Card + KeyValueRow per-request, Alert.
- [x] **72 My mandates** (`/my-mandates`, role=agent) — `MyMandates.tsx`. Reuses: KpiTile, Tabs, Card-wrapped table with Badge state column + Avatar + tabular rent.
- [x] **73 Landlord tenants** (`/landlord-tenants`) — `LandlordTenants.tsx`. Reuses: KpiTile, Tabs, Card-wrapped table with Avatar + Badge state column.
- [x] **74 Viewing availability** (`/viewing-availability`) — `ViewingAvailability.tsx`. Reuses: Tabs (weekly / overrides / proposals), Toggle, Card, Alert, KeyValueRow rules card, Badge.
- [x] **75 Payment result pages** (`/payment-result`) — `PaymentResult.tsx`. One screen with `Tabs variant="segmented"` flipping between success / cancel / error states. Reuses: Card, Icon, Eyebrow, KeyValueRow, Alert.
- [x] **76 Dashboard settings** (`/dashboard-settings`, role=landlord) — `DashboardSettings.tsx`. Reuses: SubNav (6-section rail), Toggle matrix for notifications, FormField + Select for rent/bank, Card, Alert for danger zone.
- [x] **77 Identity verification** (`/identity-verification`) — `IdentityVerification.tsx`. Reuses: vertical Stepper (4 steps), FormField + Select doc type, FileUploadZone, Alert, KeyValueRow, Card sidebar.
- [x] **78 OAuth callback** (`/auth/oauth2/callback`) — `OauthCallback.tsx`. One screen with `Tabs variant="segmented"` flipping between exchanging / success / error. Reuses: Card, Icon, Eyebrow, Alert, KeyValueRow, Button.
- [x] **79 List property landing** (`/list-property`) — `ListProperty.tsx`. Public marketing CTA distinct from `/wizard`. Reuses: espresso radial hero, Photo, Card overlay, social-proof strip, 4-step grid, 2×2 perks grid, Footer.
- [x] **80 Agent browse** (`/agent-browse`) — `AgentBrowse.tsx`. Reuses: espresso hero, Tabs filter, `Tabs variant="segmented"` sort, Card grid with Avatar + RatingDisplay + 3-stat row.

**Shared new component**: `src/components/BriefCard.tsx` — Tier C, used by Job board + Agent requests. Composes Card / Badge / Avatar / Icon / Eyebrow. Status taxonomy: OPEN / MATCHED / FILLED / EXPIRED / CANCELLED.

### 10b — Domain capabilities (services without a screen equivalent today)

These are services on the backend that habitat hasn't surfaced anywhere yet. Each implies new screens or extends existing ones.

- [ ] **RoomRequestService** — tenant briefs ↔ agent matching marketplace.
- [ ] **MandateService** — full lifecycle with three flows (agent-online, agent-offline, landlord-initiated), document upload, approval/rejection/revocation. Habitat's `/mandates` shows the table but doesn't drive these workflows.
- [ ] **AgencyService** — agency CRUD + public browse.
- [ ] **ConversationService** — one-to-one tenant↔landlord messaging scoped to a unit, separate from community chat. Habitat has `/inbox` but it's a single split-pane mock — needs to be wired to per-unit conversations.
- [ ] **VerificationService** — tracks identity verification + consent records (used during signup + credit checks).
- [ ] **UserService** — registered-user lookup by email (used during mandate creation when inviting a non-Habitat user).
- [ ] **ChatDrawerService** — global signal-driven drawer so any component can open a conversation. Habitat's nav `<ChatDrawer>` is local state only.
- [ ] **PropertyWizardStateService** — multi-step draft state with step gating, mandate pre-population, and persistence. Habitat's `/wizard` is a static 5-step mock.

### 10c — Depth gaps (Habitat has the screen, Angular has substantially more flow) ✅ (UI-only pass shipped 2026-05-12)

Each line was a screen Habitat already had, paired with the depth it was missing. UI added; backend wiring is still 10b.

- [x] **Lease (`/lease`)** — added template selection (3 RHA templates via Select), OTP dual-signature card (6-digit Input with resend), lease decline path with reason capture + undo, download draft PDF button. Page now switchable across 4 stages via Tabs.
- [x] **My applications (`/my-apps`)** — extended ApplicationRow with `variant` union: `conditional` (warn alert + docs CTA), `on_hold` (warn card + nudge CTA), `invoice_due` (info alert + Pay button), `invoice_failed` (danger alert + retry). Added `EMPLOYMENT` enum badge on every row. Invoice ref shown as mono code.
- [x] **Apply (`/apply`)** — replaced 3 generic upload slots with 9 typed `DocumentStatusRow`s: SA_ID, PASSPORT, PAYSLIPS_3M, BANK_STATEMENTS_3M, EMPLOYMENT_LETTER, PROOF_OF_ADDRESS, CREDIT_CONSENT, LANDLORD_REFERENCE, OTHER. Each subText carries the type code in mono.
- [x] **Viewings (`/viewings`)** — sidebar now shows 7 request states (PENDING / APPROVED / DECLINED / ALTERNATIVE_PROPOSED / ALTERNATIVE_ACCEPTED / ALTERNATIVE_DECLINED / CANCELLED) with per-state Badge + per-state CTAs. PROPOSED rows display the proposed alternative time inline.
- [x] **Communities (`/communities`)** — added Tabs filter (All / Joined / Discover), area Chip filters; admin/moderator role chips on cards + thread header; right-rail "Join requests" admin panel with Approve / Decline; message hover-menu with Pin (admin) + Delete (own or moderator); media-attached message preview; "Load older" link.
- [x] **Notifications (`/notifications`)** — expanded to 25 items / 7 categories / 21 typed codes (PAYMENT_RECEIVED, DOCUMENTS_REQUESTED, MANDATE_PENDING_APPROVAL, VIEWING_ALTERNATIVE_PROPOSED, …). Type code rendered in mono next to body. Working "Mark all read" + filter chips by category. Bell-shake intent flagged in the info Alert.
- [x] **Property detail (`/property`)** + **Landlord dashboard (`/landlord-dashboard`)** — added LISTED / DRAFT / UNLISTED state badge on hero; `LISTED_BY_OWNER` vs `BY_AGENT` badge with agent name; mandate badge (Full management / Tenant find / Self-managed); per-unit status badge (AVAILABLE / OCCUPIED / UNDER_MAINTENANCE / UNLISTED) on every UnitRow. PropertyTable now has State / Source / Mandate columns + payout-account hint per row.
- [x] **Agent profile (`/agent`)** — added Fees Card (PERCENT_OF_ANNUAL vs FIXED, tenant admin fee), Areas-covered Card with pin chips, Connect Card with WhatsApp / Instagram / TikTok handles, link to agency page. Verification + agency already existed.
- [x] **Invoice (`/invoice`)** — added Tabs segmented switcher (PENDING / PAID / EXPIRED); PENDING shows warn Alert + "Pay R 4,155.75" CTA + countdown + pay link; PAID keeps the existing watermark; EXPIRED shows danger Alert + "Request new invoice" CTA. Issued/expiry sub-line in the top bar.
- [x] **Verification (`/verification`)** — added a per-doc-type status grid (SA_ID, SELFIE, POA, BANK, EMPLOYMENT, CREDIT (TPN), REFERENCES) with per-row Badge. Added consent Card with separate CREDIT_CONSENT + TPN toggles, consent reference, and "Withdraw any time" pointer.

**Phase 10c shipped — no new routes, no new visual tokens, no new icons.** Each pass composes existing primitives. Backend wiring remains the entire scope of 10b.

### 10d — Exit criteria for Phase 10

- [x] All 15 new screens (10a) added to `routes.ts` with their owning groups. Group `parity`, routes 66–80. Shipped 2026-05-12.
- [ ] All 8 services (10b) wired in `src/lib/<domain>.ts`, talking to backroom-api.
- [x] Each depth gap (10c) tracked individually; check off when its screen reaches feature parity with backroom-ui. **UI-only pass complete 2026-05-12** — Lease, My-apps, Apply, Viewings, Communities, Notifications, Property+Dashboard, Agent, Invoice, Verification all touched.
- [x] No regressions on the 65 existing screens — Phase 10a build round green, full route list still renders.
- [x] Build + lint + typecheck green after Phase 10a — full smoke pass via `/dev/routes`.

**Phase 10a shipped — checkpoint summary**

- 15 new screens (routes 66–80 in group `parity`).
- 1 new shared Tier C component: `BriefCard` (used by `/job-board` + `/agent-requests`).
- `Components.tsx` gallery update is deferred — add `BriefCard` to `/dev/components` when convenient.
- No new visual tokens, no new icons, no new fonts. Design lock holds.

---

## Phase 11 — Production-readiness & social depth

The app has the surface area for every flow; what's missing is the production-grade plumbing and the social space we just designed. Six tracks, two shipped this session, four queued.

### 11a — Auth context + role gating ✅

- [x] `SessionContext` exposing `{ user, signIn, signOut }`, persisted to localStorage.
- [x] `RequireAuth` route wrapper — redirects unauthenticated visitors to `/auth` and re-routes them back on success.
- [x] Nav workspace dropdown filters by the signed-in user's available roles; current role is highlighted; switching roles updates context.
- [x] Sign-out clears the session and routes to `/landing`.
- [x] Dev-only role-switcher inside the `/dev` hub so each workspace can be previewed without auth wiring.

### 11d — Social: notifications + bookmark + report ✅

- [x] Four new notification types added to the bell drawer: `NEW_FOLLOWER` (→ `/u/:id`), `POST_REPLY` (→ `/post/:id`), `POST_LIKE` (→ `/post/:id`), `POST_MENTION` (→ `/post/:id`).
- [x] `PostCard` gains a bookmark icon (Save) — fills when active, toast on toggle.
- [x] Kebab menu on `PostCard` with **Report post**, **Mute author**, **Block** — all fire toast feedback for now.

### 11b — Mobile responsiveness pass (queued)

A real reflow pass on the eight most-visited screens — Landing, Browse, Communities (Feed), Property detail, Unit, `/profile`, `/u/:userId`, Inbox. Single `useViewport()` hook exposes `sm` / `md` / `lg`. Other screens follow when needed.

- [ ] `useViewport()` hook.
- [ ] Landing, Browse, Communities, Property detail, Unit, Profile, Public profile, Inbox reflow to single-column under `md`.
- [ ] Tab + drawer surfaces collapse correctly on `sm`.

### 11c — Loading + error + empty states ✅

The codebase renders mock data instantly; real flows need this once API wiring lands. Starter set: Feed, Browse, Notifications, Statements.

- [x] `<LoadingState />` (skeleton card stack — `card` or `list` variant, optional avatar lead) + `<ErrorState />` (danger-tinted icon + title + body + Retry CTA) primitives.
- [x] Applied to the four data-heaviest screens behind a `?state=loading|error` URL param. Cleared via the Retry button or by removing the param.
- [x] Dev hub gains a "Preview data states" card with 8 deep links so each state can be inspected at a glance.

### 11e — Lease offboarding + cosigner + reviews (queued)

End-of-lease workflow we don't model yet. Important for SA market.

- [ ] Move-out inspection screen with photo upload + condition checklist.
- [ ] Deposit refund decision — landlord-side approve/deduct flow.
- [ ] Lease-end review (tenant rates landlord, vice versa) — connects to existing `/reviews` route.
- [ ] Cosigner / guarantor section on `/apply` — add a second-applicant block with own FICA reference.

### 11f — Discovery polish (queued)

- [ ] Saved search → email/push alert opt-in on `/saved`.
- [ ] Replace the CSS-mock map with MapLibre + real geocoded pins.
- [ ] Post share modal: copy-link, native Web Share API, OG metadata in the HTML head.

### 11 — Exit criteria

- [x] Auth gate live; no workspace reachable without a signed-in role.
- [x] Bell drawer shows social events (`POST_REPLY`, `NEW_FOLLOWER`, …) alongside property events.
- [ ] Top 8 screens reflow cleanly at 375px width.
- [x] Data-heaviest screens have a loading + error fallback (preview via `?state=`).

---

## Conventions during build-out

> **Design lock.** The Habitat design system is fixed: tokens, primitives, typography, color, and spacing. New components must compose existing primitives — they do not introduce new visual patterns. See [`CLAUDE.md`](./CLAUDE.md) for the full rule set (color tokens, typography classes, primitive registry, decision checklist for adding components or screens).

- **TypeScript**: strict mode, no `any` unless commented. `interface` for object shapes, `type` for unions.
- **Components**: function components with `export default`. Compose existing primitives from `src/components/` rather than re-implementing patterns. Co-locate scoped CSS only when utility classes can't express it (`Component.module.css`).
- **No duplication**: if you're writing JSX that looks like an existing pattern, stop and check `component-audit.md` and `/dev/components`. The audit is the single source of truth for what's reusable.
- **No new visual tokens**: use the CSS variables in `src/styles/tokens.css`. No new hex literals (the `/tokens` swatch screen excepted), no custom shadows, no off-scale spacing, no new font families.
- **Naming**: `kebab-case` for screen folders (`landlord-dashboard/`), `PascalCase` for component files.
- **Routes**: every screen route lives in `src/routes.ts`; never hardcode a path in `<Link>`. Use route ID constants.
- **API**: never call `fetch` directly from a component — go through `src/lib/api.ts` or a domain service in `src/lib/<domain>.ts`.
- **Strings**: user-facing copy can live inline in screens (prototypes do too); extract to `src/copy/` only if duplication grows.
- **Icons**: never inline SVG in a screen — always `<Icon name="…" />`. New icons go in `Icon.tsx` using the same 24×24 / 1.5-stroke style.
- **Brand**: user-facing brand is **Habitat** (logo wordmark `HABI`+`TAT`). Property type "backroom" lowercase stays. Backend service `backroom-api` is unchanged.
- **Commits**: one commit per checked phase, message format `phase N: <name>`. Never include `Co-Authored-By: Claude`.
