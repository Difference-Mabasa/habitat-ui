import type { ReactNode } from "react";
import Icon, { type IconName } from "./Icon";
import Badge, { type BadgeTone } from "./Badge";

export interface SubNavItem {
  id: string;
  label: string;
  icon: IconName;
  /** Optional small badge on the right (e.g., "Required"). */
  badge?: { label: string; tone?: BadgeTone };
}

export interface SubNavProps {
  items: SubNavItem[];
  activeId: string;
  onChange?: (id: string) => void;
  width?: number;
  header?: ReactNode;
}

/**
 * Section-level navigation rail used by Profile, Settings, and similar
 * account/account-adjacent screens. Distinct from `Sidebar` (the app-level
 * dashboard rail) — same idea, simpler visual treatment.
 */
export default function SubNav({
  items,
  activeId,
  onChange,
  width = 240,
  header,
}: SubNavProps) {
  return (
    <nav style={{ width, display: "flex", flexDirection: "column", gap: 2, flexShrink: 0 }}>
      {header}
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange?.(item.id)}
            style={{
              padding: "10px 12px",
              borderRadius: 6,
              background: active ? "var(--surface-2)" : "transparent",
              color: active ? "var(--ink)" : "var(--slate)",
              fontSize: 13,
              fontWeight: active ? 600 : 500,
              display: "flex",
              alignItems: "center",
              gap: 10,
              borderLeft: `2px solid ${active ? "var(--accent)" : "transparent"}`,
              border: 0,
              borderLeftWidth: 2,
              borderLeftStyle: "solid",
              borderLeftColor: active ? "var(--accent)" : "transparent",
              textAlign: "left",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <Icon name={item.icon} size={14} />
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge ? (
              <Badge tone={item.badge.tone ?? "warn"}>{item.badge.label}</Badge>
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}
