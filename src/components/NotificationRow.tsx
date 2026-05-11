import type { ReactNode } from "react";
import Eyebrow from "./Eyebrow";
import type { IconName } from "./Icon";

export interface NotificationRowProps {
  type: ReactNode;
  title: ReactNode;
  body: ReactNode;
  time: ReactNode;
  unread?: boolean;
  /** Optional icon reserved for future use (e.g., type indicator on the side). */
  icon?: IconName;
  action?: ReactNode;
}

export default function NotificationRow({
  type,
  title,
  body,
  time,
  unread = false,
  action,
}: NotificationRowProps) {
  return (
    <div
      style={{
        padding: "14px 16px",
        borderBottom: "1px solid var(--hairline)",
        background: unread ? "var(--surface-2)" : "transparent",
        display: "flex",
        gap: 12,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: 6,
          alignSelf: "stretch",
          borderRadius: 3,
          background: unread ? "var(--accent)" : "transparent",
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Eyebrow>{type}</Eyebrow>
          <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--slate)" }}>{time}</span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 12, color: "var(--slate)", lineHeight: 1.4 }}>{body}</div>
        {action ? <div style={{ marginTop: 8 }}>{action}</div> : null}
      </div>
    </div>
  );
}
