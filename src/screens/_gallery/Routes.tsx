import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Logo from "@/components/Logo";
import Input from "@/components/Input";
import Chip from "@/components/Chip";
import EmptyState from "@/components/EmptyState";
import { ROUTES, GROUP_LABEL, type RouteGroup, type ScreenRoute } from "@/routes";

export default function RoutesGallery() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<RouteGroup | "all">("all");

  const groups = useMemo(
    () => Array.from(new Set(ROUTES.map((r) => r.group))) as RouteGroup[],
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ROUTES.filter((r) => {
      if (group !== "all" && r.group !== group) return false;
      if (!q) return true;
      return (
        r.label.toLowerCase().includes(q) ||
        r.path.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
      );
    });
  }, [query, group]);

  const grouped = useMemo(() => {
    return filtered.reduce<Record<RouteGroup, ScreenRoute[]>>(
      (acc, route) => {
        (acc[route.group] ??= []).push(route);
        return acc;
      },
      {} as Record<RouteGroup, ScreenRoute[]>,
    );
  }, [filtered]);

  const orderedGroups = (Object.keys(grouped) as RouteGroup[]);

  return (
    <main style={{ minHeight: "100vh", background: "var(--paper)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 32px 80px" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <Link to="/dev" style={{ display: "inline-flex" }}>
            <Logo size={20} />
          </Link>
          <div>
            <Eyebrow>
              {filtered.length} of {ROUTES.length} screens
            </Eyebrow>
          </div>
        </header>

        <h1 style={{ fontSize: 32, fontWeight: 500, letterSpacing: "-0.02em", margin: "0 0 24px" }}>
          All routes
        </h1>

        {/* Search + group filter */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 280, maxWidth: 480 }}>
            <Input
              leftIcon="search"
              placeholder="Filter by name, path, or id…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <Chip active={group === "all"} onClick={() => setGroup("all")}>
              All
            </Chip>
            {groups.map((g) => (
              <Chip key={g} active={group === g} onClick={() => setGroup(g)}>
                {GROUP_LABEL[g]}
              </Chip>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon="search"
            title="No routes match"
            description="Try a different keyword or clear the group filter."
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {orderedGroups.map((g) => (
              <section key={g}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    marginBottom: 12,
                  }}
                >
                  <Eyebrow>{GROUP_LABEL[g]}</Eyebrow>
                  <span className="tabular" style={{ fontSize: 12, color: "var(--slate)" }}>
                    {grouped[g].length}
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                  {grouped[g].map((route) => (
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
        )}
      </div>
    </main>
  );
}
