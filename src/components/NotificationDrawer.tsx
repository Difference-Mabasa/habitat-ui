import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import Icon from "./Icon";
import Eyebrow from "./Eyebrow";

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  /** Full message shown in the detail view. Falls back to `body`. */
  fullBody?: string;
  /** Where the action button navigates to. */
  href?: string;
  /** Label for the detail-view action button. Defaults to "Open". */
  actionLabel?: string;
}

export interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
  items: NotificationItem[];
}

const DRAWER_KEYFRAMES = `
@keyframes habitat-notif-fade-in { from { opacity: 0 } to { opacity: 1 } }
@keyframes habitat-notif-slide-in { from { transform: translateX(100%) } to { transform: translateX(0) } }
`;

export default function NotificationDrawer({
  open,
  onClose,
  items,
}: NotificationDrawerProps) {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = items.find((n) => n.id === selectedId) ?? null;
  const unreadCount = items.filter((n) => n.unread).length;

  useEffect(() => {
    if (!open) setSelectedId(null);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selected) setSelectedId(null);
        else onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose, selected]);

  if (!open) return null;

  return createPortal(
    <>
      <style>{DRAWER_KEYFRAMES}</style>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(11,13,18,0.4)",
          zIndex: 200,
          animation: "habitat-notif-fade-in 200ms ease",
        }}
      />
      <aside
        role="dialog"
        aria-label="Notifications"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 400,
          maxWidth: "100vw",
          background: "var(--surface)",
          borderLeft: "1px solid var(--hairline)",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.15)",
          zIndex: 201,
          display: "flex",
          flexDirection: "column",
          animation: "habitat-notif-slide-in 250ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <DrawerHeader
          selected={!!selected}
          unreadCount={unreadCount}
          onBack={() => setSelectedId(null)}
          onClose={onClose}
        />
        {selected ? (
          <DetailView
            item={selected}
            onAction={() => {
              if (!selected.href) return;
              navigate(selected.href);
              onClose();
            }}
          />
        ) : (
          <ListView items={items} onSelect={setSelectedId} onClose={onClose} />
        )}
      </aside>
    </>,
    document.body,
  );
}

function DrawerHeader({
  selected,
  unreadCount,
  onBack,
  onClose,
}: {
  selected: boolean;
  unreadCount: number;
  onBack: () => void;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "0 20px",
        height: 62,
        borderBottom: "1px solid var(--hairline)",
        flexShrink: 0,
        background: "var(--surface)",
      }}
    >
      {selected ? (
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            background: "none",
            border: "none",
            padding: "6px 8px",
            margin: "0 -8px 0 0",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 13,
            fontWeight: 600,
            color: "var(--ink)",
            borderRadius: 6,
          }}
        >
          <Icon name="chevL" size={16} />
          Back
        </button>
      ) : null}
      <div
        style={{
          flex: 1,
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: "-0.005em",
          color: "var(--ink)",
        }}
      >
        {selected ? "Notification" : "Notifications"}
        {!selected && unreadCount > 0 ? (
          <span style={{ fontSize: 12, color: "var(--slate)", fontWeight: 500, marginLeft: 8 }}>
            {unreadCount} unread
          </span>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="btn btn--icon btn--sm btn--ghost"
      >
        <Icon name="x" size={14} />
      </button>
    </div>
  );
}

function ListView({
  items,
  onSelect,
  onClose,
}: {
  items: NotificationItem[];
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  if (items.length === 0) {
    return (
      <div style={{ padding: "64px 24px", textAlign: "center", color: "var(--slate)" }}>
        <Icon name="bell" size={32} style={{ opacity: 0.4, marginBottom: 12 }} />
        <div style={{ fontSize: 13 }}>You're all caught up!</div>
      </div>
    );
  }
  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      {items.map((n) => (
        <button
          key={n.id}
          type="button"
          onClick={() => onSelect(n.id)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            padding: "16px 20px",
            background: n.unread ? "color-mix(in oklch, var(--accent) 4%, transparent)" : "transparent",
            border: "none",
            borderBottom: "1px solid var(--hairline)",
            textAlign: "left",
            cursor: "pointer",
            fontFamily: "inherit",
            color: "var(--ink)",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: n.unread ? "var(--accent)" : "transparent",
              marginTop: 6,
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: n.unread ? 600 : 500, marginBottom: 2 }}>
              {n.title}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--slate)",
                lineHeight: 1.4,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {n.body}
            </div>
            <div style={{ fontSize: 11, color: "var(--slate-2)", marginTop: 4 }}>{n.time}</div>
          </div>
          <Icon name="chevR" size={14} style={{ color: "var(--slate)", marginTop: 4, flexShrink: 0 }} />
        </button>
      ))}
      <div style={{ padding: "16px 20px", textAlign: "center" }}>
        <Link
          to="/notifications"
          onClick={onClose}
          style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}
        >
          View all notifications →
        </Link>
      </div>
    </div>
  );
}

function DetailView({
  item,
  onAction,
}: {
  item: NotificationItem;
  onAction: () => void;
}) {
  return (
    <>
      <div style={{ padding: 24, flex: 1, overflowY: "auto" }}>
        <Eyebrow style={{ marginBottom: 10 }}>{item.type}</Eyebrow>
        <h3 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 6px", lineHeight: 1.3 }}>
          {item.title}
        </h3>
        <div style={{ fontSize: 11, color: "var(--slate-2)", marginBottom: 20 }}>{item.time}</div>
        <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.65, margin: 0 }}>
          {item.fullBody ?? item.body}
        </p>
      </div>
      {item.href ? (
        <div
          style={{
            padding: 16,
            borderTop: "1px solid var(--hairline)",
            background: "var(--surface)",
          }}
        >
          <Button
            variant="accent"
            rightIcon="chevR"
            onClick={onAction}
            style={{ width: "100%", justifyContent: "center" }}
          >
            {item.actionLabel ?? "Open"}
          </Button>
        </div>
      ) : null}
    </>
  );
}
