import { Suspense, lazy, type ComponentType, type LazyExoticComponent } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ROUTES } from "@/routes";
import { useTheme } from "@/hooks/useTheme";
import DevHome from "@/screens/_gallery";
import RoutesGallery from "@/screens/_gallery/Routes";
import ComponentGallery from "@/screens/_gallery/Components";
import Placeholder from "@/screens/_placeholder/Placeholder";
import ToastHost from "@/components/ToastHost";
import CommandPalette from "@/components/CommandPalette";
import RequireAuth from "@/lib/RequireAuth";
import SessionProvider from "@/lib/SessionProvider";
import { PaletteProvider } from "@/lib/palette";

/**
 * Routes that don't require a signed-in session — everything else is wrapped
 * in <RequireAuth>. /landing, the auth funnel, dev surfaces, and a handful of
 * customer-facing pages stay public.
 */
const PUBLIC_ROUTE_IDS = new Set<string>([
  "landing",
  "browse",
  "property",
  "unit",
  "communities",
  "agent-browse",
  "agency-browse",
  "blog",
  "about",
  "careers",
  "case",
  "list-property",
  "help",
  "help-article",
  "tokens",
  "i18n",
  "a11y",
  "cards",
  "register",
  "forgot-password",
  "oauth-callback",
  "user-profile",
  "post-detail",
]);

const PHASE_FOR_GROUP: Record<string, string> = {
  core: "Phase 2",
  landlord: "Phase 3",
  tenant: "Phase 4",
  account: "Phase 5",
  growth: "Phase 6",
  trust: "Phase 7",
  docs: "Phase 8",
  components: "Phase 9",
  lifecycle: "Phase 9",
  money: "Phase 9",
  content: "Phase 9",
  comms: "Phase 9",
  power: "Phase 9",
  system: "Phase 9",
  parity: "Phase 10",
};

/**
 * Screens are added to this manifest as they ship. Anything not in here renders
 * a Placeholder for the appropriate phase.
 */
