import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";
import Icon, { type IconName } from "./Icon";

export interface InlineLinkProps {
  to?: string;
  href?: string;
  onClick?: () => void;
  icon?: IconName;
  iconPosition?: "left" | "right";
  size?: "sm" | "md";
  tone?: "ink" | "slate" | "accent";
  children: ReactNode;
  style?: CSSProperties;
}

const TONE_COLOR: Record<NonNullable<InlineLinkProps["tone"]>, string> = {
  ink: "var(--ink)",
  slate: "var(--slate)",
  accent: "var(--accent)",
};

export default function InlineLink({
  to,
  href,
  onClick,
  icon,
  iconPosition = "right",
  size = "md",
  tone = "ink",
  children,
  style,
}: InlineLinkProps) {
  const innerStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    fontSize: size === "sm" ? 12 : 13,
    fontWeight: 500,
    color: TONE_COLOR[tone],
    textDecoration: "underline",
    textUnderlineOffset: 3,
    textDecorationColor: "var(--hairline-strong)",
    ...style,
  };
  const inner = (
    <>
      {icon && iconPosition === "left" ? <Icon name={icon} size={12} /> : null}
      {children}
      {icon && iconPosition === "right" ? <Icon name={icon} size={12} /> : null}
    </>
  );

  if (to) {
    return (
      <Link to={to} style={innerStyle}>
        {inner}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} style={innerStyle}>
        {inner}
      </a>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ background: "none", border: 0, padding: 0, cursor: "pointer", ...innerStyle }}
    >
      {inner}
    </button>
  );
}
