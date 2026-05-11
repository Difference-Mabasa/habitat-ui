import type { ReactNode } from "react";
import Icon, { type IconName } from "./Icon";
import Button from "./Button";

export interface FileUploadZoneProps {
  title: ReactNode;
  helpText?: ReactNode;
  buttonLabel?: string;
  /** mono-font specs line e.g. "PDF · CSV · max 10 MB · 3 months". */
  specsText?: ReactNode;
  icon?: IconName;
  onChoose?: () => void;
}

export default function FileUploadZone({
  title,
  helpText = "or",
  buttonLabel = "Choose files",
  specsText,
  icon = "upload",
  onChoose,
}: FileUploadZoneProps) {
  return (
    <div
      style={{
        border: "1.5px dashed var(--hairline-strong)",
        borderRadius: 12,
        padding: 32,
        textAlign: "center",
        background: "var(--surface-2)",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "var(--surface)",
          border: "1px solid var(--hairline-strong)",
          margin: "0 auto 12px",
          display: "grid",
          placeItems: "center",
          color: "var(--slate)",
        }}
      >
        <Icon name={icon} size={18} />
      </div>
      <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{title}</div>
      {helpText ? (
        <div style={{ fontSize: 13, color: "var(--slate)", marginBottom: 16 }}>{helpText}</div>
      ) : null}
      <Button variant="primary" size="sm" onClick={onChoose}>
        {buttonLabel}
      </Button>
      {specsText ? (
        <div className="mono" style={{ fontSize: 11, color: "var(--slate-2)", marginTop: 16 }}>
          {specsText}
        </div>
      ) : null}
    </div>
  );
}
