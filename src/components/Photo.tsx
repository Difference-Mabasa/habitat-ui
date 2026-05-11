import type { CSSProperties, ReactNode } from "react";

export interface PhotoProps {
  label?: string;
  ratio?: CSSProperties["aspectRatio"];
  src?: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export default function Photo({
  label,
  ratio = "16/10",
  src,
  alt,
  className = "",
  style,
  children,
}: PhotoProps) {
  return (
    <div
      className={`ph ${className}`.trim()}
      style={{ aspectRatio: ratio, borderRadius: 8, ...style }}
    >
      {src ? (
        <img
          src={src}
          alt={alt ?? ""}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : null}
      {label && !src ? <div className="ph__label">{label}</div> : null}
      {children}
    </div>
  );
}
