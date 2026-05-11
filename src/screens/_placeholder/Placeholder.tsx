import { Link, useLocation } from "react-router-dom";
import Eyebrow from "@/components/Eyebrow";
import Button from "@/components/Button";

export interface PlaceholderProps {
  label: string;
  phase: string;
}

export default function Placeholder({ label, phase }: PlaceholderProps) {
  const location = useLocation();
  return (
    <main
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "64px 32px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <Eyebrow>Pending {phase}</Eyebrow>
      <h1 style={{ fontSize: 36, fontWeight: 500, letterSpacing: "-0.02em", margin: 0 }}>
        {label}
      </h1>
      <p style={{ fontSize: 14, color: "var(--slate)", margin: 0 }}>
        This screen has not been built yet. It is scheduled for {phase} in{" "}
        <code className="mono">build-order.md</code>.
      </p>
      <code className="mono" style={{ fontSize: 12, color: "var(--slate)" }}>
        {location.pathname}
      </code>
      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <Button as="a" href="/" variant="secondary">
          ← Dev home
        </Button>
        <Link to="/_routes">
          <Button variant="ghost">All routes</Button>
        </Link>
        <Link to="/_components">
          <Button variant="ghost">Component gallery</Button>
        </Link>
      </div>
    </main>
  );
}
