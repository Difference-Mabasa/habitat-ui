import { useEffect, useId, useRef, useState } from "react";
import Input from "./Input";

/**
 * SA-scoped address autocomplete.
 *
 * **Primary provider: Google Places** (matches backroom-ui). Loaded via
 * the script tag in {@code index.html}; consumers call
 * {@code google.maps.importLibrary('places')} which transparently waits
 * for the SDK to finish loading. Google has materially better SA
 * address + suburb data than alternatives.
 *
 * **Fallback: Nominatim (OpenStreetMap)**. If the Google SDK isn't
 * available (key removed, network blocked, ad blocker, dev env without
 * the script tag), the component falls through to a free Nominatim
 * lookup so the form remains functional. Quality drops but nothing
 * breaks.
 *
 * UX flow (mirrors backroom):
 *   1. User types in the search input.
 *   2. After 300ms debounce + 2-char minimum, fetch predictions.
 *   3. User taps a suggestion -> resolve it (Google: fetchFields for
 *      location + addressComponents; Nominatim: already inline) ->
 *      structured fields below auto-fill.
 *   4. Structured fields stay editable for manual corrections.
 */

export interface AddressValue {
  addressLine: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: string;
  latitude: number | null;
  longitude: number | null;
}

// eslint-disable-next-line react-refresh/only-export-components
export const EMPTY_ADDRESS: AddressValue = {
  addressLine: "",
  suburb: "",
  city: "",
  province: "",
  postalCode: "",
  latitude: null,
  longitude: null,
};

interface AddressLookupProps {
  value: AddressValue;
  onChange: (next: AddressValue) => void;
  /** Optional callback fired the moment a suggestion is picked (vs typed). */
  onSuggestionPicked?: (next: AddressValue) => void;
  /** Placeholder for the search input. */
  placeholder?: string;
  /** Fired when the wrapping field group should save (blur fanout). */
  onBlur?: () => void;
  disabled?: boolean;
}

/**
 * Internal: a search hit the user can pick. `resolve()` is two-stage
 * because Google's autocomplete returns lightweight predictions and the
 * full address details (components + lat/lng) require a second call.
 * Nominatim returns everything in one call, so `resolve` is just a
 * trivial wrapper there.
 */
interface Suggestion {
  primary: string;
  secondary: string;
  resolve: () => Promise<AddressValue>;
}

const DEBOUNCE_MS = 300;
const HIDE_DELAY_MS = 180;
const MIN_QUERY_CHARS = 2;

export default function AddressLookup({
  value,
  onChange,
  onSuggestionPicked,
  placeholder = "Search for your address",
  onBlur,
  disabled,
}: AddressLookupProps) {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resolving, setResolving] = useState(false);

  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search.
  useEffect(() => {
    if (query.trim().length < MIN_QUERY_CHARS) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      void searchAddresses(query)
        .then((s) => {
          setSuggestions(s);
          setLoading(false);
        })
        .catch(() => {
          setSuggestions([]);
          setLoading(false);
        });
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  const pickSuggestion = async (s: Suggestion) => {
    setQuery("");
    setSuggestions([]);
    setOpen(false);
    setResolving(true);
    try {
      const resolved = await s.resolve();
      onChange(resolved);
      onSuggestionPicked?.(resolved);
    } finally {
      setResolving(false);
    }
  };

  const setField = (k: keyof AddressValue, v: string) => {
    onChange({ ...value, [k]: v });
  };

  const scheduleHide = () => {
    hideTimerRef.current = setTimeout(() => setOpen(false), HIDE_DELAY_MS);
  };
  const cancelHide = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Search input */}
      <div style={{ position: "relative" }}>
        <Input
          id={inputId}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            scheduleHide();
            if (onBlur) setTimeout(onBlur, HIDE_DELAY_MS + 20);
          }}
          placeholder={placeholder}
          autoComplete="off"
          disabled={disabled || resolving}
        />
        {open && (loading || resolving || suggestions.length > 0) ? (
          <ul
            role="listbox"
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              right: 0,
              zIndex: 50,
              background: "var(--surface)",
              border: "1px solid var(--hairline-strong)",
              borderRadius: 8,
              boxShadow: "0 6px 24px rgba(0, 0, 0, 0.08)",
              listStyle: "none",
              margin: 0,
              padding: 4,
              maxHeight: 280,
              overflowY: "auto",
            }}
            onMouseDown={cancelHide}
          >
            {loading || resolving ? (
              <li
                style={{
                  padding: "10px 12px",
                  fontSize: 13,
                  color: "var(--slate)",
                }}
              >
                {resolving ? "Loading address…" : "Searching…"}
              </li>
            ) : (
              suggestions.map((s, i) => (
                <li
                  key={`${s.primary}-${i}`}
                  role="option"
                  aria-selected={false}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    void pickSuggestion(s);
                  }}
                  style={{
                    padding: "10px 12px",
                    fontSize: 13,
                    cursor: "pointer",
                    borderRadius: 6,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ fontWeight: 500 }}>{s.primary}</div>
                  {s.secondary ? (
                    <div style={{ fontSize: 11, color: "var(--slate)", marginTop: 2 }}>
                      {s.secondary}
                    </div>
                  ) : null}
                </li>
              ))
            )}
          </ul>
        ) : null}
      </div>

      {/* Structured fields — always visible. The suggestion fills them in
          but the user can edit any of them manually. */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Input
          value={value.addressLine}
          onChange={(e) => setField("addressLine", e.target.value)}
          onBlur={onBlur}
          placeholder="Street address"
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Input
            value={value.suburb}
            onChange={(e) => setField("suburb", e.target.value)}
            onBlur={onBlur}
            placeholder="Suburb"
          />
          <Input
            value={value.city}
            onChange={(e) => setField("city", e.target.value)}
            onBlur={onBlur}
            placeholder="City"
          />
          <Input
            value={value.province}
            onChange={(e) => setField("province", e.target.value)}
            onBlur={onBlur}
            placeholder="Province"
          />
          <Input
            value={value.postalCode}
            onChange={(e) => setField("postalCode", e.target.value)}
            onBlur={onBlur}
            placeholder="Postal code"
            className="mono"
          />
        </div>
      </div>
    </div>
  );
}

