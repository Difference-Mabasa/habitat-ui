import { type ApiClient } from "./client";

// Mirrors the API enums (com.habitat.api.enums.*). Kept inline rather than
// pulled from a generated client so the surface is grep-able from the UI.
export type PropertyType =
  | "HOUSE"
  | "FLAT"
  | "APARTMENT_BLOCK"
  | "TOWNHOUSE_COMPLEX"
  | "COMPLEX"
  | "PLOT"
  | "FARM";

export type UnitType =
  | "APARTMENT"
  | "HOUSE"
  | "TOWNHOUSE"
  | "COTTAGE"
  | "STUDIO"
  | "FLATLET";

export type PropertyStatus = "DRAFT" | "LISTED" | "UNLISTED";
export type UnitStatus = "AVAILABLE" | "OCCUPIED" | "UNDER_MAINTENANCE" | "UNLISTED";
export type FurnishingType = "FURNISHED" | "SEMI_FURNISHED" | "UNFURNISHED";
export type PaymentFrequency = "WEEKLY" | "MONTHLY";

export interface PropertyImage {
  id: string;
  url: string;
  isCover: boolean;
  sortOrder: number;
}

export interface UnitDetail {
  id: string;
  propertyId: string;
  unitNumber: string | null;
  title: string;
  description: string | null;
  unitType: UnitType;
  status: UnitStatus;
  furnishing: FurnishingType | null;
  price: number;
  paymentFrequency: PaymentFrequency;
  deposit: number | null;
  bedrooms: number;
  bathrooms: number;
  sqm: number | null;
  maxOccupants: number | null;
  waterIncluded: boolean;
  electricityIncluded: boolean;
  petsAllowed: boolean;
  availableFrom: string | null;
  images: PropertyImage[];
}

export interface PropertyDetail {
  id: string;
  title: string;
  description: string | null;
  propertyType: PropertyType;
  status: PropertyStatus;
  addressLine: string | null;
  suburb: string | null;
  city: string | null;
  province: string | null;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
  landlordId: string;
  managerId: string;
  images: PropertyImage[];
  units: UnitDetail[];
  createdAt: string;
}

