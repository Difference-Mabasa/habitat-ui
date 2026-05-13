import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import Button from "@/components/Button";
import Input from "@/components/Input";
import FormField from "@/components/FormField";
import Checkbox from "@/components/Checkbox";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Icon from "@/components/Icon";
import { useSession } from "@/lib/session";

type Role = "tenant" | "landlord" | "agent";

const ROLES: { id: Role; title: string; body: string; icon: "home" | "key" | "users" }[] = [
  { id: "tenant", title: "I'm renting", body: "Browse spots, apply, sign a lease.", icon: "home" },
  { id: "landlord", title: "I have a property", body: "List a backroom, cottage, or flat.", icon: "key" },
  { id: "agent", title: "I'm an agent", body: "Match tenants on behalf of landlords.", icon: "users" },
];

export default function Register() {
  const navigate = useNavigate();
  const { register, error, status } = useSession();
  const [role, setRole] = useState<Role>("tenant");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const homeForRole: Record<Role, string> = {
    tenant: "/onboarding",
    landlord: "/landlord-onboarding",
    agent: "/agent-overview",
  };

  const completeRegister = async () => {
    try {
      await register({ email, password, displayName, role });
      navigate(homeForRole[role]);
    } catch {
      // error is exposed via session.error.
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1.4fr",
        background: "var(--paper)",
      }}
    >
      {/* Left — espresso pitch panel */}
      <div
        style={{
          background: "radial-gradient(120% 80% at 80% 20%, #4A2410 0%, #2A1709 45%, #1E0F06 100%)",
          color: "var(--paper)",
          padding: "56px 64px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.05,
            backgroundImage: "radial-gradient(rgba(247,239,226,0.4) 1px, transparent 1px)",
            backgroundSize: "3px 3px",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Logo size={22} invert />
          </Link>
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <span
              aria-hidden="true"
              style={{ width: 10, height: 10, background: "var(--accent)", transform: "rotate(45deg)" }}
            />
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", color: "var(--accent)" }}>
              JOIN HABITAT
            </span>
          </div>
          <h1 className="display" style={{ fontSize: 80, color: "var(--paper)", margin: "0 0 28px" }}>
            FIND IT.
            <br />
            LIST IT.
            <br />
            LIVE IT.
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.6, maxWidth: 360, color: "rgba(247,239,226,0.7)", margin: 0 }}>
            One account. Rent, list, or match. Pick how you want to start — you can add more later from
            your profile.
          </p>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            fontSize: 11,
            color: "rgba(247,239,226,0.4)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          South Africa's Kasi Rental Platform
        </div>
      </div>

      {/* Right — register form */}
      <div
        style={{
          padding: "48px 80px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ width: "100%", maxWidth: 480 }}>
          <h2 className="display" style={{ fontSize: 48, color: "var(--ink)", margin: "0 0 6px" }}>
            CREATE ACCOUNT
          </h2>
          <p style={{ fontSize: 14, color: "var(--slate)", margin: "0 0 28px" }}>
            Have one?{" "}
            <Link to="/auth" style={{ color: "var(--accent)", fontWeight: 600 }}>
              Sign in
            </Link>
          </p>

          <Eyebrow style={{ marginBottom: 10 }}>I want to…</Eyebrow>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 24 }}>
            {ROLES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                style={{
                  padding: 14,
                  borderRadius: 10,
                  border: `1px solid ${role === r.id ? "var(--accent)" : "var(--hairline)"}`,
                  background: role === r.id ? "color-mix(in oklch, var(--accent) 6%, var(--surface))" : "var(--surface)",
                  textAlign: "left",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  color: "var(--ink)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <Icon name={r.icon} size={18} style={{ color: role === r.id ? "var(--accent)" : "var(--slate)" }} />
                <div style={{ fontSize: 13, fontWeight: 600 }}>{r.title}</div>
                <div style={{ fontSize: 11, color: "var(--slate)", lineHeight: 1.4 }}>{r.body}</div>
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <FormField label="Display name" required>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your full name"
                style={{ height: 44 }}
                autoComplete="name"
              />
            </FormField>
            <FormField label="Email" required helper="We'll send a one-tap verification link.">
              <Input
                type="email"
                placeholder="you@example.co.za"
                style={{ height: 44 }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </FormField>
            <FormField label="Password" required helper="Min 8 chars.">
              <Input
                type="password"
                placeholder="••••••••"
                style={{ height: 44 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </FormField>
            {error ? (
              <div role="alert" style={{ fontSize: 13, color: "var(--danger)" }}>
                {error}
              </div>
            ) : null}

            <Card padding={14} style={{ background: "var(--surface-2)" }}>
              <Checkbox
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                label={
                  <span style={{ fontSize: 13 }}>
                    I accept Habitat's{" "}
                    <Link to="/about" style={{ color: "var(--accent)", fontWeight: 600 }}>
                      terms of service
                    </Link>{" "}
                    and{" "}
                    <Link to="/about" style={{ color: "var(--accent)", fontWeight: 600 }}>
                      POPIA notice
                    </Link>
                    .
                  </span>
                }
              />
            </Card>

            <Button
              variant="accent"
              disabled={!acceptTerms || status === "loading"}
              onClick={() => void completeRegister()}
              style={{
                height: 52,
                justifyContent: "center",
                fontSize: 14,
                letterSpacing: "0.14em",
                fontWeight: 700,
                marginTop: 6,
              }}
            >
              CREATE ACCOUNT
            </Button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                margin: "12px 0 8px",
                color: "var(--slate)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.16em",
              }}
            >
              <div style={{ flex: 1, height: 1, background: "var(--hairline-strong)" }} />
              OR
              <div style={{ flex: 1, height: 1, background: "var(--hairline-strong)" }} />
            </div>

            <Button
              variant="secondary"
              onClick={() => navigate("/auth/oauth2/callback")}
              style={{
                width: "100%",
                height: 48,
                justifyContent: "center",
                fontSize: 14,
                textTransform: "none",
                fontWeight: 500,
                background: "#fff",
              }}
            >
              Continue with Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