// ── Provider router ──────────────────────────────────────────────────

async function searchAddresses(query: string): Promise<Suggestion[]> {
  if (isGoogleAvailable()) {
    try {
      return await searchViaGoogle(query);
    } catch (err) {
      // If Google fails (quota, network, API key issue) we fall back to
      // Nominatim so the form keeps working. Original error captured for
      // diagnosis but not surfaced to the user.
      console.warn("Google Places search failed, falling back to Nominatim:", err);
    }
  }
  return searchViaNominatim(query);
}

function isGoogleAvailable(): boolean {
  return typeof window !== "undefined" && Boolean(window.google?.maps?.importLibrary);
}

// ── Google Places ────────────────────────────────────────────────────

async function searchViaGoogle(query: string): Promise<Suggestion[]> {
  const { AutocompleteSuggestion } = (await google.maps.importLibrary(
    "places",
  )) as google.maps.PlacesLibrary;
  const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
    input: query,
    includedRegionCodes: ["za"],
  });
  return suggestions
    .map((s) => s.placePrediction)
    .filter((p): p is google.maps.places.PlacePrediction => p !== null)
    .map((pred): Suggestion => ({
      primary: pred.mainText?.text ?? pred.text.text,
      secondary: pred.secondaryText?.text ?? "",
      resolve: () => resolveGooglePrediction(pred),
    }));
}

async function resolveGooglePrediction(
  pred: google.maps.places.PlacePrediction,
): Promise<AddressValue> {
  const place = pred.toPlace();
  await place.fetchFields({ fields: ["location", "addressComponents"] });
  const comps = place.addressComponents ?? [];
  const get = (type: string) =>
    comps.find((c) => c.types.includes(type))?.longText ?? "";

  const streetNumber = get("street_number");
  const route = get("route");
  const addressLine = streetNumber ? `${streetNumber} ${route}`.trim() : route;
  const suburb =
    get("sublocality_level_1") || get("sublocality") || get("neighborhood");
  const city = get("locality");
  const province = get("administrative_area_level_1");
  const postalCode = get("postal_code");
  const lat = place.location?.lat() ?? null;
  const lng = place.location?.lng() ?? null;

  return {
    addressLine,
    suburb,
    city,
    province,
    postalCode,
    latitude: lat,
    longitude: lng,
  };
}

// ── Nominatim (fallback) ─────────────────────────────────────────────

interface NominatimRow {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    house_number?: string;
    road?: string;
    pedestrian?: string;
    suburb?: string;
    neighbourhood?: string;
    quarter?: string;
    city_district?: string;
    village?: string;
    town?: string;
    city?: string;
    state?: string;
    postcode?: string;
  };
}

async function searchViaNominatim(query: string): Promise<Suggestion[]> {
  const params = new URLSearchParams({
    q: query,
    format: "jsonv2",
    countrycodes: "za",
    addressdetails: "1",
    limit: "8",
  });
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?${params.toString()}`,
    { headers: { "Accept-Language": "en" } },
  );
  if (!res.ok) throw new Error(`geocoder ${res.status}`);
  const rows = (await res.json()) as NominatimRow[];
  return rows.map(rowToSuggestion);
}

function rowToSuggestion(row: NominatimRow): Suggestion {
  const a = row.address ?? {};
  const street = joinTrim(a.house_number, a.road ?? a.pedestrian);
  const suburb = a.suburb ?? a.neighbourhood ?? a.quarter ?? a.city_district ?? "";
  const city = a.city ?? a.town ?? a.village ?? "";
  const province = a.state ?? "";
  const postalCode = a.postcode ?? "";
  const primary = street || row.display_name.split(",")[0] || row.display_name;
  const secondaryParts = [suburb, city, province, postalCode].filter(Boolean);
  const value: AddressValue = {
    addressLine: street,
    suburb,
    city,
    province,
    postalCode,
    latitude: numberOrNull(row.lat),
    longitude: numberOrNull(row.lon),
  };
  return {
    primary,
    secondary: secondaryParts.join(" · "),
    resolve: () => Promise.resolve(value),
  };
}

function joinTrim(...parts: (string | undefined | null)[]): string {
  return parts.filter((p) => p && p.length > 0).join(" ");
}

function numberOrNull(s: string | undefined): number | null {
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}
