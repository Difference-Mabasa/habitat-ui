import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/Icon";
import PlaceSearch from "@/components/PlaceSearch";
import { useViewport } from "@/hooks/useViewport";
import type { PlaceValue } from "@/lib/places";

export default function HeroSearch() {
  const navigate = useNavigate();
  const { isSm, isMd } = useViewport();
  const isMobile = isSm || isMd;
  const [locationText, setLocationText] = useState("");
  const [picked, setPicked] = useState<PlaceValue | null>(null);
  const [type, setType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const onSearch = () => {
    const params = new URLSearchParams();

    // Prefer the picked place's suburb (most useful filter on /browse);
    // fall back to city, then the literal typed string. lat/lng goes
    // along when available so a future radius filter can use it.
    if (picked) {
      const focus = picked.suburb || picked.city || locationText.trim();
      if (focus) params.set("location", focus);
      if (picked.latitude != null) params.set("lat", picked.latitude.toString());
      if (picked.longitude != null) params.set("lng", picked.longitude.toString());
    } else if (locationText.trim()) {
      params.set("location", locationText.trim());
    }

    if (type) params.set("type", type);
    if (maxPrice) params.set("maxPrice", maxPrice);
    const qs = params.toString();
    navigate(qs ? `/browse?${qs}` : "/browse");
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isSm
          ? "1fr"
          : isMd
            ? "minmax(0, 1fr) minmax(0, 1fr)"
            : "minmax(0, 1.6fr) 160px 160px auto",
        gap: 8,
        padding: 10,
        background: "var(--surface)",
        border: "1px solid var(--hairline-strong)",
        borderRadius: 14,
        boxShadow: "var(--shadow-md)",
        alignItems: "stretch",
      }}
    >
      <Field label="Location">
        <PlaceSearch
          value={locationText}
          onChange={(next) => {
            setLocationText(next);
            // Typing diverges from the picked place — discard it so the
            // search uses the raw text rather than stale lat/lng.
            if (picked) setPicked(null);
          }}
          onPick={(place, label) => {
            setPicked(place);
            setLocationText(label);
          }}
          placeholder="Sandton, Umhlanga, Camps Bay…"
          ariaLabel="Location"
          leftSlot={<Icon name="pin" size={14} style={{ color: "var(--slate)", flexShrink: 0 }} />}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSearch();
            }
          }}
        />
      </Field>

      <Field label="Type">
        <select value={type} onChange={(e) => setType(e.target.value)} style={selectStyle}>
          <option value="">Any type</option>
          <option value="Apartment">Apartment</option>
          <option value="House">House</option>
          <option value="Townhouse">Townhouse</option>
          <option value="Cottage">Cottage</option>
          <option value="Studio">Studio</option>
        </select>
      </Field>

      <Field label="Max rent">
        <MaxRentStepper value={maxPrice} onChange={setMaxPrice} onEnter={onSearch} />
      </Field>

      <button
        type="button"
        onClick={onSearch}
        className="btn btn--primary"
        style={{
          height: isMobile ? 52 : "auto",
          padding: "0 20px",
          borderRadius: 10,
          gridColumn: isSm ? "1" : isMd ? "1 / span 2" : undefined,
        }}
      >
        <Icon name="search" size={15} />
        <span style={{ marginLeft: 6 }}>Search</span>
      </button>
    </div>
  );
}

/**
 * Free-input rent cap with +/- stepper buttons. The user can type any
 * value (numbers only — non-digits are stripped) OR nudge by R 1,000 at
 * a time. Empty = no max ("Any budget"); the first + jumps to R 1,000.
 * For big numbers, typing is faster than stepping.
 */
const RENT_STEP = 1000;

function MaxRentStepper({
  value,
  onChange,
  onEnter,
}: {
  value: string;
  onChange: (next: string) => void;
  onEnter: () => void;
}) {
  const current = value === "" ? null : Number(value);

  const setNumber = (n: number | null) => {
    if (n == null || n <= 0) onChange("");
    else onChange(String(n));
  };

  const inc = () => setNumber((current ?? 0) + RENT_STEP);
  const dec = () => setNumber(current == null ? null : current - RENT_STEP);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, flex: 1, minWidth: 0 }}>
      <span style={{ fontSize: 13, color: "var(--slate)", flexShrink: 0 }}>R</span>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, ""))}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onEnter();
          }
        }}
        placeholder="Any"
        aria-label="Max rent"
        style={{
          flex: 1,
          minWidth: 0,
          border: "none",
          outline: "none",
          background: "transparent",
          fontFamily: "inherit",
          fontSize: 14,
          color: "var(--ink)",
          padding: 0,
        }}
      />
      <StepperBtn label="Decrease" onClick={dec} disabled={current == null || current <= 0}>
        −
      </StepperBtn>
      <StepperBtn label="Increase" onClick={inc}>
        +
      </StepperBtn>
    </div>
  );
}

function StepperBtn({
  children,
  onClick,
  label,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 22,
        height: 22,
        flexShrink: 0,
        display: "grid",
        placeItems: "center",
        background: "var(--surface-2)",
        border: "1px solid var(--hairline)",
        borderRadius: 6,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.4 : 1,
        fontFamily: "inherit",
        fontSize: 14,
        lineHeight: 1,
        color: "var(--ink)",
        padding: 0,
      }}
    >
      {children}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        padding: "8px 14px",
        borderRadius: 10,
        background: "var(--surface)",
        border: "1px solid var(--hairline)",
        cursor: "text",
        position: "relative",
      }}
    >
      <span
        className="eyebrow"
        style={{ fontSize: 10, color: "var(--slate)", letterSpacing: "0.12em" }}
      >
        {label}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>{children}</div>
    </label>
  );
}

const selectStyle: React.CSSProperties = {
  border: "none",
  outline: "none",
  background: "transparent",
  fontFamily: "inherit",
  fontSize: 14,
  color: "var(--ink)",
  width: "100%",
  padding: 0,
  appearance: "none",
  cursor: "pointer",
};
