import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Icon, { type IconName } from "@/components/Icon";
import Chip from "@/components/Chip";
import Badge from "@/components/Badge";
import Input from "@/components/Input";
import FormField from "@/components/FormField";
import Eyebrow from "@/components/Eyebrow";
import Toggle from "@/components/Toggle";
import Checkbox from "@/components/Checkbox";
import Button from "@/components/Button";
import PlaceSearch from "@/components/PlaceSearch";
import type { UnitType } from "@/lib/api/properties";

interface PopoverProps {
  /** Visible chip text. */
  label: ReactNode;
  /** Optional accent badge — e.g. active filter count or value. */
  badge?: ReactNode;
  leftIcon?: IconName;
  /** Active state — paints the chip in accent. */
  active?: boolean;
  /** Width of the dropdown panel. */
  width?: number;
  children: (close: () => void) => ReactNode;
}

function FilterPopover({ label, badge, leftIcon, active, width = 280, children }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <Chip
        active={active || open}
        leftIcon={leftIcon}
        onClick={() => setOpen((v) => !v)}
        style={{ height: 40 }}
      >
        {label}
        {badge ? <span style={{ marginLeft: 4 }}><Badge tone="accent" className="mono">{badge}</Badge></span> : null}
      </Chip>
      {open ? (
        <div
          role="dialog"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            width,
            background: "var(--surface)",
            border: "1px solid var(--hairline-strong)",
            borderRadius: 12,
            boxShadow: "var(--shadow-lg)",
            padding: 16,
            zIndex: 20,
          }}
        >
          {children(() => setOpen(false))}
        </div>
      ) : null}
    </div>
  );
}

// ─── Budget ────────────────────────────────────────────────────────────────

const BUDGET_PRESETS: { label: string; min: number | null; max: number | null }[] = [
  { label: "Under R 3k",  min: null, max: 3000 },
  { label: "R 3k–5k",     min: 3000, max: 5000 },
  { label: "R 5k–8k",     min: 5000, max: 8000 },
  { label: "R 8k–12k",    min: 8000, max: 12000 },
  { label: "R 12k+",      min: 12000, max: null },
];

export interface BudgetFilterProps {
  minPrice: number | null;
  maxPrice: number | null;
  onChange: (next: { minPrice: number | null; maxPrice: number | null }) => void;
}

