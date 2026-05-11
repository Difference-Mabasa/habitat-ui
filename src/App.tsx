import { Suspense } from "react";
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
          {ROUTES.map((r) => (
            <Route
              key={r.id}
              path={r.path}
              element={
                <Placeholder label={r.label} phase={PHASE_FOR_GROUP[r.group] ?? "a future phase"} />
              }
            />
          ))}
          <Route path="*" element={<Placeholder label="Not found" phase="Phase 5 (states)" />} />
        </Routes>
      </Suspense>
      <ToastHost />
    </>
  );
}
