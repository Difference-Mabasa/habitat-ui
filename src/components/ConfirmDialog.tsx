import type { ReactNode } from "react";
import Modal from "./Modal";
import Button from "./Button";
import Icon, { type IconName } from "./Icon";

export type ConfirmTone = "neutral" | "danger" | "warn" | "accent";

const TONE_STYLE: Record<ConfirmTone, { color: string; bg: string; icon: IconName }> = {
  neutral: { color: "var(--ink)", bg: "var(--surface-2)", icon: "info" },
  danger: { color: "var(--danger)", bg: "var(--danger-soft)", icon: "x" },
  warn: { color: "var(--warn)", bg: "var(--warn-soft)", icon: "info" },
  accent: { color: "var(--accent)", bg: "var(--accent-soft)", icon: "check" },
};

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: ReactNode;
  message: ReactNode;
  tone?: ConfirmTone;
  icon?: IconName;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  tone = "neutral",
  icon,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
}: ConfirmDialogProps) {
  const t = TONE_STYLE[tone];
  return (
    <Modal
      open={open}
      onClose={onClose}
      bare
      width={420}
      footer={null}
    >
      <div style={{ padding: 24, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 12 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: t.bg,
            color: t.color,
            display: "grid",
            placeItems: "center",
          }}
        >
          <Icon name={icon ?? t.icon} size={22} />
        </div>
        <div style={{ fontSize: 16, fontWeight: 600 }}>{title}</div>
        <div style={{ fontSize: 13, color: "var(--slate)", lineHeight: 1.5 }}>{message}</div>
      </div>
      <div
        style={{
          padding: "12px 20px",
          borderTop: "1px solid var(--hairline)",
          display: "flex",
          justifyContent: "flex-end",
          gap: 8,
        }}
      >
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          variant={tone === "danger" ? "primary" : "accent"}
          onClick={onConfirm}
          loading={loading}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
