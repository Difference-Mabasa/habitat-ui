import Nav from "@/components/Nav";
import Icon, { type IconName } from "@/components/Icon";
import Button from "@/components/Button";
import IconButton from "@/components/IconButton";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import Avatar from "@/components/Avatar";
import Photo from "@/components/Photo";
import KeyValueRow from "@/components/KeyValueRow";
import InlineLink from "@/components/InlineLink";
import ScoreBreakdown from "@/components/ScoreBreakdown";

const SCORE_ITEMS = [
  { label: "Affordability", value: 92, sub: "Income 4.1× rent" },
  { label: "Credit", value: 78, sub: "1 closed account" },
  { label: "Identity", value: 100, sub: "FICA + ID confirmed" },
  { label: "Rental history", value: 70, sub: "1 ref pending" },
];

const DOCUMENTS: { name: string; file: string; ok: boolean; note?: string }[] = [
  { name: "ID document", file: "id-sa.pdf", ok: true },
  { name: "Payslips · 3 months", file: "payslips-q1.pdf", ok: true },
  { name: "Bank statements · 3 months", file: "fnb-statements.pdf", ok: true },
  { name: "Reference · Previous landlord", file: "reference-form.pdf", ok: false, note: "Awaiting response" },
];

export default function ApplicantDetail() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="landlord" />

      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "24px 32px 64px" }}>
        <div style={{ marginBottom: 16 }}>
          <InlineLink
            to="/landlord-dashboard"
            icon="chevL"
            iconPosition="left"
            size="sm"
            tone="slate"
          >
            Applications · Studio · Melville
          </InlineLink>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 360px", gap: 32 }}>
          <main>
            {/* Applicant header */}
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
              <Avatar name="Sipho Dlamini" size="lg" />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.015em", margin: 0 }}>
                    Sipho Dlamini
                  </h1>
                  <Badge tone="success" leftIcon="check">
                    FICA verified
                  </Badge>
                  <Badge tone="accent">Score 84</Badge>
                </div>
                <div style={{ fontSize: 13, color: "var(--slate)", display: "flex", gap: 12 }}>
                  <span>34 yrs</span>
                  <span>·</span>
                  <span>Software engineer @ Discovery</span>
                  <span>·</span>
                  <span>Single, no pets</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Button variant="secondary" leftIcon="x">
                  Decline
                </Button>
                <Button variant="secondary" leftIcon="chat">
                  Message
                </Button>
                <Button variant="accent" leftIcon="check">
                  Approve to lease
                </Button>
              </div>
            </div>

            {/* Score breakdown */}
            <Card padding={24} style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{ fontSize: 16, fontWeight: 600 }}>Tenant score</div>
                <div className="tabular" style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.02em" }}>
                  84<span style={{ fontSize: 14, color: "var(--slate)", fontWeight: 400 }}>/100</span>
                </div>
              </div>
              <ScoreBreakdown items={SCORE_ITEMS} />
            </Card>

            {/* Affordability */}
            <Card padding={24} style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Affordability</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
                <AffordabilityMetric label="Net monthly income" value="R 22,400" />
                <AffordabilityMetric
                  label="Rent ratio"
                  value="24%"
                  sub="Within healthy range"
                  subTone="success"
                />
                <AffordabilityMetric label="3-month avg balance" value="R 8,200" />
              </div>
            </Card>

            {/* Documents */}
            <Card padding={24}>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Documents</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {DOCUMENTS.map((d) => (
                  <DocumentRow key={d.name} doc={d} />
                ))}
              </div>
            </Card>
          </main>

          {/* Right rail */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card padding={20}>
              <Eyebrow style={{ marginBottom: 12 }}>Applying for</Eyebrow>
              <Photo ratio="16/10" label="studio · melville.jpg" style={{ borderRadius: 8, marginBottom: 12 }} />
              <div style={{ fontSize: 14, fontWeight: 600 }}>Studio · Melville</div>
              <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 12 }}>
                32 m² · 1 bed · move 1 May
              </div>
              <KeyValueRow label="Rent" value="R 5,400" divider size="sm" />
            </Card>

            <Card padding={20}>
              <Eyebrow style={{ marginBottom: 12 }}>Cover note</Eyebrow>
              <p style={{ fontSize: 13, color: "var(--slate)", lineHeight: 1.6, margin: 0 }}>
                "Hi Thandi — I'm looking for a quiet spot near work. I've been at my current place 4 years,
                leaving because of relocation. Happy to do a video call if helpful."
              </p>
              <Button
                variant="secondary"
                size="sm"
                leftIcon="chat"
                style={{ width: "100%", marginTop: 16, justifyContent: "center" }}
              >
                Reply
              </Button>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}

function AffordabilityMetric({
  label,
  value,
  sub,
  subTone = "slate",
}: {
  label: string;
  value: string;
  sub?: string;
  subTone?: "slate" | "success" | "warn";
}) {
  const subColor =
    subTone === "success" ? "var(--success)" : subTone === "warn" ? "var(--warn)" : "var(--slate)";
  return (
    <div>
      <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 4 }}>{label}</div>
      <div className="tabular" style={{ fontSize: 22, fontWeight: 600 }}>
        {value}
      </div>
      {sub ? <div style={{ fontSize: 11, color: subColor }}>{sub}</div> : null}
    </div>
  );
}

function DocumentRow({ doc }: { doc: { name: string; file: string; ok: boolean; note?: string } }) {
  const icon: IconName = "doc";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 14px",
        border: "1px solid var(--hairline)",
        borderRadius: 8,
      }}
    >
      <Icon name={icon} size={16} style={{ color: "var(--slate)" }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{doc.name}</div>
        <div className="mono" style={{ fontSize: 11, color: "var(--slate)" }}>
          {doc.file}
          {doc.note ? ` · ${doc.note}` : ""}
        </div>
      </div>
      {doc.ok ? <Badge tone="success">Verified</Badge> : <Badge tone="warn">Pending</Badge>}
      <IconButton icon="eye" label="Preview" size="sm" />
      <IconButton icon="download" label="Download" size="sm" />
    </div>
  );
}
