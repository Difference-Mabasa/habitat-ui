import type { ReactNode } from "react";
import { useId } from "react";

export interface FormFieldProps {
  label?: ReactNode;
  helper?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  htmlFor?: string;
  /**
   * Render-prop form lets the field auto-wire id, aria-describedby, and aria-invalid
   * onto whatever control sits inside.
   */
  children: ReactNode | ((args: { id: string; describedBy?: string; invalid: boolean }) => ReactNode);
}

export default function FormField({
  label,
  helper,
  error,
  required = false,
  htmlFor,
  children,
}: FormFieldProps) {
  const autoId = useId();
  const id = htmlFor ?? autoId;
  const helperId = helper ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(" ") || undefined;
  const invalid = Boolean(error);

  const rendered =
    typeof children === "function"
      ? children({ id, describedBy, invalid })
      : children;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label ? (
        <label
          htmlFor={id}
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "var(--ink)",
            display: "inline-flex",
            gap: 4,
          }}
        >
          {label}
          {required ? <span aria-hidden="true" style={{ color: "var(--danger)" }}>*</span> : null}
        </label>
      ) : null}
      {rendered}
      {helper && !error ? (
        <span id={helperId} style={{ fontSize: 12, color: "var(--slate)" }}>
          {helper}
        </span>
      ) : null}
      {error ? (
        <span id={errorId} style={{ fontSize: 12, color: "var(--danger)" }}>
          {error}
        </span>
      ) : null}
    </div>
  );
}
