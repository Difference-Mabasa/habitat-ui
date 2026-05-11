import { Link } from "react-router-dom";
import Card from "./Card";
import Photo from "./Photo";
import Icon from "./Icon";

export interface AreaCardProps {
  name: string;
  /** Number of units/spots in the area. */
  count: number;
  /** Formatted starting price, e.g. "R 3,200" or "from R 3,200". */
  priceFrom: string;
  /** Aspect ratio for the photo. Default 16/10. */
  ratio?: string;
  photoLabel?: string;
  to?: string;
}

/**
 * Area summary card used on the landing page's "Featured areas" section
 * and the Neighbourhood (Soweto) page's sub-areas grid.
 */
export default function AreaCard({
  name,
  count,
  priceFrom,
  ratio = "16/10",
  photoLabel,
  to = "/browse",
}: AreaCardProps) {
  return (
    <Link to={to} style={{ textDecoration: "none", color: "inherit" }}>
      <Card interactive padding={0} style={{ overflow: "hidden" }}>
        <Photo ratio={ratio} label={photoLabel ?? name.toLowerCase()} style={{ borderRadius: 0 }} />
        <div
          style={{
            padding: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 8,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{name}</div>
            <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 2 }}>
              {count.toLocaleString()} spots · from {priceFrom}
            </div>
          </div>
          <Icon name="arrUR" size={14} style={{ color: "var(--slate)", flexShrink: 0 }} />
        </div>
      </Card>
    </Link>
  );
}
