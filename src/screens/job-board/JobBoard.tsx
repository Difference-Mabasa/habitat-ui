import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AgentShell from "@/components/AgentShell";
import Button from "@/components/Button";
import { toast } from "@/lib/toast";
import KpiTile from "@/components/KpiTile";
import Tabs from "@/components/Tabs";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import BriefCard, { type BriefCardData, type BriefStatus } from "@/components/BriefCard";

const BRIEFS: BriefCardData[] = [];

const FILTERS: { id: BriefStatus | "all"; label: string; count: number }[] = [
  { id: "all", label: "All", count: 0 },
  { id: "OPEN", label: "Open", count: 0 },
  { id: "MATCHED", label: "Matched", count: 0 },
  { id: "FILLED", label: "Filled", count: 0 },
  { id: "EXPIRED", label: "Expired", count: 0 },
];

export default function JobBoard() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<BriefStatus | "all">("OPEN");
  const rows = filter === "all" ? BRIEFS : BRIEFS.filter((b) => b.status === filter);

  const propose = (b: BriefCardData) => {
    toast.success(`Proposal sent to ${b.tenant} — tracking in /agent-requests.`);
    navigate("/agent-requests?filter=proposed");
  };
  const message = (b: BriefCardData) => navigate(`/inbox?id=dm-${b.id}`);

  return (
    <AgentShell activeId="job-board">
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "32px 32px 64px" }}>
        <PageHeader
          eyebrow="Marketplace"
          title="Tenant briefs"
          subtitle="Live job board of tenants looking for a spot. Propose a match from your mandated listings — fastest agent wins the brief."
          actions={
            <>
              <Button variant="ghost" size="sm" leftIcon="filter">Areas & budget</Button>
              <Button variant="accent" leftIcon="plus">Saved searches</Button>
            </>
          }
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          <KpiTile label="Open briefs" value="0" subText="in your areas" />
          <KpiTile label="You proposed" value="0" subText="awaiting review" />
          <KpiTile label="Matches won · YTD" value="0" subText="R 0 fees" />
          <KpiTile label="Avg. response" value="—" subText="—" />
        </div>

        <div style={{ marginBottom: 16 }}>
          <Tabs
            tabs={FILTERS.map((f) => ({ id: f.id, label: f.label, count: f.count }))}
            value={filter}
            onChange={(id) => setFilter(id as BriefStatus | "all")}
          />
        </div>

        {rows.length === 0 ? (
          <EmptyState
            icon="search"
            title="No briefs match this filter"
            description="Try another status, or broaden the areas in your saved searches."
            actions={<Button variant="accent">Edit saved searches</Button>}
          />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {rows.map((b) => (
              <BriefCard
                key={b.id}
                brief={b}
                actions={
                  b.status === "OPEN" ? (
                    <>
                      <Button variant="accent" size="sm" leftIcon="check" onClick={() => propose(b)}>
                        Propose a match
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => message(b)}>
                        Message tenant
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      rightIcon="chevR"
                      onClick={() => navigate("/agent-requests")}
                    >
                      View brief
                    </Button>
                  )
                }
              />
            ))}
          </div>
        )}
      </div>
    </AgentShell>
  );
}
