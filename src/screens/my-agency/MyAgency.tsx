import Nav from "@/components/Nav";
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

const AGENTS = [
  { name: "Naledi Mokoena", role: "Founder · Principal", init: "NM", listings: 14, verified: true },
  { name: "Thabo Khumalo", role: "Senior agent", init: "TK", listings: 8, verified: true },
  { name: "Aisha Mahlangu", role: "Agent · Soweto", init: "AM", listings: 5, verified: true },
  { name: "Pieter van der Berg", role: "Agent · Inner City", init: "PV", listings: 3, verified: false },
];

const AREAS = [
  "Soweto",
  "Diepkloof",
  "Orlando West",
  "Maboneng",
  "Westdene",
  "Auckland Park",
  "Brixton",
  "Yeoville",
];

export default function MyAgency() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="agent" />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 32px 64px" }}>
        <PageHeader
          eyebrow="My agency"
          title="Vilakazi Property Co."
          badges={<Badge tone="success" leftIcon="check">Verified</Badge>}
          subtitle="Public agency profile — tenants and landlords see this when searching for representation."
          actions={
            <>
              <Button variant="ghost" size="sm" leftIcon="eye">Preview public page</Button>
              <Button variant="accent" leftIcon="check">Publish changes</Button>
            </>
          }
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          <KpiTile label="Active mandates" value="24" />
          <KpiTile label="Agents on team" value="4" subText="3 verified" />
          <KpiTile label="Avg. response" value="1.4 h" valueTone="success" />
          <KpiTile label="Fees · YTD" value="R 184,200" subText="Across 32 placements" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 320px", gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card padding={24}>
              <Eyebrow style={{ marginBottom: 14 }}>Identity</Eyebrow>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <FormField label="Trading name" required>
                  <Input defaultValue="Vilakazi Property Co." />
                </FormField>
                <FormField label="PPRA registration" helper="Property Practitioners Regulatory Authority">
                  <Input defaultValue="FFC-022831" className="mono" />
                </FormField>
                <FormField label="Company registration">
                  <Input defaultValue="2018/418229/07" className="mono" />
                </FormField>
                <FormField label="VAT number">
                  <Input defaultValue="4880291184" className="mono" />
                </FormField>
              </div>
            </Card>

            <Card padding={24}>
              <Eyebrow style={{ marginBottom: 14 }}>Contact</Eyebrow>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <FormField label="Office phone">
                  <Input defaultValue="+27 11 482 8211" />
                </FormField>
                <FormField label="WhatsApp business">
                  <Input defaultValue="+27 82 184 4421" />
                </FormField>
                <FormField label="Email">
                  <Input defaultValue="hello@vilakazi.co.za" type="email" />
                </FormField>
                <FormField label="Website">
                  <Input defaultValue="vilakazi.co.za" />
                </FormField>
              </div>
            </Card>

            <Card padding={24}>
              <Eyebrow style={{ marginBottom: 14 }}>About</Eyebrow>
              <FormField label="Public bio" helper="Shown on your agency page — max 320 chars.">
                <Textarea
                  rows={4}
                  defaultValue="A Soweto-born agency placing tenants in verified backrooms, cottages, and family homes since 2018. 4 agents, fluent in Zulu, Sotho, and English. Trust account audited annually."
                />
              </FormField>
            </Card>

            <Card padding={24}>
              <Eyebrow style={{ marginBottom: 14 }}>Areas covered</Eyebrow>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {AREAS.map((a, i) => (
                  <Chip key={a} active={i < 5} leftIcon="pin">{a}</Chip>
                ))}
                <Chip leftIcon="plus">Add area</Chip>
              </div>
            </Card>

            <Card padding={0} style={{ overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--hairline)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Team</div>
                <Button variant="ghost" size="sm" leftIcon="plus">Invite agent</Button>
              </div>
              {AGENTS.map((a, i) => (
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
              ))}
            </Card>
          </div>

          <aside style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 24, alignSelf: "start" }}>
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
                }}
              >
                <div className="display" style={{ fontSize: 36 }}>VPC</div>
              </div>
              <Button variant="secondary" size="sm" leftIcon="upload" style={{ width: "100%", justifyContent: "center" }}>
                Replace logo
              </Button>
            </Card>

            <Card padding={20}>
              <Eyebrow style={{ marginBottom: 10 }}>Fee structure (default)</Eyebrow>
              <FormField label="Landlord — tenant find">
                <Input defaultValue="1 month rent" />
              </FormField>
              <FormField label="Landlord — full management" helper="Of monthly rent collected">
                <Input defaultValue="8%" />
              </FormField>
              <FormField label="Tenant — admin fee">
                <Input defaultValue="R 800 once-off" />
              </FormField>
            </Card>

            <Card padding={20} style={{ background: "var(--surface-2)", borderColor: "transparent" }}>
              <Eyebrow>Trust account</Eyebrow>
              <p style={{ fontSize: 13, margin: "8px 0 12px", lineHeight: 1.5 }}>
                FNB Trust · ••••8842 · Audited by Mazars (last: Mar 2026).
              </p>
              <Button variant="ghost" size="sm" rightIcon="chevR">Change bank</Button>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
