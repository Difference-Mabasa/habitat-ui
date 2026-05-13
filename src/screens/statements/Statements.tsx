import { useSearchParams } from "react-router-dom";
import LandlordShell from "@/components/LandlordShell";
import AgentShell from "@/components/AgentShell";
import { useWorkspace } from "@/lib/useWorkspace";
import Button from "@/components/Button";
import Card from "@/components/Card";
import KpiTile from "@/components/KpiTile";
import PageHeader from "@/components/PageHeader";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import MonthlyCollectionChart, { type MonthBar } from "./MonthlyCollectionChart";
import StatementsTable, { type StatementRow } from "./StatementsTable";

const MONTH_BARS: MonthBar[] = [];

const STATEMENT_ROWS: StatementRow[] = [];

export default function Statements() {
  const [params, setParams] = useSearchParams();
  const ws = useWorkspace();
  const Shell = ws === "agent" ? AgentShell : LandlordShell;
  const dataState = params.get("state") as "loading" | "error" | null;
  const clearDataState = () => {
    const next = new URLSearchParams(params);
    next.delete("state");
    setParams(next, { replace: true });
  };

  return (
    <Shell activeId="payments">
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "32px 32px 64px" }}>
        <PageHeader
          eyebrow="Money in, money out"
          title="Statements & payouts"
          actions={
            <>
              <Button variant="secondary" leftIcon="download">Export for SARS</Button>
            </>
          }
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
          <KpiTile label="Year-to-date collected" value="R 0" />
          <KpiTile label="Year-to-date payouts" value="R 0" />
          <KpiTile label="Outstanding rent" value="R 0" />
          <KpiTile label="Avg payout time" value="—" />
        </div>

        <Card padding={24} style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Monthly collection · last 12 months</div>
            <div style={{ display: "flex", gap: 16, fontSize: 11, color: "var(--slate)" }}>
              <span>
                <span
                  aria-hidden="true"
                  style={{
                    display: "inline-block",
                    width: 10,
                    height: 10,
                    background: "var(--accent)",
                    marginRight: 6,
                    borderRadius: 2,
                  }}
                />
                Collected
              </span>
              <span>
                <span
                  aria-hidden="true"
                  style={{
                    display: "inline-block",
                    width: 10,
                    height: 10,
                    background: "var(--surface-3)",
                    marginRight: 6,
                    borderRadius: 2,
                  }}
                />
                Expected
              </span>
            </div>
          </div>
          {dataState === "loading" ? (
            <LoadingState rows={4} variant="list" style={{ marginTop: 16 }} />
          ) : dataState === "error" ? (
            <ErrorState
              title="Couldn't load the chart"
              description="The collection history didn't come back. Retry or open a specific month from the table below."
              onRetry={clearDataState}
            />
          ) : MONTH_BARS.length === 0 ? (
            <EmptyState icon="trend" title="No collection history yet" />
          ) : (
            <MonthlyCollectionChart months={MONTH_BARS} max={25} />
          )}
        </Card>

        <Card padding={0} style={{ overflow: "hidden" }}>
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "1px solid var(--hairline)",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600 }}>Monthly statements</div>
            <Button variant="ghost" size="sm" leftIcon="filter">All properties</Button>
          </div>
          {dataState === "loading" ? (
            <LoadingState rows={5} variant="list" />
          ) : dataState === "error" ? (
            <ErrorState
              title="Couldn't load statements"
              description="The statements service didn't respond. Try again — your downloads are still available."
              onRetry={clearDataState}
            />
          ) : STATEMENT_ROWS.length === 0 ? (
            <EmptyState icon="paper" title="No statements yet" />
          ) : (
            <StatementsTable rows={STATEMENT_ROWS} />
          )}
        </Card>
      </div>
    </Shell>
  );
}
