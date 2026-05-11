import type { ReactNode } from "react";
import Logo from "@/components/Logo";
import Badge from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import Avatar from "@/components/Avatar";

interface EmailProps {
  tag: string;
  subject: string;
  preheader: string;
  cta?: string;
  children: ReactNode;
}

function Email({ tag, subject, preheader, cta, children }: EmailProps) {
  return (
    <div
      style={{
        background: "var(--surface-2)",
        padding: 24,
        borderRadius: 12,
        border: "1px solid var(--hairline)",
      }}
    >
      <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 12 }}>
        <Badge tone="accent">{tag}</Badge>
        <span className="mono" style={{ fontSize: 11, color: "var(--slate)" }}>
          noreply@backroom.co.za
        </span>
      </div>
      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>{subject}</div>
      <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 14 }}>{preheader}</div>

      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div style={{ background: "var(--ink)", padding: "20px 24px" }}>
          <Logo size={16} invert />
        </div>
        <div style={{ padding: 28 }}>
          {children}
          {cta ? (
            <div style={{ marginTop: 22 }}>
              <button
                type="button"
                style={{
                  background: "var(--accent)",
                  color: "#fff",
                  padding: "12px 22px",
                  borderRadius: 8,
                  border: 0,
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {cta}
              </button>
            </div>
          ) : null}
        </div>
        <div
          style={{
            padding: "16px 24px",
            background: "var(--surface-2)",
            fontSize: 10,
            color: "var(--slate)",
            lineHeight: 1.5,
            borderTop: "1px solid var(--hairline)",
          }}
        >
          Backroom SA (Pty) Ltd · 8 Bree Street, Cape Town · PPRA FFC2026/00831
          <br />
          You're getting this because you have an account at Backroom.{" "}
          <a href="#" style={{ color: "var(--slate)", textDecoration: "underline" }}>
            Unsubscribe
          </a>{" "}
          ·{" "}
          <a href="#" style={{ color: "var(--slate)", textDecoration: "underline" }}>
            Email preferences
          </a>
        </div>
      </div>
    </div>
  );
}

