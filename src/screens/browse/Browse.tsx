import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Nav from "@/components/Nav";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import { useViewport } from "@/hooks/useViewport";
import { useSession } from "@/lib/session";
import { createPropertiesApi, type PropertySummary, type UnitType } from "@/lib/api/properties";
import {
  AreaFilter,
  BudgetFilter,
  BedsFilter,
  MoreFiltersControl,
  TypeFilter,
  type MoreFilters,
  type TypeFilterOption,
} from "./FilterPopovers";
import FilterBar from "@/components/FilterBar";
import PropertyCard, { type PropertyCardData } from "@/components/PropertyCard";
import MapPanel from "./MapPanel";

// Mirrors the API's UnitType enum (premium-aligned; BACKROOM / ROOM removed
// in the V9 schema). Fed into the multi-select TypeFilter dropdown.
const TYPES: TypeFilterOption[] = [
  { label: "Apartment",  value: "APARTMENT" },
  { label: "House",      value: "HOUSE" },
  { label: "Townhouse",  value: "TOWNHOUSE" },
  { label: "Cottage",    value: "COTTAGE" },
  { label: "Studio",     value: "STUDIO" },
];

type ViewMode = "list" | "split" | "map";

const VIEW_TOGGLES: { id: ViewMode; icon: "grid" | "list" | "map" }[] = [
  { id: "list", icon: "grid" },
  { id: "split", icon: "list" },
  { id: "map", icon: "map" },
];

function parseCsvSet(raw: string | null): Set<string> {
  if (!raw) return new Set();
  return new Set(raw.split(",").map((s) => s.trim()).filter(Boolean));
}

