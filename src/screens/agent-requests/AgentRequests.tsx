import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AgentShell from "@/components/AgentShell";
import Button from "@/components/Button";
import { toast } from "@/lib/toast";
import KpiTile from "@/components/KpiTile";
import Tabs from "@/components/Tabs";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import BriefCard, { type BriefCardData } from "@/components/BriefCard";

type RequestState = "incoming" | "proposed" | "accepted" | "declined";

interface AgentRequest {
  brief: BriefCardData;
  state: RequestState;
  proposedUnit?: string;
  noteFromTenant?: string;
}

const REQUESTS: AgentRequest[] = [
  {
    brief: {
      id: "r1",
      tenant: "Sipho Dlamini",
      tenantInit: "SD",
      budgetMin: 3000,
      budgetMax: 4200,
      areas: ["Orlando West", "Diepkloof"],
      moveIn: "by 1 Jun",
      status: "OPEN",
      body: "Working professional. Need a backroom with own entrance and prepaid electricity.",
      posted: "18m",
    },
    state: "incoming",
    noteFromTenant: "Hi Naledi — saw your Vilakazi listings. Would love to view this weekend if you have something matching.",
  },
  {
    brief: {
      id: "r2",
      tenant: "Naledi Khumalo",
      tenantInit: "NK",
      budgetMin: 5500,
      budgetMax: 7500,
      areas: ["Westdene", "Auckland Park"],
      moveIn: "ASAP",
      status: "OPEN",
      body: "Postgrad student. Garden cottage or 1-bed flat, parking, Wi-Fi-ready.",
      posted: "2h",
    },
    state: "proposed",
    proposedUnit: "Garden Cottage · Westdene",
  },
  {
    brief: {
      id: "r3",
      tenant: "Lerato Pretorius",
      tenantInit: "LP",
      budgetMin: 4000,
      budgetMax: 5800,
      areas: ["Yeoville", "Bellevue"],
      moveIn: "by 15 Jun",
      status: "MATCHED",
      body: "1-bed with secure parking. Pet-friendly (small dog).",
      posted: "Yesterday",
    },
    state: "accepted",
    proposedUnit: "1-Bed · Bellevue East",
  },
  {
    brief: {
      id: "r4",
      tenant: "Mxolisi Ndlovu",
      tenantInit: "MN",
      budgetMin: 2800,
      budgetMax: 3500,
      areas: ["Pimville"],
      moveIn: "by 1 Jul",
      status: "OPEN",
      body: "Backroom in Pimville, prepaid electricity essential.",
      posted: "3d",
    },
    state: "declined",
  },
];

const FILTERS: { id: RequestState | "all"; label: string; count: number }[] = [
  { id: "all", label: "All", count: 4 },
  { id: "incoming", label: "Incoming", count: 1 },
  { id: "proposed", label: "Proposed", count: 1 },
  { id: "accepted", label: "Accepted", count: 1 },
  { id: "declined", label: "Declined", count: 1 },
];

export default function AgentRequests() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<RequestState | "all">("all");
  const rows = filter === "all" ? REQUESTS : REQUESTS.filter((r) => r.state === filter);

  const propose = (r: AgentRequest) =>
    navigate(`/portfolio?propose=${r.brief.id}`);
  const messageTenant = (r: AgentRequest) =>
    navigate(`/inbox?id=dm-${r.brief.id}`);
  const decline = (r: AgentRequest) =>
    toast.warn(`Declined brief from ${r.brief.tenant}.`);
  const withdraw = (r: AgentRequest) =>
    toast.warn(`Proposal withdrawn — ${r.proposedUnit ?? "unit"}.`);

  return (
    <AgentShell activeId="agent-requests">
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 32px 64px" }}>
        <PageHeader
          eyebrow="Inbox · Marketplace"
          title="Tenant requests for you"
          subtitle="Briefs where you've been tagged or have proposed a match. Move quickly — fastest agent usually wins."
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          <KpiTile label="Incoming" value="1" valueTone="accent" subText="needs reply" />
          <KpiTile label="Awaiting tenant" value="1" subText="proposed Tue 10:30" />
          <KpiTile label="Accepted" value="1" valueTone="success" subText="this week" />
          <KpiTile label="Win rate" value="36%" subText="↑ 4 pts vs last 30 days" subTone="success" />
        </div>

        <div style={{ marginBottom: 16 }}>
          <Tabs
            tabs={FILTERS.map((f) => ({ id: f.id, label: f.label, count: f.count }))}
            value={filter}
            onChange={(id) => setFilter(id as RequestState | "all")}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {rows.map((r) => (
            <div key={r.brief.id}>
              <BriefCard
                brief={r.brief}
                actions={
                  r.state === "incoming" ? (
                    <>
                      <Button variant="accent" size="sm" leftIcon="check" onClick={() => propose(r)}>
                        Propose unit
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => messageTenant(r)}>
                        Message tenant
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => decline(r)}>
                        Decline
                      </Button>
                    </>
                  ) : r.state === "proposed" ? (
                    <>
                      <span style={{ fontSize: 13, color: "var(--slate)", marginRight: "auto" }}>
                        Proposed <strong style={{ color: "var(--ink)" }}>{r.proposedUnit}</strong> — tenant has 48h to reply.
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => withdraw(r)}>
                        Withdraw
                      </Button>
                    </>
                  ) : r.state === "accepted" ? (
                    <>
                      <span style={{ fontSize: 13, color: "var(--success)", marginRight: "auto", fontWeight: 600 }}>
                        Accepted — {r.proposedUnit}
                      </span>
                      <Button
                        variant="accent"
                        size="sm"
                        rightIcon="chevR"
                        onClick={() => messageTenant(r)}
                      >
                        Open conversation
                      </Button>
                    </>
                  ) : (
                    <span style={{ fontSize: 13, color: "var(--slate)" }}>
                      Declined — out of your active areas.
                    </span>
                  )
                }
              />
              {r.state === "incoming" && r.noteFromTenant ? (
                <Card padding={14} style={{ marginTop: 8, background: "var(--surface-2)" }}>
                  <Eyebrow style={{ marginBottom: 6 }}>Tenant note</Eyebrow>
                  <p style={{ fontSize: 13, margin: 0, lineHeight: 1.55 }}>{r.noteFromTenant}</p>
                </Card>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </AgentShell>
  );
}