export function BudgetFilter({ minPrice, maxPrice, onChange }: BudgetFilterProps) {
  const [draftMin, setDraftMin] = useState(minPrice?.toString() ?? "");
  const [draftMax, setDraftMax] = useState(maxPrice?.toString() ?? "");

  useEffect(() => setDraftMin(minPrice?.toString() ?? ""), [minPrice]);
  useEffect(() => setDraftMax(maxPrice?.toString() ?? ""), [maxPrice]);

  const isActive = minPrice != null || maxPrice != null;
  const label =
    minPrice != null && maxPrice != null
      ? `R ${minPrice.toLocaleString("en-ZA")} – R ${maxPrice.toLocaleString("en-ZA")}`
      : minPrice != null
        ? `R ${minPrice.toLocaleString("en-ZA")}+`
        : maxPrice != null
          ? `Under R ${maxPrice.toLocaleString("en-ZA")}`
          : "Any budget";

  return (
    <FilterPopover label={label} leftIcon="cash" active={isActive} width={300}>
      {(close) => (
        <>
          <Eyebrow style={{ marginBottom: 10 }}>Monthly rent</Eyebrow>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <FormField label="Min">
              <Input
                inputMode="numeric"
                value={draftMin}
                onChange={(e) => setDraftMin(e.target.value.replace(/\D/g, ""))}
                placeholder="Any"
                className="mono"
              />
            </FormField>
            <FormField label="Max">
              <Input
                inputMode="numeric"
                value={draftMax}
                onChange={(e) => setDraftMax(e.target.value.replace(/\D/g, ""))}
                placeholder="Any"
                className="mono"
              />
            </FormField>
          </div>

          <Eyebrow style={{ marginBottom: 8 }}>Or pick a range</Eyebrow>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
            {BUDGET_PRESETS.map((p) => {
              const active = p.min === minPrice && p.max === maxPrice;
              return (
                <Chip
                  key={p.label}
                  active={active}
                  onClick={() => {
                    onChange({ minPrice: p.min, maxPrice: p.max });
                    close();
                  }}
                  style={{ height: 28, fontSize: 12 }}
                >
                  {p.label}
                </Chip>
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid var(--hairline)" }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onChange({ minPrice: null, maxPrice: null });
                close();
              }}
            >
              Clear
            </Button>
            <Button
              variant="accent"
              size="sm"
              onClick={() => {
                onChange({
                  minPrice: draftMin ? Number(draftMin) : null,
                  maxPrice: draftMax ? Number(draftMax) : null,
                });
                close();
              }}
            >
              Apply
            </Button>
          </div>
        </>
      )}
    </FilterPopover>
  );
}

// ─── Beds ──────────────────────────────────────────────────────────────────

const BED_OPTIONS: { label: string; value: number | null }[] = [
  { label: "Any",   value: null },
  { label: "1+",    value: 1 },
  { label: "2+",    value: 2 },
  { label: "3+",    value: 3 },
];

export interface BedsFilterProps {
  minBeds: number | null;
  onChange: (next: number | null) => void;
}

export function BedsFilter({ minBeds, onChange }: BedsFilterProps) {
  const label = minBeds == null ? "Any beds" : `${minBeds}+ beds`;
  return (
    <FilterPopover label={label} leftIcon="bed" active={minBeds != null} width={240}>
      {(close) => (
        <>
          <Eyebrow style={{ marginBottom: 10 }}>Bedrooms</Eyebrow>
          <div style={{ display: "flex", gap: 6 }}>
            {BED_OPTIONS.map((b) => (
              <Chip
                key={b.label}
                active={b.value === minBeds}
                onClick={() => {
                  onChange(b.value);
                  close();
                }}
                style={{ height: 36, flex: 1, justifyContent: "center", fontSize: 13 }}
              >
                {b.label}
              </Chip>
            ))}
          </div>
        </>
      )}
    </FilterPopover>
  );
}

// ─── More filters ──────────────────────────────────────────────────────────

export interface MoreFilters {
  verifiedOnly: boolean;
  newOnly: boolean;
  minSqm: number | null;
}

export interface MoreFiltersProps {
  value: MoreFilters;
  onChange: (next: MoreFilters) => void;
}

function activeMoreFiltersCount(v: MoreFilters): number {
  let n = 0;
  if (v.verifiedOnly) n++;
  if (v.newOnly) n++;
  if (v.minSqm != null) n++;
  return n;
}

export function MoreFiltersControl({ value, onChange }: MoreFiltersProps) {
  const [draftSqm, setDraftSqm] = useState(value.minSqm?.toString() ?? "");
  useEffect(() => setDraftSqm(value.minSqm?.toString() ?? ""), [value.minSqm]);
  const count = activeMoreFiltersCount(value);

  return (
    <FilterPopover label="More filters" leftIcon="sliders" badge={count > 0 ? count : undefined} active={count > 0} width={320}>
      {(close) => (
        <>
          <Eyebrow style={{ marginBottom: 10 }}>Trust &amp; freshness</Eyebrow>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
              <Toggle
                checked={value.verifiedOnly}
                onChange={(e) => onChange({ ...value, verifiedOnly: e.target.checked })}
              />
              <span>
                <strong>Verified by Habitat</strong>
                <span style={{ display: "block", fontSize: 11, color: "var(--slate)" }}>
                  FICA + photos + landlord ID checked
                </span>
              </span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
              <Toggle
                checked={value.newOnly}
                onChange={(e) => onChange({ ...value, newOnly: e.target.checked })}
              />
              <span>
                <strong>New this week</strong>
                <span style={{ display: "block", fontSize: 11, color: "var(--slate)" }}>
                  Listed in the last 7 days
                </span>
              </span>
            </label>
          </div>

          <Eyebrow style={{ marginBottom: 10 }}>Size</Eyebrow>
          <FormField label="Minimum (m²)" helper="Whole numbers only.">
            <Input
              inputMode="numeric"
              value={draftSqm}
              onChange={(e) => setDraftSqm(e.target.value.replace(/\D/g, ""))}
              placeholder="Any"
              className="mono"
            />
          </FormField>

          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, marginTop: 12, borderTop: "1px solid var(--hairline)" }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onChange({ verifiedOnly: false, newOnly: false, minSqm: null });
                close();
              }}
            >
              Clear
            </Button>
            <Button
              variant="accent"
              size="sm"
              onClick={() => {
                onChange({ ...value, minSqm: draftSqm ? Number(draftSqm) : null });
                close();
              }}
            >
              Apply
            </Button>
          </div>
        </>
      )}
    </FilterPopover>
  );
}

// ─── Area multiselect ─────────────────────────────────────────────────────
//
// Replaces the legacy FilterBar.LocationFilter (a static button). Search
// uses the shared PlaceSearch primitive so suggestions come from Google
// Places (Nominatim as fallback) — same lookup the hero search and the
// profile address picker use. Picking a suggestion appends its primary
// label (suburb-name when Google has one, city-name otherwise) to the
// selected list; selections render as removable chips below.

