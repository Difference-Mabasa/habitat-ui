import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Badge from "@/components/Badge";
import Icon, { type IconName } from "@/components/Icon";
import { ROUTES, GROUP_LABEL, type RouteGroup } from "@/routes";
import { useTheme, ACCENT_OPTIONS } from "@/hooks/useTheme";
import { DEMO_CREDENTIALS, useSession, type Role } from "@/lib/session";

interface ShortcutTile {
  icon: IconName;
  label: string;
  to: string;
  desc: string;
}

const ROLE_SHORTCUTS: ShortcutTile[] = [
  { icon: "home",    label: "Tenant",   to: "/tenant-portal",      desc: "My Rental · apps · viewings · saved" },
  { icon: "key",     label: "Landlord", to: "/landlord-dashboard", desc: "Properties · applicants · payouts" },
  { icon: "users",   label: "Agent",    to: "/agent-overview",     desc: "Portfolio · marketplace · mandates" },
  { icon: "shield",  label: "Admin",    to: "/admin",              desc: "Moderation · trust & safety" },
];

const ENTRY_POINTS: ShortcutTile[] = [
  { icon: "search",  label: "Landing",     to: "/landing",     desc: "Customer landing + property search" },
  { icon: "grid",    label: "Browse",      to: "/browse",      desc: "Tenant browse · map + list + filters" },
  { icon: "chat",    label: "Communities", to: "/communities", desc: "Feed · People · Discover · Articles" },
  { icon: "bell",    label: "Inbox",       to: "/inbox",       desc: "DMs + community chats" },
];

const DEV_SURFACES: ShortcutTile[] = [
  { icon: "list",    label: "Routes",     to: "/dev/routes",     desc: "Every screen, grouped" },
  { icon: "grid",    label: "Components", to: "/dev/components", desc: "Primitives · every variant" },
  { icon: "sliders", label: "Tokens",     to: "/tokens",         desc: "Colors · type · spacing" },
  { icon: "bolt",    label: "⌘K",         to: "/cmdk",           desc: "Command palette" },
];

const DATA_STATE_PREVIEWS: { label: string; href: string; desc: string }[] = [
  { label: "Feed · loading",          href: "/communities?state=loading",   desc: "Skeleton card stack" },
  { label: "Feed · error",            href: "/communities?state=error",     desc: "Retry CTA" },
  { label: "Browse · loading",        href: "/browse?state=loading",        desc: "6-row skeleton" },
  { label: "Browse · error",          href: "/browse?state=error",          desc: "Retry CTA" },
  { label: "Notifications · loading", href: "/notifications?state=loading", desc: "List skeleton" },
  { label: "Notifications · error",   href: "/notifications?state=error",   desc: "Retry CTA" },
  { label: "Statements · loading",    href: "/statements?state=loading",    desc: "Chart + table" },
  { label: "Statements · error",      href: "/statements?state=error",      desc: "Retry CTA" },
];

// Recently added screens — sorted by the leading "NN — " number in their label, desc.
const RECENT = [...ROUTES]
  .filter((r) => /^\d+/.test(r.label))
  .sort((a, b) => parseInt(b.label, 10) - parseInt(a.label, 10))
  .slice(0, 6);

const GROUPS = Array.from(new Set(ROUTES.map((r) => r.group))) as RouteGroup[];