export interface PropertySummary {
  id: string;
  title: string;
  suburb: string | null;
  city: string | null;
  province: string | null;
  latitude: number | null;
  longitude: number | null;
  propertyType: PropertyType;
  coverImageUrl: string | null;
  headlineUnitId: string | null;
  headlineUnitType: UnitType | null;
  headlinePrice: number | null;
  headlineBeds: number | null;
  headlineBaths: number | null;
  headlineSqm: number | null;
  totalUnits: number;
  availableUnits: number;
  /** ISO 8601 timestamp of when the property was first created. */
  createdAt: string;
  /** Aggregated rating (0.00–5.00). Zero for new / un-reviewed listings. */
  avgRating: number;
  /** Number of reviews backing avgRating. Zero for un-reviewed listings. */
  ratingCount: number;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type SortKey = "NEWEST" | "PRICE" | "BEDROOMS" | "SIZE";
export type SortDirection = "ASC" | "DESC";

export interface PropertySearchFilters {
  location?: string;
  /** One or more unit types — sent as comma-separated `type=APARTMENT,STUDIO`. */
  types?: UnitType[];
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  minSqm?: number;
  sort?: SortKey;
  dir?: SortDirection;
  page?: number;
  size?: number;
}

export interface CreatePropertyPayload {
  title: string;
  description?: string;
  propertyType: PropertyType;
  addressLine?: string;
  suburb?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}

export type UpdatePropertyPayload = Partial<CreatePropertyPayload> & {
  status?: PropertyStatus;
};

export interface CreateUnitPayload {
  unitNumber?: string;
  title: string;
  description?: string;
  unitType: UnitType;
  furnishing?: FurnishingType;
  price: number;
  paymentFrequency?: PaymentFrequency;
  deposit?: number;
  bedrooms: number;
  bathrooms: number;
  sqm?: number;
  maxOccupants?: number;
  waterIncluded?: boolean;
  electricityIncluded?: boolean;
  petsAllowed?: boolean;
  availableFrom?: string;
}

export type UpdateUnitPayload = Partial<CreateUnitPayload> & {
  status?: UnitStatus;
};

export interface PopularArea {
  /** Suburb name — also a valid value for `/browse?location=…`. */
  name: string;
  /** Number of LISTED properties in this suburb. Zero for editorial-fallback rows. */
  listingCount: number;
}

export interface PropertiesApi {
  list(filters?: PropertySearchFilters): Promise<PageResponse<PropertySummary>>;
  getById(id: string): Promise<PropertyDetail>;
  /**
   * Suburbs with the most LISTED properties, capped at {@code size}
   * (default 3). The server falls back to an editorial list when no
   * listings exist, so the response is never empty.
   */
  popularAreas(size?: number): Promise<PopularArea[]>;
  /**
   * Highest-rated LISTED properties, capped at {@code size} (default 4).
   * Server sorts by avgRating DESC, then ratingCount DESC, then
   * createdAt DESC — so an un-reviewed catalogue falls back to newest
   * first instead of returning an empty grid.
   */
  topRated(size?: number): Promise<PropertySummary[]>;
  create(payload: CreatePropertyPayload): Promise<PropertyDetail>;
  update(id: string, payload: UpdatePropertyPayload): Promise<PropertyDetail>;
  delete(id: string): Promise<void>;
  addUnit(propertyId: string, payload: CreateUnitPayload): Promise<UnitDetail>;
  updateUnit(unitId: string, payload: UpdateUnitPayload): Promise<UnitDetail>;
  deleteUnit(unitId: string): Promise<void>;
}

export function createPropertiesApi(client: ApiClient): PropertiesApi {
  return {
    list(filters = {}) {
      const params = new URLSearchParams();
      if (filters.location) params.set("location", filters.location);
      if (filters.types && filters.types.length > 0) {
        params.set("type", filters.types.join(","));
      }
      if (filters.minPrice != null) params.set("minPrice", String(filters.minPrice));
      if (filters.maxPrice != null) params.set("maxPrice", String(filters.maxPrice));
      if (filters.minBeds != null) params.set("minBeds", String(filters.minBeds));
      if (filters.minSqm != null) params.set("minSqm", String(filters.minSqm));
      if (filters.sort) params.set("sort", filters.sort);
      if (filters.dir) params.set("dir", filters.dir);
      if (filters.page != null) params.set("page", String(filters.page));
      if (filters.size != null) params.set("size", String(filters.size));
      const qs = params.toString();
      return client.get<PageResponse<PropertySummary>>(qs ? `/properties?${qs}` : "/properties");
    },
    getById(id) {
      return client.get<PropertyDetail>(`/properties/${id}`);
    },
    popularAreas(size) {
      const path = size != null
        ? `/properties/popular-areas?size=${encodeURIComponent(String(size))}`
        : "/properties/popular-areas";
      return client.get<PopularArea[]>(path);
    },
    topRated(size) {
      const path = size != null
        ? `/properties/top-rated?size=${encodeURIComponent(String(size))}`
        : "/properties/top-rated";
      return client.get<PropertySummary[]>(path);
    },
    create(payload) {
      return client.post<PropertyDetail>("/properties", payload);
    },
    update(id, payload) {
      return client.patch<PropertyDetail>(`/properties/${id}`, payload);
    },
    delete(id) {
      return client.delete<void>(`/properties/${id}`);
    },
    addUnit(propertyId, payload) {
      return client.post<UnitDetail>(`/properties/${propertyId}/units`, payload);
    },
    updateUnit(unitId, payload) {
      return client.patch<UnitDetail>(`/units/${unitId}`, payload);
    },
    deleteUnit(unitId) {
      return client.delete<void>(`/units/${unitId}`);
    },
  };
}
