import type { ReactNode } from "react";
import Icon, { type IconName } from "./Icon";
import Badge from "./Badge";
import Button from "./Button";

export type DocStatus = "empty" | "uploaded" | "verified";

const STATUS_STYLE: Record<DocStatus, { color: string; bg: string; icon: IconName; label: string }> = {
  empty: { color: "var(--slate)", bg: "var(--surface-2)", icon: "upload", label: "Required" },
  uploaded: { color: "var(--accent)", bg: "var(--accent-soft)", icon: "doc", label: "Uploaded" },
  verified: { color: "var(--success)", bg: "var(--success-soft)", icon: "check", label: "Verified" },
};

export interface DocumentStatusRowProps {
  name: ReactNode;
  subText?: ReactNode;
  status: DocStatus;
  /** Replaces the right-hand action (defaults to status badge + appropriate button). */
  action?: ReactNode;
  onReplace?: () => void;
  onUpload?: () => void;
  /** Highlight when this is the active upload target. */
  active?: boolean;
}

export default function DocumentStatusRow({
  name,
  subText,
  status,
  action,
  onReplace,
  onUpload,
  active = false,
}: DocumentStatusRowProps) {
  const s = STATUS_STYLE[status];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "14px 16px",
        border: `1px solid ${active ? "var(--ink)" : "var(--hairline)"}`,
        borderRadius: 12,
        background: "var(--surface)",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: s.bg,
          color: s.color,
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}
      >
        <Icon name={s.icon} size={16} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{name}</div>
        {subText ? (
          <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 2 }}>{subText}</div>
        ) : null}
      </div>
      {action ? (
        action
      ) : status === "verified" ? (
        <Badge tone="success">Verified</Badge>
      ) : status === "uploaded" ? (
        <Button variant="ghost" size="sm" onClick={onReplace}>
          Replace
        </Button>
      ) : (
        <Button variant="secondary" size="sm" onClick={onUpload}>
          Upload
        </Button>
      )}
    </div>
  );
}
