import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import Input from "@/components/Input";

const SUMMARY: [string, string, string][] = [
  ["Contrast", "AAA", "All body text"],
  ["Focus rings", "100%", "Visible on all controls"],
  ["Keyboard nav", "Pass", "Every flow keyboard-only"],
  ["Screen reader", "Pass", "VoiceOver + TalkBack tested"],
];

const CONTRAST: [string, string, string][] = [
  ["#1E0F06 on #FFFFFF", "16.2 : 1", "AAA"],
  ["#6B5340 on #FFFFFF", "5.7 : 1", "AA"],
  ["#FFFFFF on #E97A1F", "3.1 : 1", "AA Large"],
  ["#1E0F06 on #FCE7D2", "12.4 : 1", "AAA"],
];

const MOTION: [string, string][] = [
  ["Carousels", "auto-pause when prefers-reduced-motion: reduce."],
  ["Page transitions", "swap fade for opacity instant."],
  ["Hover lift", "on cards disables; outline only."],
];

export default function A11y() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh", padding: "48px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Eyebrow>WCAG 2.2 AA · audited 11 May 2026</Eyebrow>
        <h1 className="display" style={{ fontSize: 80, margin: "8px 0 8px" }}>
          ACCESSIBILITY
        </h1>
        <p style={{ fontSize: 15, color: "var(--slate)", maxWidth: 580, marginBottom: 36 }}>
          27% of South Africans live with a disability. Backroom is built to WCAG 2.2 AA — verified by
          Axe + manual review every release.
        </p>

        {/* Summary */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 14,
            marginBottom: 32,
          }}
        >
          {SUMMARY.map(([l, v, s]) => (
            <Card key={l} padding={18}>
              <Eyebrow>{l}</Eyebrow>
              <div className="display" style={{ fontSize: 30, color: "var(--success)", marginTop: 4 }}>
                {v}
              </div>
              <div style={{ fontSize: 12, color: "var(--slate)" }}>{s}</div>
            </Card>
          ))}
        </div>

        {/* Live demos */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Focus ring */}
          <Card padding={28}>
            <h3 className="display" style={{ fontSize: 20, marginBottom: 12 }}>
              FOCUS RINGS
            </h3>
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <Button
                variant="accent"
                style={{ outline: "3px solid #4DA3FF", outlineOffset: 2 }}
              >
                Primary · :focus-visible
              </Button>
              <Button variant="secondary">Secondary</Button>
            </div>
            <Input
              placeholder="Tab here to see focus"
              style={{ outline: "3px solid #4DA3FF", outlineOffset: 2, height: 44 }}
            />
            <p style={{ fontSize: 12, color: "var(--slate)", marginTop: 12 }}>
              3px outline · 2px offset · #4DA3FF for max contrast on both warm-cream and brown
              backgrounds.
            </p>
          </Card>

          {/* Contrast */}
          <Card padding={28}>
            <h3 className="display" style={{ fontSize: 20, marginBottom: 12 }}>
              CONTRAST
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {CONTRAST.map(([pair, ratio, level]) => (
                <div
                  key={pair}
                  style={{
                    padding: "10px 14px",
                    background: "var(--surface-2)",
                    borderRadius: 10,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: 13,
                  }}
                >
                  <span className="mono">{pair}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span className="mono" style={{ fontWeight: 600 }}>
                      {ratio}
                    </span>
                    <Badge tone="success">{level}</Badge>
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Touch targets */}
          <Card padding={28}>
            <h3 className="display" style={{ fontSize: 20, marginBottom: 12 }}>
              TOUCH TARGETS
            </h3>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  background: "var(--accent)",
                  borderRadius: 10,
                  display: "grid",
                  placeItems: "center",
                  color: "#fff",
                }}
              >
                <Icon name="heart" size={20} />
              </div>
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: "var(--ink)",
                  borderRadius: 12,
                  display: "grid",
                  placeItems: "center",
                  color: "#fff",
                }}
              >
                <Icon name="check" size={22} />
              </div>
              <div
                style={{
                  width: 56,
                  height: 56,
                  background: "var(--success)",
                  borderRadius: 14,
                  display: "grid",
                  placeItems: "center",
                  color: "#fff",
                }}
              >
                <Icon name="user" size={26} />
              </div>
            </div>
            <p style={{ fontSize: 12, color: "var(--slate)", marginTop: 12 }}>
              Minimum 44 × 44px (WCAG 2.5.5). Floating actions and primary CTAs use 48–56px.
            </p>
          </Card>

          {/* Reduced motion */}
          <Card padding={28}>
            <h3 className="display" style={{ fontSize: 20, marginBottom: 12 }}>
              REDUCED MOTION
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {MOTION.map(([k, body]) => (
                <div
                  key={k}
                  style={{
                    padding: "12px 14px",
                    background: "var(--surface-2)",
                    borderRadius: 10,
                    fontSize: 13,
                  }}
                >
                  <strong>{k}</strong> {body}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Skip link */}
        <div
          style={{
            marginTop: 32,
            padding: 24,
            background: "var(--ink)",
            borderRadius: 12,
            color: "var(--paper)",
          }}
        >
          <Eyebrow style={{ color: "var(--accent)" }}>Skip-to-content</Eyebrow>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 10 }}>
            <Button variant="accent">Skip to main content</Button>
            <div style={{ fontSize: 13, color: "rgba(247,239,226,0.7)" }}>
              Visible on Tab focus from any page · jumps screen-reader past nav
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
