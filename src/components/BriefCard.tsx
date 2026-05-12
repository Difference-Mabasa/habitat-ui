import type { ReactNode } from "react";
import Card from "./Card";
import Badge, { type BadgeTone } from "./Badge";
import Avatar from "./Avatar";
import Icon from "./Icon";
import Eyebrow from "./Eyebrow";

export type BriefStatus = "OPEN" | "MATCHED" | "FILLED" | "EXPIRED" | "CANCELLED";

export interface BriefCardData {
  id: string;
  tenant: string;
  tenantInit?: string;
  budgetMin: number;
  budgetMax: number;
  /** e.g. ["Brixton", "Westdene", "Auckland Park"] */
  areas: string[];
  /** e.g. "by 1 Jun" or "ASAP" */
  moveIn: string;
  status: BriefStatus;
  /** Free-text tenant brief, kept short. */
  body: string;
  /** "12m" / "2h" / "Yesterday" relative-time string. */
  posted: string;
  /** Optional propose-count badge ("3 agents proposed"). */
  proposals?: number;
}

export interface BriefCardProps {
  brief: BriefCardData;
  /** Right-side action slot. */
  actions?: ReactNode;
  /** Optional click handler on the row container. */
  onClick?: () => void;
}

const STATUS_TONE: Record<BriefStatus, { tone: BadgeTone; label: string }> = {
  OPEN: { tone: "accent", label: "Open" },
  MATCHED: { tone: "success", label: "Matched" },
  FILLED: { tone: "neutral", label: "Filled" },
  EXPIRED: { tone: "neutral", label: "Expired" },
  CANCELLED: { tone: "neutral", label: "Cancelled" },
};

function formatRange(min: number, max: number) {
  const fmt = (n: number) => `R ${n.toLocaleString("en-ZA")}`;
  return `${fmt(min)} – ${fmt(max)}`;
}

export default function BriefCard({ brief, actions, onClick }: BriefCardProps) {
  const status = STATUS_TONE[brief.status];
  return (
    <Card
      padding={20}
      interactive={Boolean(onClick)}
      onClick={onClick}
      style={{ display: "flex", flexDirection: "column", gap: 14 }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Avatar name={brief.tenantInit ?? brief.tenant} size="md" tone="neutral" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{brief.tenant}</div>
            <Badge tone={status.tone}>{status.label}</Badge>
            {brief.proposals != null && brief.proposals > 0 ? (
              <Badge tone="neutral">{brief.proposals} proposed</Badge>
            ) : null}
          </div>
          <div style={{ fontSize: 11, color: "var(--slate)", marginTop: 2 }}>
            Posted {brief.posted} ago
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        <Field icon="cash" label="Budget">
          <span className="tabular">{formatRange(brief.budgetMin, brief.budgetMax)}</span>
        </Field>
        <Field icon="pin" label="Areas">
          {brief.areas.join(" · ")}
        </Field>
        <Field icon="calendar" label="Move-in">
          {brief.moveIn}
        </Field>
      </div>

      <p style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.55, margin: 0 }}>{brief.body}</p>

      {actions ? (
        <div
          style={{
            display: "flex",
            gap: 8,
            paddingTop: 12,
            borderTop: "1px solid var(--hairline)",
          }}
        >
          {actions}
        </div>
      ) : null}
    </Card>
  );
}

function Field({
  icon,
  label,
  children,
}: {
  icon: "cash" | "pin" | "calendar";
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <Eyebrow style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <Icon name={icon} size={12} /> {label}
      </Eyebrow>
      <div style={{ fontSize: 13, fontWeight: 500 }}>{children}</div>
    </div>
  );
}
