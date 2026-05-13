import Nav from "@/components/Nav";
import Icon, { type IconName } from "@/components/Icon";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import EmptyState from "@/components/EmptyState";

interface Role {
  id: string;
  team: string;
  title: string;
  location: string;
  type: string;
}

const ROLES: Role[] = [];

const VALUES: { icon: IconName; title: string; body: string }[] = [
  { icon: "bolt", title: "Move with urgency", body: "Tenants need homes today. We ship daily, not yearly." },
  { icon: "users", title: "Defaults to trust", body: "We assume good intent — from teammates, tenants, and landlords." },
  { icon: "shield", title: "Get it right", body: "Renting is real money. We test obsessively before shipping." },
];

const BENEFITS: [string, string][] = [
  ["Salary", "Top-of-market for SA tech, banded transparently"],
  ["Equity", "Every full-time hire gets meaningful ISO grant"],
  ["Remote-friendly", "Quarterly team weeks in CT or JHB"],
  ["Health", "Full Discovery Health for you + dependants"],
  ["Learning", "R 24,000/year on books, conferences, courses"],
  ["Parental", "20 weeks fully paid · all parents"],
];

export default function Careers() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />

      <div style={{ padding: "64px 32px 32px", maxWidth: 1100, margin: "0 auto" }}>
        <Eyebrow>{ROLES.length === 0 ? "Careers" : `${ROLES.length} open roles`}</Eyebrow>
        <h1 className="display" style={{ fontSize: 120, lineHeight: 0.92, margin: "16px 0 24px" }}>
          BUILD WITH
          <br />
          HABITAT.
        </h1>
        <p style={{ fontSize: 17, color: "var(--slate)", maxWidth: 580, lineHeight: 1.5 }}>
          One mission: fix renting for the South Africans nobody else is building for.
        </p>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 48 }}>
          {VALUES.map((v) => (
            <Card key={v.title} padding={22}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "var(--accent-soft)",
                  color: "var(--accent)",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Icon name={v.icon} size={20} />
              </div>
              <div style={{ fontWeight: 600, marginTop: 14, fontSize: 16 }}>{v.title}</div>
              <p style={{ fontSize: 13, color: "var(--slate)", margin: "6px 0 0", lineHeight: 1.5 }}>
                {v.body}
              </p>
            </Card>
          ))}
        </div>

        <h2 className="display" style={{ fontSize: 36, marginBottom: 18 }}>
          OPEN ROLES
        </h2>
        <Card padding={0} style={{ overflow: "hidden", marginBottom: 48 }}>
          {ROLES.length === 0 ? (
            <EmptyState
              icon="users"
              title="No open roles right now"
              description="Check back soon — we add new positions regularly."
            />
          ) : (
            ROLES.map((r, i) => (
              <div
                key={r.id}
                style={{
                  padding: "18px 24px",
                  display: "grid",
                  gridTemplateColumns: "120px 1fr 1fr 100px 80px",
                  gap: 14,
                  alignItems: "center",
                  borderTop: i ? "1px solid var(--hairline)" : "none",
                  cursor: "pointer",
                }}
              >
                <Badge tone="neutral">{r.team}</Badge>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{r.title}</div>
                <div style={{ fontSize: 13, color: "var(--slate)" }}>{r.location}</div>
                <div className="mono" style={{ fontSize: 12, color: "var(--slate)" }}>
                  {r.type}
                </div>
                <Button variant="ghost" size="sm" rightIcon="arrR" style={{ justifySelf: "end" }}>
                  Apply
                </Button>
              </div>
            ))
          )}
        </Card>

        <Card padding={36} style={{ background: "var(--ink)", color: "var(--paper)" }}>
          <h3 className="display" style={{ fontSize: 32, color: "var(--paper)", marginBottom: 18 }}>
            WHAT WE OFFER
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
              fontSize: 13,
            }}
          >
            {BENEFITS.map(([k, v]) => (
              <div key={k}>
                <div style={{ fontWeight: 600, color: "var(--accent)" }}>{k}</div>
                <div style={{ color: "rgba(247,239,226,0.7)", marginTop: 4, lineHeight: 1.5 }}>
                  {v}
                </div>
              </div>
            ))}
          </div>
        </Card>
        <div style={{ height: 64 }} />
      </div>
    </div>
  );
}
