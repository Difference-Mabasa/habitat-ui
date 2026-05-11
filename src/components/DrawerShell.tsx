import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import Icon from "./Icon";

export interface DrawerShellProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  width?: number;
  maxHeight?: number;
  /** Pixel offset from top of viewport — default 64 (matches Nav height). */
  anchorTop?: number;
  /** Pixel offset from right of viewport — default 32. */
  anchorRight?: number;
}

export default function DrawerShell({
  open,
  onClose,
  title,
  children,
  width = 380,
  maxHeight = 560,
  anchorTop = 64,
  anchorRight = 32,
}: DrawerShellProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: anchorTop,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(11,13,18,0.3)",
          zIndex: 10,
        }}
      />
      <aside
        role="dialog"
        aria-label={typeof title === "string" ? title : undefined}
        style={{
          position: "fixed",
          top: anchorTop,
          right: anchorRight,
          width,
          maxHeight,
          background: "var(--surface)",
          border: "1px solid var(--hairline)",
          borderRadius: "var(--r-lg)",
          boxShadow: "var(--shadow-lg)",
          zIndex: 11,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            height: 52,
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--hairline)",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 600 }}>{title}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="btn btn--icon btn--sm btn--ghost"
          >
            <Icon name="x" size={14} />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>{children}</div>
      </aside>
    </>,
    document.body,
  );
}
