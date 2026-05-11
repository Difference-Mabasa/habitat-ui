import type { ButtonHTMLAttributes } from "react";
import Icon, { type IconName } from "./Icon";
import type { ButtonSize, ButtonVariant } from "./Button";

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  icon: IconName;
  variant?: ButtonVariant;
  size?: ButtonSize;
  badge?: number;
  label: string;
}

const ICON_SIZE: Record<ButtonSize, number> = { sm: 14, md: 17, lg: 18 };

export default function IconButton({
  icon,
  variant = "ghost",
  size = "md",
  badge,
  label,
  className,
  ...rest
}: IconButtonProps) {
  const parts = ["btn", `btn--${variant}`, "btn--icon"];
  if (size !== "md") parts.push(`btn--${size}`);
  if (className) parts.push(className);
  return (
    <button
      type="button"
      aria-label={label}
      {...rest}
      className={parts.join(" ")}
      style={{ position: "relative", ...rest.style }}
    >
      <Icon name={icon} size={ICON_SIZE[size]} />
      {badge != null && badge > 0 ? <BadgeDot count={badge} /> : null}
    </button>
  );
}

function BadgeDot({ count }: { count: number }) {
  return (
    <span
      style={{
        position: "absolute",
        top: 6,
        right: 6,
        minWidth: 16,
        height: 16,
        padding: "0 4px",
        background: "var(--accent)",
        color: "#fff",
        borderRadius: 999,
        fontSize: 10,
        fontWeight: 600,
        display: "grid",
        placeItems: "center",
        border: "2px solid var(--surface)",
      }}
    >
      {count}
    </span>
  );
}
