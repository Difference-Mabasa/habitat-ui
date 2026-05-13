import { useEffect, useRef, useState } from "react";
import type {
  CSSProperties,
  KeyboardEventHandler,
  ReactNode,
} from "react";
import { searchPlaces, type PlaceSuggestion, type PlaceValue } from "@/lib/places";

/**
 * SA-scoped place search primitive — a controlled text input plus a
 * positioned suggestions dropdown powered by Google Places (with
 * Nominatim fallback). Used standalone (HeroSearch) or composed inside
 * a richer picker (AddressLookup, which adds editable structured fields
 * underneath).
 *
 * The component owns:
 *   - debounced search & loading state
 *   - resolving the picked suggestion (Google needs a second fetch)
 *   - showing/hiding the dropdown around blur
 *
 * The caller owns:
 *   - the displayed text {@code value} (so HeroSearch can keep the
 *     label visible after pick, AddressLookup can clear it)
 *   - container styling around the input
 *   - keydown / Enter behaviour
 */
export interface PlaceSearchProps {
  value: string;
  onChange: (next: string) => void;
  /** Fired once the picked suggestion is resolved to structured data. */
  onPick: (place: PlaceValue, label: string) => void;
  placeholder?: string;
  /** Optional element rendered to the left of the input (e.g. an icon). */
  leftSlot?: ReactNode;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  onBlur?: () => void;
  disabled?: boolean;
  /** Override the inner input's inline styles. */
  inputStyle?: CSSProperties;
  inputId?: string;
  ariaLabel?: string;
}

const DEBOUNCE_MS = 300;
const HIDE_DELAY_MS = 180;
const MIN_QUERY_CHARS = 2;

export default function PlaceSearch({
  value,
  onChange,
  onPick,
  placeholder = "Search for a place",
  leftSlot,
  onKeyDown,
  onBlur,
  disabled,
  inputStyle,
  inputId,
  ariaLabel,
}: PlaceSearchProps) {
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resolving, setResolving] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (value.trim().length < MIN_QUERY_CHARS) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      void searchPlaces(value)
        .then((s) => {
          setSuggestions(s);
          setLoading(false);
        })
        .catch(() => {
          setSuggestions([]);
          setLoading(false);
        });
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [value]);

  const pick = async (s: PlaceSuggestion) => {
    setSuggestions([]);
    setOpen(false);
    setResolving(true);
    try {
      const resolved = await s.resolve();
      // Match backroom: input shows the primary text only ("Midrand"),
      // not the full label ("Midrand, South Africa"). Caller still gets
      // the primary as the label so it can use it for query params.
      onChange(s.primary);
      onPick(resolved, s.primary);
    } finally {
      setResolving(false);
    }
  };

  const scheduleHide = () => {
    hideTimerRef.current = setTimeout(() => setOpen(false), HIDE_DELAY_MS);
  };
  const cancelHide = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const showDropdown = open && (loading || resolving || suggestions.length > 0);

  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
      {leftSlot}
      <input
        id={inputId}
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          scheduleHide();
          if (onBlur) setTimeout(onBlur, HIDE_DELAY_MS + 20);
        }}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        aria-label={ariaLabel}
        disabled={disabled || resolving}
        style={{
          border: "none",
          outline: "none",
          background: "transparent",
          fontFamily: "inherit",
          fontSize: 14,
          color: "var(--ink)",
          width: "100%",
          padding: 0,
          ...inputStyle,
        }}
      />
      {showDropdown ? (
        <ul
          role="listbox"
          onMouseDown={cancelHide}
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            zIndex: 50,
            background: "var(--surface)",
            border: "1px solid var(--hairline-strong)",
            borderRadius: 10,
            boxShadow: "var(--shadow-lg)",
            listStyle: "none",
            margin: 0,
            padding: 4,
            maxHeight: 280,
            overflowY: "auto",
          }}
        >
          {loading || resolving ? (
            <li style={{ padding: "10px 12px", fontSize: 13, color: "var(--slate)" }}>
              {resolving ? "Loading place…" : "Searching…"}
            </li>
          ) : (
            suggestions.map((s, i) => (
              <li
                key={`${s.primary}-${i}`}
                role="option"
                aria-selected={false}
                onMouseDown={(e) => {
                  e.preventDefault();
                  void pick(s);
                }}
                style={{
                  padding: "10px 12px",
                  fontSize: 13,
                  cursor: "pointer",
                  borderRadius: 6,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ fontWeight: 500 }}>{s.primary}</div>
                {s.secondary ? (
                  <div style={{ fontSize: 11, color: "var(--slate)", marginTop: 2 }}>
                    {s.secondary}
                  </div>
                ) : null}
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
