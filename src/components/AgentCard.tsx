import type { ReactNode } from "react";
import Avatar from "./Avatar";
import Icon from "./Icon";

export interface AgentCardProps {
  name: string;
  role: string;
  avatarSrc?: string;
  /** Compact "responds in ~2 hrs" style sub-line. */
  responseTime?: string;
  rating?: number;
  reviewCount?: number;
  actions?: ReactNode;
  /** Stacked layout (full card) vs inline (sticky panel footer). */
  variant?: "inline" | "stacked";
}

export default function AgentCard({
  name,
  role,
  avatarSrc,
  responseTime,
  rating,
  reviewCount,
  actions,
  variant = "inline",
}: AgentCardProps) {
  if (variant === "inline") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Avatar name={name} src={avatarSrc} size="md" tone="neutral" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{name}</div>
          <div style={{ fontSize: 11, color: "var(--slate)" }}>
            {role}
            {responseTime ? ` · ${responseTime}` : ""}
          </div>
        </div>
        {actions}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Avatar name={name} src={avatarSrc} size="lg" tone="neutral" />
        <div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{name}</div>
          <div style={{ fontSize: 12, color: "var(--slate)" }}>
            {role}
            {responseTime ? ` · ${responseTime}` : ""}
          </div>
          {rating != null ? (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                marginTop: 4,
                fontSize: 12,
                color: "var(--slate)",
              }}
            >
              <Icon name="star" size={12} style={{ color: "var(--ink)" }} />
              <span className="tabular" style={{ fontWeight: 600, color: "var(--ink)" }}>
                {rating.toFixed(1)}
              </span>
              {reviewCount != null ? <span>({reviewCount})</span> : null}
            </div>
          ) : null}
        </div>
      </div>
      {actions ? <div style={{ display: "flex", gap: 8 }}>{actions}</div> : null}
    </div>
  );
}
