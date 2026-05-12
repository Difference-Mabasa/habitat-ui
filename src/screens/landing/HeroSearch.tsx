import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/Icon";
import { useViewport } from "@/hooks/useViewport";

const SA_AREAS = [
  "Brixton", "Melville", "Westdene", "Yeoville", "Auckland Park",
  "Maboneng", "Northcliff", "Linden", "Norwood", "Orlando West",
  "Pimville", "Diepkloof", "Soweto", "Alexandra", "Khayelitsha",
  "Cape Town", "Durban", "Pretoria", "Sandton", "Rosebank",
];

export default function HeroSearch() {
  const navigate = useNavigate();
  const { isSm, isMd } = useViewport();
  const isMobile = isSm || isMd;
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => {
    const q = location.trim().toLowerCase();
    if (q.length < 2) return [];
    return SA_AREAS.filter((a) => a.toLowerCase().includes(q)).slice(0, 5);
  }, [location]);

  const onSearch = () => {
    setShowSuggestions(false);
    const params = new URLSearchParams();
    if (location.trim()) params.set("location", location.trim());
    if (type) params.set("type", type);
    if (maxPrice) params.set("maxPrice", maxPrice);
    const qs = params.toString();
    navigate(qs ? `/browse?${qs}` : "/browse");
  };

  const onPickSuggestion = (s: string) => {
    setLocation(s);
    setShowSuggestions(false);
    inputRef.current?.focus();
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
      <div style={{ position: "relative" }}>
        <Field label="Location">
          <Icon name="pin" size={14} style={{ color: "var(--slate)", flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSearch();
              }
            }}
            placeholder="Soweto, Brixton, Melville…"
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              fontFamily: "inherit",
              fontSize: 14,
              color: "var(--ink)",
              width: "100%",
              padding: 0,
            }}
          />
        </Field>
        {showSuggestions && suggestions.length > 0 ? (
          <ul
            role="listbox"
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              right: 0,
              margin: 0,
              padding: 4,
              listStyle: "none",
              background: "var(--surface)",
              border: "1px solid var(--hairline-strong)",
              borderRadius: 10,
              boxShadow: "var(--shadow-lg)",
              zIndex: 20,
            }}
          >
            {suggestions.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onPickSuggestion(s);
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 12px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: 13,
                    color: "var(--ink)",
                    textAlign: "left",
                    borderRadius: 6,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <Icon name="pin" size={12} style={{ color: "var(--slate)" }} />
                  {s}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <Field label="Type">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={selectStyle}
        >
          <option value="">Any type</option>
          <option value="Backroom">Backroom</option>
          <option value="Cottage">Cottage</option>
          <option value="Flatlet">Flatlet</option>
          <option value="Studio">Studio</option>
        </select>
      </Field>

      <Field label="Max rent">
        <select
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={selectStyle}
        >
          <option value="">Any budget</option>
          <option value="3000">Under R 3,000</option>
          <option value="5000">Under R 5,000</option>
          <option value="8000">Under R 8,000</option>
          <option value="12000">Under R 12,000</option>
        </select>
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
