import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { DEMO_CREDENTIALS, useSession } from "@/lib/session";
import Card from "@/components/Card";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Eyebrow from "@/components/Eyebrow";
import Tabs from "@/components/Tabs";
import Alert from "@/components/Alert";
import KeyValueRow from "@/components/KeyValueRow";

type CallbackState = "exchanging" | "success" | "error";

export default function OauthCallback() {
  const [state, setState] = useState<CallbackState>("success");
  const { login, user } = useSession();

  // The real OAuth2 exchange endpoint (/auth/oauth2/exchange) lands in
  // Phase 1c. Until then, the "Success" path falls back to logging the
  // signed-in tenant demo user in via the standard credentials flow so
  // the surface still feels real end-to-end.
  useEffect(() => {
    if (state === "success" && !user) {
      void login(DEMO_CREDENTIALS.tenant);
    }
  }, [state, user, login]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--paper)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        gap: 16,
      }}
    >
      <Logo size={20} />

      {/* Demo controls — flip between the three states. */}
      <Tabs
        variant="segmented"
        tabs={[
          { id: "exchanging", label: "Exchanging" },
          { id: "success", label: "Success" },
          { id: "error", label: "Error" },
        ]}
        value={state}
        onChange={(v) => setState(v as CallbackState)}
      />

      <Card padding={32} style={{ maxWidth: 440, width: "100%", textAlign: "center" }}>
        {state === "exchanging" && (
          <>
            <Spinner />
            <Eyebrow style={{ marginTop: 18 }}>Almost there</Eyebrow>
            <h1 style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.01em", margin: "8px 0 6px" }}>
              Signing you in with Google
            </h1>
            <p style={{ fontSize: 13, color: "var(--slate)", margin: 0, lineHeight: 1.55 }}>
              We're exchanging the auth code with Google and creating your Habitat session. Hold tight — usually under 2 seconds.
            </p>
            <div className="mono" style={{ fontSize: 11, color: "var(--slate-2)", marginTop: 20 }}>
              /auth/oauth2/callback · provider=google
            </div>
          </>
        )}

        {state === "success" && (
          <>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "color-mix(in oklch, var(--success) 12%, transparent)",
                border: "1.5px solid var(--success)",
                color: "var(--success)",
                display: "grid",
                placeItems: "center",
                margin: "0 auto 20px",
              }}
            >
              <Icon name="check" size={26} />
            </div>
            <Eyebrow style={{ color: "var(--success)" }}>Signed in</Eyebrow>
            <h1 style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.01em", margin: "8px 0 6px" }}>
              Welcome back, Sipho
            </h1>
            <p style={{ fontSize: 13, color: "var(--slate)", margin: "0 0 18px", lineHeight: 1.55 }}>
              Redirecting you to <span className="mono">/tenant-portal</span> now. If nothing happens, tap below.
            </p>
            <Link to="/onboarding" style={{ textDecoration: "none" }}>
              <Button variant="accent" rightIcon="arrR" style={{ width: "100%", justifyContent: "center" }}>
                Continue setup
              </Button>
            </Link>
            <div className="mono" style={{ fontSize: 11, color: "var(--slate-2)", marginTop: 16 }}>
              session expires in 30 days
            </div>
          </>
        )}

        {state === "error" && (
          <>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "color-mix(in oklch, var(--danger) 12%, transparent)",
                border: "1.5px solid var(--danger)",
                color: "var(--danger)",
                display: "grid",
                placeItems: "center",
                margin: "0 auto 20px",
              }}
            >
              <Icon name="x" size={26} />
            </div>
            <Eyebrow style={{ color: "var(--danger)" }}>Sign-in failed</Eyebrow>
            <h1 style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.01em", margin: "8px 0 6px" }}>
              We couldn't sign you in
            </h1>
            <p style={{ fontSize: 13, color: "var(--slate)", margin: "0 0 18px", lineHeight: 1.55 }}>
              Google sent back an error or the auth code expired. Try again — if it keeps failing, sign in with email instead.
            </p>
            <div style={{ textAlign: "left", marginBottom: 16 }}>
              <KeyValueRow label="Error" value="invalid_grant" tone="danger" divider />
              <KeyValueRow
                label="Reason"
                value="auth code expired (10 min)"
                divider={false}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Link to="/auth/oauth2/callback" style={{ textDecoration: "none" }}>
                <Button variant="accent" leftIcon="refresh" style={{ width: "100%", justifyContent: "center" }}>
                  Try Google again
                </Button>
              </Link>
              <Link to="/auth" style={{ textDecoration: "none" }}>
                <Button variant="secondary" style={{ width: "100%", justifyContent: "center" }}>
                  Sign in with email
                </Button>
              </Link>
            </div>
          </>
        )}
      </Card>

      {state === "error" ? (
        <div style={{ maxWidth: 440, width: "100%" }}>
          <Alert tone="info" title="Common cause">
            You took longer than 10 minutes between tapping "Continue with Google" and being redirected back.
            Google expires the auth code by then for safety. Just retry.
          </Alert>
        </div>
      ) : null}
    </div>
  );
}

function Spinner() {
  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: "50%",
        border: "3px solid var(--surface-3)",
        borderTopColor: "var(--accent)",
        margin: "0 auto",
        animation: "habitat-spin 700ms linear infinite",
      }}
      aria-label="Loading"
    >
      <style>{`@keyframes habitat-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
