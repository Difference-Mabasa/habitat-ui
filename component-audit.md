# Backroom UI — Component Audit

Catalog of every reusable UI pattern across the 43 prototype screens. Anything appearing in 2+ screens is built once and reused — no duplication.

> **Source**: `C:\Users\mabas\Downloads\Backroom Web-handoff\backroom-web\project\` — 43 `screen-*.jsx` files + `nav.jsx`, `primitives.jsx`.

## Tiering

Each component is tagged with a build tier:

- **A — Foundation primitive**. Built in Phase 1, before any screen. Used by 5+ screens. Typed React wrappers over the existing utility classes (`.btn`, `.chip`, `.badge`, `.card`, `.input`) or new shared widgets.
- **B — Layout/shell primitive**. Built in Phase 1. Shells, page-headers, drawers, empty/error states — non-domain but appears across many screens.
- **C — Domain card / row**. Built in `src/components/` the first time its screen ships, then reused. Property cards, applicant cards, KPI tiles, notification rows, etc.
- **D — Screen-internal complex widget**. Lives inside its owning screen folder; not abstracted further because there's no second consumer. Property table, viewing calendar, comparison table, etc. *(Still split into a sub-component file — but not in `src/components/`.)*

A single rule: **if a pattern appears 2+ times and is currently inconsistent across screens, the audit's job is to converge them.** Inconsistencies are flagged in each entry.

---

## 1. Foundation primitives (Tier A)

These are the building blocks. Every screen uses several. Build them first.

### Button — Tier A
- **What**: typed wrapper over `.btn` and its modifiers.
- **Appears in**: all 43 screens.
- **Props**: `variant: "primary" | "accent" | "secondary" | "ghost"`, `size: "sm" | "md" | "lg"`, `iconOnly`, `leftIcon`, `rightIcon`, `disabled`, `loading`, `as` (for `<a>` rendering).
- **Source**: `styles.css` `.btn` classes (already ported into `utilities.css`).
- **Notes**: never write `<button className="btn btn--primary">` in a screen — always `<Button variant="primary">`.

### IconButton — Tier A
- **What**: `<Button iconOnly>` shortcut; square button with only an icon.
- **Appears in**: 10+ screens (nav, browse heart-favourites, property share/save, sidebar action rows).
- **Props**: `icon: IconName`, `size`, `variant`, `badge` (numeric).
- **Source**: `.btn.btn--icon` utility + `Dot` from `nav.jsx:105-116` for the badge.

### Chip — Tier A
- **What**: pill-shaped toggle/filter button. Different from `<Button>` — has filter semantics.
- **Appears in**: 5+ screens — `screen-browse.jsx:45-62` (price/bed/more filters), `screen-notifications.jsx:44-46` (filter tabs), `screen-reviews.jsx:56-64` (tag picker).
- **Props**: `active`, `leftIcon`, `count` (badge), `size`, `onToggle`.
- **Source**: `.chip` and `.chip--active` utility classes.

### Badge — Tier A
- **What**: small monospace label for status, tags, counts.
- **Appears in**: 30+ screens. "Verified", "New", "Pending", "Approved", "Let", "Score 84", unread counters, etc.
- **Props**: `tone: "neutral" | "success" | "warn" | "danger" | "accent"`, `size: "sm" | "md"`, `leftIcon`.
- **Source**: `.badge` and `.badge--{tone}` utility classes.

### Card — Tier A
- **What**: bordered surface container with `border-radius: var(--r-lg)`.
- **Appears in**: 40+ screens.
- **Props**: `padding`, `interactive` (hover state), `as` (for clickable cards).
- **Source**: `.card` utility class.

### Input / Textarea / Select — Tier A
- **What**: form controls with consistent height, focus ring, hover border.
- **Appears in**: 15+ screens.
- **Props**: `label`, `helper`, `error`, `leftIcon`, `rightSlot`, plus all native input props.
- **Source**: `.input` / `.select` utility classes; textarea variant in `screen-reviews.jsx:70`, `screen-inbox.jsx:89`.

### Checkbox / Radio / Toggle — Tier A
- **What**: inline form controls.
- **Appears in**: `screen-settings.jsx`, `screen-onboarding.jsx`, `screen-apply.jsx`, `screen-reviews.jsx` (name-toggle), `screen-wizard.jsx`.
- **Props**: standard React form props; `label` + `helper` slots.
- **Notes**: prototypes use native inputs styled inline — converge on a typed component.

### FormField — Tier A (composite)
- **What**: label + control + helper + error wrapper. Always use this in forms, never raw `<label>` + control.
- **Appears in**: every form (`apply`, `auth`, `wizard`, `settings`, `profile`, `onboarding`, `verification`, `maintenance`, `deposit`, `reviews`).
- **Props**: `label`, `helper`, `error`, `required`, `children`.

### Eyebrow — Tier A
- **What**: small uppercase mono-font label that sits above headings (`.eyebrow` class).
- **Appears in**: 25+ screens (almost every section header has one).
- **Props**: `children`, `tone`.

### Hairline — Tier A
- **What**: 1px horizontal separator (`.hairline` class).
- **Appears in**: 30+ screens.

### Stepper — Tier A (two variants)
- **What**: progress indicator for multi-step flows.
- **Appears in**:
  - **Vertical**: `screen-apply.jsx:20-65` (left rail), `screen-verification.jsx:32-54`.
  - **Horizontal**: `screen-wizard.jsx:18-41`, `screen-onboarding.jsx:6-29`.
- **Props**: `orientation: "vertical" | "horizontal"`, `steps: Array<{ label, state }>`, `currentStep`, `onStepClick`, optional `aside` (info card for vertical).
- **Convergence**: prototypes implement these separately — build one component, two layouts.

### ProgressBar — Tier A
- **What**: thin horizontal fill bar for metric/score/occupancy.
- **Appears in**: `screen-landlord.jsx:222-227` (occupancy), `screen-applicant.jsx` (score bars), `screen-onboarding.jsx:100-118`.
- **Props**: `value` (0–100), `tone`, `height: "thin" | "md"`.

### StarRating — Tier A
- **What**: 1–5 star display or interactive picker.
- **Appears in**: `screen-reviews.jsx:26-31, 35-50`, `screen-property.jsx`, `screen-agent.jsx`, `screen-viewings.jsx`.
- **Props**: `value`, `max=5`, `size`, `interactive`, `onChange`, `count` (review count badge), `layout: "inline" | "vertical"`.

### Avatar — Tier A
- **What**: round image with initials fallback.
- **Appears in**: nav user pill, `screen-inbox.jsx` (every message), `screen-landlord.jsx` (applicant pipeline), `screen-applicant.jsx`, `screen-viewings.jsx`, `screen-reviews.jsx`, `screen-agent.jsx`.
- **Props**: `src`, `name` (used for initials fallback), `size`, `tone` (accent ring for verified).

### PriceDisplay — Tier A
- **What**: large tabular price with `/period` suffix.
- **Appears in**: `screen-property.jsx:158-163`, `screen-saved.jsx`, `screen-compare.jsx`, `screen-pricing.jsx`, `screen-cards.jsx`, property cards everywhere.
- **Props**: `amount`, `period` (default `"/month"`), `currency` (default `"R"`), `size: "lg" | "md" | "sm"`, `tone`.

### KeyValueRow — Tier A
- **What**: horizontal label + value pair with optional border-top.
- **Appears in**: 10+ screens — `screen-lease.jsx:50-62`, `screen-applicant.jsx:68-82`, `screen-deposit.jsx`, `screen-property.jsx`, `screen-statements.jsx`, `screen-my-apps.jsx`.
- **Props**: `label`, `value`, `tone`, `size`, `divider` (top border).

---

## 2. Layout & shell primitives (Tier B)

### PageShell — Tier B
- **What**: top nav + optional sidebar + main content with `max-width: 1440`, `padding: 32`.
- **Appears in**: every screen that has the nav (all except print artboards 40–42 and email 42).
- **Props**: `navRole`, `sidebar?: ReactNode`, `children`.

### TwoColumnSplit — Tier B
- **What**: main content + sticky right sidebar (typically 380px right rail).
- **Appears in**: `screen-property.jsx:51-196`, `screen-apply.jsx`, `screen-wizard.jsx`, `screen-applicant.jsx`, `screen-lease.jsx`.
- **Props**: `main`, `aside`, `asideWidth`, `gap`.

### ThreeColumnLayout — Tier B
- **What**: left rail + center + right rail.
- **Appears in**: `screen-apply.jsx:17-145` (stepper / form / recap).
- **Props**: `left`, `center`, `right`, `leftWidth=260`, `rightWidth=320`.

### Sidebar — Tier B
- **What**: 240px left nav for landlord/agency/admin dashboards.
- **Appears in**: `screen-landlord.jsx:124-180`, `screen-agency.jsx`, `screen-admin.jsx`.
- **Props**: `items: Array<{ icon, label, count, active, href }>`, `proTip?: { title, body }`.

### TopNav — Tier B
- **What**: full-width nav with logo, role-specific links, search, chat/notif buttons, user pill.
- **Appears in**: all 43 screens with nav.
- **Props**: `role: "tenant" | "landlord" | "agent" | "admin"`, `showBadges`, `onChatOpen`, `onNotifOpen`.
- **Source**: port `nav.jsx:4-102`.

### DrawerShell — Tier B
- **What**: dropdown panel from nav, 380px wide, sits top-right.
- **Appears in**: NotificationDrawer + ChatDrawer in nav, future drawers for sub-features.
- **Props**: `title`, `onClose`, `width=380`, `maxHeight=560`, `children`.
- **Source**: `nav.jsx:118-147`.

### PageHeader — Tier B
- **What**: eyebrow + h1 title + subtitle + right-side action buttons. Sits at the top of nearly every page.
- **Appears in**: 15+ screens — `screen-landlord.jsx:15-26`, `screen-applicant.jsx:8-35`, `screen-saved.jsx`, `screen-statements.jsx`, `screen-my-apps.jsx`, `screen-viewings.jsx`, `screen-help.jsx`, etc.
- **Props**: `eyebrow`, `title`, `subtitle`, `actions?: ReactNode`, `badges?: ReactNode`.

### SectionHeader — Tier B
- **What**: smaller header within a card/section. eyebrow + title + optional `<InlineLink>` action.
- **Appears in**: 10+ screens — "Available units", "Amenities", "Documents", "Applicants pipeline", etc.
- **Props**: `eyebrow?`, `title`, `subtitle?`, `actionLabel?`, `actionHref?` or `onAction`.

### Breadcrumbs — Tier B
- **What**: chevron-separated path navigation under the page header.
- **Appears in**: `screen-property.jsx:24-34`, `screen-applicant.jsx`, `screen-inbox.jsx`.
- **Props**: `items: Array<{ label, href? }>`.

### Tabs — Tier B
- **What**: horizontal tab navigation (variants: pill / underline / segmented).
- **Appears in**: `screen-landlord.jsx:45-49` (All/Active/Drafts pill chips), `screen-browse.jsx:71-85` (list/split/map segmented).
- **Props**: `tabs: Array<{ id, label, count? }>`, `value`, `onChange`, `variant: "pill" | "underline" | "segmented"`.
- **Convergence**: prototypes use chip-groups and button-groups interchangeably for tabbing — converge to one `<Tabs>` with variants.

### InlineLink — Tier B
- **What**: clickable text link with optional icon (chevron right, arrow up-right, etc.).
- **Appears in**: `screen-property.jsx:97-98`, `screen-landing.jsx:148-150`, `screen-inbox.jsx`.
- **Props**: `href` or `onClick`, `icon`, `iconPosition`, `size`.

### EmptyState — Tier B
- **What**: centered card with icon, heading, description, CTA when there's nothing to show.
- **Appears in**: `screen-cards.jsx:125-135` is the canonical example; needs to be applied to browse/saved/inbox/notifications when those lists are empty.
- **Props**: `icon`, `title`, `description`, `cta?: { label, onClick }`.

### ErrorState / Banner / Alert — Tier B
- **What**: inline banner with tone (error/warn/info/success), icon, message, optional action.
- **Appears in**: `screen-verification.jsx:96-99` (danger), `screen-states.jsx` (the canonical state gallery).
- **Props**: `tone`, `icon`, `title?`, `message`, `action?`, `dismissible`.

### LoadingSkeleton — Tier B
- **What**: shimmer placeholder for loading state.
- **Appears in**: `screen-states.jsx` (canonical).
- **Props**: `shape: "line" | "block" | "circle"`, `width`, `height`.

### ToastHost — Tier B
- **What**: global toast/snackbar host, displays success/error messages.
- **Appears in**: not in handoff but required by Phase 9 (API integration). Build the API now so it's available.
- **Props**: imperative API — `toast.success(msg)`, `toast.error(msg)`.

### Modal / ConfirmDialog — Tier B
- **What**: centered overlay with backdrop, icon, title, message, two-button footer.
- **Appears in**: not directly in handoff but referenced by actions like "Approve", "Decline", "Delete".
- **Props**: `open`, `onClose`, `icon`, `title`, `message`, `primaryAction`, `secondaryAction`, `tone`.

### Footer — Tier B
- **What**: dark-background footer with link columns, logo, copyright.
- **Appears in**: `screen-landing.jsx:254-286` (FooterBlock).
- **Props**: `columns: Array<{ title, links }>`, `companyInfo`, `copyright`.

---

## 3. Domain cards & rows (Tier C)

Built in `src/components/` the first time their screen is implemented, then reused.

### PropertyCard — Tier C (three variants)
- **What**: the most-reused widget in the app. Photo + favourite + badge + title + area + price + amenity icons.
- **Variants**:
  - `grid`: 3-up browse card. Canonical: `screen-cards.jsx:24-51`.
  - `row`: dense list row with 130px thumbnail. Canonical: `screen-cards.jsx:54-80`.
  - `compact`: 4-up small card with 56px thumbnail. Canonical: `screen-cards.jsx:82-96`.
- **Appears in**: `screen-cards.jsx` (gallery — has ALL three variants), `screen-browse.jsx:121-168`, `screen-saved.jsx`, `screen-landing.jsx` (featured areas), `screen-landlord.jsx` (similar layout).
- **Props**: `variant: "grid" | "row" | "compact"`, `photo`, `title`, `area`, `price`, `beds`, `baths`, `amenities: IconName[]`, `tag` (New/Verified/Let), `saved`, `active`, `onToggleSave`, `onOpen`.
- **Convergence**: there are *three different layouts* of property card currently — `screen-cards.jsx` is the canonical reference (designed as the component gallery). Build all three variants in one component.

### ApplicantCard / PipelineCard — Tier C
- **What**: name + unit + score chip + status line. Sits in the landlord applicant pipeline.
- **Appears in**: `screen-landlord.jsx:266-296`, `screen-applicant.jsx` (header summary).
- **Props**: `name`, `unit`, `score`, `statusLine`, `onOpen`.
- **Notes**: `ScoreChip` helper — score ≥ 90 → success, ≥ 75 → accent, else warn. Bake into Badge tone selection.

### AgentCard — Tier C
- **What**: agent profile preview card (avatar + name + rating + specialties).
- **Appears in**: `screen-mandates.jsx`, `screen-agent.jsx` (public profile), `screen-property.jsx` (sidebar contact card).
- **Props**: `name`, `avatar`, `rating`, `specialties`, `verified`, `onContact`.

### KpiTile — Tier C
- **What**: stat card with label, large value, delta badge, optional sparkline.
- **Appears in**: `screen-landlord.jsx:182-196` (Kpi component), `screen-statements.jsx` (YTD summary), `screen-analytics.jsx`.
- **Props**: `label`, `value`, `delta`, `deltaTone`, `subText`, `spark?: number[]`.

### StatTile — Tier C
- **What**: simpler stat card (no delta, no spark) — number + label + optional sub-text.
- **Appears in**: `screen-landing.jsx:102-108` (Stat component), several hero blocks.
- **Props**: `label`, `value`, `subText`, `tone`.

### NotificationRow — Tier C
- **What**: icon badge + title + description + time + unread state + optional CTA.
- **Appears in**: `nav.jsx:164-185` (NotifDrawer items), `screen-notifications.jsx:53-76`.
- **Props**: `type: IconName`, `title`, `body`, `time`, `unread`, `tone`, `action?`.
- **Convergence**: drawer and full-screen versions use the same data shape — single component.

### ActionItem — Tier C
- **What**: dashboard action queue row — icon badge + title + subtitle + CTA on right.
- **Appears in**: `screen-landlord.jsx:241-264` (ActionItem component).
- **Props**: `icon`, `title`, `subtitle`, `tone`, `ctaLabel`, `onAction`.

### MessageBubble — Tier C
- **What**: chat bubble; styled differently for own vs received.
- **Appears in**: `screen-inbox.jsx:69-84`, `nav.jsx` (ChatDrawer preview — simplified).
- **Props**: `name`, `time`, `body`, `own`, `tone`.

### ViewingCard — Tier C
- **What**: viewing block on calendar showing title, attendee, confirmation state.
- **Appears in**: `screen-viewings.jsx:54-71`.
- **Props**: `title`, `who`, `confirmed`, `groupEvent`, `startHour`, `duration` (calendar positions absolutely).

### SavedSearchCard — Tier C
- **What**: card showing a saved search with match count, alert freq, view/settings buttons.
- **Appears in**: `screen-saved.jsx:31-45`.
- **Props**: `name`, `matchCount`, `alertFreq`, `newCount`, `onView`, `onSettings`.

### FilterBar — Tier C
- **What**: horizontal sticky bar — location dropdown, type chip group, price/bed buttons, view-mode segmented, result count.
- **Appears in**: `screen-browse.jsx:28-87` only — but the pattern is reusable in `saved` and `notifications` filter contexts. Extract.
- **Props**: `slots` — `left`, `center`, `right`; or build as composite with explicit `location`, `chips`, `views`, `resultCount` props.

### DocumentStatusRow — Tier C
- **What**: file upload tracker — icon badge + name + filename + sub-text + status + Replace/View action.
- **Appears in**: `screen-apply.jsx:150-180`, `screen-applicant.jsx:86-107`.
- **Props**: `name`, `filename`, `status: "empty" | "uploaded" | "verified"`, `subText`, `onReplace`.

### FileUploadZone — Tier C
- **What**: dashed-border drop zone with upload icon + instructional text + accepted types + CTA button.
- **Appears in**: `screen-apply.jsx:84-107` (bank statements), `screen-verification.jsx:66-79`, `screen-wizard.jsx` (property photos).
- **Props**: `label`, `description`, `accepts`, `maxSize`, `helpText`, `onUpload`.

### MapPin — Tier C
- **What**: rounded pill map marker showing price, cluster count, or sold state.
- **Appears in**: `screen-cards.jsx:98-123` (canonical gallery), `screen-browse.jsx`, `screen-map.jsx`.
- **Props**: `price?`, `cluster?: number`, `active`, `sold`, `verified`.

### RatingDisplay — Tier C
- **What**: rating number + star icons row + count.
- **Appears in**: `screen-reviews.jsx:94-99` (landlord profile rating), `screen-property.jsx` (property rating block), `screen-agent.jsx`.
- **Props**: `rating`, `count`, `layout: "vertical" | "horizontal"`, `size`.
- **Notes**: distinct from `<StarRating>` — RatingDisplay is the "shows a rating with context" composite; StarRating is just the stars.

### SectionActionHeader — Tier C
- **What**: in-content section header (smaller than PageHeader) with title + right-side actions.
- **Appears in**: 8+ screens.
- **Props**: `eyebrow?`, `title`, `actions?: ReactNode`.
- **Notes**: very close to SectionHeader (B) — merge unless they diverge.

---

## 4. Screen-internal complex widgets (Tier D)

These live inside their owning screen's folder (e.g. `src/screens/landlord-dashboard/PropertyTable.tsx`). They're complex enough to deserve their own file but only have one consumer.

| Component | Owning screen | Source |
|---|---|---|
| PropertyTable (occupancy bar + app count) | landlord-dashboard | `screen-landlord.jsx:39-71` |
| ApplicationPipeline (4-col kanban) | landlord-dashboard | `screen-landlord.jsx:266-296` |
| ViewingCalendarGrid (hourly grid) | viewings | `screen-viewings.jsx:31-75` |
| ComparisonTable (multi-col with highlight) | compare | `screen-compare.jsx` |
| InboxThreadList (split pane) | inbox | `screen-inbox.jsx` |
| StatementsTable | statements | `screen-statements.jsx:71-98` |
| MonthlyCollectionChart (bar chart) | statements | `screen-statements.jsx:43-63` |
| LeaseDocument (paginated viewer) | lease | `screen-lease.jsx` |
| DepositReturnChecklist | deposit | `screen-deposit.jsx:27-94` |
| ApplicationStatusTimeline (4-stage) | my-apps | `screen-my-apps.jsx:38-60` |
| AffordabilityBreakdown (4-col) | applicant | `screen-applicant.jsx:43-62` |
| Hero (landing block) | landing | `screen-landing.jsx:18-99` |
| ValueGrid (feature cards) | landing | `screen-landing.jsx:131-169` |

If any of these turns out to appear in a second screen later, promote it to Tier C.

---

## Convergence checklist

Inconsistencies the audit caught — must resolve while building, not after.

- [ ] **PropertyCard** has 3 visual layouts across screens. Use `screen-cards.jsx` as canonical; one component with `variant` prop.
- [ ] **Stepper** is implemented twice (vertical sidebar in apply/verification, horizontal bar in wizard/onboarding). One component, two orientations.
- [ ] **Tabs** are sometimes chip-groups (`screen-landlord.jsx`), sometimes button-groups (`screen-browse.jsx`). One `<Tabs>` with `variant: "pill" | "segmented"`.
- [ ] **NotificationRow** appears in both the nav drawer and the full notifications screen — same component.
- [ ] **MessageBubble** appears in inbox + the chat drawer preview — same component.
- [ ] **SectionHeader** vs **SectionActionHeader** — likely the same thing with optional actions; don't fork.
- [ ] **Badge tone selection** for score values (≥90/≥75/else) is repeated in landlord pipeline + applicant detail — extract a `scoreTone(value)` helper alongside `<Badge>`.

## Gaps the prototypes don't cover

These don't appear in any artboard but are required infrastructure — build during Phase 1 or Phase 9:

- ToastHost (success/error snackbar)
- ConfirmDialog (modal)
- Tooltip
- Popover / menu dropdown
- Mobile sheet drawer (referenced in `screen-mobile.jsx` but not detailed)

---

## Component count

- Tier A (foundation primitives): **15**
- Tier B (layout/shell primitives): **15**
- Tier C (domain cards/rows): **15**
- Tier D (screen-internal widgets): **13**

**Total: ~58 reusable units. Phase 1 builds A + B (~30 components). Phases 2–8 build C as their screens land. Phase 9 covers gaps + extracts any C/D promotions.**
