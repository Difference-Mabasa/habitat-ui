import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "@/components/Icon";
import Checkbox from "@/components/Checkbox";
import Input from "@/components/Input";
import Badge from "@/components/Badge";

export interface AreaMultiSelectProps {
  options: string[];
  value: Set<string>;
  onChange: (next: Set<string>) => void;
  placeholder?: string;
}

export default function AreaMultiSelect({
  options,
  value,
  onChange,
  placeholder = "All areas",
}: AreaMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, query]);

  const toggle = (name: string) => {
    const next = new Set(value);
    if (next.has(name)) next.delete(name);
    else next.add(name);
    onChange(next);
  };
  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(new Set());
  };

  const count = value.size;
  const label =
    count === 0
      ? placeholder
      : count === 1
        ? Array.from(value)[0]
        : `${count} areas`;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          height: 36,
          padding: "0 12px",
          background: count > 0 ? "var(--accent-soft)" : "var(--surface)",
          border: `1px solid ${count > 0 ? "var(--accent)" : "var(--hairline-strong)"}`,
          borderRadius: 999,
          fontFamily: "inherit",
          fontSize: 13,
          fontWeight: 500,
          color: count > 0 ? "var(--accent)" : "var(--ink)",
          cursor: "pointer",
          minWidth: 140,
        }}
      >
        <Icon name="pin" size={13} />
        <span style={{ flex: 1, textAlign: "left" }}>{label}</span>
        {count > 0 ? (
          <Badge tone="accent" className="mono">
            {count}
          </Badge>
        ) : null}
        <Icon name={open ? "chevU" : "chevD"} size={12} />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-multiselectable
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            width: 280,
            background: "var(--surface)",
            border: "1px solid var(--hairline-strong)",
            borderRadius: 10,
            boxShadow: "var(--shadow-lg)",
            padding: 8,
            zIndex: 30,
            maxHeight: 360,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ padding: "4px 4px 8px" }}>
            <Input
              leftIcon="search"
              placeholder="Find an area…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>

          <div style={{ overflowY: "auto", flex: 1, padding: "0 2px" }}>
            {filtered.length === 0 ? (
              <div style={{ padding: 16, textAlign: "center", color: "var(--slate)", fontSize: 12 }}>
                No areas match
              </div>
            ) : (
              filtered.map((opt) => {
                const checked = value.has(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggle(opt)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      width: "100%",
                      padding: "8px 10px",
                      background: "transparent",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      fontSize: 13,
                      color: "var(--ink)",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <Checkbox checked={checked} readOnly tabIndex={-1} />
                    <span style={{ flex: 1 }}>{opt}</span>
                  </button>
                );
              })
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 6px 0",
              borderTop: "1px solid var(--hairline)",
              marginTop: 6,
            }}
          >
            <button
              type="button"
              onClick={clear}
              disabled={count === 0}
              style={{
                background: "none",
                border: "none",
                padding: "4px 6px",
                fontFamily: "inherit",
                fontSize: 12,
                color: count === 0 ? "var(--slate-2)" : "var(--slate)",
                cursor: count === 0 ? "default" : "pointer",
                textDecoration: count === 0 ? "none" : "underline",
              }}
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              style={{
                background: "var(--ink)",
                color: "var(--paper)",
                border: "none",
                padding: "6px 12px",
                borderRadius: 6,
                fontFamily: "inherit",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Done
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