export default function EmailTemplates() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh", padding: "48px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Eyebrow>Notification system</Eyebrow>
        <h1 className="display" style={{ fontSize: 56, margin: "8px 0 36px" }}>
          EMAIL TEMPLATES
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Application received */}
          <Email
            tag="Application"
            subject="Your application for Vilakazi St is in"
            preheader="Naledi typically replies within 4h · score 84/100"
            cta="Track application"
          >
            <div className="display" style={{ fontSize: 32, color: "var(--ink)", marginBottom: 12 }}>
              YOU'RE IN THE QUEUE.
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.6, color: "var(--ink-2)" }}>
              Hi Sipho,
              <br />
              <br />
              Your application for <strong>Backroom · 23 Vilakazi Street</strong> reached Naledi at 14:22
              today. She typically replies within 4 hours. We'll notify you the moment she does.
            </div>
            <div
              style={{
                marginTop: 18,
                padding: 14,
                background: "var(--surface-2)",
                borderLeft: "3px solid var(--accent)",
                borderRadius: 6,
                fontSize: 13,
              }}
            >
              <strong>Your applicant score:</strong> 84/100{" "}
              <span style={{ color: "var(--slate)" }}>
                · verified ID, employed 3+ yrs, on-time rent history
              </span>
            </div>
          </Email>

          {/* Approved */}
          <Email
            tag="Approved"
            subject="✓ Naledi said yes"
            preheader="Lease ready · review and sign within 48 hours"
            cta="Review & sign lease"
          >
            <div className="display" style={{ fontSize: 32, color: "var(--success)", marginBottom: 12 }}>
              YOU GOT THE SPOT.
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.6, color: "var(--ink-2)" }}>
              Hi Sipho,
              <br />
              <br />
              Great news. Naledi approved your application for <strong>23 Vilakazi Street</strong>. Your
              lease is drafted and waiting for your signature.
            </div>
            <table style={{ marginTop: 18, width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={{ padding: "6px 0", color: "var(--slate)" }}>Move-in</td>
                  <td style={{ textAlign: "right", fontWeight: 600 }}>1 June 2026</td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "6px 0",
                      color: "var(--slate)",
                      borderTop: "1px dotted var(--hairline)",
                    }}
                  >
                    Monthly rent
                  </td>
                  <td
                    className="mono"
                    style={{
                      textAlign: "right",
                      fontWeight: 600,
                      borderTop: "1px dotted var(--hairline)",
                    }}
                  >
                    R 3,450
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "6px 0",
                      color: "var(--slate)",
                      borderTop: "1px dotted var(--hairline)",
                    }}
                  >
                    Deposit
                  </td>
                  <td
                    className="mono"
                    style={{
                      textAlign: "right",
                      fontWeight: 600,
                      borderTop: "1px dotted var(--hairline)",
                    }}
                  >
                    R 3,450
                  </td>
                </tr>
              </tbody>
            </table>
          </Email>

          {/* New applicant for landlord */}
          <Email
            tag="New applicant"
            subject="New applicant for Vilakazi St · score 84"
            preheader="Sipho Khumalo · employed 3yrs · ID verified"
            cta="View applicant"
          >
            <div className="display" style={{ fontSize: 28, color: "var(--ink)", marginBottom: 12 }}>
              NEW APPLICATION ARRIVED.
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.6, color: "var(--ink-2)" }}>
              Hi Naledi,
              <br />
              <br />
              <strong>Sipho Khumalo</strong> just applied for your spot at 23 Vilakazi Street. He scored{" "}
              <strong>84/100</strong> — ID-verified, employed at Discovery for 3 years, clean rent history.
            </div>
            <div
              style={{
                marginTop: 18,
                display: "flex",
                gap: 16,
                padding: 14,
                background: "var(--surface-2)",
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Avatar
                name="Sipho Khumalo"
                size="lg"
                tone="neutral"
                style={{ width: 48, height: 48, fontSize: 16 }}
              />
              <div style={{ fontSize: 13 }}>
                <div style={{ fontWeight: 600 }}>Sipho Khumalo · 30</div>
                <div style={{ color: "var(--slate)", fontSize: 12 }}>
                  Available to move-in 1 June · 12-month lease
                </div>
              </div>
            </div>
          </Email>

          {/* Payment receipt */}
          <Email
            tag="Receipt"
            subject="Rent paid · R 3,450 · May 2026"
            preheader="Funds released to landlord · invoice attached"
          >
            <div className="display" style={{ fontSize: 28, color: "var(--ink)", marginBottom: 12 }}>
              RECEIPT FOR MAY RENT.
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.6, color: "var(--ink-2)" }}>
              Hi Sipho — your May rent of <strong>R 3,450</strong> was received and released to Naledi on
              2 May 2026, 09:14.
            </div>
            <table style={{ marginTop: 18, width: "100%", fontSize: 13 }}>
              <tbody>
                <tr>
                  <td style={{ padding: "6px 0", color: "var(--slate)" }}>Method</td>
                  <td style={{ textAlign: "right" }}>EFT · FNB</td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "6px 0",
                      color: "var(--slate)",
                      borderTop: "1px dotted var(--hairline)",
                    }}
                  >
                    Reference
                  </td>
                  <td
                    className="mono"
                    style={{ textAlign: "right", borderTop: "1px dotted var(--hairline)" }}
                  >
                    BR-PMT-04891
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "6px 0",
                      color: "var(--slate)",
                      borderTop: "1px dotted var(--hairline)",
                    }}
                  >
                    Next due
                  </td>
                  <td style={{ textAlign: "right", borderTop: "1px dotted var(--hairline)" }}>
                    1 June 2026
                  </td>
                </tr>
              </tbody>
            </table>
            <p style={{ marginTop: 16, fontSize: 12, color: "var(--slate)" }}>
              Tax invoice attached:{" "}
              <a href="#" style={{ color: "var(--accent)", fontWeight: 600 }}>
                BR-INV-2026-04-1124.pdf
              </a>
            </p>
          </Email>
        </div>
      </div>
    </div>
  );
}
