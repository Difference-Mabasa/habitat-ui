import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import IconButton from "@/components/IconButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import FormField from "@/components/FormField";
import Checkbox from "@/components/Checkbox";
import Card from "@/components/Card";
import Alert from "@/components/Alert";
import { useSession } from "@/lib/session";
import { ApiError } from "@/lib/api/client";

type Mode = "login" | "register";
type RegisterRole = "user" | "agent";

/**
 * /auth and /register render the same screen. Only the eyebrow above the
 * hero ("WELCOME BACK" vs "JOIN HABITAT") and the right-hand form change
 * between modes; the espresso panel, the hero, the subtitle, and the
 * footer line are shared.
 *
 * Layout proportions follow backroom-ui's auth screens — fixed 420px
 * left panel, 52px hero, 36px form heading — which fit a typical laptop
 * viewport without scrolling.
 *
 * Casing: form headings, field labels, article titles, and role-toggle
 * options are written in Title Case in source so they render Title Case
 * directly. Buttons inherit `.btn`'s `text-transform: uppercase` from
 * the design system, so `<Button>` text written Title Case renders as
 * ALL CAPS in the browser — matches the rest of the app.
 */
export default function Auth() {
  const location = useLocation();
  const mode: Mode = location.pathname.startsWith("/register") ? "register" : "login";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
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
        flex: "0 0 420px",
        background: "radial-gradient(120% 80% at 80% 20%, #4A2410 0%, #2A1709 45%, #1E0F06 100%)",
        color: "var(--paper)",
        padding: "40px 48px",
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
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <span
            aria-hidden="true"
            style={{
              width: 8,
              height: 8,
              background: "var(--accent)",
              transform: "rotate(45deg)",
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.18em",
              color: "var(--accent)",
            }}
          >
            {mode === "login" ? "WELCOME BACK" : "JOIN HABITAT"}
          </span>
        </div>
        <h1
          className="display"
          style={{
            fontSize: 52,
            lineHeight: 1.05,
            color: "var(--paper)",
            margin: "0 0 24px",
          }}
        >
          YOUR SPOT
          <br />
          IS WAITING.
        </h1>
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.65,
            maxWidth: 300,
            color: "rgba(247,239,226,0.55)",
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

// ── Shared form chrome ───────────────────────────────────────────────────

function FormPanel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>{children}</div>
    </div>
  );
}

function FormHeading({ title, switchPrompt, switchLabel, switchTo }: {
  title: string;
  switchPrompt: string;
  switchLabel: string;
  switchTo: string;
}) {
  return (
    <>
      {/* No .display class — form headings render Title Case directly,
          not uppercased. The .display class is reserved for the brand
          hero on the espresso panel. */}
      <h2
        style={{
          fontSize: 32,
          fontWeight: 700,
          color: "var(--ink)",
          letterSpacing: "-0.01em",
          lineHeight: 1.1,
          margin: "0 0 6px",
        }}
      >
        {title}
      </h2>
      <p style={{ fontSize: 14, color: "var(--slate)", margin: "0 0 24px" }}>
        {switchPrompt}{" "}
        <Link to={switchTo} style={{ color: "var(--accent)", fontWeight: 600 }}>
          {switchLabel}
        </Link>
      </p>
    </>
  );
}

function Divider() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        margin: "20px 0",
        color: "var(--slate)",
        fontSize: 12,
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
      }}
    >
      <div style={{ flex: 1, height: 1, background: "var(--hairline)" }} />
      or
      <div style={{ flex: 1, height: 1, background: "var(--hairline)" }} />
    </div>
  );
}

function GoogleButton({ onClick }: { onClick: () => void }) {
  // `<Button variant="secondary">` uppercases via .btn — Google sign-in
  // is typically sentence-cased in vendor guidance, so we use a plain
  // button here matching backroom's pattern.
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: 12,
        background: "#fff",
        border: "1.5px solid var(--hairline-strong)",
        borderRadius: 8,
        fontSize: 15,
        fontWeight: 600,
        color: "var(--ink)",
        fontFamily: "inherit",
        cursor: "pointer",
      }}
    >
      <GoogleLogo />
      <span>Continue with Google</span>
    </button>
  );
}

// ── Login form ───────────────────────────────────────────────────────────

