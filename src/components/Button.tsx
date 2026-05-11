import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import Icon, { type IconName } from "./Icon";

export type ButtonVariant = "primary" | "accent" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconOnly?: boolean;
  leftIcon?: IconName;
  rightIcon?: IconName;
  loading?: boolean;
  children?: ReactNode;
}

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
    as?: "button";
    type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  };

type ButtonAsAnchor = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: "a";
  };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const ICON_SIZE: Record<ButtonSize, number> = { sm: 14, md: 16, lg: 18 };

function buildClassName(
  variant: ButtonVariant,
  size: ButtonSize,
  iconOnly: boolean,
  className?: string,
): string {
  const parts = ["btn", `btn--${variant}`];
  if (size !== "md") parts.push(`btn--${size}`);
  if (iconOnly) parts.push("btn--icon");
  if (className) parts.push(className);
  return parts.join(" ");
}

export default function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    iconOnly = false,
    leftIcon,
    rightIcon,
    loading = false,
    children,
    className,
    ...rest
  } = props;

  const cls = buildClassName(variant, size, iconOnly, className);
  const iconSize = ICON_SIZE[size];
  const content = (
    <>
      {leftIcon ? <Icon name={leftIcon} size={iconSize} /> : null}
      {loading ? <span className="mono">…</span> : children}
      {rightIcon ? <Icon name={rightIcon} size={iconSize} /> : null}
    </>
  );

  if (props.as === "a") {
    const anchorRest = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a {...anchorRest} className={cls}>
        {content}
      </a>
    );
  }

  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      type={buttonRest.type ?? "button"}
      disabled={buttonRest.disabled || loading}
      {...buttonRest}
      className={cls}
    >
      {content}
    </button>
  );
}
