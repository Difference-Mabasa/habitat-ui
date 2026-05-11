import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";

interface SwatchProps {
  name: string;
  value: string;
}

function Swatch({ name, value }: SwatchProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div
        style={{
          height: 64,
          borderRadius: 10,
          background: value,
          border: "1px solid var(--hairline)",
        }}
      />
      <div style={{ fontSize: 12, fontWeight: 600 }}>{name}</div>
      <div className="mono" style={{ fontSize: 11, color: "var(--slate)" }}>
        {value}
      </div>
    </div>
  );
}

const BRAND: SwatchProps[] = [
  { name: "accent", value: "#E97A1F" },
  { name: "accent-d", value: "#C56112" },
  { name: "accent-soft", value: "#FCE7D2" },
  { name: "ink", value: "#1E0F06" },
  { name: "ink-2", value: "#321B0C" },
  { name: "paper", value: "#FFFFFF" },
];

const SURFACE: SwatchProps[] = [
  { name: "surface", value: "#FFFFFF" },
  { name: "surface-2", value: "#F5F5F4" },
  { name: "surface-3", value: "#EAEAE8" },
  { name: "hairline", value: "#E5E5E2" },
  { name: "hairline-strong", value: "#D0D0CC" },
  { name: "slate", value: "#6B5340" },
];

const STATUS: SwatchProps[] = [
  { name: "success", value: "#2F7A50" },
  { name: "success-soft", value: "#DBEEDD" },
  { name: "warn", value: "#C56112" },
  { name: "warn-soft", value: "#FCE7D2" },
  { name: "danger", value: "#C9442D" },
  { name: "danger-soft", value: "#F3D5CC" },
];

const SHADOWS: [string, string][] = [
  ["shadow-sm", "0 1px 2px rgba(0,0,0,0.04)"],
  ["shadow-md", "0 4px 12px rgba(0,0,0,0.06)"],
  ["shadow-lg", "0 14px 36px rgba(0,0,0,0.08)"],
];

export default function Tokens() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh", padding: "48px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Eyebrow>Design tokens · Backroom v3</Eyebrow>
        <h1 className="display" style={{ fontSize: 80, margin: "8px 0 36px" }}>
          DESIGN TOKENS
        </h1>

        {/* Colors */}
        <section style={{ marginBottom: 48 }}>
          <h2 className="display" style={{ fontSize: 28, marginBottom: 6 }}>
            COLOR
          </h2>
          <p style={{ fontSize: 13, color: "var(--slate)", marginBottom: 18 }}>
            Warm neutrals on a near-white paper. Orange accent appears only on primary CTAs and key
            brand moments.
          </p>

          <Eyebrow>Brand</Eyebrow>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 16,
              marginTop: 10,
              marginBottom: 24,
            }}
          >
            {BRAND.map((s) => (
              <Swatch key={s.name} {...s} />
            ))}
          </div>

          <Eyebrow>Surface & line</Eyebrow>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 16,
              marginTop: 10,
              marginBottom: 24,
            }}
          >
            {SURFACE.map((s) => (
              <Swatch key={s.name} {...s} />
            ))}
          </div>

          <Eyebrow>Status</Eyebrow>
          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16, marginTop: 10 }}
          >
            {STATUS.map((s) => (
              <Swatch key={s.name} {...s} />
            ))}
          </div>
        </section>

        {/* Type */}
        <section style={{ marginBottom: 48 }}>
          <h2 className="display" style={{ fontSize: 28, marginBottom: 18 }}>
            TYPE
          </h2>
          <Card padding={32}>
            <div className="display" style={{ fontSize: 88, lineHeight: 0.92 }}>
              DISPLAY · ANTON
            </div>
            <div className="mono" style={{ fontSize: 12, color: "var(--slate)", marginTop: 6 }}>
              --font-display · Anton · uppercase · letter-spacing -0.005em · line-height 0.92
            </div>

            <div style={{ marginTop: 32, fontSize: 32, fontWeight: 600 }}>
              Headings · Inter Semibold
            </div>
            <div style={{ fontSize: 16, marginTop: 16, lineHeight: 1.5 }}>
              Body · Inter Regular. The quick brown fox jumps over the lazy dog and 9,876,543,210 spots
              are listed.
            </div>
            <Eyebrow style={{ marginTop: 16 }}>EYEBROW · UPPERCASE TRACKED</Eyebrow>
            <div className="mono" style={{ marginTop: 12 }}>
              Mono · JetBrains · R 3,450.00 · 23 Vilakazi St
            </div>
          </Card>
        </section>

        {/* Spacing & radius */}
        <section style={{ marginBottom: 48 }}>
          <h2 className="display" style={{ fontSize: 28, marginBottom: 18 }}>
            SPACING & RADIUS
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card padding={24}>
              <Eyebrow style={{ marginBottom: 14 }}>Space scale · 4px base</Eyebrow>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80 }}>
                {[4, 8, 12, 16, 24, 32, 48, 64].map((v) => (
                  <div key={v} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 28, height: v, background: "var(--accent)", borderRadius: 4 }} />
                    <div className="mono" style={{ fontSize: 11, color: "var(--slate)" }}>
                      {v}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card padding={24}>
              <Eyebrow style={{ marginBottom: 14 }}>Radii</Eyebrow>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
                {[4, 6, 10, 14, 22, 999].map((r) => (
                  <div key={r} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        background: "var(--ink)",
                        borderRadius: r,
                      }}
                    />
                    <div className="mono" style={{ fontSize: 11, color: "var(--slate)" }}>
                      {r === 999 ? "pill" : r}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* Shadows */}
        <section>
          <h2 className="display" style={{ fontSize: 28, marginBottom: 18 }}>
            SHADOWS
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {SHADOWS.map(([n, v]) => (
              <div
                key={n}
                style={{
                  padding: 28,
                  background: "#fff",
                  borderRadius: 14,
                  boxShadow: v,
                }}
              >
                <div style={{ fontWeight: 600 }}>{n}</div>
                <div className="mono" style={{ fontSize: 11, color: "var(--slate)", marginTop: 4 }}>
                  {v}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
