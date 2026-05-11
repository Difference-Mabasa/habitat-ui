import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: ReactNode;
  helper?: ReactNode;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, helper, style, ...rest },
  ref,
) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        cursor: rest.disabled ? "not-allowed" : "pointer",
        ...style,
      }}
    >
      <input
        ref={ref}
        type="checkbox"
        style={{
          width: 18,
          height: 18,
          marginTop: 1,
          accentColor: "var(--accent)",
          flexShrink: 0,
        }}
        {...rest}
      />
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

export default Checkbox;