function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error, status } = useSession();
  const from = (location.state as { from?: string } | null)?.from;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const completeSignIn = async () => {
    try {
      await login({ email, password });
      navigate(from ?? "/tenant-portal", { replace: true });
    } catch {
      // error is exposed via session.error.
    }
  };

  return (
    <FormPanel>
      <FormHeading
        title="Sign In"
        switchPrompt="No account?"
        switchLabel="Create one free"
        switchTo="/register"
      />

      <GoogleButton onClick={() => navigate("/auth/oauth2/callback")} />
      <Divider />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void completeSignIn();
        }}
      >
        {error ? (
          <div style={{ marginBottom: 16 }}>
            <Alert tone="danger">{error}</Alert>
          </div>
        ) : null}

        <FormField label="Email Address">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </FormField>

        <div style={{ marginTop: 14 }}>
          <FormField
            label="Password"
            helper={
              <Link
                to="/forgot-password"
                style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}
              >
                Forgot?
              </Link>
            }
          >
            <div style={{ position: "relative" }}>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                style={{ paddingRight: 44 }}
              />
              <IconButton
                icon="eye"
                label={showPassword ? "Hide password" : "Show password"}
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 6,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--slate)",
                }}
              />
            </div>
          </FormField>
        </div>

        <Button
          type="submit"
          variant="accent"
          size="lg"
          disabled={status === "loading"}
          style={{
            width: "100%",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          {status === "loading" ? "Signing In…" : "Sign In"}
        </Button>
      </form>
    </FormPanel>
  );
}

// ── Register form ────────────────────────────────────────────────────────

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

const ROLE_OPTIONS: { id: RegisterRole; label: string; emoji: string }[] = [
  { id: "user", label: "Tenant or Landlord", emoji: "🏠" },
  { id: "agent", label: "Independent Agent", emoji: "🤝" },
];

function RegisterForm() {
  const navigate = useNavigate();
  const { register, error, status } = useSession();
  const [role, setRole] = useState<RegisterRole>("user");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const completeRegister = async () => {
    const localErrors = validateRegistration({ firstName, surname, email, password, acceptTerms });
    if (Object.keys(localErrors).length > 0) {
      setFieldErrors(localErrors);
      return;
    }
    setFieldErrors({});
    try {
      await register({ email, password, firstName, surname, role });
      // Land on the public landing page. The welcome notification (pushed
      // by the API event listener) carries a "Complete profile" CTA into /profile.
      navigate("/");
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

  const showBanner = error && Object.keys(fieldErrors).length === 0;

  return (
    <FormPanel>
      <FormHeading
        title="Create Account"
        switchPrompt="Already have one?"
        switchLabel="Sign in"
        switchTo="/auth"
      />

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {ROLE_OPTIONS.map((opt) => {
          const active = role === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setRole(opt.id)}
              style={{
                flex: 1,
                padding: "12px 8px",
                border: `1.5px solid ${active ? "var(--accent)" : "var(--hairline-strong)"}`,
                borderRadius: 8,
                background: active ? "color-mix(in oklch, var(--accent) 6%, var(--surface))" : "#fff",
                color: active ? "var(--accent-hover)" : "var(--slate)",
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <span style={{ marginRight: 6 }}>{opt.emoji}</span>
              {opt.label}
            </button>
          );
        })}
      </div>

      <GoogleButton onClick={() => navigate("/auth/oauth2/callback")} />
      <Divider />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void completeRegister();
        }}
      >
        {showBanner ? (
          <div style={{ marginBottom: 16 }}>
            <Alert tone="danger">{error}</Alert>
          </div>
        ) : null}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <FormField label="First Name" required error={fieldErrors.firstName}>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Sipho"
              autoComplete="given-name"
            />
          </FormField>
          <FormField label="Surname" required error={fieldErrors.surname}>
            <Input
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              placeholder="Dlamini"
              autoComplete="family-name"
            />
          </FormField>
        </div>

        <div style={{ marginBottom: 14 }}>
          <FormField label="Email Address" required error={fieldErrors.email}>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </FormField>
        </div>

        <div style={{ marginBottom: 14 }}>
          <FormField label="Password" required helper="Min 8 characters." error={fieldErrors.password}>
            <div style={{ position: "relative" }}>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                style={{ paddingRight: 44 }}
              />
              <IconButton
                icon="eye"
                label={showPassword ? "Hide password" : "Show password"}
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 6,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--slate)",
                }}
              />
            </div>
          </FormField>
        </div>

        <div style={{ marginBottom: 14 }}>
          <Card padding={14} style={{ background: "var(--surface-2)" }}>
            <Checkbox
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              label={
                <span style={{ fontSize: 13 }}>
                  I accept Habitat's{" "}
                  <Link
                    to="/help/terms-of-service"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--accent)", fontWeight: 600 }}
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/help/popia-notice"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--accent)", fontWeight: 600 }}
                  >
                    POPIA Notice
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
          type="submit"
          variant="accent"
          size="lg"
          disabled={status === "loading"}
          style={{
            width: "100%",
            justifyContent: "center",
            marginTop: 4,
          }}
        >
          {status === "loading" ? "Creating Account…" : "Create Account"}
        </Button>
      </form>
    </FormPanel>
  );
}

// ── Google brand mark ────────────────────────────────────────────────────

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}
