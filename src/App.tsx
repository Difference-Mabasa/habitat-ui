import { Suspense, lazy, type ComponentType, type LazyExoticComponent } from "react";
import { Route, Routes } from "react-router-dom";
import { ROUTES } from "@/routes";
import { useTheme } from "@/hooks/useTheme";
import DevHome from "@/screens/_gallery";
import RoutesGallery from "@/screens/_gallery/Routes";
import ComponentGallery from "@/screens/_gallery/Components";
import Placeholder from "@/screens/_placeholder/Placeholder";
import ToastHost from "@/components/ToastHost";

const PHASE_FOR_GROUP: Record<string, string> = {
  core: "Phase 2",
  landlord: "Phase 3",
  tenant: "Phase 4",
  account: "Phase 5",
  growth: "Phase 6",
  trust: "Phase 7",
  docs: "Phase 8",
  components: "Phase 9",
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
  "tenant-portal": lazy(() => import("@/screens/tenant-portal/TenantPortal")),
  wizard: lazy(() => import("@/screens/wizard/Wizard")),
  applicant: lazy(() => import("@/screens/applicant/ApplicantDetail")),
  mandates: lazy(() => import("@/screens/mandates/Mandates")),
  viewings: lazy(() => import("@/screens/viewings/Viewings")),
  map: lazy(() => import("@/screens/map/Map")),
  inbox: lazy(() => import("@/screens/inbox/Inbox")),
  statements: lazy(() => import("@/screens/statements/Statements")),
  analytics: lazy(() => import("@/screens/analytics/Analytics")),
  agency: lazy(() => import("@/screens/agency/Agency")),
  notifications: lazy(() => import("@/screens/notifications/Notifications")),
  "my-apps": lazy(() => import("@/screens/my-apps/MyApplications")),
  lease: lazy(() => import("@/screens/lease/Lease")),
  payment: lazy(() => import("@/screens/payment/Payment")),
  communities: lazy(() => import("@/screens/communities/Communities")),
  saved: lazy(() => import("@/screens/saved/Saved")),
  compare: lazy(() => import("@/screens/compare/Compare")),
  maintenance: lazy(() => import("@/screens/maintenance/Maintenance")),
  deposit: lazy(() => import("@/screens/deposit/Deposit")),
  reviews: lazy(() => import("@/screens/reviews/Reviews")),
  onboarding: lazy(() => import("@/screens/onboarding/Onboarding")),
};

export default function App() {
  // Bootstrap theme (sets data-theme + --accent on <html> from localStorage).
  useTheme();

  return (
    <>
      <Suspense fallback={<div style={{ padding: 40 }}>Loading…</div>}>
        <Routes>
          <Route path="/" element={<DevHome />} />
          <Route path="/_routes" element={<RoutesGallery />} />
          <Route path="/_components" element={<ComponentGallery />} />
          {ROUTES.map((r) => {
            const Component = SCREEN_COMPONENTS[r.id];
            return (
              <Route
                key={r.id}
                path={r.path}
                element={
                  Component ? (
                    <Component />
                  ) : (
                    <Placeholder label={r.label} phase={PHASE_FOR_GROUP[r.group] ?? "a future phase"} />
                  )
                }
              />
            );
          })}
          <Route path="*" element={<Placeholder label="Not found" phase="Phase 5 (states)" />} />
        </Routes>
      </Suspense>
      <ToastHost />
    </>
  );
}
