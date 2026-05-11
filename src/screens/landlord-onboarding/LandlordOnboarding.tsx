import Nav from "@/components/Nav";
import Icon, { type IconName } from "@/components/Icon";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import ProgressBar from "@/components/ProgressBar";

interface Task {
  id: string;
  done: boolean;
  label: string;
  time: string;
  primary?: boolean;
}

const TASKS: Task[] = [
  { id: "t1", done: true, label: "List your first property", time: "Done · 3 min" },
  { id: "t2", done: true, label: "Add 5 photos and pricing", time: "Done · 5 min" },
  { id: "t3", done: false, label: "Verify your bank account for payouts", time: "~2 min", primary: true },
  { id: "t4", done: false, label: "Set your availability for viewings", time: "~1 min" },
  { id: "t5", done: false, label: "Invite your second agent", time: "Optional" },
];

interface Tip {
  icon: IconName;
  iconTone: "accent" | "success";
  title: string;
  body: string;
  cta?: string;
  ctaVariant?: "ghost" | "accent";
}

const TIPS: Tip[] = [
  {
    icon: "sparkle",
    iconTone: "accent",
    title: "Spots with 5+ photos get 3× more viewings.",
    body: "Add interior, exterior, kitchen, bathroom, and street angle. We resize automatically.",
    cta: "Add more photos →",
    ctaVariant: "ghost",
  },
  {
    icon: "bolt",
    iconTone: "accent",
    title: "Reply to first message within 4h.",
    body: "You'll get a \"Fast responder\" badge after 5 quick replies. Tenants prefer fast landlords.",
  },
  {
    icon: "shield",
    iconTone: "success",
    title: "Get the Verified Landlord badge.",
    body: "2-min FICA check unlocks priority placement and direct deposits.",
    cta: "Verify now",
    ctaVariant: "accent",
  },
];

export default function LandlordOnboarding() {
  const completed = TASKS.filter((t) => t.done).length;
  const pct = Math.round((completed / TASKS.length) * 100);

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="landlord" />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 32px" }}>
        {/* Celebration banner */}
        <div
          style={{
            background: "var(--ink)",
            color: "var(--paper)",
            borderRadius: 16,
            padding: 40,
            position: "relative",
            overflow: "hidden",
            marginBottom: 28,
          }}
        >
          <div
            aria-hidden="true"
            style={{ position: "absolute", right: 32, top: 32, display: "flex", gap: 8 }}
          >
            {["#E97A1F", "#F7EFE2", "#5C7A2F"].map((c, i) => (
              <div
                key={c}
                style={{ width: 14, height: 14, background: c, transform: `rotate(${i * 12}deg)` }}
              />
            ))}
          </div>
          <Eyebrow style={{ color: "var(--accent)", marginBottom: 14 }}>Welcome aboard, Naledi</Eyebrow>
          <h1 className="display" style={{ fontSize: 72, margin: 0, color: "var(--paper)" }}>
            YOUR FIRST SPOT
            <br />
            IS LIVE.
          </h1>
          <p
            style={{
              fontSize: 15,
              color: "rgba(247,239,226,0.7)",
              maxWidth: 480,
              marginTop: 16,
            }}
          >
            "Backroom at 23 Vilakazi St" went live 12 minutes ago. Average vacancy in Soweto is 9 days —
            let's get you tenants.
          </p>
          <div style={{ marginTop: 24, display: "flex", gap: 10 }}>
            <Button variant="accent">View your listing</Button>
            <Button
              variant="secondary"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "var(--paper)",
              }}
            >
              Share to WhatsApp
            </Button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 28 }}>
          {/* Checklist */}
          <Card padding={0} style={{ overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--hairline)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className="display" style={{ fontSize: 24 }}>
                  SETUP CHECKLIST
                </div>
                <div className="mono" style={{ fontSize: 13, fontWeight: 600 }}>
                  {completed}/{TASKS.length}
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <ProgressBar value={pct} height="thin" />
              </div>
            </div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {TASKS.map((t, i) => (
                <li
                  key={t.id}
                  style={{
                    padding: "18px 24px",
                    borderTop: i ? "1px solid var(--hairline)" : "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      border: t.done ? "none" : "1.5px solid var(--hairline-strong)",
                      background: t.done ? "var(--success)" : "transparent",
                      color: "#fff",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    {t.done ? <Icon name="check" size={14} /> : null}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 500,
                        fontSize: 15,
                        color: t.done ? "var(--slate)" : "var(--ink)",
                        textDecoration: t.done ? "line-through" : "none",
                      }}
                    >
                      {t.label}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 2 }}>{t.time}</div>
                  </div>
                  {!t.done ? (
                    <Button variant={t.primary ? "accent" : "secondary"} size="sm">
                      Start
                    </Button>
                  ) : null}
                </li>
              ))}
            </ul>
          </Card>

          {/* Tips */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {TIPS.map((tip) => (
              <Card key={tip.title} padding={22}>
                <Icon
                  name={tip.icon}
                  size={18}
                  style={{ color: tip.iconTone === "success" ? "var(--success)" : "var(--accent)" }}
                />
                <div style={{ fontWeight: 600, marginTop: 10 }}>{tip.title}</div>
                <div style={{ fontSize: 13, color: "var(--slate)", marginTop: 6 }}>{tip.body}</div>
                {tip.cta ? (
                  <Button
                    variant={tip.ctaVariant ?? "ghost"}
                    size="sm"
                    style={{
                      marginTop: 12,
                      padding: tip.ctaVariant === "accent" ? undefined : 0,
                    }}
                  >
                    {tip.cta}
                  </Button>
                ) : null}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
