import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import Icon, { type IconName } from "./Icon";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: IconName;
  rightSlot?: ReactNode;
  invalid?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { leftIcon, rightSlot, invalid, className, style, ...rest },
  ref,
) {
  if (!leftIcon && !rightSlot) {
    return (
      <input
        ref={ref}
        className={`input ${className ?? ""}`.trim()}
        style={invalid ? { borderColor: "var(--danger)", ...style } : style}
        aria-invalid={invalid || undefined}
        {...rest}
      />
    );
  }
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        height: 40,
        padding: "0 12px",
        background: "var(--surface)",
        border: `1px solid ${invalid ? "var(--danger)" : "var(--hairline-strong)"}`,
        borderRadius: "var(--r-md)",
        ...style,
      }}
    >
      {leftIcon ? <Icon name={leftIcon} size={15} style={{ color: "var(--slate)" }} /> : null}
      <input
        ref={ref}
        className={className}
        style={{
          flex: 1,
          height: "100%",
          padding: 0,
          border: 0,
          background: "transparent",
          outline: "none",
          fontSize: 14,
          color: "var(--ink)",
          fontFamily: "inherit",
        }}
        aria-invalid={invalid || undefined}
        {...rest}
      />
      {rightSlot}
    </div>
  );
});

export default Input;
