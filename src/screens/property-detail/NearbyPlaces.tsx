import { useEffect, useMemo, useRef, useState } from "react";
import Card from "@/components/Card";
import Chip from "@/components/Chip";
import Icon, { type IconName } from "@/components/Icon";

type CategoryId = "all" | "cafes" | "schools" | "transit" | "hospitals" | "parks" | "shopping";
type ResolvedCategory = Exclude<CategoryId, "all">;

interface NearbyPlace {
  id: string;
  name: string;
  category: ResolvedCategory;
  /** Distance in metres from the property. */
  distanceM: number;
  position: google.maps.LatLngLiteral;
}

const CATEGORIES: { id: CategoryId; label: string; icon: IconName; types: string[] }[] = [
  { id: "all",       label: "All nearby",   icon: "pin",    types: [] },
  { id: "cafes",     label: "Cafés & food", icon: "flame",  types: ["cafe", "restaurant"] },
  { id: "schools",   label: "Schools",      icon: "paper",  types: ["school", "primary_school", "secondary_school", "university"] },
  { id: "transit",   label: "Transit",      icon: "bolt",   types: ["bus_station", "train_station", "transit_station"] },
  { id: "hospitals", label: "Health",       icon: "shield", types: ["hospital", "pharmacy", "doctor"] },
  { id: "parks",     label: "Parks",        icon: "park",   types: ["park"] },
  { id: "shopping",  label: "Shopping",     icon: "cash",   types: ["shopping_mall", "supermarket", "store"] },
];

const CATEGORY_TONE: Record<ResolvedCategory, { color: string; bg: string }> = {
  cafes:     { color: "var(--accent)",  bg: "var(--accent-soft)" },
  schools:   { color: "var(--ink)",     bg: "var(--surface-3)" },
  transit:   { color: "var(--slate)",   bg: "var(--surface-2)" },
  hospitals: { color: "var(--danger)",  bg: "var(--danger-soft)" },
  parks:     { color: "var(--success)", bg: "var(--success-soft)" },
  shopping:  { color: "var(--warn)",    bg: "var(--warn-soft)" },
};

/** Map a Google Places type back to one of our category buckets. First match wins. */
function categoryForTypes(types: readonly string[]): ResolvedCategory | null {
  for (const cat of CATEGORIES) {
    if (cat.id === "all") continue;
    if (types.some((t) => cat.types.includes(t))) {
      return cat.id as ResolvedCategory;
    }
  }
  return null;
}

const DEMO_MAP_ID = "DEMO_MAP_ID";
const NEARBY_RADIUS_M = 1500;

function isGoogleReady(): boolean {
  return typeof window !== "undefined" && Boolean(window.google?.maps?.importLibrary);
}

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

