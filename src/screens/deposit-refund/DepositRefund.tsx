import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LandlordShell from "@/components/LandlordShell";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import Icon from "@/components/Icon";
import FormField from "@/components/FormField";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import PageHeader from "@/components/PageHeader";
import Alert from "@/components/Alert";
import KeyValueRow from "@/components/KeyValueRow";
import Avatar from "@/components/Avatar";
import { toast } from "@/lib/toast";

interface Deduction {
  id: string;
  reason: string;
  amount: string;
  evidence: string;
}

const DEPOSIT_HELD = 0;

const PRESET_DEDUCTIONS: Omit<Deduction, "id">[] = [];

interface TenantFlag {
  room: string;
  note: string;
  photo: string;
}

const TENANT_FLAGS: TenantFlag[] = [];

export default function DepositRefund() {
  const navigate = useNavigate();
  const [deductions, setDeductions] = useState<Deduction[]>(
    PRESET_DEDUCTIONS.map((d, i) => ({ ...d, id: `d${i + 1}` })),
  );
  const [outcome, setOutcome] = useState<"full" | "partial" | "withhold">("partial");
  const [notes, setNotes] = useState("");

  const totalDeductions = useMemo(
    () => deductions.reduce((sum, d) => sum + (Number(d.amount.replace(/[^\d.]/g, "")) || 0), 0),
    [deductions],
  );

  const refund =
    outcome === "full" ? DEPOSIT_HELD : outcome === "withhold" ? 0 : Math.max(0, DEPOSIT_HELD - totalDeductions);

  const addDeduction = () =>
    setDeductions((prev) => [
      ...prev,
      { id: `d${prev.length + 1}`, reason: "", amount: "", evidence: "" },
    ]);

  const updateDeduction = (id: string, patch: Partial<Deduction>) =>
    setDeductions((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));

  const removeDeduction = (id: string) =>
    setDeductions((prev) => prev.filter((d) => d.id !== id));

  const submit = () => {
    if (outcome === "withhold" && !notes.trim()) {
      toast.warn("Add a reason when withholding the full deposit.");
      return;
    }
    toast.success(
      outcome === "full"
        ? "Full deposit refund issued to the tenant."
        : outcome === "withhold"
          ? "Deposit withheld. Tenant has 7 days to contest."
          : `R ${refund.toLocaleString("en-ZA")} refunded · R ${totalDeductions.toLocaleString("en-ZA")} deducted.`,
    );
    navigate("/landlord-properties");
  };

  return (
    <LandlordShell activeId="properties">
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 32px 64px" }}>
        <PageHeader
          eyebrow="Lease end · Deposit refund"
          title="Decide the deposit refund"
          subtitle="Held in Habitat's trust account. Habitat releases your portion to the tenant once you submit — they have 7 days to contest line items."
          badges={
            <>
              <Badge tone="warn">Decision needed</Badge>
              <Badge tone="neutral">RHA s.5(3)(g) · 14-day rule</Badge>
            </>
          }
        />

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 340px", gap: 24 }}>
          <main style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card padding={20}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <Avatar name="Tenant" size="lg" tone="neutral" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>—</div>
                  <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 2 }}>
                    Tenant and lease details load from the closed lease.
                  </div>
                </div>
              </div>
            </Card>

            <Card padding={20}>
              <Eyebrow style={{ marginBottom: 12 }}>Tenant's move-out inspection</Eyebrow>
              {TENANT_FLAGS.length === 0 ? (
                <div style={{ fontSize: 12, color: "var(--slate)", padding: "10px 0" }}>
                  No inspection items flagged yet.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {TENANT_FLAGS.map((f) => (
                    <div
                      key={f.room}
                      style={{
                        display: "flex",
                        gap: 12,
                        padding: 12,
                        border: "1px solid var(--hairline)",
                        borderRadius: 8,
                        alignItems: "center",
                      }}
                    >
                      <Icon name="info" size={14} style={{ color: "var(--warn)", flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{f.room}</div>
                        <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 2 }}>{f.note}</div>
                      </div>
                      <span className="mono" style={{ fontSize: 11, color: "var(--slate-2)" }}>
                        {f.photo}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card padding={20}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <Eyebrow>Your decision</Eyebrow>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <OutcomeOption
                  value="full"
                  current={outcome}
                  title="Refund in full"
                  body={`Return R ${DEPOSIT_HELD.toLocaleString("en-ZA")} to Sipho. No deductions.`}
                  onPick={() => setOutcome("full")}
                />
                <OutcomeOption
                  value="partial"
                  current={outcome}
                  title="Refund with deductions"
                  body="Itemise the deductions below — each requires a reason and (recommended) evidence."
                  onPick={() => setOutcome("partial")}
                />
                <OutcomeOption
                  value="withhold"
                  current={outcome}
                  title="Withhold the full deposit"
                  body="Used in rare cases of major damage or arrears. Tenant has 7 days to contest."
                  onPick={() => setOutcome("withhold")}
                  tone="danger"
                />
              </div>
            </Card>

            {outcome === "partial" ? (
              <Card padding={20}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <Eyebrow>Deductions · {deductions.length}</Eyebrow>
                  <Button variant="ghost" size="sm" leftIcon="plus" onClick={addDeduction}>
                    Add line
                  </Button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {deductions.map((d) => (
                    <div
                      key={d.id}
                      style={{
                        padding: 14,
                        border: "1px solid var(--hairline)",
                        borderRadius: 8,
                        display: "grid",
                        gridTemplateColumns: "minmax(0, 2fr) 120px minmax(0, 1.4fr) auto",
                        gap: 10,
                        alignItems: "center",
                      }}
                    >
                      <FormField label="Reason">
                        <Input
                          value={d.reason}
                          onChange={(e) => updateDeduction(d.id, { reason: e.target.value })}
                          placeholder="e.g. Wall repair"
                        />
                      </FormField>
                      <FormField label="Amount (R)">
                        <Input
                          className="mono"
                          value={d.amount}
                          onChange={(e) => updateDeduction(d.id, { amount: e.target.value })}
                          placeholder="0"
                        />
                      </FormField>
                      <FormField label="Evidence">
                        <Input
                          value={d.evidence}
                          onChange={(e) => updateDeduction(d.id, { evidence: e.target.value })}
                          placeholder="Photo 04 · contractor quote"
                        />
                      </FormField>
                      <button
                        type="button"
                        aria-label="Remove deduction"
                        onClick={() => removeDeduction(d.id)}
                        style={{
                          background: "none",
                          border: "none",
                          padding: 6,
                          cursor: "pointer",
                          color: "var(--slate)",
                        }}
                      >
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            ) : null}

            <Card padding={20}>
              <Eyebrow style={{ marginBottom: 12 }}>Note to tenant</Eyebrow>
              <Textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  outcome === "withhold"
                    ? "Required when withholding — explain why and reference the inspection photos."
                    : "Optional. Will be sent with the refund notification."
                }
              />
            </Card>
          </main>

          <aside style={{ position: "sticky", top: 88, alignSelf: "start" }}>
            <Card padding={20}>
              <Eyebrow style={{ marginBottom: 10 }}>Refund summary</Eyebrow>
              <KeyValueRow label="Deposit held" value={`R ${DEPOSIT_HELD.toLocaleString("en-ZA")}`} divider />
              <KeyValueRow
                label="Deductions"
                value={
                  outcome === "partial"
                    ? `R ${totalDeductions.toLocaleString("en-ZA")}`
                    : outcome === "withhold"
                      ? `R ${DEPOSIT_HELD.toLocaleString("en-ZA")}`
                      : "—"
                }
                tone={outcome === "full" ? "neutral" : "warn"}
                divider
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: 12,
                  marginTop: 12,
                  borderTop: "1px solid var(--hairline)",
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                <span>Refund to tenant</span>
                <span className="tabular">R {refund.toLocaleString("en-ZA")}</span>
              </div>

              <Button
                variant="accent"
                leftIcon="check"
                onClick={submit}
                style={{ width: "100%", justifyContent: "center", marginTop: 18 }}
              >
                {outcome === "withhold" ? "Withhold deposit" : `Refund R ${refund.toLocaleString("en-ZA")}`}
              </Button>
              <div style={{ marginTop: 12 }}>
                <Alert tone="info" title="Tenant can contest">
                  Habitat holds the deduction amount in trust for 7 days. If the tenant doesn't contest,
                  it's released to your payout account.
                </Alert>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </LandlordShell>
  );
}

function OutcomeOption({
  value,
  current,
  title,
  body,
  onPick,
  tone,
}: {
  value: "full" | "partial" | "withhold";
  current: "full" | "partial" | "withhold";
  title: string;
  body: string;
  onPick: () => void;
  tone?: "danger";
}) {
  const active = value === current;
  return (
    <button
      type="button"
      onClick={onPick}
      style={{
        textAlign: "left",
        padding: 14,
        border: `1.5px solid ${active ? (tone === "danger" ? "var(--danger)" : "var(--accent)") : "var(--hairline-strong)"}`,
        background: active
          ? tone === "danger"
            ? "var(--danger-soft)"
            : "color-mix(in oklch, var(--accent) 6%, var(--surface))"
          : "var(--surface)",
        borderRadius: 10,
        cursor: "pointer",
        fontFamily: "inherit",
        color: "var(--ink)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            border: `2px solid ${active ? (tone === "danger" ? "var(--danger)" : "var(--accent)") : "var(--hairline-strong)"}`,
            background: active ? (tone === "danger" ? "var(--danger)" : "var(--accent)") : "transparent",
            flexShrink: 0,
          }}
        />
        <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
      </div>
      <div style={{ fontSize: 12, color: "var(--slate)", marginLeft: 26, lineHeight: 1.5 }}>{body}</div>
    </button>
  );
}
