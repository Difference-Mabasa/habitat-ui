# Habitat UI — Claude instructions

This is the **Habitat** rental platform frontend (Vite + React + TypeScript), talking to `backroom-api` on `localhost:8080`. 65 screens already shipped (Phases 1–9). Phase 10 (parity with the legacy Angular `backroom-ui` app) is the active backlog.

> **The Habitat design is locked.** Tokens, primitives, typography, color, spacing, and copy voice are decided. Don't invent new visual patterns. Compose what already exists. New components that ship are extensions of the system, not alternatives to it.

---

## 1. The design lock — what's fixed and how to stay inside it

### 1.1 Single source of truth

- **Visual tokens** live in `src/styles/tokens.css` (CSS variables) and `src/styles/utilities.css` (`.btn`, `.chip`, `.badge`, `.card`, `.input`, `.eyebrow`, `.mono`, `.display`, `.ph`, `.hairline`, `.tabular`, `.skel`).
- **Reusable components** live in `src/components/` (~60 of them). They are catalogued in `component-audit.md` and previewable at `/dev/components`.
- **Routes** live in `src/routes.ts` — add new screens there, don't hardcode paths.

If a primitive exists for what you need, **use it**. If two primitives can compose what you need, **compose them**. Only create a new component when neither covers the pattern *and* you have ≥2 screens that would consume it.

### 1.2 Color

Use only the variables in `tokens.css`. No new hex literals in component code (the `/tokens` swatch screen is the lone exception).

| Use case | Variable |
|---|---|
| Background | `--paper`, `--paper-2`, `--surface`, `--surface-2`, `--surface-3` |
| Borders | `--hairline`, `--hairline-strong` |
| Text | `--ink`, `--ink-2`, `--slate`, `--slate-2`, `--slate-3` |
| Brand | `--accent`, `--accent-hover`, `--accent-soft`, `--accent-ring` |
| Status | `--success` / `--success-soft`, `--warn` / `--warn-soft`, `--danger` / `--danger-soft` |

Dark mode is handled by `[data-theme="dark"]` in `tokens.css`. Don't write theme-conditional code in components — let the variables flip.

### 1.3 Typography

| Token | Family | Used for |
|---|---|---|
| `var(--font-display)` | Anton | Page hero headings (`.display` class) — uppercase, condensed, letter-spacing `-0.005em`, line-height `0.92` |
| `var(--font-sans)` | Inter | Body, controls, most labels |
| `var(--font-mono)` | JetBrains Mono | IDs, codes, timestamps, numeric tabulars (`.mono` class) |

The three editorial classes:

- `.display` — for hero / page-title / section banner type. Always uppercase.
- `.eyebrow` — small uppercase mono label, 11px, tracked 0.12em.
- `.mono` — monospace inline (codes, IDs, refs).
- `.tabular` — turns on `font-variant-numeric: tabular-nums` for money/stats.

Don't introduce new font families, custom letter-spacings, or new utility classes for type.

### 1.4 Spacing & radii

Spacing scale (from `/tokens`): **4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64**. Snap to one of these. No `gap: 7` or `padding: 19`.

Radii: `--r-xs (4)`, `--r-sm (6)`, `--r-md (8)`, `--r-lg (12)`, `--r-xl (16)`. Pills = `999`.

Shadows: `--shadow-sm`, `--shadow-md`, `--shadow-lg`. Don't write custom `box-shadow` strings.

### 1.5 Primitives — which one to reach for

Always prefer the typed component over re-implementing it:

