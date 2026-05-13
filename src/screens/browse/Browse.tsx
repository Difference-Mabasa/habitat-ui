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
import {
  createPropertiesApi,
  type PropertySummary,
  type SortDirection,
  type SortKey,
  type UnitType,
} from "@/lib/api/properties";
import {
  AreaFilter,
  BudgetFilter,
  BedsFilter,
  SizeFilter,
  SortFilter,
  TypeFilter,
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

// Grid is 3 columns wide on desktop and 2 on tablet; 12 fits 4 rows / 6 rows
// without leaving a half-empty trailing row at common widths.
const PAGE_SIZE = 12;

function readIntParam(params: URLSearchParams, key: string): number | null {
  const raw = params.get(key);
  if (!raw) return null;
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 ? n : null;
}

function readSortKey(raw: string | null): SortKey {
  if (raw === "PRICE" || raw === "BEDROOMS" || raw === "SIZE" || raw === "NEWEST") return raw;
  return "NEWEST";
}

function readSortDirection(raw: string | null): SortDirection {
  return raw === "ASC" ? "ASC" : "DESC";
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
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // All filters are URL-driven so the state survives reload and is shareable.
  const areaSet = useMemo(() => parseCsvSet(params.get("location") ?? params.get("areas")), [params]);
  const typeSet = useMemo(() => parseCsvSet(params.get("type")), [params]);
  const minPrice = readNumberParam(params, "minPrice");
  const maxPrice = readNumberParam(params, "maxPrice");
  const minBeds = readNumberParam(params, "minBeds");
  const minSqm = readNumberParam(params, "minSqm");
  const sort: SortKey = readSortKey(params.get("sort"));
  const direction: SortDirection = readSortDirection(params.get("dir"));
  // Page is 0-indexed on the wire and in the URL; the pagination control
  // displays it 1-indexed.
  const page = Math.max(0, readIntParam(params, "page") ?? 0);
  const pageSize = PAGE_SIZE;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const filters = {
      // API binds repeated/CSV ?location values into List<String>; each
      // value is OR-matched against suburb / city / province server-side.
      location: areaSet.size > 0 ? Array.from(areaSet).join(",") : undefined,
      types: typeSet.size > 0 ? (Array.from(typeSet) as UnitType[]) : undefined,
      minPrice: minPrice ?? undefined,
      maxPrice: maxPrice ?? undefined,
      minBeds: minBeds ?? undefined,
      minSqm: minSqm ?? undefined,
      sort,
      dir: direction,
      page,
      size: pageSize,
    };
    void api
      .list(filters)
      .then((response) => {
        if (cancelled) return;
        setItems(response.content);
        setTotalElements(response.totalElements);
        setTotalPages(response.totalPages);
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
  }, [api, areaSet, typeSet, minPrice, maxPrice, minBeds, minSqm, sort, direction, page, pageSize]);

  /** Any filter change resets the page back to 0 — the user's expectation is
   *  "I narrowed the list, show me from the top" and it also avoids landing on
   *  an out-of-range page after the result set shrinks. */
  const patchFilter = (mutator: (next: URLSearchParams) => void) => {
    const next = new URLSearchParams(params);
    next.delete("page");
    mutator(next);
    setParams(next, { replace: true });
  };

  const setAreas = (next: string[]) =>
    patchFilter((p) => {
      p.delete("areas");
      if (next.length === 0) p.delete("location");
      else p.set("location", next.join(","));
    });

  const setTypes = (next: UnitType[]) =>
    patchFilter((p) => {
      if (next.length === 0) p.delete("type");
      else p.set("type", next.join(","));
    });

  const setSort = (next: { sort: SortKey; direction: SortDirection }) =>
    patchFilter((p) => {
      // NEWEST + DESC is the implicit default — keep the URL clean by
      // omitting both params for that case.
      if (next.sort === "NEWEST" && next.direction === "DESC") {
        p.delete("sort");
        p.delete("dir");
      } else {
        p.set("sort", next.sort);
        p.set("dir", next.direction);
      }
    });

  const setBudget = ({ minPrice: lo, maxPrice: hi }: { minPrice: number | null; maxPrice: number | null }) =>
    patchFilter((p) => {
      if (lo == null) p.delete("minPrice");
      else p.set("minPrice", String(lo));
      if (hi == null) p.delete("maxPrice");
      else p.set("maxPrice", String(hi));
    });

  const setMinBeds = (n: number | null) =>
    patchFilter((p) => {
      if (n == null) p.delete("minBeds");
      else p.set("minBeds", String(n));
    });

  const setMinSqm = (n: number | null) =>
    patchFilter((p) => {
      if (n == null) p.delete("minSqm");
      else p.set("minSqm", String(n));
    });

  const setPage = (n: number) => {
    const next = new URLSearchParams(params);
    if (n <= 0) next.delete("page");
    else next.set("page", String(n));
    setParams(next, { replace: true });
  };

  const resetAll = () => setParams(new URLSearchParams(), { replace: true });

  // Pure projection — the API already enforces every filter, including
  // minPrice and minSqm. Adding a client-side filter here would mean the
  // paginated page is whatever's LEFT after a second pass, which mismatches
  // totalElements and shows half-empty pages (the backroom PERF-01 bug).
  const visibleListings = useMemo<PropertyCardData[]>(() => {
    return items.map((s) => ({
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
  }, [items]);

  const visiblePins = useMemo(
    () =>
      items
        .filter((s) => s.latitude != null && s.longitude != null)
        .map((s) => ({ id: s.id, lat: s.latitude!, lng: s.longitude! })),
    [items],
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
            <SizeFilter minSqm={minSqm} onChange={setMinSqm} />
            <SortFilter sort={sort} direction={direction} onChange={setSort} />
          </>
        }
        right={
          <>
            <span style={{ fontSize: 13, color: "var(--slate)" }} className="tabular">
              <span style={{ fontWeight: 600, color: "var(--ink)" }}>{totalElements}</span> homes
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

            {!loading && !error && totalPages > 1 ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  padding: "32px 0 16px",
                }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon="chevL"
                  disabled={page <= 0}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <span style={{ fontSize: 13, color: "var(--slate)" }} className="tabular">
                  Page <span style={{ fontWeight: 600, color: "var(--ink)" }}>{page + 1}</span> of {totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  rightIcon="chevR"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            ) : null}
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
