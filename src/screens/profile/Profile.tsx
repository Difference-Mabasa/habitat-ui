import { useState } from "react";
import Nav from "@/components/Nav";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Avatar from "@/components/Avatar";
import Eyebrow from "@/components/Eyebrow";
import SubNav, { type SubNavItem } from "@/components/SubNav";

const ITEMS: SubNavItem[] = [
  { id: "profile", label: "Profile", icon: "user" },
  { id: "identity", label: "Identity verification", icon: "shield", badge: { label: "Required" } },
  { id: "affordability", label: "Affordability proof", icon: "cash" },
  { id: "references", label: "References", icon: "users" },
  { id: "notifications", label: "Notifications", icon: "bell" },
  { id: "privacy", label: "Privacy & POPIA", icon: "key" },
  { id: "sessions", label: "Sessions", icon: "clock" },
];

const VERIFICATIONS = [
  { label: "Email", ok: true },
  { label: "Phone", ok: true },
  { label: "ID & FICA", ok: true },
  { label: "Affordability", ok: false },
];

const DETAILS: [string, string][] = [
  ["Full name", "Sipho Dlamini"],
  ["ID number", "8504••••••••"],
  ["Phone", "+27 82 ••• 4421"],
  ["Date of birth", "12 May 1985"],
  ["Employer", "Discovery Health"],
  ["Occupation", "Senior software engineer"],
];

export default function Profile() {
  const [section, setSection] = useState("profile");

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 32px 64px" }}>
        <Eyebrow>Account</Eyebrow>
        <h1
          style={{
            fontSize: 30,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            margin: "8px 0 32px",
          }}
        >
          Profile & verification
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "240px minmax(0,1fr)", gap: 48 }}>
          <SubNav items={ITEMS} activeId={section} onChange={setSection} />

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Verification status */}
            <Card padding={24}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 20,
                }}
              >
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Verification status</div>
                  <div style={{ fontSize: 13, color: "var(--slate)" }}>
                    Verified profiles get 4× more landlord responses.
                  </div>
                </div>
                <VerificationRing percent={75} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                {VERIFICATIONS.map((s) => (
                  <div
                    key={s.label}
                    style={{
                      padding: 12,
                      border: `1px solid ${s.ok ? "var(--success)" : "var(--hairline)"}`,
                      borderRadius: 6,
                      background: s.ok
                        ? "color-mix(in oklch, var(--success) 6%, var(--surface))"
                        : "var(--surface)",
                    }}
                  >
                    <Icon
                      name={s.ok ? "check" : "clock"}
                      size={14}
                      style={{ color: s.ok ? "var(--success)" : "var(--warn)", marginBottom: 6 }}
                    />
                    <div style={{ fontSize: 12, fontWeight: 500 }}>{s.label}</div>
                    <div style={{ fontSize: 10, color: "var(--slate)", marginTop: 2 }}>
                      {s.ok ? "Verified" : "Pending"}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Personal */}
            <Card padding={24}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 24,
                }}
              >
                <div style={{ fontSize: 16, fontWeight: 600 }}>Personal details</div>
                <Button variant="ghost" size="sm" leftIcon="edit">
                  Edit
                </Button>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 24,
                  alignItems: "center",
                  marginBottom: 24,
                  paddingBottom: 24,
                  borderBottom: "1px solid var(--hairline)",
                }}
              >
                <Avatar
                  name="Sipho Dlamini"
                  size="lg"
                  tone="neutral"
                  style={{ width: 80, height: 80, fontSize: 26 }}
                />
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 2 }}>Sipho Dlamini</div>
                  <div style={{ fontSize: 13, color: "var(--slate)" }}>
                    Member since March 2024 · sipho@discovery.co.za
                  </div>
                  <Button variant="ghost" size="sm" leftIcon="upload" style={{ marginTop: 8, padding: 0 }}>
                    Change photo
                  </Button>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {DETAILS.map(([k, v]) => (
                  <div key={k}>
                    <div
                      className="mono"
                      style={{
                        fontSize: 11,
                        color: "var(--slate)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: 4,
                      }}
                    >
                      {k}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{v}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Affordability prompt */}
            <Card
              padding={24}
              style={{
                borderColor: "var(--accent)",
                background: "color-mix(in oklch, var(--accent) 4%, var(--surface))",
              }}
            >
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: "var(--accent)",
                    color: "var(--paper)",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name="cash" size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                    Verify your affordability to unlock instant-apply
                  </div>
                  <div style={{ fontSize: 13, color: "var(--slate)", marginBottom: 12 }}>
                    Connect your bank account read-only via Stitch — we calculate your rent affordability
                    without storing your statements.
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Button variant="accent" size="sm">
                      Connect bank
                    </Button>
                    <Button variant="ghost" size="sm">
                      Upload statements instead
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function VerificationRing({ percent }: { percent: number }) {
  const circumference = 176; // 2*pi*28
  const offset = circumference * (1 - percent / 100);
  return (
    <div style={{ position: "relative", width: 64, height: 64 }}>
      <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r="28" fill="none" stroke="var(--surface-3)" strokeWidth="6" />
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke="var(--success)"
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 32 32)"
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: 14, fontWeight: 600 }}>
        {percent}%
      </div>
    </div>
  );
}
