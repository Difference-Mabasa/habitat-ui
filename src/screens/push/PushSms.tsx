import type { ReactNode } from "react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";

interface PushNotif {
  title: string;
  body: string;
}

const PUSH: PushNotif[] = [
  { title: "New applicant · score 84", body: "Sipho K. applied for Vilakazi St. ID-verified, employed 3 yrs." },
  { title: "Lease ready to sign", body: "Naledi sent your lease for 23 Vilakazi St. Tap to review." },
  { title: "Rent received · R 3,450", body: "May rent from Sipho cleared. Funds release tomorrow." },
  { title: "Viewing in 1 hour", body: "Backroom at Vilakazi St with Naledi · 14:00. Tap for directions." },
  { title: "Score boosted +20 pts", body: "3 more on-time rents → unlock TPN's 'Excellent' tier." },
];

const SMS = [
  "Backroom: New applicant Sipho K. (score 84). Reply YES to invite to a viewing, INFO for details, STOP to opt out.",
  "Backroom: Your viewing is confirmed for Sat 14 May, 14:00, 23 Vilakazi St. Reply CANCEL to reschedule. Help: 0618229100",
  "Backroom: Rent R 3,450 not yet received. Pay by 12 May to avoid R 250 fee. Pay now: br.co.za/p/4891",
  "Backroom: Your deposit refund of R 3,602 was sent to FNB •••2114. Allow 2–3 working days. Ref: BR-RFD-1124",
  "Backroom: 1-time code 481209. Don't share. We will never ask for this.",
];

const PREFS: [string, boolean, boolean, boolean][] = [
  ["New applicant", true, true, true],
  ["Lease ready", true, true, true],
  ["Rent received", true, false, true],
  ["Rent late", true, true, true],
  ["Marketing & tips", false, false, true],
];

function PushItem({ title, body }: PushNotif) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 18,
        padding: 14,
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
      }}
    >
      <div
        className="display"
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: "var(--accent)",
          color: "#fff",
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
          fontSize: 18,
        }}
      >
        B
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>Backroom</div>
          <div style={{ fontSize: 11, color: "var(--slate)" }}>now</div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{title}</div>
        <div style={{ fontSize: 12, color: "var(--slate)", lineHeight: 1.4, marginTop: 1 }}>{body}</div>
      </div>
    </div>
  );
}

function SmsBubble({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        alignSelf: "flex-start",
        maxWidth: "85%",
        padding: "10px 14px",
        background: "#fff",
        borderRadius: 18,
        borderTopLeftRadius: 4,
        fontSize: 13,
        lineHeight: 1.4,
        color: "var(--ink)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      }}
    >
      {children}
    </div>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <div
      style={{
        width: 32,
        height: 18,
        borderRadius: 999,
        background: on ? "var(--success)" : "var(--surface-3)",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: "#fff",
          top: 2,
          left: on ? 16 : 2,
          transition: "left 0.2s",
        }}
      />
    </div>
  );
}

export default function PushSms() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh", padding: "48px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Eyebrow>Companion to email templates</Eyebrow>
        <h1 className="display" style={{ fontSize: 56, margin: "8px 0 36px" }}>
          PUSH & SMS
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          {/* Push column */}
          <div>
            <h3 className="display" style={{ fontSize: 24, marginBottom: 14 }}>
              PUSH NOTIFICATIONS
            </h3>
            <div
              style={{
                background: "var(--ink)",
                borderRadius: 28,
                padding: 20,
                paddingTop: 36,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {PUSH.map((p) => (
                <PushItem key={p.title} title={p.title} body={p.body} />
              ))}
            </div>
            <div
              className="mono"
              style={{ fontSize: 11, color: "var(--slate)", marginTop: 10, textAlign: "center" }}
            >
              iOS · Android (8 templates total)
            </div>
          </div>

          {/* SMS column */}
          <div>
            <h3 className="display" style={{ fontSize: 24, marginBottom: 14 }}>
              SMS · FALLBACK
            </h3>
            <div
              style={{
                background: "linear-gradient(180deg, #b8d4f5 0%, #c9e0f5 100%)",
                borderRadius: 24,
                padding: 22,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {SMS.map((m, i) => (
                <SmsBubble key={i}>{m}</SmsBubble>
              ))}
            </div>
            <div
              className="mono"
              style={{ fontSize: 11, color: "var(--slate)", marginTop: 10, textAlign: "center" }}
            >
              For users without smartphones · 6 templates total
            </div>
          </div>
        </div>

        {/* Preference panel */}
        <Card style={{ marginTop: 48, padding: 28 }}>
          <h3 className="display" style={{ fontSize: 22, marginBottom: 6 }}>
            USER PREFERENCES
          </h3>
          <p style={{ fontSize: 13, color: "var(--slate)", marginBottom: 18 }}>
            Each notification type has independent push / SMS / email toggles.
          </p>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "var(--surface-2)" }}>
                {["Event", "Push", "SMS", "Email"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 14px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      color: "var(--slate)",
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PREFS.map(([label, push, sms, email], i) => (
                <tr key={i} style={{ borderTop: "1px solid var(--hairline)" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 500 }}>{label}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <Toggle on={push} />
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <Toggle on={sms} />
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <Toggle on={email} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

// Suppress unused-import warning if Button is dropped later.
void Button;
