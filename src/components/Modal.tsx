import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import Icon from "./Icon";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
  /** Hide the chrome (title bar, X button) — caller renders entire body. */
  bare?: boolean;
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  width = 480,
  bare = false,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === "string" ? title : undefined}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(11,13,18,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        zIndex: 20,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width,
          maxWidth: "100%",
          maxHeight: "calc(100vh - 48px)",
          background: "var(--surface)",
          border: "1px solid var(--hairline)",
          borderRadius: "var(--r-lg)",
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {!bare && (title || onClose) ? (
          <div
            style={{
              height: 56,
              padding: "0 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid var(--hairline)",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 600 }}>{title}</span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="btn btn--icon btn--sm btn--ghost"
            >
              <Icon name="x" size={14} />
            </button>
          </div>
        ) : null}
        <div style={{ padding: bare ? 0 : 20, flex: 1, overflowY: "auto" }}>{children}</div>
        {footer ? (
          <div
            style={{
              padding: "12px 20px",
              borderTop: "1px solid var(--hairline)",
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              flexShrink: 0,
            }}
          >
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