function haversineM(a: google.maps.LatLngLiteral, b: google.maps.LatLngLiteral): number {
  const R = 6_371_000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function formatDistance(m: number): string {
  if (m < 1000) return `${Math.round(m)} m`;
  return `${(m / 1000).toFixed(1)} km`;
}

export interface NearbyPlacesProps {
  latitude: number;
  longitude: number;
}

/**
 * Real Google Map + Places API nearby search. Mirrors backroom's
 * featured/nearby panel: a property pin in the centre, coloured pins
 * for category matches within a 1.5 km radius, a synced side list.
 *
 * Falls back to a small "couldn't load nearby places" notice when the
 * SDK isn't reachable (no key, ad-blocker) — same pattern as MapPanel.
 */
export default function NearbyPlaces({ latitude, longitude }: NearbyPlacesProps) {
  const center = useMemo<google.maps.LatLngLiteral>(
    () => ({ lat: latitude, lng: longitude }),
    [latitude, longitude],
  );
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const propertyMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const placeMarkersRef = useRef<Map<string, google.maps.marker.AdvancedMarkerElement>>(new Map());

  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [cat, setCat] = useState<CategoryId>("all");
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  // 1. Boot the map once, dropping the property marker.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const timer = setTimeout(() => {
        if (!cancelled && !mapRef.current) setUnavailable(true);
      }, 5000);
      await waitForGoogle();
      clearTimeout(timer);
      if (cancelled || !containerRef.current) return;

      const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
      const { AdvancedMarkerElement, PinElement } = (await google.maps.importLibrary(
        "marker",
      )) as google.maps.MarkerLibrary;
      if (cancelled || !containerRef.current) return;

      const map = new Map(containerRef.current, {
        center,
        zoom: 15,
        mapId: DEMO_MAP_ID,
        disableDefaultUI: true,
        zoomControl: true,
        clickableIcons: false,
      });
      mapRef.current = map;

      const propertyPin = new PinElement({
        background: paletteToColor("var(--ink)"),
        borderColor: "#FFFFFF",
        glyphColor: "#FFFFFF",
        scale: 1.3,
      });
      propertyMarkerRef.current = new AdvancedMarkerElement({
        map,
        position: center,
        content: propertyPin.element,
        title: "This property",
      });

      setReady(true);
    })();

    return () => {
      cancelled = true;
      placeMarkersRef.current.forEach((m) => (m.map = null));
      placeMarkersRef.current.clear();
      if (propertyMarkerRef.current) propertyMarkerRef.current.map = null;
      propertyMarkerRef.current = null;
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Fetch nearby places via the new Places API whenever the category changes.
  useEffect(() => {
    if (!ready) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const { Place, SearchNearbyRankPreference } = (await google.maps.importLibrary(
          "places",
        )) as google.maps.PlacesLibrary;
        if (cancelled) return;

        const includedTypes =
          cat === "all"
            ? CATEGORIES.filter((c) => c.id !== "all").flatMap((c) => c.types)
            : CATEGORIES.find((c) => c.id === cat)!.types;

        const { places: results } = await Place.searchNearby({
          fields: ["id", "displayName", "location", "types"],
          locationRestriction: { center, radius: NEARBY_RADIUS_M },
          includedTypes,
          rankPreference: SearchNearbyRankPreference.DISTANCE,
          maxResultCount: 20,
        });

        if (cancelled) return;

        const mapped: NearbyPlace[] = (results ?? [])
          .map((p) => {
            const lat = p.location?.lat?.();
            const lng = p.location?.lng?.();
            const resolved = categoryForTypes(p.types ?? []);
            if (lat == null || lng == null || !p.id || !resolved) return null;
            const position = { lat, lng };
            return {
              id: p.id,
              name: p.displayName ?? "Unnamed place",
              category: resolved,
              distanceM: haversineM(center, position),
              position,
            };
          })
          .filter((p): p is NearbyPlace => p !== null);

        setPlaces(mapped);
      } catch {
        // Common in regions where the Places API isn't enabled for the
        // billing project — leave the list empty, user sees "No places".
        setPlaces([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ready, cat, center]);

  // 3. Sync place markers with the current results.
  useEffect(() => {
    if (!ready) return;
    const map = mapRef.current;
    if (!map) return;

    let cancelled = false;
    (async () => {
      const { AdvancedMarkerElement, PinElement } = (await google.maps.importLibrary(
        "marker",
      )) as google.maps.MarkerLibrary;
      if (cancelled) return;

      const seen = new Set<string>();
      for (const place of places) {
        seen.add(place.id);
        const tone = CATEGORY_TONE[place.category];
        let marker = placeMarkersRef.current.get(place.id);
        if (!marker) {
          const pin = new PinElement({
            background: paletteToColor(tone.color),
            borderColor: "#FFFFFF",
            glyphColor: "#FFFFFF",
            scale: 0.95,
          });
          marker = new AdvancedMarkerElement({
            map,
            position: place.position,
            content: pin.element,
            title: place.name,
          });
          marker.addListener("gmp-click", () => setActiveId(place.id));
          placeMarkersRef.current.set(place.id, marker);
        } else {
          marker.position = place.position;
          marker.map = map;
        }
      }
      // Drop markers no longer in the result set.
      for (const [id, marker] of placeMarkersRef.current) {
        if (!seen.has(id)) {
          marker.map = null;
          placeMarkersRef.current.delete(id);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ready, places]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: places.length };
    for (const c of CATEGORIES) {
      if (c.id !== "all") map[c.id] = places.filter((p) => p.category === c.id).length;
    }
    return map;
  }, [places]);

  const active = places.find((p) => p.id === activeId);

  if (unavailable) {
    return (
      <div
        style={{
          padding: 20,
          background: "var(--surface-2)",
          border: "1px solid var(--hairline)",
          borderRadius: 12,
          fontSize: 13,
          color: "var(--slate)",
        }}
      >
        Couldn't load nearby places — check that Google Maps is reachable.
      </div>
    );
  }

  return (
    <div>
      {/* Category chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {CATEGORIES.map((c) => (
          <Chip
            key={c.id}
            active={cat === c.id}
            leftIcon={c.icon}
            count={counts[c.id]}
            onClick={() => setCat(c.id)}
          >
            {c.label}
          </Chip>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 300px", gap: 16 }}>
        {/* Real Google Map */}
        <div
          ref={containerRef}
          style={{
            height: 360,
            borderRadius: 12,
            overflow: "hidden",
            background: "var(--surface-2)",
          }}
        />

        {/* List panel */}
        <Card padding={0} style={{ height: 360, overflowY: "auto" }}>
          {loading ? (
            <div style={{ padding: 20, textAlign: "center", color: "var(--slate)", fontSize: 13 }}>
              Searching nearby…
            </div>
          ) : places.length === 0 ? (
            <div style={{ padding: 20, textAlign: "center", color: "var(--slate)", fontSize: 13 }}>
              Nothing in this category within {NEARBY_RADIUS_M / 1000} km.
            </div>
          ) : (
            places.map((p, i) => {
              const tone = CATEGORY_TONE[p.category];
              const isActive = activeId === p.id;
              const catIcon = CATEGORIES.find((c) => c.id === p.category)!.icon;
              return (
                <button
                  key={p.id}
                  type="button"
                  onMouseEnter={() => setActiveId(p.id)}
                  onMouseLeave={() => setActiveId((curr) => (curr === p.id ? null : curr))}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 14px",
                    background: isActive ? "var(--surface-2)" : "transparent",
                    border: 0,
                    borderTop: i > 0 ? "1px solid var(--hairline)" : undefined,
                    borderLeft: `2px solid ${isActive ? tone.color : "transparent"}`,
                    cursor: "pointer",
                    textAlign: "left",
                    color: "var(--ink)",
                    fontFamily: "inherit",
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      background: tone.bg,
                      color: tone.color,
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon name={catIcon} size={13} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {p.name}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--slate)" }}>
                      {formatDistance(p.distanceM)} away
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </Card>
      </div>

      {/* Hover tooltip — name + distance for the currently-hovered list item. */}
      {active ? (
        <div
          style={{
            marginTop: 12,
            padding: "10px 14px",
            background: "var(--surface)",
            border: "1px solid var(--hairline)",
            borderRadius: 8,
            fontSize: 13,
            color: "var(--slate)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Icon name="pin" size={13} />
          <strong style={{ color: "var(--ink)" }}>{active.name}</strong>
          <span>·</span>
          <span>{formatDistance(active.distanceM)} from the property</span>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Resolve a CSS var to a hex value the Google PinElement accepts. PinElement
 * doesn't interpolate CSS variables itself, so we map the design-system
 * tones to their canonical tokens.css values manually.
 */
function paletteToColor(cssVar: string): string {
  switch (cssVar) {
    case "var(--accent)":  return "#E97A1F";
    case "var(--ink)":     return "#0B0D12";
    case "var(--slate)":   return "#5B6472";
    case "var(--danger)":  return "#D43A2F";
    case "var(--success)": return "#1B8E55";
    case "var(--warn)":    return "#C98A0E";
    default:               return "#0B0D12";
  }
}
