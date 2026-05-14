import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import Photo from "./Photo";
import Icon, { type IconName } from "./Icon";
import PriceDisplay from "./PriceDisplay";

export type PropertyCardVariant = "grid" | "row" | "compact";

export interface PropertyCardAmenity {
  icon: IconName;
  label: string;
}

export interface PropertyCardData {
  id: string;
  title: string;
  area: string;
  price: number;
  beds: number;
  baths: number;
  sqm?: number;
  type?: string;
  /** "New", "Verified", "Open house Sat", etc. */
  tag?: string;
  photoLabel?: string;
  photoSrc?: string;
}

export interface PropertyCardProps {
  data: PropertyCardData;
  variant?: PropertyCardVariant;
  saved?: boolean;
  active?: boolean;
  onToggleSave?: (id: string) => void;
  onHover?: (id: string) => void;
  href?: string;
  /**
   * Distance from the viewer to this property in km. Renders a small pill
   * overlay in the top-right of the card photo when set; omitted when
   * null/undefined. Drives the landing "Top Rated Near You" card layout
   * — Browse leaves it unset and sees no pill. Currently only honoured
   * by the grid variant.
   */
  distanceKm?: number | null;
}

export default function PropertyCard({
  data,
  variant = "grid",
  saved = false,
  active = false,
  onToggleSave,
  onHover,
  href = "/property",
  distanceKm,
}: PropertyCardProps) {
  if (variant === "compact") return <CompactCard data={data} href={href} />;
  if (variant === "row") {
    return (
      <RowCard
        data={data}
        saved={saved}
        active={active}
        onToggleSave={onToggleSave}
        onHover={onHover}
        href={href}
      />
    );
  }
  return (
    <GridCard
      data={data}
      saved={saved}
      active={active}
      onToggleSave={onToggleSave}
      onHover={onHover}
      href={href}
      distanceKm={distanceKm}
    />
  );
}

function SaveButton({
  saved,
  onClick,
  style,
}: {
  saved: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}) {
  return (
    <button
      type="button"
      aria-label={saved ? "Remove from saved" : "Save"}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
      style={{
        position: "absolute",
        top: 12,
        right: 12,
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: "var(--surface)",
        border: 0,
        display: "grid",
        placeItems: "center",
        color: saved ? "var(--danger)" : "var(--ink)",
        boxShadow: "var(--shadow-sm)",
        cursor: "pointer",
        ...style,
      }}
    >
      <Icon name="heart" size={15} style={{ fill: saved ? "var(--danger)" : "none" }} />
    </button>
  );
}

function TagPill({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        position: "absolute",
        top: 12,
        left: 12,
        background: "var(--surface)",
        border: "1px solid var(--hairline)",
        borderRadius: 6,
        padding: "4px 8px",
        fontSize: 11,
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  );
}

/**
 * Distance-from-viewer pill rendered top-right of the photo. Offset 8px
 * further left than the SaveButton (which sits at right:12, width:32) so
 * the two pills sit side-by-side without overlapping.
 */
function DistancePill({ km }: { km: number }) {
  return (
    <span
      aria-label={`${km.toFixed(1)} km from you`}
      style={{
        position: "absolute",
        top: 12,
        right: 12 + 32 + 8,
        background: "var(--ink)",
        color: "var(--paper)",
        padding: "4px 8px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        fontVariantNumeric: "tabular-nums",
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        boxShadow: "var(--shadow-sm)",
        pointerEvents: "none",
      }}
    >
      <Icon name="pin" size={11} /> {km.toFixed(1)} km
    </span>
  );
}

