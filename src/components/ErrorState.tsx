import type { ReactNode } from "react";
import Icon, { type IconName } from "./Icon";
import Button from "./Button";

export interface ErrorStateProps {
  /** Defaults to the warning triangle pattern via the "info" icon flipped to danger. */
  icon?: IconName;
  title?: ReactNode;
  description?: ReactNode;
  /** Shown as the primary "Retry" CTA when set. */
  onRetry?: () => void;
  retryLabel?: string;
  /** Optional secondary action — e.g. "Open inbox" / "Back". */
  secondaryAction?: ReactNode;
}

export default function ErrorState({
  icon = "info",
  title = "Couldn't load that.",
  description = "Something went wrong on our side. Give it another try — if it keeps failing, it might be a brief outage.",
  onRetry,
  retryLabel = "Try again",
  secondaryAction,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        textAlign: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 12,
          background: "var(--danger-soft)",
          color: "var(--danger)",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Icon name={icon} size={24} />
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>{title}</div>
      <p style={{ fontSize: 13, color: "var(--slate)", margin: 0, maxWidth: 400, lineHeight: 1.5 }}>
        {description}
      </p>
      {onRetry || secondaryAction ? (
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          {secondaryAction}
          {onRetry ? (
            <Button variant="accent" leftIcon="refresh" onClick={onRetry}>
              {retryLabel}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