| You want… | Use |
|---|---|
| A clickable action | `<Button variant="primary | accent | secondary | ghost" size="sm | md | lg">` |
| An icon-only button | `<IconButton icon="…" label="…" />` (label is required for a11y) |
| A filter pill / toggle | `<Chip active leftIcon count>` |
| A tag / status | `<Badge tone="neutral | success | warn | danger | accent">` |
| A bordered surface | `<Card padding interactive>` |
| A label + input + helper + error | `<FormField label helper error>` wrapping `<Input>`, `<Textarea>`, `<Select>`, `<Checkbox>`, `<Radio>`, or `<Toggle>` |
| A horizontal label/value row | `<KeyValueRow label value tone divider>` |
| A price | `<PriceDisplay amount period currency size>` |
| A rating | `<StarRating>` for interactive, `<RatingDisplay>` for composed score+stars+count |
| A multi-step flow | `<Stepper orientation="vertical | horizontal" steps currentStep>` |
| A bar | `<ProgressBar value tone height>` |
| A round person | `<Avatar name src tone size>` (initials fallback automatic) |
| Section navigation rail | `<SubNav>` (settings/profile-style) — not the same as `<Sidebar>` (landlord-dashboard rail) |
| Page title with actions | `<PageHeader eyebrow title subtitle actions>` |
| Card title with action | `<SectionHeader>` |
| Tabs | `<Tabs variant="pill | underline | segmented">` |
| Empty state | `<EmptyState icon title description actions>` |
| Inline banner | `<Alert tone="info | success | warn | danger">` |
| Loading | `<LoadingSkeleton shape="line | block | circle">` |
| Modal | `<Modal>` or the convenience `<ConfirmDialog>` |
| Snackbar | `toast.success(msg)` / `.error()` / `.info()` / `.warn()` from `@/lib/toast` |
| Top-right dropdown panel | `<DrawerShell>` |
| Page chrome (nav + content) | `<PageShell role>` |
| Property card | `<PropertyCard variant="grid | row | compact">` |
| Score breakdown | `<ScoreBreakdown items>` (uses lenient ≥85/≥70 category thresholds — pair with `scoreTone()` from `@/lib/score` for headline overall scores using the ≥90/≥75 thresholds) |
| Area/neighbourhood card | `<AreaCard name count priceFrom>` |
| KPI tile | `<KpiTile label value valueTone delta deltaTone subText subTone spark>` |
| Notification row | `<NotificationRow variant="drawer | page">` |

### 1.6 Icons

- All icons come from `<Icon name="..." />` (`src/components/Icon.tsx`). The catalog has ~55 outline icons at `viewBox="0 0 24 24"`, stroke `1.5`, line-cap `round`.
- **Don't inline new SVG in screen files.** If you need a new icon, add it to `Icon.tsx` in the same style (24×24, 1.5 stroke, currentColor, no fills unless thematic).
- Don't substitute emoji for icons. The one exception is the existing 📌 in community pinned messages (intentional).

### 1.7 Brand & voice

- **Brand name everywhere user-facing is "Habitat"**. Logo wordmark is `HABI` (ink) + `TAT` (accent). Don't reintroduce "Backroom" as a brand name.
- The **property type "backroom"** (a small SA dwelling) is a real noun and stays — in listing names like "Backroom · Vilakazi St", the type filter on `/browse`, unit names "Backroom A/B", and the community "Yeoville Backrooms". Don't rewrite those to "Habitat".
- Internal reference IDs use `HB-` prefix (HB-INV, HB-LSE, HB-PMT, HB-RFD, HB-FLG, HB-W, HB-A).
- Domain references: `habitat.co.za` / `hb.co.za`. Email senders: `noreply@habitat.co.za`, `billing@habitat.co.za`.
- The backend service is **still named `backroom-api`** — don't rename references to that. It's a deliberate split (frontend rebrand, backend unchanged).

### 1.8 Editorial tone

The design source describes itself as "Calm Utility · landlord-priority · trusted utility tone". Copy should be:

- Plain, short sentences. Currency formatted "R 3,450" with a thin space.
- "Spot", "your spot", "your hood" are accepted brand-vernacular nouns.
- Helper text under controls is allowed to be conversational ("PDF or CSV · max 10 MB · 3 months").
- No marketing buzzwords ("revolutionary", "seamless"). Be specific instead.

---

## 2. Adding a new component — checklist

Before writing a new `*.tsx`:

