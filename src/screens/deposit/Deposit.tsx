import Nav from "@/components/Nav";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import EmptyState from "@/components/EmptyState";
import DepositReturnChecklist, { type DepositItem } from "./DepositReturnChecklist";
import { totalDeductions } from "@/lib/deposit";

const ITEMS: DepositItem[] = [];

const DEPOSIT = 0;
const INTEREST = 0;

export default function Deposit() {
  const total = totalDeductions(ITEMS);
  const refund = DEPOSIT + INTEREST - total;
  const agreedCount = ITEMS.filter((i) => i.agreed).length;

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
          <Eyebrow>Lease ending</Eyebrow>
          <Badge tone="accent">
            {agreedCount} of {ITEMS.length} items agreed
          </Badge>
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 500, letterSpacing: "-0.02em", margin: "0 0 6px" }}>
          Exit inspection & deposit return
        </h1>
        <p style={{ fontSize: 14, color: "var(--slate)", margin: "0 0 32px" }}>
          You and your landlord agree on each item. Disputed items go to free arbitration.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 360px", gap: 32 }}>
          {ITEMS.length === 0 ? (
            <Card padding={20}>
              <EmptyState
                icon="shield"
                title="No deposit items yet"
                description="Inspection items will appear here once your landlord completes the walk-through."
              />
            </Card>
          ) : (
            <DepositReturnChecklist items={ITEMS} />
          )}

          <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card padding={20}>
              <Eyebrow style={{ marginBottom: 12 }}>Refund calculation</Eyebrow>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--slate)" }}>Deposit held</span>
                  <span className="tabular">R {DEPOSIT.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--slate)" }}>Interest earned</span>
                  <span className="tabular" style={{ color: "var(--success)" }}>
                    + R {INTEREST}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--slate)" }}>Deductions</span>
                  <span className="tabular" style={{ color: "var(--warn)" }}>
                    − R {total.toLocaleString()}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: 12,
                    borderTop: "1px solid var(--hairline)",
                    fontSize: 16,
                  }}
                >
                  <span style={{ fontWeight: 600 }}>You receive</span>
                  <span className="tabular" style={{ fontWeight: 600 }}>
                    R {refund.toLocaleString()}
                  </span>
                </div>
              </div>
              <Button
                variant="accent"
                style={{ width: "100%", justifyContent: "center", marginTop: 16 }}
              >
                Approve & request payout
              </Button>
              <Button
                variant="ghost"
                size="sm"
                style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
              >
                Send to arbitration
              </Button>
              <div style={{ fontSize: 11, color: "var(--slate)", textAlign: "center", marginTop: 8 }}>
                Funds release within 7 days of mutual agreement.
              </div>
            </Card>

            <Card padding={16} style={{ background: "var(--surface-2)" }}>
              <div style={{ display: "flex", gap: 10 }}>
                <Icon
                  name="shield"
                  size={16}
                  style={{ color: "var(--accent)", flexShrink: 0, marginTop: 2 }}
                />
                <div style={{ fontSize: 12, color: "var(--slate)", lineHeight: 1.5 }}>
                  Held in trust per s.5(3) of the Rental Housing Act. Habitat arbitration is free and
                  binding within 30 days.
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