function GridCard({
  data,
  saved,
  active,
  onToggleSave,
  onHover,
  href,
  distanceKm,
}: Required<Pick<PropertyCardProps, "data">> & Omit<PropertyCardProps, "data" | "variant">) {
  return (
    <Link to={href ?? "/property"} style={{ textDecoration: "none", color: "inherit" }}>
      <article
        onMouseEnter={() => onHover?.(data.id)}
        className="card"
        style={{
          overflow: "hidden",
          cursor: "pointer",
          transition: "transform 200ms, box-shadow 200ms, border-color 200ms",
          borderColor: active ? "var(--ink)" : "var(--hairline)",
          boxShadow: active ? "var(--shadow-md)" : "none",
        }}
      >
        <div style={{ position: "relative" }}>
          <Photo
            ratio="4/3"
            label={data.photoLabel ?? data.title.toLowerCase()}
            src={data.photoSrc}
            style={{ borderRadius: 0 }}
          />
          <SaveButton saved={!!saved} onClick={() => onToggleSave?.(data.id)} />
          {data.tag ? <TagPill>{data.tag}</TagPill> : null}
          {distanceKm != null ? <DistancePill km={distanceKm} /> : null}
        </div>
        <div style={{ padding: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 8,
              marginBottom: 4,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em" }}>{data.title}</span>
            <PriceDisplay amount={data.price} period="/mo" size="sm" />
          </div>
          <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 12 }}>{data.area}</div>
          <div
            style={{
              display: "flex",
              gap: 12,
              fontSize: 12,
              color: "var(--slate)",
              paddingTop: 12,
              borderTop: "1px solid var(--hairline)",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Icon name="bed" size={13} /> {data.beds}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Icon name="bath" size={13} /> {data.baths}
            </span>
            {data.sqm != null ? (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Icon name="sqm" size={13} /> {data.sqm} m²
              </span>
            ) : null}
            {data.type ? (
              <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 11 }}>
                {data.type}
              </span>
            ) : null}
          </div>
        </div>
      </article>
    </Link>
  );
}

function RowCard({
  data,
  saved,
  active,
  onToggleSave,
  onHover,
  href,
}: Required<Pick<PropertyCardProps, "data">> & Omit<PropertyCardProps, "data" | "variant">) {
  return (
    <Link to={href ?? "/property"} style={{ textDecoration: "none", color: "inherit" }}>
      <article
        onMouseEnter={() => onHover?.(data.id)}
        className="card"
        style={{
          display: "grid",
          gridTemplateColumns: "160px 1fr auto",
          gap: 16,
          padding: 12,
          alignItems: "center",
          cursor: "pointer",
          borderColor: active ? "var(--ink)" : "var(--hairline)",
          boxShadow: active ? "var(--shadow-md)" : "none",
        }}
      >
        <div style={{ position: "relative" }}>
          <Photo
            ratio="4/3"
            label={data.photoLabel ?? data.title.toLowerCase()}
            src={data.photoSrc}
            style={{ borderRadius: 8 }}
          />
          {data.tag ? <TagPill>{data.tag}</TagPill> : null}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{data.title}</div>
          <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 8 }}>{data.area}</div>
          <div style={{ display: "flex", gap: 12, fontSize: 12, color: "var(--slate)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Icon name="bed" size={13} /> {data.beds}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Icon name="bath" size={13} /> {data.baths}
            </span>
            {data.sqm != null ? (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Icon name="sqm" size={13} /> {data.sqm} m²
              </span>
            ) : null}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
          <PriceDisplay amount={data.price} period="/mo" size="md" />
          <SaveButton saved={!!saved} onClick={() => onToggleSave?.(data.id)} style={{ position: "static" }} />
        </div>
      </article>
    </Link>
  );
}

function CompactCard({ data, href }: { data: PropertyCardData; href: string }) {
  return (
    <Link to={href} style={{ textDecoration: "none", color: "inherit" }}>
      <article
        className="card"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: 12,
          cursor: "pointer",
        }}
      >
        <Photo
          ratio="1/1"
          label=""
          style={{ width: 56, height: 56, borderRadius: 6, flexShrink: 0 }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {data.title}
          </div>
          <div style={{ fontSize: 11, color: "var(--slate)", marginTop: 2 }}>{data.area}</div>
          <div style={{ marginTop: 4 }}>
            <PriceDisplay amount={data.price} period="/mo" size="sm" tone="accent" />
          </div>
        </div>
      </article>
    </Link>
  );
}
