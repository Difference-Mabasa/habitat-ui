import { useState } from "react";
import Nav from "@/components/Nav";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Chip from "@/components/Chip";
import Badge, { type BadgeTone } from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";

interface Locale {
  code: string;
  name: string;
  subtitle: string;
  hero: string;
  cta: string;
  sub: string;
}

const LOCALES: Locale[] = [
  {
    code: "EN",
    name: "English",
    subtitle: "Default · 62%",
    hero: "YOUR SPOT.\nYOUR HOOD.",
    cta: "Find your spot",
    sub: "12,840 verified spots across 9 cities. No deposits lost in WhatsApp.",
  },
  {
    code: "ZU",
    name: "isiZulu",
    subtitle: "24% of users",
    hero: "INDAWO YAKHO.\nELOKISHINI LAKHO.",
    cta: "Thola indawo yakho",
    sub: "Izindawo eziqinisekisiwe ezi-12,840 emadolobheni angu-9. Akukho izibambiso ezilahlekile ku-WhatsApp.",
  },
  {
    code: "ST",
    name: "Sesotho",
    subtitle: "14% of users",
    hero: "SEBAKA SA HAU.\nMOTSE WA HAU.",
    cta: "Fumana sebaka sa hau",
    sub: "Libaka tse 12,840 tse netefalitsoeng metseng e 9. Ha ho lipeeletso tse lahlehileng ho WhatsApp.",
  },
];

type CoverageStatus = "live" | "beta" | "draft";

interface CoverageRow {
  language: string;
  code: string;
  coverage: number;
  surfaces: string;
  status: CoverageStatus;
}

const COVERAGE: CoverageRow[] = [
  { language: "English", code: "EN", coverage: 100, surfaces: "All", status: "live" },
  { language: "isiZulu", code: "ZU", coverage: 100, surfaces: "All", status: "live" },
  { language: "Sesotho", code: "ST", coverage: 100, surfaces: "All", status: "live" },
  { language: "Afrikaans", code: "AF", coverage: 92, surfaces: "All except emails", status: "live" },
  { language: "isiXhosa", code: "XH", coverage: 78, surfaces: "Browse, apply, payments", status: "beta" },
  { language: "Setswana", code: "TN", coverage: 64, surfaces: "Browse, apply", status: "beta" },
  { language: "Sepedi", code: "NSO", coverage: 22, surfaces: "Browse only", status: "draft" },
  { language: "Xitsonga", code: "TS", coverage: 18, surfaces: "Browse only", status: "draft" },
];

const STATUS_TONE: Record<CoverageStatus, BadgeTone> = {
  live: "success",
  beta: "accent",
  draft: "neutral",
};

export default function I18n() {
  const [active, setActive] = useState("ZU");

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 32px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 24,
          }}
        >
          <div>
            <Eyebrow>Localisation · 11 languages</Eyebrow>
            <h1 className="display" style={{ fontSize: 56, margin: "8px 0 6px" }}>
              SAWUBONA. DUMELA.
            </h1>
            <p style={{ fontSize: 14, color: "var(--slate)" }}>
              Habitat in your language. 38% of users use a non-English UI.
            </p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["EN", "ZU", "ST"].map((l) => (
              <Chip key={l} active={active === l} onClick={() => setActive(l)}>
                {l}
              </Chip>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            marginBottom: 32,
          }}
        >
          {LOCALES.map((l) => (
            <Card key={l.code} padding={28}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 14,
                }}
              >
                <Badge tone="neutral">
                  {l.code} · {l.name}
                </Badge>
                <span className="mono" style={{ fontSize: 11, color: "var(--slate)" }}>
                  {l.subtitle}
                </span>
              </div>
              <h2
                className="display"
                style={{ fontSize: 32, margin: 0, lineHeight: 0.95, whiteSpace: "pre-line" }}
              >
                {l.hero}
              </h2>
              <p style={{ fontSize: 13, color: "var(--slate)", marginTop: 14, lineHeight: 1.55 }}>
                {l.sub}
              </p>
              <Button
                variant="accent"
                style={{ marginTop: 18, width: "100%", justifyContent: "center" }}
              >
                {l.cta}
              </Button>
            </Card>
          ))}
        </div>

        <h3 className="display" style={{ fontSize: 26, marginBottom: 14 }}>
          COVERAGE
        </h3>
        <Card padding={0} style={{ overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Language", "Code", "Coverage", "Surfaces", "Status"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      color: "var(--slate)",
                      background: "var(--surface-2)",
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ fontSize: 13 }}>
              {COVERAGE.map((row) => (
                <tr key={row.code} style={{ borderTop: "1px solid var(--hairline)" }}>
                  <td style={{ padding: "14px 16px", fontWeight: 500 }}>{row.language}</td>
                  <td className="mono" style={{ padding: "14px 16px" }}>
                    {row.code}
                  </td>
                  <td style={{ padding: "14px 16px", width: 220 }}>
                    <div
                      style={{
                        height: 6,
                        background: "var(--surface-2)",
                        borderRadius: 999,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${row.coverage}%`,
                          height: "100%",
                          background:
                            row.coverage >= 90
                              ? "var(--success)"
                              : row.coverage >= 50
                                ? "var(--accent)"
                                : "var(--warn)",
                        }}
                      />
                    </div>
                    <div
                      className="mono"
                      style={{ fontSize: 11, color: "var(--slate)", marginTop: 4 }}
                    >
                      {row.coverage}%
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", color: "var(--slate)" }}>{row.surfaces}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <Badge tone={STATUS_TONE[row.status]}>{row.status.toUpperCase()}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
