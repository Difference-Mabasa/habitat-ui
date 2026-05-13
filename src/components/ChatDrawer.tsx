import DrawerShell from "./DrawerShell";
import Avatar from "./Avatar";
import Eyebrow from "./Eyebrow";

export interface ChatDirectMessage {
  id: string;
  name: string;
  sub: string;
  last: string;
  unread: number;
}

export interface ChatCommunity {
  id: string;
  name: string;
  count: number;
  type: string;
}

export interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
  dms: ChatDirectMessage[];
  communities?: ChatCommunity[];
  onSelectDm?: (id: string) => void;
  onSelectCommunity?: (id: string) => void;
}

function UnreadBadge({ count }: { count: number }) {
  return (
    <span
      style={{
        minWidth: 18,
        height: 18,
        padding: "0 5px",
        fontSize: 10,
        fontWeight: 600,
        background: "var(--accent)",
        color: "#fff",
        borderRadius: 999,
        display: "grid",
        placeItems: "center",
      }}
    >
      {count}
    </span>
  );
}

export default function ChatDrawer({
  open,
  onClose,
  dms,
  communities = [],
  onSelectDm,
  onSelectCommunity,
}: ChatDrawerProps) {
  return (
    <DrawerShell open={open} onClose={onClose} title="Inbox">
      <div style={{ padding: "12px 16px 8px" }}>
        <Eyebrow style={{ marginBottom: 8 }}>Direct messages</Eyebrow>
      </div>
      {dms.length === 0 ? (
        <div style={{ padding: "16px 16px 8px", fontSize: 12, color: "var(--slate)" }}>
          No messages yet.
        </div>
      ) : null}
      {dms.map((d) => (
        <button
          key={d.id}
          type="button"
          onClick={() => onSelectDm?.(d.id)}
          style={{
            width: "100%",
            padding: "12px 16px",
            display: "flex",
            gap: 12,
            alignItems: "center",
            background: "transparent",
            border: 0,
            borderBottom: "1px solid var(--hairline)",
            textAlign: "left",
            cursor: "pointer",
          }}
        >
          <Avatar name={d.name} size="md" tone="neutral" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, fontWeight: d.unread ? 600 : 500 }}>{d.name}</span>
              {d.unread > 0 ? <UnreadBadge count={d.unread} /> : null}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--slate)",
                marginTop: 2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {d.last}
            </div>
            <div style={{ fontSize: 11, color: "var(--slate-2)", marginTop: 2 }}>{d.sub}</div>
          </div>
        </button>
      ))}
      {communities.length > 0 ? (
        <>
          <div style={{ padding: "12px 16px 8px" }}>
            <Eyebrow style={{ marginBottom: 8 }}>Communities</Eyebrow>
          </div>
          {communities.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelectCommunity?.(c.id)}
              style={{
                width: "100%",
                padding: "12px 16px",
                display: "flex",
                gap: 12,
                alignItems: "center",
                background: "transparent",
                border: 0,
                borderBottom: "1px solid var(--hairline)",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <Avatar name={c.name} size="md" tone="accent" shape="square" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: "var(--slate)" }}>
                  {c.type} · {c.count} members
                </div>
              </div>
            </button>
          ))}
        </>
      ) : null}
    </DrawerShell>
  );
}
