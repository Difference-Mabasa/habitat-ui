import Nav from "@/components/Nav";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Photo from "@/components/Photo";
import Input from "@/components/Input";
import Select from "@/components/Select";

const SIMILAR = [
  { id: "s1", title: "Backroom · Orlando East", price: "R 3,200" },
  { id: "s2", title: "Cottage · Mofolo", price: "R 4,800" },
  { id: "s3", title: "Bachelor · Pimville", price: "R 3,950" },
];

export default function Waitlist() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 32px" }}>
        <Card padding={0} style={{ overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <Photo
            label="Backroom · Orlando"
            ratio="auto"
            style={{ minHeight: 420, borderRadius: 0 }}
          />
          <div style={{ padding: 40 }}>
            <Badge tone="neutral">Filled · waitlist open</Badge>
            <h1 className="display" style={{ fontSize: 44, margin: "14px 0 0" }}>
              BACKROOM ·
              <br />
              VILAKAZI ST
            </h1>
            <div style={{ fontSize: 14, color: "var(--slate)", marginTop: 8 }}>
              Orlando West · R 3,450/mo · 18m²
            </div>

            <p style={{ fontSize: 14, color: "var(--slate)", marginTop: 22, lineHeight: 1.6 }}>
              This spot was taken on 1 June. Join the waitlist — if the tenant moves out or doesn't
              renew, you'll be notified first.
            </p>

            <div
              style={{
                marginTop: 18,
                padding: 16,
                background: "var(--surface-2)",
                borderRadius: 10,
                display: "flex",
                gap: 14,
                alignItems: "center",
              }}
            >
              <div className="display" style={{ fontSize: 36, color: "var(--accent)", lineHeight: 1 }}>
                3rd
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>You'd be 3rd in line</div>
                <div style={{ fontSize: 12, color: "var(--slate)" }}>
                  17 people waitlisted · avg wait 5–9 months
                </div>
              </div>
            </div>

            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              <Input placeholder="Email" style={{ height: 48 }} />
              <Input placeholder="WhatsApp number" style={{ height: 48 }} />
              <Select
                defaultValue="any"
                style={{ height: 48 }}
                options={[
                  { value: "any", label: "Notify me anytime it's available" },
                  { value: "june", label: "Only if available before end of June" },
                  { value: "year", label: "Only if available before end of year" },
                ]}
              />
            </div>

            <Button
              variant="accent"
              style={{ width: "100%", height: 52, justifyContent: "center", marginTop: 14 }}
            >
              Join waitlist · free
            </Button>
            <div style={{ fontSize: 11, color: "var(--slate)", marginTop: 10, textAlign: "center" }}>
              We'll text & email you. No spam — you can drop out anytime.
            </div>
          </div>
        </Card>

        {/* Similar spots */}
        <div style={{ marginTop: 36 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 14,
            }}
          >
            <h3 className="display" style={{ fontSize: 26, margin: 0 }}>
              SIMILAR & AVAILABLE NOW
            </h3>
            <Button variant="ghost" size="sm" rightIcon="arrR">
              Browse Orlando
            </Button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {SIMILAR.map((s) => (
              <Card key={s.id} padding={0} style={{ overflow: "hidden" }}>
                <Photo label={s.title} ratio="16/10" style={{ borderRadius: 0 }} />
                <div style={{ padding: 14, display: "flex", justifyContent: "space-between" }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{s.title}</div>
                  <div className="mono" style={{ fontWeight: 600 }}>
                    {s.price}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
