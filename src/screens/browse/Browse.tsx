import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Nav from "@/components/Nav";
import Icon from "@/components/Icon";
import Chip from "@/components/Chip";
import Button from "@/components/Button";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import { useViewport } from "@/hooks/useViewport";
import {
  BudgetFilter,
  BedsFilter,
  MoreFiltersControl,
  type MoreFilters,
} from "./FilterPopovers";
import FilterBar, { FilterDivider, LocationFilter } from "@/components/FilterBar";
import PropertyCard, { type PropertyCardData } from "@/components/PropertyCard";
import MapPanel from "./MapPanel";

const LISTINGS: PropertyCardData[] = [];

// JHB suburb centroids (approximate) — feeds the real MapLibre canvas.
const PIN_POSITIONS: { id: string; lat: number; lng: number; xPct?: number; yPct?: number }[] = [];

const TYPES = ["Backroom", "Cottage", "Flatlet", "Studio"];

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

export default function Browse() {
  const [params, setParams] = useSearchParams();
  const { isSm, isMd } = useViewport();
  // On phone, force list view; on tablet, force split-with-narrower-map.
  const [view, setView] = useState<ViewMode>("split");
  const effectiveView: ViewMode = isSm ? "list" : view;
  const [active, setActive] = useState<string | null>(null);
  const [savedSet, setSavedSet] = useState<Set<string>>(new Set());

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

  const patchParams = (mutator: (next: URLSearchParams) => void) => {
    const next = new URLSearchParams(params);
    mutator(next);
    setParams(next, { replace: true });
  };

  const toggleType = (t: string) => {
    const next = new Set(typeSet);
    if (next.has(t)) next.delete(t);
    else next.add(t);
    patchParams((p) => {
      if (next.size === 0) p.delete("type");
      else p.set("type", Array.from(next).join(","));
    });
  };

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

  const removeArea = (name: string) => {
    const next = new Set(areaSet);
    next.delete(name);
    patchParams((p) => {
      p.delete("areas");
      if (next.size === 0) p.delete("location");
      else p.set("location", Array.from(next).join(","));
    });
  };

  const clearAreas = () =>
    patchParams((p) => {
      p.delete("areas");
      p.delete("location");
    });

  const resetAll = () => setParams(new URLSearchParams(), { replace: true });

  const dataState = params.get("state") as "loading" | "error" | null;
  const clearDataState = () => patchParams((p) => p.delete("state"));

  const visibleListings = useMemo(() => {
    return LISTINGS.filter((l) => {
      if (areaSet.size > 0) {
        const matchesArea = Array.from(areaSet).some((area) =>
          l.area.toLowerCase().startsWith(area.toLowerCase()),
        );
        if (!matchesArea) return false;
      }
      if (typeSet.size > 0 && (!l.type || !typeSet.has(l.type))) return false;
      if (minPrice != null && l.price < minPrice) return false;
      if (maxPrice != null && l.price > maxPrice) return false;
      if (minBeds != null && (l.beds ?? 0) < minBeds) return false;
      if (moreFilters.verifiedOnly && l.tag !== "Verified") return false;
      if (moreFilters.newOnly && l.tag !== "New") return false;
      if (moreFilters.minSqm != null && (l.sqm ?? 0) < moreFilters.minSqm) return false;
      return true;
    });
  }, [areaSet, typeSet, minPrice, maxPrice, minBeds, moreFilters.verifiedOnly, moreFilters.newOnly, moreFilters.minSqm]);

  const visiblePins = useMemo(
    () => PIN_POSITIONS.filter((p) => visibleListings.some((l) => l.id === p.id)),
    [visibleListings],
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
        left={<LocationFilter city="Johannesburg" extraAreas={areaSet.size} />}
        filters={
          <>
            {areaSet.size > 0 ? (
              <>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {Array.from(areaSet).map((a) => (
                    <Chip
                      key={a}
                      active
                      leftIcon="pin"
                      onClick={() => removeArea(a)}
                      aria-label={`Remove ${a}`}
                    >
                      {a}
                      <Icon name="x" size={11} style={{ marginLeft: 4 }} />
                    </Chip>
                  ))}
                  <button
                    type="button"
                    onClick={clearAreas}
                    style={{
                      background: "none",
                      border: "none",
                      padding: "0 4px",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      fontSize: 12,
                      color: "var(--slate)",
                      textDecoration: "underline",
                    }}
                  >
                    Clear areas
                  </button>
                </div>
                <FilterDivider />
              </>
            ) : null}
            <div style={{ display: "flex", gap: 6 }}>
              {TYPES.map((t) => (
                <Chip key={t} active={typeSet.has(t)} onClick={() => toggleType(t)}>
                  {t}
                </Chip>
              ))}
            </div>
            <FilterDivider />
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
            {dataState === "loading" ? (
              <LoadingState rows={6} />
            ) : dataState === "error" ? (
              <ErrorState
                title="Couldn't load listings"
                description="The browse feed didn't respond. Retry, or open the saved searches to load cached results."
                onRetry={clearDataState}
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
                      <Button variant="ghost" onClick={clearAreas}>
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
