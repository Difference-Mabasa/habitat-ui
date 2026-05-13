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
import EmptyState from "@/components/EmptyState";
import BriefCard, { type BriefCardData } from "@/components/BriefCard";

type RequestState = "incoming" | "proposed" | "accepted" | "declined";

interface AgentRequest {
  brief: BriefCardData;
  state: RequestState;
  proposedUnit?: string;
  noteFromTenant?: string;
}

const REQUESTS: AgentRequest[] = [];

const FILTERS: { id: RequestState | "all"; label: string; count: number }[] = [
  { id: "all", label: "All", count: 0 },
  { id: "incoming", label: "Incoming", count: 0 },
  { id: "proposed", label: "Proposed", count: 0 },
  { id: "accepted", label: "Accepted", count: 0 },
  { id: "declined", label: "Declined", count: 0 },
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
          <KpiTile label="Incoming" value="0" subText="needs reply" />
          <KpiTile label="Awaiting tenant" value="0" subText="—" />
          <KpiTile label="Accepted" value="0" subText="this week" />
          <KpiTile label="Win rate" value="—" subText="—" />
        </div>

        <div style={{ marginBottom: 16 }}>
          <Tabs
            tabs={FILTERS.map((f) => ({ id: f.id, label: f.label, count: f.count }))}
            value={filter}
            onChange={(id) => setFilter(id as RequestState | "all")}
          />
        </div>

        {rows.length === 0 ? (
          <EmptyState
            icon="chat"
            title="No requests yet"
            description="Tenant briefs you propose on or get tagged in will show up here."
          />
        ) : (
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
        )}
      </div>
    </AgentShell>
  );
}
