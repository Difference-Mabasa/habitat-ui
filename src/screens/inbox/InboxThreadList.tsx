import Avatar from "@/components/Avatar";
import Chip from "@/components/Chip";

export interface InboxThread {
  id: string;
  name: string;
  initials: string;
  role: string;
  subject: string;
  preview: string;
  time: string;
  unread: number;
}

export interface InboxThreadListProps {
  threads: InboxThread[];
  activeId?: string;
  filters: { id: string; label: string; count?: number }[];
  activeFilter: string;
  onFilterChange: (id: string) => void;
  onSelect: (id: string) => void;
}

export default function InboxThreadList({
  threads,
  activeId,
  filters,
  activeFilter,
  onFilterChange,
  onSelect,
}: InboxThreadListProps) {
  return (
    <div
      style={{
        borderRight: "1px solid var(--hairline)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ padding: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.015em", margin: "0 0 12px" }}>
          Inbox
        </h1>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {filters.map((f) => (
            <Chip
              key={f.id}
              active={f.id === activeFilter}
              onClick={() => onFilterChange(f.id)}
              style={{ height: 28, fontSize: 11 }}
            >
              {f.label}
              {f.count != null ? <span style={{ marginLeft: 4 }}>{f.count}</span> : null}
            </Chip>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {threads.map((t) => {
          const active = activeId === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelect(t.id)}
              style={{
                width: "100%",
                padding: "14px 20px",
                borderBottom: "1px solid var(--hairline)",
                background: active ? "var(--surface-2)" : "transparent",
                borderLeft: `3px solid ${active ? "var(--accent)" : "transparent"}`,
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "inherit",
                color: "var(--ink)",
              }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <Avatar name={t.initials} size="md" tone="neutral" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: 2,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: t.unread > 0 ? 600 : 500,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {t.name}
                    </div>
                    <div
                      className="mono"
                      style={{ fontSize: 10, color: "var(--slate)", flexShrink: 0, marginLeft: 8 }}
                    >
                      {t.time}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--accent)", marginBottom: 4, fontWeight: 500 }}>
                    {t.subject}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--slate)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t.preview}
                  </div>
                </div>
                {t.unread > 0 ? (
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "var(--accent)",
                      color: "var(--paper)",
                      fontSize: 9,
                      fontWeight: 600,
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    {t.unread}
                  </div>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
