export interface LogoProps {
  size?: number;
  invert?: boolean;
}

export default function Logo({ size = 22, invert = false }: LogoProps) {
  const wordmarkColor = invert ? "var(--paper)" : "var(--ink)";
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <svg width={size + 10} height={size + 10} viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <path d="M18 3 L33 12 L33 28 L18 33 L3 28 L3 12 Z" fill="var(--accent)" />
        <path d="M18 3 L33 12 L18 17 Z" fill="#fff" fillOpacity="0.18" />
        <path d="M3 12 L18 17 L18 33 L3 28 Z" fill="#000" fillOpacity="0.15" />
        <path d="M11 18 L18 14 L25 18 L25 25 L11 25 Z" fill="#fff" fillOpacity="0.95" />
        <rect x="16" y="20" width="4" height="5" fill="var(--accent)" />
      </svg>
      <span
        className="display"
        style={{ fontSize: size + 4, color: wordmarkColor, letterSpacing: "0.02em" }}
      >
        BACK<span style={{ color: "var(--accent)" }}>ROOM</span>
      </span>
    </div>
  );
}
