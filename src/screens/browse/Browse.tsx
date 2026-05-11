import { useState } from "react";
import Nav from "@/components/Nav";
import Icon from "@/components/Icon";
import Chip from "@/components/Chip";
import Badge from "@/components/Badge";
import FilterBar, { FilterDivider, LocationFilter } from "@/components/FilterBar";
import PropertyCard, { type PropertyCardData } from "@/components/PropertyCard";
import MapPanel from "./MapPanel";

const LISTINGS: PropertyCardData[] = [
  { id: "l0", title: "Sunlit Backroom", area: "Brixton, JHB", price: 4200, beds: 1, baths: 1, sqm: 22, type: "Backroom", tag: "New" },
  { id: "l1", title: "Garden Cottage", area: "Westdene, JHB", price: 6800, beds: 2, baths: 1, sqm: 48, type: "Cottage", tag: "Verified" },
  { id: "l2", title: "Studio Flatlet", area: "Melville, JHB", price: 5400, beds: 1, baths: 1, sqm: 32, type: "Flatlet", tag: "Open house Sat" },
  { id: "l3", title: "Quiet Backroom", area: "Yeoville, JHB", price: 3200, beds: 1, baths: 1, sqm: 18, type: "Backroom" },
  { id: "l4", title: "Modern Studio", area: "Auckland Park, JHB", price: 7100, beds: 1, baths: 1, sqm: 38, type: "Flatlet", tag: "Pet friendly" },
  { id: "l5", title: "Family Cottage", area: "Northcliff, JHB", price: 9800, beds: 2, baths: 2, sqm: 64, type: "Cottage" },
];

const PIN_POSITIONS = [
  { id: "l0", xPct: 22, yPct: 30 },
  { id: "l1", xPct: 55, yPct: 22 },
  { id: "l2", xPct: 38, yPct: 48 },
  { id: "l3", xPct: 70, yPct: 60 },
  { id: "l4", xPct: 30, yPct: 70 },
  { id: "l5", xPct: 62, yPct: 38 },
];

const TYPES = ["Backroom", "Cottage", "Flatlet", "Studio"];

type ViewMode = "list" | "split" | "map";

const VIEW_TOGGLES: { id: ViewMode; icon: "grid" | "list" | "map" }[] = [
  { id: "list", icon: "grid" },
  { id: "split", icon: "list" },
  { id: "map", icon: "map" },
];

export default function Browse() {
  const [view, setView] = useState<ViewMode>("split");
  const [active, setActive] = useState<string | null>("l2");
  const [savedSet, setSavedSet] = useState<Set<string>>(new Set(["l0", "l4"]));
  const [typeSet, setTypeSet] = useState<Set<string>>(new Set(["Backroom", "Cottage"]));

  const toggleType = (t: string) => {
    setTypeSet((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  };

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
        left={<LocationFilter city="Johannesburg" extraAreas={2} />}
        filters={
          <>
            <div style={{ display: "flex", gap: 6 }}>
              {TYPES.map((t) => (
                <Chip key={t} active={typeSet.has(t)} onClick={() => toggleType(t)}>
                  {t}
                </Chip>
              ))}
            </div>
            <FilterDivider />
            <Chip leftIcon="cash" style={{ height: 40 }}>
              R 3,000 – R 8,000
            </Chip>
            <Chip leftIcon="bed" style={{ height: 40 }}>
              1+ beds
            </Chip>
            <Chip leftIcon="sliders" style={{ height: 40 }}>
              More filters
              <Badge tone="accent" className="mono" >3</Badge>
            </Chip>
          </>
        }
        right={
          <>
            <span style={{ fontSize: 13, color: "var(--slate)" }} className="tabular">
              <span style={{ fontWeight: 600, color: "var(--ink)" }}>248</span> homes
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
        {view !== "map" ? (
          <div
            style={{
              flex: view === "split" ? "0 0 60%" : 1,
              overflowY: "auto",
              padding: "24px 32px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: view === "list" ? "repeat(3, 1fr)" : "repeat(2, 1fr)",
                gap: 16,
              }}
            >
              {LISTINGS.map((l) => (
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
          </div>
        ) : null}

        {view !== "list" ? (
          <div style={{ flex: 1, position: "relative", borderLeft: "1px solid var(--hairline)" }}>
            <MapPanel
              listings={LISTINGS}
              pinPositions={PIN_POSITIONS}
              active={active}
              setActive={setActive}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
