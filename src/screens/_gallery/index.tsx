import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Icon from "@/components/Icon";
import { ROUTES } from "@/routes";
import { useTheme, ACCENT_OPTIONS } from "@/hooks/useTheme";

export default function DevHome() {
  const { theme, toggleTheme, accent, setAccent } = useTheme();
  return (
    <main style={{ minHeight: "100vh", background: "var(--paper)" }}>
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "64px 32px",
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
            BACKROOM <span style={{ color: "var(--accent)" }}>UI</span>
          </h1>
          <p style={{ fontSize: 15, color: "var(--slate)", marginTop: 12, maxWidth: 560 }}>
            Pixel-perfect React rebuild of the Backroom Web handoff — {ROUTES.length} screens shipped
            across 14 sections. Talks to backroom-api on :8080.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          <DevCard
            to="/dev/routes"
            eyebrow={`${ROUTES.length} screens`}
            title="Routes"
            body="Every prototype artboard from the handoff, live. Click any to view."
          />
          <DevCard
            to="/dev/components"
            eyebrow="Phase 1 primitives"
            title="Component gallery"
            body="Live preview of every Tier A and Tier B primitive in every variant. The storybook substitute."
          />
        </div>

        <Card padding={24}>
          <Eyebrow>Why this exists</Eyebrow>
          <p style={{ fontSize: 14, lineHeight: 1.7, margin: "8px 0 0", color: "var(--ink)" }}>
            Backroom UI ships in phases. <code className="mono">build-order.md</code> tracks what's
            done; <code className="mono">component-audit.md</code> is the single source of truth for
            what's reusable. If a pattern in a screen looks like an existing component, it should
            <em> be</em> the existing component.
          </p>
        </Card>
      </div>
    </main>
  );
}

function DevCard({
  to,
  eyebrow,
  title,
  body,
}: {
  to: string;
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <Card padding={24} interactive style={{ height: "100%" }}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <div style={{ fontSize: 24, fontWeight: 600, margin: "8px 0 4px" }}>{title}</div>
        <div style={{ fontSize: 13, color: "var(--slate)", lineHeight: 1.6 }}>{body}</div>
        <div style={{ marginTop: 16, fontSize: 12, color: "var(--accent)", display: "inline-flex", alignItems: "center", gap: 4 }}>
          Open <Icon name="arrR" size={12} />
        </div>
      </Card>
    </Link>
  );
}
