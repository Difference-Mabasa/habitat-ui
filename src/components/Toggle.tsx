import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: ReactNode;
  helper?: ReactNode;
}

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(function Toggle(
  { label, helper, checked, style, ...rest },
  ref,
) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        cursor: rest.disabled ? "not-allowed" : "pointer",
        ...style,
      }}
    >
      <span
        style={{
          position: "relative",
          width: 36,
          height: 20,
          background: checked ? "var(--accent)" : "var(--surface-3)",
          borderRadius: 999,
          transition: "background 120ms",
          flexShrink: 0,
        }}
      >
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          style={{ position: "absolute", inset: 0, opacity: 0, margin: 0, cursor: "inherit" }}
          {...rest}
        />
        <span
          style={{
            position: "absolute",
            top: 2,
            left: checked ? 18 : 2,
            width: 16,
            height: 16,
            background: "#fff",
            borderRadius: "50%",
            transition: "left 120ms",
            boxShadow: "0 1px 2px rgba(30,15,6,0.2)",
          }}
        />
      </span>
      {(label || helper) && (
        <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {label ? <span style={{ fontSize: 14, color: "var(--ink)" }}>{label}</span> : null}
          {helper ? (
            <span style={{ fontSize: 12, color: "var(--slate)" }}>{helper}</span>
          ) : null}
        </span>
      )}
    </label>
  );
});

export default Toggle;
