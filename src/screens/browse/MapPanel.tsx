import Photo from "@/components/Photo";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import IconButton from "@/components/IconButton";
import PriceDisplay from "@/components/PriceDisplay";
import MapPin from "@/components/MapPin";
import type { PropertyCardData } from "@/components/PropertyCard";

export interface MapPanelProps {
  listings: PropertyCardData[];
  pinPositions: { id: string; xPct: number; yPct: number }[];
  active: string | null;
  setActive: (id: string) => void;
}

export default function MapPanel({ listings, pinPositions, active, setActive }: MapPanelProps) {
  const activeListing = listings.find((l) => l.id === active);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `
          linear-gradient(180deg, rgba(11,13,18,0.02), rgba(11,13,18,0)),
          repeating-linear-gradient(0deg, transparent 0 56px, rgba(11,13,18,0.04) 56px 57px),
          repeating-linear-gradient(90deg, transparent 0 56px, rgba(11,13,18,0.04) 56px 57px),
          var(--surface-2)
        `,
      }}
    >
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden="true">
        <path
          d="M 0 200 Q 200 180 400 240 T 800 200"
          stroke="var(--hairline-strong)"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M 100 0 Q 200 200 350 400 T 500 800"
          stroke="var(--hairline-strong)"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M 700 100 L 200 700"
          stroke="var(--hairline-strong)"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
      </svg>

      <div style={{ position: "absolute", top: 16, left: 16, display: "flex", gap: 8 }}>
        <Button variant="secondary" size="sm" leftIcon="search">
          Search this area
        </Button>
        <Button variant="secondary" size="sm" leftIcon="bolt">
          Commute time
        </Button>
      </div>

      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          display: "flex",
          flexDirection: "column",
          border: "1px solid var(--hairline-strong)",
          borderRadius: 8,
          overflow: "hidden",
          background: "var(--surface)",
        }}
      >
        <IconButton
          icon="plus"
          label="Zoom in"
          size="sm"
          style={{ borderRadius: 0, borderBottom: "1px solid var(--hairline)" }}
        />
        <button
          type="button"
          aria-label="Zoom out"
          className="btn btn--ghost btn--icon btn--sm"
          style={{ borderRadius: 0 }}
        >
          —
        </button>
      </div>

      {pinPositions.map((pos) => {
        const listing = listings.find((l) => l.id === pos.id);
        if (!listing) return null;
        const isActive = active === pos.id;
        return (
          <MapPin
            key={pos.id}
            price={listing.price}
            active={isActive}
            onMouseEnter={() => setActive(pos.id)}
            style={{ position: "absolute", left: `${pos.xPct}%`, top: `${pos.yPct}%` }}
          />
        );
      })}

      {activeListing ? (
        <div
          className="card"
          style={{
            position: "absolute",
            bottom: 24,
            left: 24,
            width: 320,
            boxShadow: "var(--shadow-lg)",
            background: "var(--surface)",
            overflow: "hidden",
            padding: 0,
          }}
        >
          <Photo
            ratio="16/9"
            label={activeListing.photoLabel ?? activeListing.title.toLowerCase()}
            src={activeListing.photoSrc}
            style={{ borderRadius: 0 }}
          />
          <div style={{ padding: 14 }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600 }}>{activeListing.title}</span>
              <PriceDisplay amount={activeListing.price} period="" size="sm" />
            </div>
            <div style={{ fontSize: 12, color: "var(--slate)", display: "flex", alignItems: "center", gap: 4 }}>
              <Icon name="pin" size={12} />
              {activeListing.area}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
