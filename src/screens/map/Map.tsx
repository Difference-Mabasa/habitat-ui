import Nav from "@/components/Nav";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import IconButton from "@/components/IconButton";
import Card from "@/components/Card";
import Photo from "@/components/Photo";
import PriceDisplay from "@/components/PriceDisplay";
import MapPin from "@/components/MapPin";

interface Pin {
  id: string;
  xPct: number;
  yPct: number;
  rent: number;
  hot: boolean;
}

interface Cluster {
  id: string;
  xPct: number;
  yPct: number;
  count: number;
}

const PINS: Pin[] = [
  { id: "p1", xPct: 22, yPct: 40, rent: 3800, hot: false },
  { id: "p2", xPct: 28, yPct: 32, rent: 4400, hot: true },
  { id: "p3", xPct: 35, yPct: 48, rent: 5200, hot: false },
  { id: "p4", xPct: 42, yPct: 30, rent: 6100, hot: false },
  { id: "p5", xPct: 48, yPct: 52, rent: 4900, hot: true },
  { id: "p6", xPct: 55, yPct: 38, rent: 5800, hot: false },
  { id: "p7", xPct: 62, yPct: 60, rent: 7200, hot: false },
  { id: "p8", xPct: 68, yPct: 28, rent: 4200, hot: false },
  { id: "p9", xPct: 75, yPct: 44, rent: 5500, hot: true },
  { id: "p10", xPct: 82, yPct: 56, rent: 6800, hot: false },
];

const CLUSTERS: Cluster[] = [
  { id: "c1", xPct: 18, yPct: 22, count: 14 },
  { id: "c2", xPct: 88, yPct: 34, count: 23 },
  { id: "c3", xPct: 30, yPct: 70, count: 8 },
];

export default function MapView() {
  return (
    <div style={{ background: "var(--paper)", height: "100vh", display: "flex", flexDirection: "column" }}>
      <Nav role="tenant" />

      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {/* Map canvas */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "var(--surface-2)",
            backgroundImage: `
              radial-gradient(circle at 30% 40%, color-mix(in oklch, var(--accent) 4%, transparent), transparent 40%),
              radial-gradient(circle at 70% 60%, color-mix(in oklch, var(--success) 4%, transparent), transparent 40%),
              linear-gradient(var(--hairline) 1px, transparent 1px),
              linear-gradient(90deg, var(--hairline) 1px, transparent 1px)
            `,
            backgroundSize: "auto, auto, 32px 32px, 32px 32px",
          }}
        >
          {/* Roads */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden="true">
            <path d="M 0 380 Q 400 320 800 400 T 1440 360" fill="none" stroke="var(--hairline-strong)" strokeWidth="3" opacity="0.4" />
            <path d="M 200 0 L 220 900" fill="none" stroke="var(--hairline-strong)" strokeWidth="2" opacity="0.4" />
            <path d="M 720 0 L 700 900" fill="none" stroke="var(--hairline-strong)" strokeWidth="2" opacity="0.4" />
            <path d="M 1100 0 L 1130 900" fill="none" stroke="var(--hairline-strong)" strokeWidth="2" opacity="0.4" />
            <path d="M 0 600 L 1440 580" fill="none" stroke="var(--hairline-strong)" strokeWidth="2" opacity="0.4" />
          </svg>

          {/* Drawn search area */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden="true">
            <path
              d="M 280 220 Q 480 180 700 240 Q 820 360 760 540 Q 540 620 320 540 Q 200 380 280 220 Z"
              fill="color-mix(in oklch, var(--accent) 6%, transparent)"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
          </svg>

          {/* Clusters */}
          {CLUSTERS.map((c) => (
            <div
              key={c.id}
              className="mono"
              style={{
                position: "absolute",
                left: `${c.xPct}%`,
                top: `${c.yPct}%`,
                transform: "translate(-50%, -50%)",
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "var(--ink)",
                color: "var(--paper)",
                display: "grid",
                placeItems: "center",
                fontSize: 13,
                fontWeight: 600,
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                border: "2px solid var(--paper)",
              }}
            >
              {c.count}
            </div>
          ))}

          {/* Price pins */}
          {PINS.map((p) => (
            <MapPin
              key={p.id}
              price={p.rent}
              tone={p.hot ? "accent" : "default"}
              style={{ position: "absolute", left: `${p.xPct}%`, top: `${p.yPct}%` }}
            />
          ))}
        </div>

        {/* Top floating bar */}
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            right: 16,
            display: "flex",
            gap: 10,
            alignItems: "center",
            zIndex: 2,
          }}
        >
          <div style={{ flex: 1, maxWidth: 480, position: "relative" }}>
            <Icon
              name="search"
              size={14}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--slate)",
              }}
            />
            <input
              className="input"
              placeholder="Search Melville, Brixton…"
              defaultValue="Melville · 5km"
              style={{
                paddingLeft: 36,
                height: 40,
                background: "var(--paper)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            />
          </div>
          <Button
            variant="secondary"
            leftIcon="edit"
            style={{ background: "var(--paper)", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
          >
            Draw area
          </Button>
          <Button
            variant="secondary"
            leftIcon="sliders"
            style={{ background: "var(--paper)", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
          >
            R3k–R7k · 1+ bed · 4 more
          </Button>
          <div style={{ flex: 1 }} />
          <Button
            variant="accent"
            leftIcon="bell"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}
          >
            Save & alert me
          </Button>
        </div>

        {/* Map controls */}
        <div
          style={{
            position: "absolute",
            right: 16,
            top: 80,
            display: "flex",
            flexDirection: "column",
            gap: 4,
            zIndex: 2,
          }}
        >
          <IconButton
            icon="plus"
            label="Zoom in"
            variant="secondary"
            style={{ background: "var(--paper)", boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }}
          />
          <button
            type="button"
            aria-label="Zoom out"
            className="btn btn--secondary btn--icon"
            style={{ background: "var(--paper)", boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>−</span>
          </button>
          <div style={{ height: 8 }} />
          <IconButton
            icon="pin"
            label="Recenter"
            variant="secondary"
            style={{ background: "var(--paper)", boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }}
          />
        </div>

        {/* Floating result card */}
        <Card
          padding={14}
          style={{
            position: "absolute",
            bottom: 24,
            left: 24,
            width: 360,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            display: "flex",
            gap: 14,
            zIndex: 2,
          }}
        >
          <Photo ratio="auto" label="" style={{ width: 100, height: 80, borderRadius: 6, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 4,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600 }}>Sunlit cottage · Caroline</div>
              <PriceDisplay amount={4400} period="" size="sm" />
            </div>
            <div style={{ fontSize: 11, color: "var(--slate)", marginBottom: 8 }}>
              1 bed · 1 bath · 38 m² · 1.2 km
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <Button variant="ghost" size="sm" leftIcon="heart" style={{ height: 26, fontSize: 11 }}>
                Save
              </Button>
              <Button variant="accent" size="sm" style={{ height: 26, fontSize: 11 }}>
                View
              </Button>
            </div>
          </div>
        </Card>

        {/* Result count chip */}
        <div style={{ position: "absolute", bottom: 24, right: 24, zIndex: 2 }}>
          <div
            style={{
              background: "var(--ink)",
              color: "var(--paper)",
              padding: "8px 14px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Icon name="pin" size={12} />
            47 spots in this area
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              style={{ height: 22, fontSize: 11, color: "var(--paper)", padding: "0 8px" }}
            >
              List view
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
