import { useState } from "react";
import { Link } from "react-router-dom";
import Nav from "@/components/Nav";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Chip from "@/components/Chip";
import Input from "@/components/Input";
import Checkbox from "@/components/Checkbox";
import Eyebrow from "@/components/Eyebrow";

const REASONS = [
  "Buying a home",
  "Moving for work",
  "Found cheaper",
  "Roommate change",
  "Family",
  "Other",
];

export default function Vacate() {
  const [reason, setReason] = useState("Moving for work");
  const [ack, setAck] = useState(true);

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 32px" }}>
        <Eyebrow>Give notice to vacate · 60-day required</Eyebrow>
        <h1 className="display" style={{ fontSize: 56, margin: "8px 0 24px" }}>
          END YOUR LEASE
        </h1>

        <Card padding={32}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18, fontSize: 14 }}>
            <div>
              <Eyebrow style={{ marginBottom: 6 }}>Move-out date</Eyebrow>
              <Input type="date" defaultValue="2026-07-31" style={{ height: 48 }} />
              <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 6 }}>
                Earliest legal date based on 60-day notice: 11 July 2026
              </div>
            </div>

            <div>
              <Eyebrow style={{ marginBottom: 6 }}>Reason (optional, helps us improve)</Eyebrow>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {REASONS.map((r) => (
                  <Chip key={r} active={r === reason} onClick={() => setReason(r)}>
                    {r}
                  </Chip>
                ))}
              </div>
            </div>

            <div>
              <Eyebrow style={{ marginBottom: 6 }}>Forwarding address (for deposit return)</Eyebrow>
              <Input placeholder="Street, suburb, city, postcode" style={{ height: 48 }} />
            </div>

            <div
              style={{
                padding: 18,
                background: "var(--surface-2)",
                borderRadius: 10,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div style={{ fontWeight: 600 }}>What happens next</div>
              <ol
                style={{
                  paddingLeft: 18,
                  margin: 0,
                  fontSize: 13,
                  color: "var(--slate)",
                  lineHeight: 1.7,
                }}
              >
                <li>Naledi gets your notice immediately via WhatsApp + email.</li>
                <li>We schedule a move-out inspection 1 day before your last day.</li>
                <li>Your deposit + interest is reconciled within 14 days.</li>
                <li>Refund hits your bank within 7 working days after that.</li>
              </ol>
            </div>

            <Checkbox
              checked={ack}
              onChange={(e) => setAck(e.target.checked)}
              label={
                <span style={{ color: "var(--slate)" }}>
                  I understand this notice is legally binding under the Rental Housing Act 50 of 1999.
                </span>
              }
            />
          </div>
        </Card>

        <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", gap: 10 }}>
          <Link to="/tenant-portal" style={{ textDecoration: "none" }}>
            <Button variant="ghost">Cancel</Button>
          </Link>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="secondary">Save draft</Button>
            <Link to="/deposit" style={{ textDecoration: "none" }}>
              <Button variant="accent">Submit notice</Button>
            </Link>
          </div>
        </div>

        <Card
          padding={18}
          style={{
            marginTop: 24,
            background: "var(--accent-soft)",
            borderColor: "var(--accent)",
            display: "flex",
            gap: 12,
          }}
        >
          <Icon name="clock" size={18} style={{ color: "var(--accent)", flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: 13 }}>
            <strong>5-day cooling off:</strong> You can withdraw this notice within 5 days at no penalty.
          </div>
        </Card>
      </div>
    </div>
  );
}