export default function DevHome() {
  const { theme, toggleTheme, accent, setAccent } = useTheme();
  const session = useSession();
  return (
    <main style={{ minHeight: "100vh", background: "var(--paper)" }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "48px 32px 80px",
          display: "flex",
          flexDirection: "column",
          gap: 32,
        }}
      >
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Logo size={26} />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="eyebrow">Accent</span>
            {ACCENT_OPTIONS.map((c) => (
              <button
                key={c}
                aria-label={`Accent ${c}`}
                onClick={() => setAccent(c)}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: c,
                  border: `2px solid ${accent === c ? "var(--ink)" : "transparent"}`,
                  cursor: "pointer",
                }}
              />
            ))}
            <button
              type="button"
              className="btn btn--icon btn--ghost btn--sm"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              <Icon name={theme === "light" ? "moon" : "sun"} size={14} />
            </button>
          </div>
        </header>

        <div>
          <Eyebrow>Dev surfaces</Eyebrow>
          <h1
            style={{
              fontSize: 56,
              fontWeight: 400,
              letterSpacing: "0.005em",
              fontFamily: "var(--font-display)",
              margin: "8px 0 0",
              lineHeight: 0.95,
              textTransform: "uppercase",
            }}
          >
            HABI<span style={{ color: "var(--accent)" }}>TAT</span> UI
          </h1>
          <p style={{ fontSize: 15, color: "var(--slate)", marginTop: 12, maxWidth: 620 }}>
            Pixel-perfect React rebuild of the Habitat Web handoff —{" "}
            <strong style={{ color: "var(--ink)" }}>{ROUTES.length}</strong> screens shipped across{" "}
            <strong style={{ color: "var(--ink)" }}>{GROUPS.length}</strong> sections. Talks to
            backroom-api on :8080.
          </p>
        </div>

        {/* Section: role journeys */}
        <Section eyebrow="Jump into a role" title="Role dashboards">
          {ROLE_SHORTCUTS.map((s) => (
            <ShortcutCard key={s.label} {...s} />
          ))}
        </Section>

        {/* Section: customer entry points */}
        <Section eyebrow="Customer surfaces" title="Entry points">
          {ENTRY_POINTS.map((s) => (
            <ShortcutCard key={s.label} {...s} />
          ))}
        </Section>

        {/* Section: dev surfaces */}
        <Section eyebrow="Build & design" title="Dev surfaces">
          {DEV_SURFACES.map((s) => (
            <ShortcutCard key={s.label} {...s} />
          ))}
        </Section>

        {/* Section: recently added */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <Eyebrow>Recently added</Eyebrow>
            <Link to="/dev/routes" style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600 }}>
              All routes →
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {RECENT.map((r) => (
              <Link key={r.id} to={r.path} style={{ textDecoration: "none" }}>
                <Card padding={14} interactive>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <Badge tone="accent">{GROUP_LABEL[r.group]}</Badge>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{r.label}</div>
                  <div className="mono" style={{ fontSize: 11, color: "var(--slate)", marginTop: 2 }}>
                    {r.path}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <Card padding={20}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 12 }}>
            <div>
              <Eyebrow>Dev sign-in · preview as a role</Eyebrow>
              <div style={{ fontSize: 13, color: "var(--slate)", marginTop: 4 }}>
                {session.user ? (
                  <>
                    Signed in as <strong style={{ color: "var(--ink)" }}>{session.user.name}</strong> ·{" "}
                    {session.user.activeRole}
                  </>
                ) : (
                  "Not signed in — protected routes will redirect to /auth."
                )}
              </div>
            </div>
            {session.user ? (
              <button
                type="button"
                className="btn btn--secondary btn--sm"
                onClick={() => void session.logout()}
              >
                Sign out
              </button>
            ) : null}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {(Object.keys(DEMO_CREDENTIALS) as Role[]).map((r) => {
              const active = session.user?.activeRole === r;
              const creds = DEMO_CREDENTIALS[r];
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => void session.login({ email: creds.email, password: creds.password })}
                  style={{
                    padding: "10px 12px",
                    background: active ? "var(--accent)" : "var(--surface-2)",
                    color: active ? "var(--paper)" : "var(--ink)",
                    border: `1px solid ${active ? "var(--accent)" : "var(--hairline)"}`,
                    borderRadius: 8,
                    fontFamily: "inherit",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div style={{ textTransform: "capitalize" }}>{r}</div>
                  <div
                    style={{
                      fontSize: 11,
                      color: active ? "color-mix(in oklch, var(--paper) 80%, transparent)" : "var(--slate)",
                      marginTop: 2,
                    }}
                  >
                    {creds.displayName}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <Card padding={20}>
          <Eyebrow style={{ marginBottom: 4 }}>Preview data states</Eyebrow>
          <div style={{ fontSize: 13, color: "var(--slate)", marginBottom: 12 }}>
            Append <span className="mono">?state=loading</span> or <span className="mono">?state=error</span>{" "}
            to any of the data-heavy screens to see the loading/error fallback in place.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {DATA_STATE_PREVIEWS.map((p) => (
              <Link key={p.label} to={p.href} style={{ textDecoration: "none" }}>
                <Card padding={12} interactive style={{ height: "100%" }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{p.label}</div>
                  <div style={{ fontSize: 11, color: "var(--slate)", marginTop: 2 }}>{p.desc}</div>
                </Card>
              </Link>
            ))}
          </div>
        </Card>

        <Card padding={24}>
          <Eyebrow>Why this exists</Eyebrow>
          <p style={{ fontSize: 14, lineHeight: 1.7, margin: "8px 0 0", color: "var(--ink)" }}>
            Habitat UI ships in phases. <code className="mono">build-order.md</code> tracks what's
            done; <code className="mono">component-audit.md</code> is the single source of truth for
            what's reusable. If a pattern in a screen looks like an existing component, it should{" "}
            <em>be</em> the existing component.
          </p>
        </Card>
      </div>
    </main>
  );
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div style={{ marginBottom: 12 }}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.005em", marginTop: 4 }}>
          {title}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>{children}</div>
    </section>
  );
}

function ShortcutCard({ icon, label, to, desc }: ShortcutTile) {
  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <Card padding={18} interactive style={{ height: "100%" }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: "var(--accent-soft)",
            color: "var(--accent)",
            display: "grid",
            placeItems: "center",
            marginBottom: 12,
          }}
        >
          <Icon name={icon} size={16} />
        </div>
        <div style={{ fontSize: 15, fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 12, color: "var(--slate)", lineHeight: 1.5, marginTop: 4 }}>
          {desc}
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 11,
            color: "var(--accent)",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          Open <Icon name="arrR" size={11} />
        </div>
      </Card>
    </Link>
  );
}
