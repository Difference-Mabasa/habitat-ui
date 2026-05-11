/**
 * Single source of truth for every screen route in the app.
 * Drives <Routes> in App.tsx and the dev gallery index.
 *
 * Add a route here; everything else updates.
 */

export type RouteGroup =
  | "core"
  | "landlord"
  | "tenant"
  | "account"
  | "growth"
  | "trust"
  | "docs"
  | "components"
  | "lifecycle"
  | "money"
  | "content"
  | "comms"
  | "power"
  | "system";

export interface ScreenRoute {
  id: string;
  /** Display label used in galleries (numbered like the prototype artboards). */
  label: string;
  path: string;
  group: RouteGroup;
}

export const ROUTES: ScreenRoute[] = [
  // Core flows
  { id: "landing", label: "01 — Landing", path: "/landing", group: "core" },
  { id: "landlord-dashboard", label: "02 — Landlord dashboard", path: "/landlord-dashboard", group: "core" },
  { id: "browse", label: "03 — Browse + map", path: "/browse", group: "core" },
  { id: "property", label: "04 — Property detail", path: "/property", group: "core" },
  { id: "apply", label: "05 — Apply flow", path: "/apply", group: "core" },
  { id: "tenant-portal", label: "06 — Tenant portal", path: "/tenant-portal", group: "core" },

  // Landlord surfaces
  { id: "wizard", label: "07 — List a property wizard", path: "/wizard", group: "landlord" },
  { id: "applicant", label: "08 — Applicant detail", path: "/applicant", group: "landlord" },
  { id: "mandates", label: "09 — Mandates & agents", path: "/mandates", group: "landlord" },
  { id: "viewings", label: "10 — Viewings calendar", path: "/viewings", group: "landlord" },
  { id: "map", label: "21 — Full map view", path: "/map", group: "landlord" },
  { id: "inbox", label: "22 — Inbox / messaging", path: "/inbox", group: "landlord" },
  { id: "statements", label: "23 — Statements & payouts", path: "/statements", group: "landlord" },
  { id: "analytics", label: "24 — Property analytics", path: "/analytics", group: "landlord" },
  { id: "agency", label: "25 — Agency portfolio", path: "/agency", group: "landlord" },
  { id: "notifications", label: "26 — Notifications", path: "/notifications", group: "landlord" },

  // Tenant surfaces
  { id: "my-apps", label: "11 — My applications", path: "/my-apps", group: "tenant" },
  { id: "lease", label: "12 — Lease review & sign", path: "/lease", group: "tenant" },
  { id: "payment", label: "13 — Payment receipt", path: "/payment", group: "tenant" },
  { id: "communities", label: "14 — Communities", path: "/communities", group: "tenant" },
  { id: "saved", label: "15 — Saved searches", path: "/saved", group: "tenant" },
  { id: "compare", label: "16 — Compare drawer", path: "/compare", group: "tenant" },
  { id: "maintenance", label: "17 — Report maintenance", path: "/maintenance", group: "tenant" },
  { id: "deposit", label: "18 — Deposit return", path: "/deposit", group: "tenant" },
  { id: "reviews", label: "19 — Reviews", path: "/reviews", group: "tenant" },
  { id: "onboarding", label: "20 — Tenant onboarding", path: "/onboarding", group: "tenant" },

  // Account, system, mobile
  { id: "auth", label: "27 — Sign in", path: "/auth", group: "account" },
  { id: "profile", label: "28 — Profile & verification", path: "/profile", group: "account" },
  { id: "settings", label: "29 — Settings & billing", path: "/settings", group: "account" },
  { id: "states", label: "30 — Empty / loading / error states", path: "/states", group: "account" },
  { id: "mobile", label: "31 — Mobile (Browse · Property · Rental)", path: "/mobile", group: "account" },

  // Growth & discovery
  { id: "pricing", label: "32 — Landlord pricing & plans", path: "/pricing", group: "growth" },
  { id: "referral", label: "33 — Refer & earn", path: "/referral", group: "growth" },
  { id: "landlord-onboarding", label: "34 — Landlord onboarding", path: "/landlord-onboarding", group: "growth" },
  { id: "neighbourhood", label: "35 — Neighbourhood", path: "/neighbourhood", group: "growth" },
  { id: "agent", label: "36 — Agent public profile", path: "/agent", group: "growth" },

  // Trust, safety & support
  { id: "verification", label: "37 — FICA / POPIA verification", path: "/verification", group: "trust" },
  { id: "help", label: "38 — Help & support", path: "/help", group: "trust" },
  { id: "admin", label: "39 — Admin / moderation", path: "/admin", group: "trust" },

  // Documents
  { id: "lease-pdf", label: "40 — Lease PDF (A4 print)", path: "/lease-pdf", group: "docs" },
  { id: "invoice", label: "41 — Tax invoice (A4 print)", path: "/invoice", group: "docs" },
  { id: "emails", label: "42 — Email templates", path: "/emails", group: "docs" },

  // Component gallery
  { id: "cards", label: "43 — Property card variations", path: "/cards", group: "components" },

  // Lease lifecycle
  { id: "renewal", label: "44 — Lease renewal", path: "/renewal", group: "lifecycle" },
  { id: "moveout", label: "45 — Move-out inspection", path: "/moveout", group: "lifecycle" },
  { id: "vacate", label: "46 — Vacate notice", path: "/vacate", group: "lifecycle" },
  { id: "waitlist", label: "47 — Waitlist", path: "/waitlist", group: "lifecycle" },

  // Trust & money
  { id: "ll-kyc", label: "48 — Landlord KYC", path: "/ll-kyc", group: "money" },
  { id: "failed", label: "49 — Failed payment / retry", path: "/failed", group: "money" },
  { id: "guarantee", label: "50 — Rent-guarantee insurance", path: "/guarantee", group: "money" },
  { id: "credit", label: "51 — Credit report / TPN", path: "/credit", group: "money" },

  // Content & brand
  { id: "blog", label: "52 — Blog / guide hub", path: "/blog", group: "content" },
  { id: "about", label: "53 — About / press", path: "/about", group: "content" },
  { id: "careers", label: "54 — Careers", path: "/careers", group: "content" },
  { id: "case", label: "55 — Landlord case study", path: "/case", group: "content" },

  // Communication
  { id: "video", label: "56 — Live viewing (video call)", path: "/video", group: "comms" },
  { id: "push", label: "57 — Push / SMS templates", path: "/push", group: "comms" },
  { id: "newsletter", label: "58 — Newsletter digest", path: "/newsletter", group: "comms" },

  // Mobile & power users
  { id: "tmobile", label: "59 — Tenant mobile dashboard", path: "/tmobile", group: "power" },
  { id: "lmobile", label: "60 — Landlord mobile ops", path: "/lmobile", group: "power" },
  { id: "pwa", label: "61 — PWA install + offline", path: "/pwa", group: "power" },
  { id: "cmdk", label: "62 — Command palette ⌘K", path: "/cmdk", group: "power" },

  // System & inclusion
  { id: "i18n", label: "63 — Localisation (Zulu/Sesotho)", path: "/i18n", group: "system" },
  { id: "tokens", label: "64 — Design tokens spec", path: "/tokens", group: "system" },
  { id: "a11y", label: "65 — Accessibility audit", path: "/a11y", group: "system" },
];

export const GROUP_LABEL: Record<RouteGroup, string> = {
  core: "Core flows",
  landlord: "Landlord surfaces",
  tenant: "Tenant surfaces",
  account: "Account, system & mobile",
  growth: "Growth & discovery",
  trust: "Trust, safety & support",
  docs: "Documents & notifications",
  components: "Component gallery",
  lifecycle: "Lease lifecycle",
  money: "Trust & money",
  content: "Content & brand",
  comms: "Communication",
  power: "Mobile & power users",
  system: "System & inclusion",
};
