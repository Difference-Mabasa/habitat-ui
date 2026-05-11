import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, className, style, rows = 4, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={`input ${className ?? ""}`.trim()}
      aria-invalid={invalid || undefined}
      style={{
        height: "auto",
        padding: "10px 12px",
        lineHeight: 1.5,
        resize: "vertical",
        ...(invalid ? { borderColor: "var(--danger)" } : {}),
        ...style,
      }}
      {...rest}
    />
  );
});

export default Textarea;
