import Logo from "./Logo";

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface FooterProps {
  columns: FooterColumn[];
  tagline?: string;
  copyright?: string;
}

export default function Footer({
  columns,
  tagline = "Calm utility for renting and letting in South Africa.",
  copyright = `© ${new Date().getFullYear()} Habitat`,
}: FooterProps) {
  return (
    <footer style={{ background: "var(--ink)", color: "var(--paper)" }}>
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "64px 32px 48px",
          display: "grid",
          gridTemplateColumns: `2fr repeat(${columns.length}, 1fr)`,
          gap: 48,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Logo size={22} invert />
          <p style={{ fontSize: 13, color: "var(--slate-3)", lineHeight: 1.6, maxWidth: 280, margin: 0 }}>
            {tagline}
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              className="eyebrow"
              style={{ color: "var(--slate-3)", fontSize: 11, letterSpacing: "0.12em" }}
            >
              {col.title}
            </div>
            {col.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{ fontSize: 13, color: "var(--paper)", lineHeight: 1.4 }}
              >
                {link.label}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div
        style={{
          borderTop: "1px solid rgba(247,239,226,0.1)",
          padding: "20px 32px",
          maxWidth: 1440,
          margin: "0 auto",
          fontSize: 12,
          color: "var(--slate-3)",
        }}
      >
        {copyright}
      </div>
    </footer>
  );
}
