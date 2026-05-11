import { Link } from "react-router-dom";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Logo from "@/components/Logo";
import { ROUTES, GROUP_LABEL, type RouteGroup } from "@/routes";

export default function RoutesGallery() {
  const grouped = ROUTES.reduce<Record<RouteGroup, typeof ROUTES>>(
    (acc, route) => {
      (acc[route.group] ??= [] as unknown as typeof ROUTES).push(route);
      return acc;
    },
    {} as Record<RouteGroup, typeof ROUTES>,
  );

  return (
    <main style={{ minHeight: "100vh", background: "var(--paper)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 32px" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <Link to="/dev" style={{ display: "inline-flex" }}>
            <Logo size={20} />
          </Link>
          <div>
            <Eyebrow>{ROUTES.length} screens</Eyebrow>
          </div>
        </header>
        <h1 style={{ fontSize: 32, fontWeight: 500, letterSpacing: "-0.02em", margin: "0 0 32px" }}>
          All routes
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {(Object.keys(grouped) as RouteGroup[]).map((group) => (
            <section key={group}>
              <Eyebrow style={{ marginBottom: 12 }}>{GROUP_LABEL[group]}</Eyebrow>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {grouped[group].map((route) => (
                  <Link key={route.id} to={route.path} style={{ textDecoration: "none" }}>
                    <Card padding={16} interactive>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{route.label}</div>
                      <div className="mono" style={{ fontSize: 11, color: "var(--slate)", marginTop: 4 }}>
                        {route.path}
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