1. **Check `component-audit.md`.** If the pattern is there but unbuilt, build it as catalogued.
2. **Check `/dev/components`.** If something close exists, extend its props rather than fork.
3. **Decide where it lives**:
   - `src/components/` — only if **two or more** screens will use it. This becomes a Tier C primitive and goes in `component-audit.md`.
   - `src/screens/<owning-screen>/` — if only one screen uses it. Tier D (screen-internal).
4. **Compose, don't recreate.** A new "PromotedListingCard" should wrap `<PropertyCard>`, not duplicate its markup. A new "BillingRow" should compose `<KeyValueRow>` + `<Badge>`, not roll its own grid.
5. **Stay inside tokens** (1.2–1.4). No hex literals, no px-off-the-scale spacing, no new shadows.
6. **Use typed function components with default export**:

   ```tsx
   export interface MyComponentProps { ... }
   export default function MyComponent(props: MyComponentProps) { ... }
   ```

7. **Strict TypeScript.** No `any` unless commented with the reason. Prefer `interface` for object shapes, `type` for unions.
8. **Add to the gallery.** New Tier C components get a section in `/dev/components` (`src/screens/_gallery/Components.tsx`) showing every variant.

---

## 3. Adding a new screen — checklist

1. Add the route to `src/routes.ts` (single source of truth). Pick or create a `RouteGroup`.
2. Create `src/screens/<id>/<PascalName>.tsx`.
3. Lazy-import it in `src/App.tsx` under `SCREEN_COMPONENTS`.
4. Wrap the page in `<Nav role="…" />` (or `<PageShell>` if you want a sidebar slot).
5. Use `<PageHeader>` for the title. Use existing layout primitives (`<TwoColumnSplit>`, `<ThreeColumnLayout>`) for top-level grids.
6. Mock data lives inline at the top of the screen file as `const`s — no API wiring yet (Phase 9 deferred backlog).
7. Smoke test in `/dev/routes` (it'll appear automatically).

---

## 4. Workflow

For any non-trivial change:

```bash
npm run typecheck   # tsc -b --noEmit
npm run lint        # eslint .
npm run build       # tsc -b && vite build
```

All three must pass before commit. The Vite build is the canonical check that nothing's broken — it's faster than running the dev server through every screen.

### 4.1 Commits

- One commit per logical unit. Phase commits use `phase N: <name>`.
- Never include `Co-Authored-By: Claude` — the user has explicitly asked for it to be omitted.
- Don't run `git push` unless explicitly asked.

### 4.2 Dev surfaces

- `/dev` — dev hub with theme switcher
- `/dev/routes` — all routes grouped by section
- `/dev/components` — primitive gallery
- `/` — redirects to `/landing` (the customer flow)

---

## 5. Files that drive everything

| File | What it does |
|---|---|
| `src/routes.ts` | Every screen, every group label. Adding a screen starts here. |
| `src/styles/tokens.css` | CSS variables (colors, fonts, radii, shadows). Don't add new tokens without a real reason. |
| `src/styles/utilities.css` | Utility classes (`.btn`, `.chip`, `.card`, etc.). Don't add new utilities — extend existing ones. |
| `src/components/Icon.tsx` | The icon catalog. New icons go here, not inline. |
| `component-audit.md` | The canonical list of reusable components, tier A/B/C/D. |
| `build-order.md` | Phase log (Phases 1–9 done, Phase 10 backlog). |
| `/dev/components` | The live gallery — easiest place to see what's available. |

---

## 6. Don'ts

- ❌ Inline SVG icons in a screen file.
- ❌ New hex colors, custom box-shadows, or off-scale spacing.
- ❌ New font families or letter-spacings.
- ❌ Rolling a custom `<button>` instead of using `<Button>`.
- ❌ Skipping `<FormField>` to put a bare `<label>` next to an input.
- ❌ Reintroducing "Backroom" brand strings (the property-type noun is fine).
- ❌ Inline `style={{ background: "#E97A1F" }}` — use `var(--accent)`.
- ❌ Renaming primitives mid-build. The audit-catalogued names are the API.
- ❌ Adding a new component without first proving two screens need it.
