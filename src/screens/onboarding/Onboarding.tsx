import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import Icon, { type IconName } from "@/components/Icon";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import Avatar from "@/components/Avatar";
import Stepper from "@/components/Stepper";
import ProgressBar from "@/components/ProgressBar";

const STEPS = [
  { label: "Welcome" },
  { label: "Identity" },
  { label: "Affordability" },
  { label: "Preferences" },
  { label: "Done" },
];

interface Option {
  icon: IconName;
  title: string;
  body: string;
  recommended?: boolean;
}

const OPTIONS: Option[] = [
  {
    icon: "bolt",
    title: "Connect your bank · 30 seconds",
    body: "Read-only via Stitch. We compute affordability in real time and never store statements.",
    recommended: true,
  },
  {
    icon: "upload",
    title: "Upload 3 months of payslips",
    body: "PDF or image. We extract income via OCR. Takes 2 minutes.",
  },
  {
    icon: "doc",
    title: "Upload 3 months of bank statements",
    body: "PDF or stamped statements. Verified within an hour.",
  },
  {
    icon: "user",
    title: "Add an employer reference",
    body: "We email your HR contact. Slowest option (3–5 days).",
  },
];

interface ScorePanelRow {
  label: string;
  value: number;
  hint?: string;
}

const SCORE_ROWS: ScorePanelRow[] = [
  { label: "Identity (FICA)", value: 100 },
  { label: "Affordability", value: 92, hint: "← unlocked just now" },
  { label: "Credit", value: 78 },
  { label: "Rental history", value: 70 },
];

export default function Onboarding() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header
        style={{
          padding: "20px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--hairline)",
        }}
      >
        <Logo size={20} />
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ minWidth: 280 }}>
            <Stepper orientation="horizontal" steps={STEPS} currentStep={2} />
          </div>
          <span style={{ fontSize: 13, color: "var(--slate)" }}>Step 3 of 5 · Affordability</span>
        </div>
        <Link to="/browse" style={{ textDecoration: "none" }}>
          <Button variant="ghost" size="sm">
            Skip for now
          </Button>
        </Link>
      </header>

      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          maxWidth: 1280,
          margin: "0 auto",
          width: "100%",
          padding: "48px 32px",
          gap: 64,
        }}
      >
        {/* Left — copy & options */}
        <div>
          <Eyebrow style={{ marginBottom: 12 }}>Affordability proof</Eyebrow>
          <h1
            style={{
              fontSize: 36,
              fontWeight: 500,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              margin: "0 0 16px",
            }}
          >
            Show landlords you can afford the rent.
          </h1>
          <p style={{ fontSize: 15, color: "var(--slate)", lineHeight: 1.6, margin: "0 0 32px" }}>
            Pick whichever works for you. Verified affordability gets you 4× faster landlord responses
            and unlocks instant-apply on most listings.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {OPTIONS.map((o, i) => {
              const selected = i === 0;
              return (
                <button
                  key={o.title}
                  type="button"
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: 16,
                    border: `1px solid ${selected ? "var(--accent)" : "var(--hairline)"}`,
                    background: selected
                      ? "color-mix(in oklch, var(--accent) 4%, var(--surface))"
                      : "var(--surface)",
                    borderRadius: 10,
                    cursor: "pointer",
                    display: "flex",
                    gap: 14,
                    alignItems: "flex-start",
                    fontFamily: "inherit",
                    color: "var(--ink)",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: selected ? "var(--accent)" : "var(--surface-3)",
                      color: selected ? "var(--paper)" : "var(--slate)",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon name={o.icon} size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{o.title}</div>
                      {o.recommended ? <Badge tone="accent">Recommended</Badge> : null}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--slate)", lineHeight: 1.5 }}>{o.body}</div>
                  </div>
                  <Icon name="chevR" size={14} style={{ color: "var(--slate)", marginTop: 12 }} />
                </button>
              );
            })}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 32,
              paddingTop: 20,
              borderTop: "1px solid var(--hairline)",
            }}
          >
            <Button variant="ghost" leftIcon="chevL">
              Back
            </Button>
            <div style={{ display: "flex", gap: 8 }}>
              <Link to="/verification" style={{ textDecoration: "none" }}>
                <Button variant="ghost">Skip this step</Button>
              </Link>
              <Link to="/verification" style={{ textDecoration: "none" }}>
                <Button variant="accent" rightIcon="arrR">
                  Continue
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right — score preview */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Card padding={32} style={{ width: "100%", maxWidth: 460 }}>
            <div style={{ marginBottom: 24 }}>
              <Eyebrow style={{ marginBottom: 12 }}>How landlords see you</Eyebrow>
              <div
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "center",
                  paddingBottom: 16,
                  borderBottom: "1px solid var(--hairline)",
                }}
              >
                <Avatar name="Sipho Dlamini" size="lg" tone="neutral" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>Sipho Dlamini</div>
                  <div style={{ fontSize: 12, color: "var(--slate)" }}>
                    34 · Software engineer · Joburg
                  </div>
                </div>
                <div
                  className="tabular"
                  style={{ fontSize: 26, fontWeight: 600, color: "var(--accent)" }}
                >
                  84
                </div>
              </div>
            </div>

            {/* Stacked score rows (inline — see build-order convergence note). */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {SCORE_ROWS.map((s) => {
                const isAffordability = s.label === "Affordability";
                return (
                  <div key={s.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: "var(--slate)" }}>
                        {s.label}{" "}
                        {s.hint ? (
                          <span style={{ color: "var(--success)", fontWeight: 500 }}>{s.hint}</span>
                        ) : null}
                      </span>
                      <span className="tabular" style={{ fontSize: 12, fontWeight: 600 }}>
                        {s.value}
                      </span>
                    </div>
                    <ProgressBar
                      value={s.value}
                      tone={isAffordability ? "success" : "accent"}
                      height="thin"
                    />
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
