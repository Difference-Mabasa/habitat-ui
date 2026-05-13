import { useEffect, useRef, useState } from "react";
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
  /** Initial center as [lng, lat] (matches the prior MapLibre signature). */
  center?: [number, number];
  zoom?: number;
}

/**
 * Google-Maps-backed browse panel. The Maps + Places JS SDK is loaded
 * globally via the script tag in index.html (same key the hero search and
 * profile address picker use); we just wait for `google.maps.importLibrary`
 * to be wired and then materialise the map + AdvancedMarkerElements.
 *
 * Active state mirrors the previous MapLibre behaviour: hovering a card on
 * the left highlights the matching pin and recentres the map; clicking a
 * pin promotes that listing as the active selection (and renders a card
 * overlay bottom-left).
 *
 * Map ID: "DEMO_MAP_ID" is Google's free fallback that unlocks
 * AdvancedMarkerElement without a Cloud-configured map style. Swap to a
 * real Map ID once we want custom map styling.
 */
const DEMO_MAP_ID = "DEMO_MAP_ID";

function formatPrice(n: number): string {
  if (n >= 1_000_000) return `R ${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1_000) return `R ${(n / 1_000).toFixed(1)}k`;
  return `R ${n}`;
}

function isGoogleReady(): boolean {
  return typeof window !== "undefined" && Boolean(window.google?.maps?.importLibrary);
}

/** Resolve once the Google Maps SDK has set window.google.maps. Polls because
 *  the script tag is async/defer and may not be parsed when the component mounts. */
function waitForGoogle(): Promise<void> {
  return new Promise((resolve) => {
    if (isGoogleReady()) return resolve();
    const t = setInterval(() => {
      if (isGoogleReady()) {
        clearInterval(t);
        resolve();
      }
    }, 100);
  });
}

export default function MapPanel({
  listings,
  pinPositions,
  active,
  setActive,
  center = [28.01, -26.19],
  zoom = 11,
}: MapPanelProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.marker.AdvancedMarkerElement>>(new Map());
  const [ready, setReady] = useState(false);
  const [missingKey, setMissingKey] = useState(false);

  const activeListing = listings.find((l) => l.id === active);

  // Initialise the map once Google is loaded.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Five-second budget — if the script never resolves the user is
      // either offline or the API key was never wired; fall through to a
      // friendly placeholder rather than spin forever.
      const timer = setTimeout(() => {
        if (!cancelled && !mapRef.current) setMissingKey(true);
      }, 5000);

      await waitForGoogle();
      clearTimeout(timer);
      if (cancelled || !containerRef.current) return;

      const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
      if (cancelled || !containerRef.current) return;

      const map = new Map(containerRef.current, {
        center: { lat: center[1], lng: center[0] },
        zoom,
        mapId: DEMO_MAP_ID,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        clickableIcons: false,
      });
      mapRef.current = map;
      setReady(true);
    })();

    return () => {
      cancelled = true;
      mapRef.current = null;
      const markers = markersRef.current;
      markers.forEach((m) => (m.map = null));
      markers.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync markers + recenter on active.
  useEffect(() => {
    if (!ready) return;
    const map = mapRef.current;
    if (!map) return;

    let cancelled = false;
    (async () => {
      const { AdvancedMarkerElement } = (await google.maps.importLibrary(
        "marker",
      )) as google.maps.MarkerLibrary;
      if (cancelled) return;

      const seen = new Set<string>();
      for (const pin of pinPositions) {
        if (typeof pin.lat !== "number" || typeof pin.lng !== "number") continue;
        seen.add(pin.id);
        const listing = listings.find((l) => l.id === pin.id);
        if (!listing) continue;

        const isActive = active === pin.id;
        const position = { lat: pin.lat, lng: pin.lng };
        let marker = markersRef.current.get(pin.id);
        if (!marker) {
          const el = buildPinElement(listing.price, isActive, () => setActive(pin.id));
          marker = new AdvancedMarkerElement({
            map,
            position,
            content: el,
          });
          markersRef.current.set(pin.id, marker);
        } else {
          marker.position = position;
          marker.map = map;
          updatePinElement(marker.content as HTMLElement, listing.price, isActive);
        }
      }

      // Detach markers that no longer match a pin.
      for (const [id, marker] of markersRef.current) {
        if (!seen.has(id)) {
          marker.map = null;
          markersRef.current.delete(id);
        }
      }

      // Recentre on the active pin so the card overlay lines up.
      if (active) {
        const activePin = pinPositions.find((p) => p.id === active);
        if (activePin && typeof activePin.lat === "number" && typeof activePin.lng === "number") {
          map.panTo({ lat: activePin.lat, lng: activePin.lng });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ready, pinPositions, listings, active, setActive]);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />

      {!ready && !missingKey ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            background: "var(--surface-2)",
            color: "var(--slate)",
            fontSize: 13,
          }}
        >
          Loading map…
        </div>
      ) : null}

      {missingKey ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            background: "var(--surface-2)",
            color: "var(--slate)",
            fontSize: 13,
            padding: 24,
            textAlign: "center",
          }}
        >
          Map unavailable — the Google Maps key didn&apos;t load. The listings still work in the list view.
        </div>
      ) : null}

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
