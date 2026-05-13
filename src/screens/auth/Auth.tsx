import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import IconButton from "@/components/IconButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import FormField from "@/components/FormField";
import Checkbox from "@/components/Checkbox";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Icon from "@/components/Icon";
import { useSession } from "@/lib/session";
import { ApiError } from "@/lib/api/client";

type Mode = "login" | "register";
type Role = "tenant" | "landlord" | "agent";

/**
 * /auth and /register render the same screen. Only the eyebrow over the
 * hero ("WELCOME BACK" vs "JOIN HABITAT") and the right-hand form change
 * between modes; the espresso panel, the hero, the subtitle, and the
 * footer line are shared.
 */
export default function Auth() {
  const location = useLocation();
  const mode: Mode = location.pathname.startsWith("/register") ? "register" : "login";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1.4fr",
        background: "var(--paper)",
      }}
    >
      <PitchPanel mode={mode} />
      {mode === "login" ? <LoginForm /> : <RegisterForm />}
    </div>
  );
}

// ── Left: espresso pitch panel ───────────────────────────────────────────

function PitchPanel({ mode }: { mode: Mode }) {
  return (
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
            style={{
              width: 10,
              height: 10,
              background: "var(--accent)",
              transform: "rotate(45deg)",
            }}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.18em",
              color: "var(--accent)",
            }}
          >
            {mode === "login" ? "WELCOME BACK" : "JOIN HABITAT"}
          </span>
        </div>
        <h1 className="display" style={{ fontSize: 88, color: "var(--paper)", margin: "0 0 28px" }}>
          YOUR SPOT
          <br />
          IS WAITING.
        </h1>
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.6,
            maxWidth: 360,
            color: "rgba(247,239,226,0.7)",
            margin: 0,
          }}
        >
          Find verified properties, track applications, and connect with landlords across South Africa.
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
        South Africa's Rental Platform
      </div>
    </div>
  );
}

// ── Right: login form ────────────────────────────────────────────────────

