/**
 * SA-scoped place search. Single source of truth for Google Places /
 * Nominatim address lookups. Consumed by:
 *
 *   - {@link "@/components/PlaceSearch"} — compact input + dropdown
 *     (HeroSearch, future browse filter, etc.).
 *   - {@link "@/components/AddressLookup"} — full picker with structured
 *     fields below (Profile address card).
 *
 * Primary provider: Google Places (matches backroom-ui). Loaded via the
 * script tag in index.html; callers invoke
 * {@code google.maps.importLibrary('places')} which transparently waits
 * for the SDK to finish loading.
 *
 * Fallback: Nominatim (OpenStreetMap). If the Google SDK isn't available
 * (no key, network blocked, ad blocker), the search falls through to a
 * free Nominatim lookup so the UI keeps working.
 */

/** Structured location returned after picking a suggestion. */
export interface PlaceValue {
  addressLine: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: string;
  latitude: number | null;
  longitude: number | null;
}

export const EMPTY_PLACE: PlaceValue = {
  addressLine: "",
  suburb: "",
  city: "",
  province: "",
  postalCode: "",
  latitude: null,
  longitude: null,
};

/**
 * A search hit the user can pick. {@code resolve()} is two-stage because
 * Google's autocomplete returns lightweight predictions and the full
 * address details (components + lat/lng) require a second call.
 * Nominatim returns everything in one call, so {@code resolve} is just a
 * trivial wrapper there.
 */
export interface PlaceSuggestion {
  primary: string;
  secondary: string;
  resolve: () => Promise<PlaceValue>;
}

export async function searchPlaces(query: string): Promise<PlaceSuggestion[]> {
  if (isGoogleAvailable()) {
    try {
      return await searchViaGoogle(query);
    } catch (err) {
      console.warn("Google Places search failed, falling back to Nominatim:", err);
    }
  }
  return searchViaNominatim(query);
}

function isGoogleAvailable(): boolean {
  return typeof window !== "undefined" && Boolean(window.google?.maps?.importLibrary);
}

// ── Google Places ────────────────────────────────────────────────────

async function searchViaGoogle(query: string): Promise<PlaceSuggestion[]> {
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
    .map((pred): PlaceSuggestion => ({
      primary: pred.mainText?.text ?? pred.text.text,
      secondary: pred.secondaryText?.text ?? "",
      resolve: () => resolveGooglePrediction(pred),
    }));
}

async function resolveGooglePrediction(
  pred: google.maps.places.PlacePrediction,
): Promise<PlaceValue> {
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

async function searchViaNominatim(query: string): Promise<PlaceSuggestion[]> {
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

function rowToSuggestion(row: NominatimRow): PlaceSuggestion {
  const a = row.address ?? {};
  const street = joinTrim(a.house_number, a.road ?? a.pedestrian);
  const suburb = a.suburb ?? a.neighbourhood ?? a.quarter ?? a.city_district ?? "";
  const city = a.city ?? a.town ?? a.village ?? "";
  const province = a.state ?? "";
  const postalCode = a.postcode ?? "";
  const primary = street || row.display_name.split(",")[0] || row.display_name;
  const secondaryParts = [suburb, city, province, postalCode].filter(Boolean);
  const value: PlaceValue = {
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