function readNumberParam(params: URLSearchParams, key: string): number | null {
  const raw = params.get(key);
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** "APARTMENT_BLOCK" -> "Apartment Block". */
function titleCase(s: string): string {
  return s
    .toLowerCase()
    .split("_")
    .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export default function Browse() {
  const [params, setParams] = useSearchParams();
  const { isSm, isMd } = useViewport();
  const session = useSession();
  const api = useMemo(() => createPropertiesApi(session.client), [session.client]);
  // On phone, force list view; on tablet, force split-with-narrower-map.
  const [view, setView] = useState<ViewMode>("split");
  const effectiveView: ViewMode = isSm ? "list" : view;
  const [active, setActive] = useState<string | null>(null);
  const [savedSet, setSavedSet] = useState<Set<string>>(new Set());

  // Real listings from the API. Filters live on the URL; whenever a param
  // changes we re-fetch (the API does the work, no client-side filtering).
  const [items, setItems] = useState<PropertySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // All filters are URL-driven so the state survives reload and is shareable.
  const areaSet = useMemo(() => parseCsvSet(params.get("location") ?? params.get("areas")), [params]);
  const typeSet = useMemo(() => parseCsvSet(params.get("type")), [params]);
  const minPrice = readNumberParam(params, "minPrice");
  const maxPrice = readNumberParam(params, "maxPrice");
  const minBeds = readNumberParam(params, "minBeds");
  const moreFilters: MoreFilters = {
    verifiedOnly: params.get("verified") === "1",
    newOnly: params.get("new") === "1",
    minSqm: readNumberParam(params, "minSqm"),
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const filters = {
      // API binds repeated/CSV ?location values into List<String>; each
      // value is OR-matched against suburb / city / province server-side.
      location: areaSet.size > 0 ? Array.from(areaSet).join(",") : undefined,
      types: typeSet.size > 0 ? (Array.from(typeSet) as UnitType[]) : undefined,
      maxPrice: maxPrice ?? undefined,
      minBeds: minBeds ?? undefined,
      size: 50,
    };
    void api
      .list(filters)
      .then((page) => {
        if (cancelled) return;
        setItems(page.content);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load listings.");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [api, areaSet, typeSet, maxPrice, minBeds]);

  const patchParams = (mutator: (next: URLSearchParams) => void) => {
    const next = new URLSearchParams(params);
    mutator(next);
    setParams(next, { replace: true });
  };

  const setAreas = (next: string[]) =>
    patchParams((p) => {
      p.delete("areas");
      if (next.length === 0) p.delete("location");
      else p.set("location", next.join(","));
    });

  const setTypes = (next: UnitType[]) =>
    patchParams((p) => {
      if (next.length === 0) p.delete("type");
      else p.set("type", next.join(","));
    });

  const setBudget = ({ minPrice: lo, maxPrice: hi }: { minPrice: number | null; maxPrice: number | null }) =>
    patchParams((p) => {
      if (lo == null) p.delete("minPrice");
      else p.set("minPrice", String(lo));
      if (hi == null) p.delete("maxPrice");
      else p.set("maxPrice", String(hi));
    });

  const setMinBeds = (n: number | null) =>
    patchParams((p) => {
      if (n == null) p.delete("minBeds");
      else p.set("minBeds", String(n));
    });

  const setMoreFilters = (next: MoreFilters) =>
    patchParams((p) => {
      if (next.verifiedOnly) p.set("verified", "1");
      else p.delete("verified");
      if (next.newOnly) p.set("new", "1");
      else p.delete("new");
      if (next.minSqm == null) p.delete("minSqm");
      else p.set("minSqm", String(next.minSqm));
    });

  const resetAll = () => setParams(new URLSearchParams(), { replace: true });

  // Server does location/type/maxPrice/minBeds. minPrice, sqm, verified, new
  // are post-filtered client-side until the API picks them up.
  const visibleListings = useMemo<PropertyCardData[]>(() => {
    return items
      .filter((s) => {
        if (minPrice != null && (s.headlinePrice ?? 0) < minPrice) return false;
        if (moreFilters.minSqm != null && (s.headlineSqm ?? 0) < moreFilters.minSqm) return false;
        return true;
      })
      .map((s) => ({
        id: s.id,
        title: s.title,
        area: s.suburb ?? s.city ?? "—",
        price: s.headlinePrice ?? 0,
        beds: s.headlineBeds ?? 0,
        baths: s.headlineBaths ?? 0,
        sqm: s.headlineSqm ?? undefined,
        type: s.headlineUnitType ? titleCase(s.headlineUnitType) : undefined,
        photoSrc: s.coverImageUrl ?? undefined,
      }));
  }, [items, minPrice, moreFilters.minSqm]);

  const visiblePins = useMemo(
    () =>
      items
        .filter((s) => s.latitude != null && s.longitude != null)
        .filter((s) => visibleListings.some((l) => l.id === s.id))
        .map((s) => ({ id: s.id, lat: s.latitude!, lng: s.longitude! })),
    [items, visibleListings],
  );

  const toggleSave = (id: string) => {
    setSavedSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div style={{ background: "var(--paper)", height: "100vh", display: "flex", flexDirection: "column" }}>
      <Nav role="tenant" />

      <FilterBar
        filters={
          <>
            <AreaFilter areas={Array.from(areaSet)} onChange={setAreas} />
            <TypeFilter
              options={TYPES}
              selected={Array.from(typeSet) as UnitType[]}
              onChange={setTypes}
            />
            <BudgetFilter
              minPrice={minPrice}
              maxPrice={maxPrice}
              onChange={setBudget}
            />
            <BedsFilter minBeds={minBeds} onChange={setMinBeds} />
            <MoreFiltersControl value={moreFilters} onChange={setMoreFilters} />
          </>
        }
        right={
          <>
            <span style={{ fontSize: 13, color: "var(--slate)" }} className="tabular">
              <span style={{ fontWeight: 600, color: "var(--ink)" }}>{visibleListings.length}</span> homes
            </span>
            <div
              style={{
                display: "flex",
                border: "1px solid var(--hairline-strong)",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              {VIEW_TOGGLES.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setView(b.id)}
                  className="btn btn--icon btn--sm"
                  aria-label={`${b.id} view`}
                  style={{
                    borderRadius: 0,
                    border: 0,
                    background: view === b.id ? "var(--ink)" : "transparent",
                    color: view === b.id ? "var(--paper)" : "var(--ink)",
                  }}
                >
                  <Icon name={b.icon} size={15} />
                </button>
              ))}
            </div>
          </>
        }
      />

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {effectiveView !== "map" ? (
          <div
            style={{
              flex: effectiveView === "split" ? (isMd ? "0 0 55%" : "0 0 60%") : 1,
              overflowY: "auto",
              padding: isSm ? "16px 16px" : "24px 32px",
            }}
          >
            {loading ? (
              <LoadingState rows={6} />
            ) : error ? (
              <ErrorState
                title="Couldn't load listings"
                description={error}
                onRetry={resetAll}
              />
            ) : visibleListings.length === 0 ? (
              <EmptyState
                icon="search"
                size="lg"
                title="No spots match these filters"
                description={
                  areaSet.size > 0
                    ? `We couldn't find listings in ${Array.from(areaSet).join(", ")}${
                        typeSet.size > 0 ? ` for ${Array.from(typeSet).join(" / ").toLowerCase()}` : ""
                      }${maxPrice ? ` under R ${maxPrice.toLocaleString("en-ZA")}` : ""}. Widen your filters or clear them to see all listings.`
                    : "Widen your filters or clear them to see all listings."
                }
                actions={
                  <>
                    {areaSet.size > 0 ? (
                      <Button variant="ghost" onClick={() => setAreas([])}>
                        Clear areas
                      </Button>
                    ) : null}
                    <Button variant="accent" onClick={resetAll}>
                      Reset all filters
                    </Button>
                  </>
                }
              />
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isSm
                    ? "1fr"
                    : isMd
                      ? "repeat(2, 1fr)"
                      : effectiveView === "list"
                        ? "repeat(3, 1fr)"
                        : "repeat(2, 1fr)",
                  gap: 16,
                }}
              >
                {visibleListings.map((l) => (
                  <PropertyCard
                    key={l.id}
                    data={l}
                    variant="grid"
                    active={active === l.id}
                    saved={savedSet.has(l.id)}
                    onHover={setActive}
                    onToggleSave={toggleSave}
                    href={`/property/${l.id}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : null}

        {effectiveView !== "list" ? (
          <div style={{ flex: 1, position: "relative", borderLeft: "1px solid var(--hairline)" }}>
            <MapPanel
              listings={visibleListings}
              pinPositions={visiblePins}
              active={active}
              setActive={setActive}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
