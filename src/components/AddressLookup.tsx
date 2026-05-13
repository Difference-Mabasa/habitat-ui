import { useEffect, useId, useRef, useState } from "react";
import Input from "./Input";

/**
 * SA-scoped address autocomplete.
 *
 * Backed by **Nominatim (OpenStreetMap)** in dev: free, no API key,
 * 1 req/sec rate limit, asks for a custom User-Agent. A 300ms debounce
 * + 2-character minimum keeps us comfortably under the rate cap even
 * with users typing fast.
 *
 * Behaviour ports from backroom's `<app-address-lookup>` — hybrid UX:
 * single search input → dropdown of suggestions → tap a row → the
 * structured fields below auto-fill but stay editable. The same
 * AddressValue shape is used so both ends of the wire match.
 *
 * The geocoder lookup is wrapped in a thin adapter so a future swap to
 * a paid provider (Google Places, Mapbox, MapTiler, Pelias) means
 * replacing one function — no caller changes.
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

interface Suggestion {
  displayName: string;
  primary: string;
  secondary: string;
  value: AddressValue;
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

  const pickSuggestion = (s: Suggestion) => {
    onChange(s.value);
    onSuggestionPicked?.(s.value);
    setQuery("");
    setSuggestions([]);
    setOpen(false);
  };

  const setField = (k: keyof AddressValue, v: string) => {
    onChange({ ...value, [k]: v });
  };

  // Hide the dropdown shortly after blur so mousedown on a suggestion
  // still registers before the dropdown unmounts.
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
            // The group-level save can fire after the user picks a
            // suggestion or types something — but only after the hide
            // timer resolves so a mid-click doesn't trip it.
            if (onBlur) setTimeout(onBlur, HIDE_DELAY_MS + 20);
          }}
          placeholder={placeholder}
          autoComplete="off"
          disabled={disabled}
        />
        {open && (loading || suggestions.length > 0) ? (
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
            {loading ? (
              <li
                style={{
                  padding: "10px 12px",
                  fontSize: 13,
                  color: "var(--slate)",
                }}
              >
                Searching…
              </li>
            ) : (
              suggestions.map((s, i) => (
                <li
                  key={`${s.displayName}-${i}`}
                  role="option"
                  aria-selected={false}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    pickSuggestion(s);
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

// ── Geocoder adapter ─────────────────────────────────────────────────

/**
 * Nominatim shape (subset).
 */
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

async function searchAddresses(query: string): Promise<Suggestion[]> {
  const params = new URLSearchParams({
    q: query,
    format: "jsonv2",
    countrycodes: "za",
    addressdetails: "1",
    limit: "8",
  });
  const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;
  const res = await fetch(url, {
    headers: {
      // Nominatim asks for an explicit User-Agent identifying the app.
      // Browsers strip custom User-Agent headers from fetch requests
      // (security restriction) so this is a no-op; the Accept-Language
      // hint gets honoured though, which is what we actually need.
      "Accept-Language": "en",
    },
  });
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
  return {
    displayName: row.display_name,
    primary,
    secondary: secondaryParts.join(" · "),
    value: {
      addressLine: street,
      suburb,
      city,
      province,
      postalCode,
      latitude: numberOrNull(row.lat),
      longitude: numberOrNull(row.lon),
    },
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
