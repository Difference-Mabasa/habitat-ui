import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import IconButton from "@/components/IconButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { DEMO_USERS, useSession } from "@/lib/session";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useSession();
  const from = (location.state as { from?: string } | null)?.from;

  const completeSignIn = () => {
    signIn(DEMO_USERS.tenant);
    navigate(from ?? "/tenant-portal", { replace: true });
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
            backgroundImage:
              "radial-gradient(rgba(247,239,226,0.4) 1px, transparent 1px)",
            backgroundSize: "3px 3px",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <Logo size={22} invert />
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
              WELCOME BACK
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
            Log in to browse verified backrooms, track applications, and connect with landlords across
            South Africa's townships.
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

      {/* Right — sign-in form */}
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

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <FormGroup label="Email address">
              <Input type="email" placeholder="you@example.com" style={{ height: 48 }} />
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
                  defaultValue="••••••••"
                  style={{ height: 48, paddingRight: 44 }}
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
            <Button
              variant="accent"
              onClick={completeSignIn}
              style={{
                height: 56,
                justifyContent: "center",
                marginTop: 8,
                fontSize: 14,
                letterSpacing: "0.16em",
                fontWeight: 700,
              }}
            >
              SIGN IN
            </Button>
          </div>
        </div>
      </div>
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