const SCREEN_COMPONENTS: Partial<Record<string, LazyExoticComponent<ComponentType>>> = {
  landing: lazy(() => import("@/screens/landing/Landing")),
  "landlord-dashboard": lazy(() => import("@/screens/landlord-dashboard/LandlordDashboard")),
  browse: lazy(() => import("@/screens/browse/Browse")),
  property: lazy(() => import("@/screens/property-detail/PropertyDetail")),
  apply: lazy(() => import("@/screens/apply/Apply")),
  "apply-success": lazy(() => import("@/screens/apply/ApplySuccess")),
  "upload-documents": lazy(() => import("@/screens/apply/UploadDocuments")),
  "tenant-portal": lazy(() => import("@/screens/tenant-portal/TenantPortal")),
  wizard: lazy(() => import("@/screens/wizard/Wizard")),
  applicant: lazy(() => import("@/screens/applicant/ApplicantDetail")),
  mandates: lazy(() => import("@/screens/mandates/Mandates")),
  viewings: lazy(() => import("@/screens/viewings/Viewings")),
  map: lazy(() => import("@/screens/map/Map")),
  inbox: lazy(() => import("@/screens/inbox/Inbox")),
  statements: lazy(() => import("@/screens/statements/Statements")),
  analytics: lazy(() => import("@/screens/analytics/Analytics")),
  portfolio: lazy(() => import("@/screens/portfolio/Portfolio")),
  notifications: lazy(() => import("@/screens/notifications/Notifications")),
  "my-apps": lazy(() => import("@/screens/my-apps/MyApplications")),
  lease: lazy(() => import("@/screens/lease/Lease")),
  payment: lazy(() => import("@/screens/payment/Payment")),
  invoices: lazy(() => import("@/screens/invoices/Invoices")),
  "move-in": lazy(() => import("@/screens/move-in/MoveIn")),
  communities: lazy(() => import("@/screens/communities/Communities")),
  saved: lazy(() => import("@/screens/saved/Saved")),
  compare: lazy(() => import("@/screens/compare/Compare")),
  maintenance: lazy(() => import("@/screens/maintenance/Maintenance")),
  deposit: lazy(() => import("@/screens/deposit/Deposit")),
  reviews: lazy(() => import("@/screens/reviews/Reviews")),
  auth: lazy(() => import("@/screens/auth/Auth")),
  profile: lazy(() => import("@/screens/profile/Profile")),
  settings: lazy(() => import("@/screens/settings/Settings")),
  states: lazy(() => import("@/screens/states/States")),
  mobile: lazy(() => import("@/screens/mobile/Mobile")),
  pricing: lazy(() => import("@/screens/pricing/Pricing")),
  referral: lazy(() => import("@/screens/referral/Referral")),
  "landlord-onboarding": lazy(() => import("@/screens/landlord-onboarding/LandlordOnboarding")),
  neighbourhood: lazy(() => import("@/screens/neighbourhood/Neighbourhood")),
  agent: lazy(() => import("@/screens/agent/AgentProfile")),
  verification: lazy(() => import("@/screens/verification/Verification")),
  help: lazy(() => import("@/screens/help/Help")),
  "help-article": lazy(() => import("@/screens/help/HelpArticle")),
  admin: lazy(() => import("@/screens/admin/Admin")),
  "lease-pdf": lazy(() => import("@/screens/lease-pdf/LeasePdf")),
  invoice: lazy(() => import("@/screens/invoice/Invoice")),
  emails: lazy(() => import("@/screens/emails/EmailTemplates")),
  cards: lazy(() => import("@/screens/cards/Cards")),
  renewal: lazy(() => import("@/screens/renewal/Renewal")),
  moveout: lazy(() => import("@/screens/moveout/MoveOut")),
  vacate: lazy(() => import("@/screens/vacate/Vacate")),
  waitlist: lazy(() => import("@/screens/waitlist/Waitlist")),
  "ll-kyc": lazy(() => import("@/screens/ll-kyc/LandlordKyc")),
  failed: lazy(() => import("@/screens/failed/FailedPayment")),
  guarantee: lazy(() => import("@/screens/guarantee/Guarantee")),
  credit: lazy(() => import("@/screens/credit/Credit")),
  blog: lazy(() => import("@/screens/blog/Blog")),
  about: lazy(() => import("@/screens/about/About")),
  careers: lazy(() => import("@/screens/careers/Careers")),
  case: lazy(() => import("@/screens/case/CaseStudy")),
  video: lazy(() => import("@/screens/video/VideoCall")),
  push: lazy(() => import("@/screens/push/PushSms")),
  newsletter: lazy(() => import("@/screens/newsletter/Newsletter")),
  tmobile: lazy(() => import("@/screens/tmobile/TenantMobile")),
  lmobile: lazy(() => import("@/screens/lmobile/LandlordMobile")),
  pwa: lazy(() => import("@/screens/pwa/Pwa")),
  cmdk: lazy(() => import("@/screens/cmdk/CmdK")),
  i18n: lazy(() => import("@/screens/i18n/I18n")),
  tokens: lazy(() => import("@/screens/tokens/Tokens")),
  a11y: lazy(() => import("@/screens/a11y/A11y")),
  "job-board": lazy(() => import("@/screens/job-board/JobBoard")),
  "room-request": lazy(() => import("@/screens/room-request/RoomRequest")),
  "agent-requests": lazy(() => import("@/screens/agent-requests/AgentRequests")),
  "my-agency": lazy(() => import("@/screens/my-agency/MyAgency")),
  "agency-browse": lazy(() => import("@/screens/agency-browse/AgencyBrowse")),
  "mandate-approvals": lazy(() => import("@/screens/mandate-approvals/MandateApprovals")),
  "my-mandates": lazy(() => import("@/screens/my-mandates/MyMandates")),
  "landlord-tenants": lazy(() => import("@/screens/landlord-tenants/LandlordTenants")),
  "viewing-availability": lazy(() => import("@/screens/viewing-availability/ViewingAvailability")),
  "payment-result": lazy(() => import("@/screens/payment-result/PaymentResult")),
  "dashboard-settings": lazy(() => import("@/screens/dashboard-settings/DashboardSettings")),
  "identity-verification": lazy(() => import("@/screens/identity-verification/IdentityVerification")),
  "oauth-callback": lazy(() => import("@/screens/oauth-callback/OauthCallback")),
  "list-property": lazy(() => import("@/screens/list-property/ListProperty")),
  "agent-browse": lazy(() => import("@/screens/agent-browse/AgentBrowse")),
  "book-viewing": lazy(() => import("@/screens/book-viewing/BookViewing")),
  "viewing-confirmed": lazy(() => import("@/screens/viewing-confirmed/ViewingConfirmed")),
  "my-viewings": lazy(() => import("@/screens/my-viewings/MyViewings")),
  unit: lazy(() => import("@/screens/unit/Unit")),
  "landlord-leases": lazy(() => import("@/screens/landlord-leases/LandlordLeases")),
  "agent-overview": lazy(() => import("@/screens/agent-overview/AgentOverview")),
  "landlord-properties": lazy(() => import("@/screens/landlord-properties/LandlordProperties")),
  "listing-submitted": lazy(() => import("@/screens/listing-submitted/ListingSubmitted")),
  "property-chat": lazy(() => import("@/screens/property-chat/PropertyChat")),
  "community-thread": lazy(() => import("@/screens/community-thread/CommunityThread")),
  register: lazy(() => import("@/screens/auth/Auth")),
  "forgot-password": lazy(() => import("@/screens/forgot-password/ForgotPassword")),
  "user-profile": lazy(() => import("@/screens/user-profile/UserProfile")),
  "post-detail": lazy(() => import("@/screens/post-detail/PostDetail")),
  "move-out": lazy(() => import("@/screens/move-out/MoveOut")),
  "deposit-refund": lazy(() => import("@/screens/deposit-refund/DepositRefund")),
};

