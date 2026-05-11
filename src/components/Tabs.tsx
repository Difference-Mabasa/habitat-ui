import type { ReactNode } from "react";

export type TabsVariant = "pill" | "underline" | "segmented";

export interface TabItem<T extends string = string> {
  id: T;
  label: ReactNode;
  count?: number;
}

export interface TabsProps<T extends string = string> {
  tabs: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  variant?: TabsVariant;
}

export default function Tabs<T extends string = string>({
  tabs,
  value,
  onChange,
  variant = "pill",
}: TabsProps<T>) {
  if (variant === "segmented") {
    return (
      <div
        role="tablist"
        style={{
          display: "inline-flex",
          border: "1px solid var(--hairline-strong)",
          borderRadius: "var(--r-md)",
          padding: 2,
          background: "var(--surface)",
        }}
      >
        {tabs.map((tab) => {
          const active = tab.id === value;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => onChange(tab.id)}
              style={{
                height: 32,
                padding: "0 14px",
                background: active ? "var(--ink)" : "transparent",
                color: active ? "var(--paper)" : "var(--ink)",
                border: 0,
                borderRadius: "var(--r-sm)",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === "underline") {
    return (
      <div role="tablist" style={{ display: "flex", gap: 24, borderBottom: "1px solid var(--hairline)" }}>
        {tabs.map((tab) => {
          const active = tab.id === value;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => onChange(tab.id)}
              style={{
                position: "relative",
                padding: "12px 0",
                background: "transparent",
                border: 0,
                fontSize: 14,
                fontWeight: active ? 600 : 500,
                color: active ? "var(--ink)" : "var(--slate)",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {tab.label}
              {tab.count != null ? (
                <span style={{ marginLeft: 6, fontSize: 12, color: "var(--slate)" }}>{tab.count}</span>
              ) : null}
              {active ? (
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: -1,
                    height: 2,
                    background: "var(--ink)",
                  }}
                />
              ) : null}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div role="tablist" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {tabs.map((tab) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`chip ${active ? "chip--active" : ""}`.trim()}
          >
            {tab.label}
            {tab.count != null ? (
              <span style={{ marginLeft: 4 }} className="mono">
                {tab.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
