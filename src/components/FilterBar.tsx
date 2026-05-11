import type { ReactNode } from "react";
import Icon from "./Icon";

export interface FilterBarProps {
  left?: ReactNode;
  /** Main filter controls — chips, buttons. */
  filters: ReactNode;
  /** Right side — typically result count + view toggle. */
  right?: ReactNode;
}

/**
 * Sticky horizontal filter bar used in browse and similar list surfaces.
 * Slots are kept open-ended so screens can compose their own controls.
 */
export default function FilterBar({ left, filters, right }: FilterBarProps) {
  return (
    <div style={{ borderBottom: "1px solid var(--hairline)", background: "var(--surface)" }}>
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        {left}
        {left && filters ? <FilterDivider /> : null}
        {filters}
        {right ? (
          <>
            <div style={{ flex: 1 }} />
            {right}
          </>
        ) : null}
      </div>
    </div>
  );
}

export function FilterDivider() {
  return <div aria-hidden="true" style={{ width: 1, height: 24, background: "var(--hairline)" }} />;
}

/**
 * Pre-built location dropdown trigger, used in the standard browse filter bar.
 */
export function LocationFilter({
  city,
  extraAreas = 0,
  onClick,
}: {
  city: string;
  extraAreas?: number;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        height: 40,
        padding: "0 14px",
        border: "1px solid var(--hairline-strong)",
        borderRadius: "var(--r-md)",
        minWidth: 280,
        background: "var(--surface)",
        cursor: "pointer",
        fontFamily: "inherit",
        color: "var(--ink)",
      }}
    >
      <Icon name="pin" size={16} style={{ color: "var(--slate)" }} />
      <span style={{ fontSize: 13, fontWeight: 500 }}>{city}</span>
      {extraAreas > 0 ? (
        <span style={{ fontSize: 12, color: "var(--slate)" }}>+ {extraAreas} areas</span>
      ) : null}
      <Icon name="chevD" size={14} style={{ color: "var(--slate)", marginLeft: "auto" }} />
    </button>
  );
}
