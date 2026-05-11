import type { ReactNode } from "react";
import Icon from "@/components/Icon";
import Eyebrow from "@/components/Eyebrow";

export interface PhoneFrameProps {
  label: string;
  children: ReactNode;
  width?: number;
  height?: number;
}

export default function PhoneFrame({
  label,
  children,
  width = 360,
  height = 760,
}: PhoneFrameProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width,
          height,
          background: "var(--ink)",
          borderRadius: 44,
          padding: 8,
          boxShadow: "0 12px 32px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "var(--paper)",
            borderRadius: 36,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <StatusBar />
          <div style={{ paddingTop: 36, height: "100%", overflow: "hidden" }}>{children}</div>
        </div>
      </div>
      <Eyebrow>{label}</Eyebrow>
    </div>
  );
}

function StatusBar() {
  return (
    <div
      className="mono"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
        fontSize: 12,
        fontWeight: 600,
        zIndex: 10,
      }}
    >
      <span>9:41</span>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "50%",
          top: 8,
          transform: "translateX(-50%)",
          width: 96,
          height: 22,
          background: "var(--ink)",
          borderRadius: 999,
        }}
      />
      <div style={{ display: "flex", gap: 4 }}>
        <Icon name="wifi" size={11} />
        <span
          aria-hidden="true"
          style={{
            width: 18,
            height: 9,
            border: "1px solid currentColor",
            borderRadius: 2,
            position: "relative",
            display: "inline-block",
          }}
        >
          <span
            style={{
              position: "absolute",
              inset: 1,
              background: "currentColor",
              width: "70%",
              borderRadius: 1,
            }}
          />
        </span>
      </div>
    </div>
  );
}
