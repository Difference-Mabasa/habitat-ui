import AgentShell from "@/components/AgentShell";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Badge from "@/components/Badge";
import Avatar from "@/components/Avatar";
import Chip from "@/components/Chip";
import FormField from "@/components/FormField";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import PageHeader from "@/components/PageHeader";
import KpiTile from "@/components/KpiTile";
import EmptyState from "@/components/EmptyState";

interface AgencyAgent {
  name: string;
  role: string;
  init: string;
  listings: number;
  verified: boolean;
}

const AGENTS: AgencyAgent[] = [];

const AREAS: string[] = [];

export default function MyAgency() {
  return (
    <AgentShell activeId="agency">
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 32px 64px" }}>
        <PageHeader
          eyebrow="My agency"
          title="Your agency"
          subtitle="Public agency profile — tenants and landlords see this when searching for representation."
          actions={
            <>
              <Button variant="ghost" size="sm" leftIcon="eye">Preview public page</Button>
              <Button variant="accent" leftIcon="check">Publish changes</Button>
            </>
          }
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          <KpiTile label="Active mandates" value="0" />
          <KpiTile label="Agents on team" value="0" subText="—" />
          <KpiTile label="Avg. response" value="—" />
          <KpiTile label="Fees · YTD" value="R 0" subText="—" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 320px", gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card padding={24}>
              <Eyebrow style={{ marginBottom: 14 }}>Identity</Eyebrow>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <FormField label="Trading name" required>
                  <Input defaultValue="" placeholder="Your agency name" />
                </FormField>
                <FormField label="PPRA registration" helper="Property Practitioners Regulatory Authority">
                  <Input defaultValue="" placeholder="FFC-xxxxxx" className="mono" />
                </FormField>
                <FormField label="Company registration">
                  <Input defaultValue="" placeholder="YYYY/NNNNNN/NN" className="mono" />
                </FormField>
                <FormField label="VAT number">
                  <Input defaultValue="" placeholder="VAT no." className="mono" />
                </FormField>
              </div>
            </Card>

            <Card padding={24}>
              <Eyebrow style={{ marginBottom: 14 }}>Contact</Eyebrow>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <FormField label="Office phone">
                  <Input defaultValue="" placeholder="+27 ..." />
                </FormField>
                <FormField label="WhatsApp business">
                  <Input defaultValue="" placeholder="+27 ..." />
                </FormField>
                <FormField label="Email">
                  <Input defaultValue="" placeholder="you@example.co.za" type="email" />
                </FormField>
                <FormField label="Website">
                  <Input defaultValue="" placeholder="example.co.za" />
                </FormField>
              </div>
            </Card>

            <Card padding={24}>
              <Eyebrow style={{ marginBottom: 14 }}>About</Eyebrow>
              <FormField label="Public bio" helper="Shown on your agency page — max 320 chars.">
                <Textarea
                  rows={4}
                  defaultValue=""
                  placeholder="Tell tenants and landlords about your agency."
                />
              </FormField>
            </Card>

            <Card padding={24}>
              <Eyebrow style={{ marginBottom: 14 }}>Areas covered</Eyebrow>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {AREAS.map((a) => (
                  <Chip key={a} leftIcon="pin">{a}</Chip>
                ))}
                <Chip leftIcon="plus">Add area</Chip>
              </div>
            </Card>

            <Card padding={0} style={{ overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--hairline)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Team</div>
                <Button variant="ghost" size="sm" leftIcon="plus">Invite agent</Button>
              </div>
              {AGENTS.length === 0 ? (
                <EmptyState
                  icon="users"
                  title="No agents yet"
                  description="Invite your first agent to start managing properties together."
                />
              ) : (
                AGENTS.map((a, i) => (
                  <div
                    key={a.name}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto 1fr auto auto auto",
                      alignItems: "center",
                      gap: 16,
                      padding: "14px 20px",
                      borderTop: i > 0 ? "1px solid var(--hairline)" : undefined,
                    }}
                  >
                    <Avatar name={a.init} size="md" tone="neutral" />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{a.name}</div>
                      <div style={{ fontSize: 12, color: "var(--slate)" }}>{a.role}</div>
                    </div>
                    <div className="tabular" style={{ fontSize: 13, color: "var(--slate)" }}>
                      {a.listings} listings
                    </div>
                    {a.verified ? (
                      <Badge tone="success" leftIcon="check">Verified</Badge>
                    ) : (
                      <Badge tone="warn">Verification pending</Badge>
                    )}
                    <Button variant="ghost" size="sm" rightIcon="chevR">Manage</Button>
                  </div>
                ))
              )}
            </Card>
          </div>

          <aside style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 88, alignSelf: "start" }}>
            <Card padding={20}>
              <Eyebrow style={{ marginBottom: 10 }}>Logo</Eyebrow>
              <div
                style={{
                  height: 140,
                  background: "var(--surface-2)",
                  borderRadius: 8,
                  border: "1px dashed var(--hairline-strong)",
                  display: "grid",
                  placeItems: "center",
                  marginBottom: 12,
                  color: "var(--slate)",
                  fontSize: 12,
                }}
              >
                No logo uploaded
              </div>
              <Button variant="secondary" size="sm" leftIcon="upload" style={{ width: "100%", justifyContent: "center" }}>
                Upload logo
              </Button>
            </Card>

            <Card padding={20}>
              <Eyebrow style={{ marginBottom: 10 }}>Fee structure (default)</Eyebrow>
              <FormField label="Landlord — tenant find">
                <Input defaultValue="" placeholder="e.g. 1 month rent" />
              </FormField>
              <FormField label="Landlord — full management" helper="Of monthly rent collected">
                <Input defaultValue="" placeholder="e.g. 8%" />
              </FormField>
              <FormField label="Tenant — admin fee">
                <Input defaultValue="" placeholder="e.g. R 0 once-off" />
              </FormField>
            </Card>

            <Card padding={20} style={{ background: "var(--surface-2)", borderColor: "transparent" }}>
              <Eyebrow>Trust account</Eyebrow>
              <p style={{ fontSize: 13, margin: "8px 0 12px", lineHeight: 1.5, color: "var(--slate)" }}>
                No trust account on file yet.
              </p>
              <Button variant="ghost" size="sm" rightIcon="chevR">Add bank</Button>
            </Card>
          </aside>
        </div>
      </div>
    </AgentShell>
  );
}
