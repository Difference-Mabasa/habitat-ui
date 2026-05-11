import Nav from "@/components/Nav";
import Photo from "@/components/Photo";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge, { type BadgeTone } from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import ApplicationStatusTimeline from "./ApplicationStatusTimeline";

interface ApplicationRow {
  id: string;
  property: string;
  landlord: string;
  rent: string;
  applied: string;
  stage: number;
  status: string;
  tone: BadgeTone;
}

const APPS: ApplicationRow[] = [
  { id: "a1", property: "Studio · Melville", landlord: "Thandi M.", rent: "R 5,400", applied: "12 Mar", stage: 3, status: "Lease ready", tone: "success" },
  { id: "a2", property: "Cottage · Norwood", landlord: "Pieter K.", rent: "R 6,200", applied: "10 Mar", stage: 2, status: "In review", tone: "accent" },
  { id: "a3", property: "Backroom · Yeoville", landlord: "Nomsa Z.", rent: "R 3,800", applied: "08 Mar", stage: 2, status: "Vetting", tone: "accent" },
  { id: "a4", property: "Flatlet · Auckland Park", landlord: "Ravi S.", rent: "R 4,950", applied: "02 Mar", stage: 1, status: "Submitted", tone: "neutral" },
  { id: "a5", property: "Studio · Brixton", landlord: "—", rent: "R 4,400", applied: "26 Feb", stage: 0, status: "Declined", tone: "warn" },
];

export default function MyApplications() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 32px 64px" }}>
        <Eyebrow>You</Eyebrow>
        <h1
          style={{
            fontSize: 30,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            margin: "8px 0 6px",
          }}
        >
          My applications
        </h1>
        <p style={{ fontSize: 14, color: "var(--slate)", margin: "0 0 32px" }}>
          5 active · landlords typically respond within 48 hours.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {APPS.map((a) => (
            <Card key={a.id} padding={0} style={{ overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "120px 1fr auto" }}>
                <Photo ratio="auto" label="" style={{ borderRadius: 0, height: "100%", minHeight: 140 }} />
                <div style={{ padding: 20 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 4 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{a.property}</h3>
                    <Badge tone={a.tone}>{a.status}</Badge>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--slate)",
                      display: "flex",
                      gap: 12,
                      marginBottom: 16,
                    }}
                  >
                    <span>Landlord: {a.landlord}</span>
                    <span>·</span>
                    <span className="tabular">{a.rent}/mo</span>
                    <span>·</span>
                    <span>Applied {a.applied}</span>
                  </div>
                  <ApplicationStatusTimeline stage={a.stage} declined={a.tone === "warn"} />
                </div>
                <div
                  style={{
                    padding: 20,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    justifyContent: "center",
                    borderLeft: "1px solid var(--hairline)",
                  }}
                >
                  {a.tone === "success" ? (
                    <Button variant="accent" size="sm" rightIcon="chevR">
                      Sign lease
                    </Button>
                  ) : a.tone === "warn" ? (
                    <Button variant="ghost" size="sm">
                      View reason
                    </Button>
                  ) : (
                    <Button variant="secondary" size="sm">
                      View status
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" leftIcon="chat">
                    Message
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
