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
import MonthlyCollectionChart, { type MonthBar } from "./MonthlyCollectionChart";
import StatementsTable, { type StatementRow } from "./StatementsTable";

const MONTH_BARS: MonthBar[] = [
  { label: "May", collected: 18 },
  { label: "Jun", collected: 19 },
  { label: "Jul", collected: 20 },
  { label: "Aug", collected: 21 },
  { label: "Sep", collected: 22 },
  { label: "Oct", collected: 22 },
  { label: "Nov", collected: 22 },
  { label: "Dec", collected: 22 },
  { label: "Jan", collected: 22 },
  { label: "Feb", collected: 22, expected: 20 },
  { label: "Mar", collected: 23 },
  { label: "Apr", collected: 23 },
];

const STATEMENT_ROWS: StatementRow[] = [
  { id: "s1", period: "Apr 2025", collected: 23000, fees: 184, payout: 22816, status: "Pending", settled: "Pays out 04 Apr" },
  { id: "s2", period: "Mar 2025", collected: 23000, fees: 184, payout: 22816, status: "Paid", settled: "04 Mar 2025" },
  { id: "s3", period: "Feb 2025", collected: 18600, fees: 149, payout: 18451, status: "Paid", settled: "04 Feb 2025" },
  { id: "s4", period: "Jan 2025", collected: 23000, fees: 184, payout: 22816, status: "Paid", settled: "04 Jan 2025" },
  { id: "s5", period: "Dec 2024", collected: 23000, fees: 184, payout: 22816, status: "Paid", settled: "04 Dec 2024" },
  { id: "s6", period: "Nov 2024", collected: 18600, fees: 149, payout: 18451, status: "Paid", settled: "04 Nov 2024" },
];

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
              <Button variant="ghost" size="sm" rightIcon="chevD">FY 2024/25</Button>
              <Button variant="secondary" leftIcon="download">Export for SARS</Button>
            </>
          }
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
          <KpiTile label="Year-to-date collected" value="R 254,800" subText="↑ 14.2% YoY" subTone="success" />
          <KpiTile label="Year-to-date payouts" value="R 252,761" subText="After R 2,039 in fees" />
          <KpiTile
            label="Outstanding rent"
            value="R 5,400"
            valueTone="warn"
            subText="1 tenant · 4 days late"
          />
          <KpiTile label="Avg payout time" value="T+3" subText="Settles 3 business days" />
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
          ) : (
            <StatementsTable rows={STATEMENT_ROWS} />
          )}
        </Card>
      </div>
    </Shell>
  );
}
