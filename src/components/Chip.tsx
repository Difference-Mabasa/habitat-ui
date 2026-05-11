import type { ButtonHTMLAttributes, ReactNode } from "react";
import Icon, { type IconName } from "./Icon";

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  children: ReactNode;
  active?: boolean;
  leftIcon?: IconName;
  count?: number;
}

export default function Chip({
  children,
  active = false,
  leftIcon,
  count,
  className,
  ...rest
}: ChipProps) {
  const parts = ["chip"];
  if (active) parts.push("chip--active");
  if (className) parts.push(className);
  return (
    <button type="button" {...rest} className={parts.join(" ")}>
      {leftIcon ? <Icon name={leftIcon} size={12} /> : null}
      {children}
      {count != null && count > 0 ? (
        <span className="badge badge--accent" style={{ marginLeft: 4 }}>
          {count}
        </span>
      ) : null}
    </button>
  );
}
