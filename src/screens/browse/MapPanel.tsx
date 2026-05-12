import { useEffect, useRef } from "react";
import maplibregl, { Map as MlMap, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Photo from "@/components/Photo";
import Icon from "@/components/Icon";
import PriceDisplay from "@/components/PriceDisplay";
import type { PropertyCardData } from "@/components/PropertyCard";

export interface PinPosition {
  id: string;
  lat: number;
  lng: number;
  /** Legacy x/y percent for fallback when lat/lng is unknown — unused once data is migrated. */
  xPct?: number;
  yPct?: number;
}

export interface MapPanelProps {
  listings: PropertyCardData[];
  pinPositions: PinPosition[];
  active: string | null;
  setActive: (id: string) => void;
  /** Initial center if no pins. Defaults to central Joburg. */
  center?: [number, number];
  zoom?: number;
}

// OpenFreeMap public style — OSM tiles, no API key.
const STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";

function formatPrice(n: number): string {
  if (n >= 1_000_000) return `R ${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1_000) return `R ${(n / 1_000).toFixed(1)}k`;
  return `R ${n}`;
}

export default function MapPanel({
  listings,
  pinPositions,
  active,
  setActive,
  center = [28.01, -26.19],
  zoom = 12,
}: MapPanelProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MlMap | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());

  const activeListing = listings.find((l) => l.id === active);

  // Initialise once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE_URL,
      center,
      zoom,
      attributionControl: { compact: true },
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    mapRef.current = map;
    const markers = markersRef.current;
    return () => {
      map.remove();
      mapRef.current = null;
      markers.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync markers when pins or active change.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const seen = new Set<string>();
    for (const pin of pinPositions) {
      if (typeof pin.lat !== "number" || typeof pin.lng !== "number") continue;
      seen.add(pin.id);
      const listing = listings.find((l) => l.id === pin.id);
      if (!listing) continue;

      let marker = markersRef.current.get(pin.id);
      const isActive = active === pin.id;
      if (!marker) {
        const el = buildPinElement(listing.price, isActive, () => setActive(pin.id));
        marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
          .setLngLat([pin.lng, pin.lat])
          .addTo(map);
        markersRef.current.set(pin.id, marker);
      } else {
        marker.setLngLat([pin.lng, pin.lat]);
        const el = marker.getElement();
        updatePinElement(el, listing.price, isActive);
        el.onclick = (e) => {
          e.stopPropagation();
          setActive(pin.id);
        };
      }
    }

    // Drop markers that are no longer in the pin set.
    for (const [id, marker] of markersRef.current) {
      if (!seen.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    }

    // Recenter on the active pin.
    if (active) {
      const activePin = pinPositions.find((p) => p.id === active);
      if (activePin && typeof activePin.lat === "number" && typeof activePin.lng === "number") {
        map.easeTo({ center: [activePin.lng, activePin.lat], duration: 350 });
      }
    }
  }, [pinPositions, listings, active, setActive]);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />

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
            zIndex: 5,
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

function buildPinElement(price: number, isActive: boolean, onClick: () => void): HTMLElement {
  const el = document.createElement("button");
  el.type = "button";
  el.dataset.role = "habitat-map-pin";
  el.style.cursor = "pointer";
  el.style.transformOrigin = "center bottom";
  el.style.transition = "transform 150ms, background 150ms";
  el.style.fontFamily = "inherit";
  el.style.fontVariantNumeric = "tabular-nums";
  el.style.fontSize = "13px";
  el.style.fontWeight = "600";
  el.style.padding = "6px 12px";
  el.style.borderRadius = "999px";
  el.style.boxShadow = "var(--shadow-md)";
  el.style.whiteSpace = "nowrap";
  el.style.display = "inline-flex";
  el.style.alignItems = "center";
  el.style.gap = "4px";
  updatePinElement(el, price, isActive);
  el.onclick = (e) => {
    e.stopPropagation();
    onClick();
  };
  return el;
}

function updatePinElement(el: HTMLElement, price: number, isActive: boolean) {
  el.textContent = formatPrice(price);
  el.style.background = isActive ? "var(--ink)" : "var(--surface)";
  el.style.color = isActive ? "var(--paper)" : "var(--ink)";
  el.style.border = `1px solid ${isActive ? "var(--ink)" : "var(--hairline-strong)"}`;
  el.style.transform = isActive ? "scale(1.05)" : "scale(1)";
  el.style.zIndex = isActive ? "5" : "1";
}
