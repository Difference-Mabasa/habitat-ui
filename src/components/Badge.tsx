import type { ReactNode } from "react";
import Icon, { type IconName } from "./Icon";

export type BadgeTone = "neutral" | "success" | "warn" | "danger" | "accent";

export interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  leftIcon?: IconName;
  className?: string;
}

export default function Badge({ children, tone = "neutral", leftIcon, className = "" }: BadgeProps) {
  return (
    <span className={`badge badge--${tone} ${className}`.trim()}>
      {leftIcon ? <Icon name={leftIcon} size={11} /> : null}
      {children}
    </span>
  );
}