export interface AreaFilterProps {
  /** Currently selected area names. Each value is OR-matched against
   *  suburb / city / province on the API. */
  areas: string[];
  onChange: (next: string[]) => void;
}

export function AreaFilter({ areas, onChange }: AreaFilterProps) {
  const [query, setQuery] = useState("");

  const triggerLabel =
    areas.length === 0
      ? "Any area"
      : areas.length === 1
        ? areas[0]
        : `${areas[0]} + ${areas.length - 1} more`;

  const addArea = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (areas.some((a) => a.toLowerCase() === trimmed.toLowerCase())) return;
    onChange([...areas, trimmed]);
  };

  const removeArea = (name: string) => {
    onChange(areas.filter((a) => a !== name));
  };

  return (
    <FilterPopover
      label={triggerLabel}
      leftIcon="pin"
      active={areas.length > 0}
      badge={areas.length > 1 ? areas.length : undefined}
      width={340}
    >
      {() => (
        <>
          <Eyebrow style={{ marginBottom: 10 }}>Search areas</Eyebrow>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              height: 40,
              padding: "0 12px",
              background: "var(--surface)",
              border: "1px solid var(--hairline-strong)",
              borderRadius: "var(--r-md)",
              marginBottom: 12,
            }}
          >
            <PlaceSearch
              value={query}
              onChange={setQuery}
              onPick={(place, primary) => {
                addArea(place.suburb || place.city || primary);
                setQuery("");
              }}
              leftSlot={<Icon name="search" size={14} style={{ color: "var(--slate)", flexShrink: 0 }} />}
              placeholder="Type a suburb or city…"
              ariaLabel="Area search"
            />
          </div>

          {areas.length === 0 ? (
            <div style={{ fontSize: 12, color: "var(--slate)" }}>
              Pick one or more suburbs to filter the list. Listings match if their suburb, city,
              or province contains any of the selected names.
            </div>
          ) : (
            <>
              <Eyebrow style={{ marginBottom: 8 }}>Selected · {areas.length}</Eyebrow>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                {areas.map((a) => (
                  <Chip
                    key={a}
                    active
                    leftIcon="pin"
                    onClick={() => removeArea(a)}
                    aria-label={`Remove ${a}`}
                    style={{ height: 28, fontSize: 12 }}
                  >
                    {a}
                    <Icon name="x" size={11} style={{ marginLeft: 4 }} />
                  </Chip>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "1px solid var(--hairline)" }}>
                <Button variant="ghost" size="sm" onClick={() => onChange([])}>
                  Clear all
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </FilterPopover>
  );
}

// ─── Type multiselect ─────────────────────────────────────────────────────
//
// Compact checkbox dropdown that replaces the inline chip row (which took
// 5+ slots on the filter bar). Values are uppercase UnitType enum values
// so they map straight onto the API's ?type=A,B param.

export interface TypeFilterOption {
  value: UnitType;
  label: string;
}

export interface TypeFilterProps {
  options: TypeFilterOption[];
  selected: UnitType[];
  onChange: (next: UnitType[]) => void;
}

export function TypeFilter({ options, selected, onChange }: TypeFilterProps) {
  const triggerLabel =
    selected.length === 0
      ? "Any type"
      : selected.length === 1
        ? labelOf(options, selected[0])
        : `${labelOf(options, selected[0])} + ${selected.length - 1} more`;

  const toggle = (value: UnitType) => {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  };

  return (
    <FilterPopover
      label={triggerLabel}
      leftIcon="home"
      active={selected.length > 0}
      badge={selected.length > 1 ? selected.length : undefined}
      width={240}
    >
      {() => (
        <>
          <Eyebrow style={{ marginBottom: 10 }}>Property type</Eyebrow>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {options.map((opt) => (
              <Checkbox
                key={opt.value}
                checked={selected.includes(opt.value)}
                onChange={() => toggle(opt.value)}
                label={opt.label}
              />
            ))}
          </div>
          {selected.length > 0 ? (
            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, marginTop: 12, borderTop: "1px solid var(--hairline)" }}>
              <Button variant="ghost" size="sm" onClick={() => onChange([])}>
                Clear
              </Button>
            </div>
          ) : null}
        </>
      )}
    </FilterPopover>
  );
}

function labelOf(options: TypeFilterOption[], value: UnitType): string {
  return options.find((o) => o.value === value)?.label ?? value;
}
