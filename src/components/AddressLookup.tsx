import { useState } from "react";
import Input from "./Input";
import PlaceSearch from "./PlaceSearch";
import { EMPTY_PLACE, type PlaceValue } from "@/lib/places";

/**
 * Full address picker: a {@link PlaceSearch} bar plus editable structured
 * fields underneath that auto-fill from the picked suggestion. The
 * structured fields stay editable so the user can correct anything
 * Google didn't get right.
 *
 * Used by the Profile address card. Phase later: also by the listing
 * wizard / property-detail map.
 *
 * For a search-only use case (no structured fields), reach for
 * {@link PlaceSearch} directly.
 */

// Re-export the canonical shape under the old name so existing call sites
// (Profile, /lib/api/auth typings) keep working.
export type AddressValue = PlaceValue;
// eslint-disable-next-line react-refresh/only-export-components
export const EMPTY_ADDRESS: AddressValue = EMPTY_PLACE;

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

export default function AddressLookup({
  value,
  onChange,
  onSuggestionPicked,
  placeholder = "Search for your address",
  onBlur,
  disabled,
}: AddressLookupProps) {
  const [query, setQuery] = useState("");

  const setField = (k: keyof AddressValue, v: string) => {
    onChange({ ...value, [k]: v });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Search bar */}
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
        }}
      >
        <PlaceSearch
          value={query}
          onChange={setQuery}
          onPick={(place) => {
            setQuery("");
            onChange(place);
            onSuggestionPicked?.(place);
          }}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
        />
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
