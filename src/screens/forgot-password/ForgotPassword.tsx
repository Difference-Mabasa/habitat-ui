import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import Button from "@/components/Button";
import Input from "@/components/Input";
import FormField from "@/components/FormField";
import Card from "@/components/Card";
import Icon from "@/components/Icon";
import Eyebrow from "@/components/Eyebrow";
import Alert from "@/components/Alert";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

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
      }}
    >
      <Link to="/" style={{ marginBottom: 24, textDecoration: "none" }}>
        <Logo size={20} />
      </Link>

      <Card padding={32} style={{ width: "100%", maxWidth: 440 }}>
        {sent ? (
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
                margin: "0 auto 16px",
              }}
            >
              <Icon name="check" size={26} />
            </div>
            <Eyebrow style={{ color: "var(--success)", textAlign: "center" }}>Email sent</Eyebrow>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 500,
                letterSpacing: "-0.01em",
                margin: "8px 0 6px",
                textAlign: "center",
              }}
            >
              Check your inbox
            </h1>
            <p
              style={{
                fontSize: 13,
                color: "var(--slate)",
                margin: "0 0 20px",
                textAlign: "center",
                lineHeight: 1.55,
              }}
            >
              If <strong style={{ color: "var(--ink)" }}>{email || "your email"}</strong> is on Habitat,
              we sent a password reset link. It expires in 30 minutes.
            </p>

            <Alert tone="info" title="Didn't get it?">
              Check spam, or wait 60 seconds and try again. Still nothing? It's possible no account
              uses that email.
            </Alert>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 20 }}>
              <Button
                variant="secondary"
                onClick={() => setSent(false)}
                style={{ width: "100%", justifyContent: "center" }}
              >
                Try a different email
              </Button>
              <Link to="/auth" style={{ textDecoration: "none" }}>
                <Button variant="ghost" leftIcon="arrL" style={{ width: "100%", justifyContent: "center" }}>
                  Back to sign in
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <Link
              to="/auth"
              style={{
                fontSize: 12,
                color: "var(--slate)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                marginBottom: 16,
              }}
            >
              <Icon name="arrL" size={12} /> Back to sign in
            </Link>
            <Eyebrow>Forgot your password?</Eyebrow>
            <h1 style={{ fontSize: 26, fontWeight: 500, letterSpacing: "-0.015em", margin: "8px 0 6px" }}>
              No worries
            </h1>
            <p style={{ fontSize: 13, color: "var(--slate)", margin: "0 0 24px", lineHeight: 1.55 }}>
              Pop your email below and we'll send a one-tap reset link. It expires in 30 minutes for
              your safety.
            </p>

            <FormField label="Email" required>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.co.za"
                style={{ height: 48 }}
              />
            </FormField>

            <Button
              variant="accent"
              disabled={!email}
              onClick={() => setSent(true)}
              style={{ width: "100%", height: 52, justifyContent: "center", marginTop: 16 }}
            >
              Send reset link
            </Button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                margin: "20px 0",
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
              leftIcon="chat"
              onClick={() => navigate("/help")}
              style={{ width: "100%", justifyContent: "center" }}
            >
              Reset via WhatsApp instead
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}