function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error, status } = useSession();
  const from = (location.state as { from?: string } | null)?.from;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const completeSignIn = async () => {
    try {
      await login({ email, password });
      navigate(from ?? "/tenant-portal", { replace: true });
    } catch {
      // error is exposed via session.error — re-render handles UX.
    }
  };

  return (
    <div
      style={{
        padding: "56px 80px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 440 }}>
        <h2 className="display" style={{ fontSize: 56, color: "var(--ink)", margin: "0 0 6px" }}>
          SIGN IN
        </h2>
        <p style={{ fontSize: 14, color: "var(--slate)", margin: "0 0 28px" }}>
          No account?{" "}
          <Link to="/register" style={{ color: "var(--accent)", fontWeight: 600 }}>
            Create one free
          </Link>
        </p>

        <Button
          variant="secondary"
          onClick={() => navigate("/auth/oauth2/callback")}
          style={{
            width: "100%",
            height: 52,
            justifyContent: "center",
            fontSize: 14,
            textTransform: "none",
            fontWeight: 500,
            marginBottom: 24,
            background: "#fff",
          }}
        >
          <GoogleLogo />
          <span>Continue with Google</span>
        </Button>

        <Divider />

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <FormGroup label="Email address">
            <Input
              type="email"
              placeholder="you@example.com"
              style={{ height: 48 }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </FormGroup>
          <FormGroup
            label="Password"
            labelRight={
              <Link to="/forgot-password" style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600 }}>
                Forgot?
              </Link>
            }
          >
            <div style={{ position: "relative" }}>
              <Input
                type="password"
                style={{ height: 48, paddingRight: 44 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <IconButton
                icon="eye"
                label="Show password"
                size="sm"
                style={{
                  position: "absolute",
                  right: 6,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--slate)",
                }}
              />
            </div>
          </FormGroup>
          {error ? (
            <div role="alert" style={{ fontSize: 13, color: "var(--danger)" }}>
              {error}
            </div>
          ) : null}
          <Button
            variant="accent"
            onClick={() => void completeSignIn()}
            disabled={status === "loading"}
            style={{
              height: 56,
              justifyContent: "center",
              marginTop: 8,
              fontSize: 14,
              letterSpacing: "0.16em",
              fontWeight: 700,
            }}
          >
            {status === "loading" ? "SIGNING IN…" : "SIGN IN"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Right: register form ─────────────────────────────────────────────────

interface FieldErrors {
  firstName?: string;
  surname?: string;
  email?: string;
  password?: string;
  acceptTerms?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRegistration(values: {
  firstName: string;
  surname: string;
  email: string;
  password: string;
  acceptTerms: boolean;
}): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.firstName.trim()) errors.firstName = "First name is required.";
  else if (values.firstName.trim().length > 40) errors.firstName = "Max 40 characters.";
  if (!values.surname.trim()) errors.surname = "Surname is required.";
  else if (values.surname.trim().length > 40) errors.surname = "Max 40 characters.";
  if (!values.email.trim()) errors.email = "Email is required.";
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = "That doesn't look like an email.";
  if (!values.password) errors.password = "Password is required.";
  else if (values.password.length < 8) errors.password = "Use at least 8 characters.";
  if (!values.acceptTerms) errors.acceptTerms = "Accept the terms and POPIA notice to continue.";
  return errors;
}

const ROLES: { id: Role; title: string; body: string; icon: "home" | "key" | "users" }[] = [
  { id: "tenant", title: "I'm renting", body: "Browse spots, apply, sign a lease.", icon: "home" },
  { id: "landlord", title: "I have a property", body: "List a cottage, flat, or studio.", icon: "key" },
  { id: "agent", title: "I'm an agent", body: "Match tenants on behalf of landlords.", icon: "users" },
];

function RegisterForm() {
  const navigate = useNavigate();
  const { register, error, status } = useSession();
  const [role, setRole] = useState<Role>("tenant");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const homeForRole: Record<Role, string> = {
    tenant: "/onboarding",
    landlord: "/landlord-onboarding",
    agent: "/agent-overview",
  };

  const completeRegister = async () => {
    const localErrors = validateRegistration({ firstName, surname, email, password, acceptTerms });
    if (Object.keys(localErrors).length > 0) {
      setFieldErrors(localErrors);
      return;
    }
    setFieldErrors({});
    try {
      await register({ email, password, firstName, surname, role });
      navigate(homeForRole[role]);
    } catch (e) {
      if (e instanceof ApiError) {
        const next: FieldErrors = {};
        if (e.fieldErrors) {
          for (const fe of e.fieldErrors) {
            if (
              fe.field === "firstName" ||
              fe.field === "surname" ||
              fe.field === "email" ||
              fe.field === "password"
            ) {
              next[fe.field] = fe.message;
            }
          }
        }
        if (e.status === 409) next.email = e.message;
        if (Object.keys(next).length > 0) setFieldErrors(next);
      }
    }
  };

  return (
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
        <h2 className="display" style={{ fontSize: 56, color: "var(--ink)", margin: "0 0 6px" }}>
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
                background:
                  role === r.id ? "color-mix(in oklch, var(--accent) 6%, var(--surface))" : "var(--surface)",
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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormField label="First name" required error={fieldErrors.firstName}>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Your first name"
                style={{ height: 44 }}
                autoComplete="given-name"
              />
            </FormField>
            <FormField label="Surname" required error={fieldErrors.surname}>
              <Input
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder="Your surname"
                style={{ height: 44 }}
                autoComplete="family-name"
              />
            </FormField>
          </div>
          <FormField
            label="Email"
            required
            helper="We'll send a one-tap verification link."
            error={fieldErrors.email}
          >
            <Input
              type="email"
              placeholder="you@example.co.za"
              style={{ height: 44 }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </FormField>
          <FormField label="Password" required helper="Min 8 chars." error={fieldErrors.password}>
            <Input
              type="password"
              placeholder="••••••••"
              style={{ height: 44 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </FormField>
          {/* Top-level banner — only shows when the API throws something
              that didn't map to a specific field (network down, 500, etc.). */}
          {error && Object.keys(fieldErrors).length === 0 ? (
            <div role="alert" style={{ fontSize: 13, color: "var(--danger)" }}>
              {error}
            </div>
          ) : null}

          <div>
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
            {fieldErrors.acceptTerms ? (
              <div role="alert" style={{ fontSize: 12, color: "var(--danger)", marginTop: 6 }}>
                {fieldErrors.acceptTerms}
              </div>
            ) : null}
          </div>

          <Button
            variant="accent"
            disabled={status === "loading"}
            onClick={() => void completeRegister()}
            style={{
              height: 56,
              justifyContent: "center",
              fontSize: 14,
              letterSpacing: "0.16em",
              fontWeight: 700,
              marginTop: 6,
            }}
          >
            {status === "loading" ? "CREATING ACCOUNT…" : "CREATE ACCOUNT"}
          </Button>

          <Divider />

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
            <GoogleLogo />
            <span>Continue with Google</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Shared bits ──────────────────────────────────────────────────────────

function Divider() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        margin: "0 0 24px",
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
  );
}

function FormGroup({
  label,
  labelRight,
  children,
}: {
  label: string;
  labelRight?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <label
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </label>
        {labelRight}
      </div>
      {children}
    </div>
  );
}

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.6 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h6c-.3 1.4-1 2.6-2.2 3.4v2.8h3.6c2.1-2 3.2-4.8 3.2-8.2z"
      />
      <path
        fill="#34A853"
        d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.7 1.1-2.8 0-5.3-1.9-6.1-4.5H2.2v2.8C4 19.9 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.9 14.1c-.2-.7-.3-1.4-.3-2.1s.1-1.4.3-2.1V7.1H2.2C1.4 8.6 1 10.3 1 12s.4 3.4 1.2 4.9l3.7-2.8z"
      />
      <path
        fill="#EA4335"
        d="M12 5.5c1.6 0 3 .5 4.1 1.6l3.1-3.1C17.5 2.1 15 1 12 1 7.7 1 4 4.1 2.2 7.1l3.7 2.8C6.7 7.4 9.2 5.5 12 5.5z"
      />
    </svg>
  );
}
