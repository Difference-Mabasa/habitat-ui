import type { ReactNode } from "react";
import Avatar from "./Avatar";

export interface MessageBubbleProps {
  name: string;
  body: ReactNode;
  time?: ReactNode;
  own?: boolean;
  avatarTone?: "ink" | "accent" | "neutral";
}

export default function MessageBubble({
  name,
  body,
  time,
  own = false,
  avatarTone = "neutral",
}: MessageBubbleProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: own ? "row-reverse" : "row",
        gap: 10,
        alignItems: "flex-end",
      }}
    >
      <Avatar name={name} size="sm" tone={own ? "ink" : avatarTone} />
      <div style={{ maxWidth: "78%" }}>
        {!own ? (
          <div style={{ fontSize: 11, color: "var(--slate)", marginBottom: 4 }}>{name}{time ? <> · {time}</> : null}</div>
        ) : null}
        <div
          style={{
            padding: "10px 14px",
            background: own ? "var(--accent)" : "var(--surface-2)",
            color: own ? "#fff" : "var(--ink)",
            borderRadius: 14,
            borderTopRightRadius: own ? 4 : 14,
            borderTopLeftRadius: own ? 14 : 4,
            fontSize: 13,
            lineHeight: 1.5,
          }}
        >
          {body}
        </div>
        {own && time ? (
          <div style={{ fontSize: 11, color: "var(--slate)", marginTop: 4, textAlign: "right" }}>{time}</div>
        ) : null}
      </div>
    </div>
  );
}
