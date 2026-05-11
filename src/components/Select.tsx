import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  invalid?: boolean;
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { options, invalid, placeholder, className, style, ...rest },
  ref,
) {
  return (
    <select
      ref={ref}
      className={`select ${className ?? ""}`.trim()}
      aria-invalid={invalid || undefined}
      style={invalid ? { borderColor: "var(--danger)", ...style } : style}
      {...rest}
    >
      {placeholder ? (
        <option value="" disabled>
          {placeholder}
        </option>
      ) : null}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
});

export default Select;
