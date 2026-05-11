import Nav from "@/components/Nav";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import Avatar from "@/components/Avatar";
import KeyValueRow from "@/components/KeyValueRow";
import LeaseDocument, { type LeasePage } from "./LeaseDocument";

const PAGES: LeasePage[] = [
  {
    id: 4,
    title: "Rent and Deposit · Term",
    body: (
      <>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginTop: 0, marginBottom: 12 }}>4. Rent and Deposit</h3>
        <p style={{ margin: "0 0 16px", color: "var(--slate)" }}>
          The Tenant agrees to pay monthly rent of{" "}
          <span style={{ color: "var(--ink)", fontWeight: 600 }}>R 5,400.00</span> on or before the 1st of
          each month, by EFT into the account nominated by the Landlord. A grace period of three (3) days
          applies; thereafter interest at the prescribed rate accrues on outstanding amounts.
        </p>
        <p style={{ margin: "0 0 16px", color: "var(--slate)" }}>
          The deposit, equal to one (1) month's rent (R 5,400.00), is held in an interest-bearing trust
          account in the Tenant's name as required by section 5(3)(b) of the Rental Housing Act.
        </p>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>5. Term</h3>
        <p style={{ margin: "0 0 16px", color: "var(--slate)" }}>
          This lease commences on{" "}
          <span style={{ color: "var(--ink)", fontWeight: 600 }}>1 May 2025</span> and continues for a fixed
          term of twelve (12) months, ending 30 April 2026. Either party may terminate on twenty (20)
          business days' written notice without penalty, in accordance with the Consumer Protection Act.
        </p>
        <div
          style={{
            padding: 16,
            border: "1px solid var(--accent)",
            background: "color-mix(in oklch, var(--accent) 6%, transparent)",
            borderRadius: 8,
            marginTop: 24,
          }}
        >
          <div
            className="mono"
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--accent)",
              marginBottom: 4,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Initial here
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div
              style={{
                width: 80,
                height: 36,
                border: "1px dashed var(--hairline-strong)",
                borderRadius: 4,
                background: "var(--surface)",
                display: "grid",
                placeItems: "center",
                fontSize: 11,
                color: "var(--slate)",
              }}
            >
              Tap to initial
            </div>
            <span style={{ fontSize: 11, color: "var(--slate)" }}>
              Acknowledging clauses 4 and 5 above.
            </span>
          </div>
        </div>
      </>
    ),
  },
];

export default function Lease() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 32px 64px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Eyebrow>Lease · LSE-2024-00482</Eyebrow>
          <Badge tone="warn" leftIcon="clock">
            Awaiting your signature
          </Badge>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", margin: "0 0 24px" }}>
          Review and sign your lease
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 380px", gap: 32 }}>
          <Card padding={0} style={{ overflow: "hidden" }}>
            <LeaseDocument
              title="Residential Lease Agreement · Studio · Melville"
              pages={PAGES}
              totalPages={11}
              initialPage={0}
            />
          </Card>

          <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card padding={20}>
              <Eyebrow style={{ marginBottom: 16 }}>Lease summary</Eyebrow>
              <KeyValueRow label="Property" value="Studio · Melville" size="sm" />
              <KeyValueRow label="Landlord" value="Thandi Mokoena" size="sm" />
              <KeyValueRow label="Term" value="12 months" size="sm" />
              <KeyValueRow label="Start" value="1 May 2025" size="sm" />
              <KeyValueRow label="Rent" value="R 5,400 / mo" size="sm" />
              <KeyValueRow label="Deposit" value="R 5,400" size="sm" />
            </Card>

            <Card padding={20}>
              <Eyebrow style={{ marginBottom: 12 }}>Signatures</Eyebrow>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar name="Thandi Mokoena" size="sm" tone="neutral" />
                  <span style={{ fontSize: 13 }}>Thandi (landlord)</span>
                </div>
                <Badge tone="success" leftIcon="check">
                  Signed
                </Badge>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderTop: "1px solid var(--hairline)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar name="Sipho Dlamini" size="sm" tone="neutral" />
                  <span style={{ fontSize: 13 }}>You</span>
                </div>
                <Badge tone="warn">Pending</Badge>
              </div>
              <Button
                variant="accent"
                leftIcon="edit"
                style={{ width: "100%", justifyContent: "center", marginTop: 16 }}
              >
                Sign all 11 pages
              </Button>
              <Button
                variant="ghost"
                size="sm"
                leftIcon="download"
                style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
              >
                Download draft
              </Button>
            </Card>

            <Card padding={16} style={{ background: "var(--surface-2)" }}>
              <div style={{ display: "flex", gap: 10 }}>
                <Icon name="shield" size={16} style={{ color: "var(--success)", flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize: 12, color: "var(--slate)", lineHeight: 1.5 }}>
                  Compliant with the Rental Housing Act and CPA. Signatures are e-IDAS qualified and
                  time-stamped.
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