export default function App() {
  // Bootstrap theme (sets data-theme + --accent on <html> from localStorage).
  useTheme();

  return (
    <SessionProvider>
      <PaletteProvider>
      <Suspense fallback={<div style={{ padding: 40 }}>Loading…</div>}>
        <Routes>
          {/* Root redirects to the customer-facing landing page. The dev hub
              lives under /dev so it stays out of the user's way. */}
          <Route path="/" element={<Navigate to="/landing" replace />} />
          <Route path="/dev" element={<DevHome />} />
          <Route path="/dev/routes" element={<RoutesGallery />} />
          <Route path="/dev/components" element={<ComponentGallery />} />
          {/* Legacy dev URLs — redirect so old bookmarks still work. */}
          <Route path="/_routes" element={<Navigate to="/dev/routes" replace />} />
          <Route path="/_components" element={<Navigate to="/dev/components" replace />} />
          {/* Renamed /agency → /portfolio (Phase 10 cleanup). */}
          <Route path="/agency" element={<Navigate to="/portfolio" replace />} />
          {/* /community-thread merged into /communities WhatsApp-Web layout. */}
          <Route path="/community-thread" element={<Navigate to="/communities" replace />} />
          {ROUTES.map((r) => {
            const Component = SCREEN_COMPONENTS[r.id];
            // The /auth screen itself is public — and `auth` is its route id.
            const isPublic = PUBLIC_ROUTE_IDS.has(r.id) || r.id === "auth";
            const screen = Component ? (
              <Component />
            ) : (
              <Placeholder label={r.label} phase={PHASE_FOR_GROUP[r.group] ?? "a future phase"} />
            );
            return (
              <Route
                key={r.id}
                path={r.path}
                element={isPublic ? screen : <RequireAuth>{screen}</RequireAuth>}
              />
            );
          })}
          <Route path="*" element={<Placeholder label="Not found" phase="Phase 5 (states)" />} />
        </Routes>
      </Suspense>
      <CommandPalette />
      <ToastHost />
      </PaletteProvider>
    </SessionProvider>
  );
}
