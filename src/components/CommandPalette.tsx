import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { GROUP_LABEL, ROUTES, type RouteGroup } from "@/routes";
import Icon from "./Icon";
import { usePalette } from "@/lib/palette";

interface PaletteEntry {
  id: string;
  label: string;
  path: string;
  group: RouteGroup;
}

const ENTRIES: PaletteEntry[] = ROUTES
  // Dynamic-segment routes can't be jumped to without IDs (e.g. /u/:userId).
  .filter((r) => !r.path.includes(":"))
  .map((r) => ({
    id: r.id,
    label: r.label.replace(/^\d+\w?\s+—\s+/, ""),
    path: r.path,
    group: r.group,
  }));

function score(entry: PaletteEntry, q: string): number {
  if (!q) return 0;
  const label = entry.label.toLowerCase();
  const id = entry.id.toLowerCase();
  const path = entry.path.toLowerCase();
  if (id === q || label === q || path === q || path === `/${q}`) return 100;
  if (id.startsWith(q) || label.startsWith(q) || path.startsWith(`/${q}`)) return 60;
  if (id.includes(q) || label.includes(q) || path.includes(q)) return 30;
  return 0;
}

const MAX_RESULTS = 30;

interface Group {
  group: RouteGroup;
  entries: PaletteEntry[];
}

export default function CommandPalette() {
  const { open, closePalette } = usePalette();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const flatResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ENTRIES.slice(0, MAX_RESULTS);
    return ENTRIES.map((e) => ({ e, s: score(e, q) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, MAX_RESULTS)
      .map((x) => x.e);
  }, [query]);

  const grouped = useMemo<Group[]>(() => {
    const order: RouteGroup[] = [];
    const byGroup = new Map<RouteGroup, PaletteEntry[]>();
    for (const e of flatResults) {
      if (!byGroup.has(e.group)) {
        byGroup.set(e.group, []);
        order.push(e.group);
      }
      byGroup.get(e.group)!.push(e);
    }
    return order.map((g) => ({ group: g, entries: byGroup.get(g)! }));
  }, [flatResults]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveIdx(0);
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (activeIdx >= flatResults.length) setActiveIdx(0);
  }, [flatResults, activeIdx]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${activeIdx}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  if (!open) return null;

  const activate = (entry: PaletteEntry) => {
    closePalette();
    navigate(entry.path);
  };

  const onInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, Math.max(0, flatResults.length - 1)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const sel = flatResults[activeIdx];
      if (sel) activate(sel);
    } else if (e.key === "Escape") {
      e.preventDefault();
      closePalette();
    }
  };

  let cursor = 0;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onMouseDown={closePalette}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(11,13,18,0.45)",
        zIndex: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "10vh 24px 24px",
      }}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          width: 640,
          maxWidth: "100%",
          maxHeight: "80vh",
          background: "var(--surface)",
          border: "1px solid var(--hairline)",
          borderRadius: "var(--r-lg)",
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            borderBottom: "1px solid var(--hairline)",
            flexShrink: 0,
          }}
        >
          <Icon name="search" size={18} style={{ color: "var(--slate)", flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIdx(0);
            }}
            onKeyDown={onInputKeyDown}
            placeholder="Type a screen name or path…"
            aria-label="Search anywhere"
            style={{
              flex: 1,
              border: 0,
              outline: "none",
              background: "transparent",
              fontFamily: "inherit",
              fontSize: 15,
              color: "var(--ink)",
            }}
          />
          <Kbd>esc</Kbd>
        </div>

        <div ref={listRef} style={{ padding: 8, overflowY: "auto", flex: 1 }}>
          {flatResults.length === 0 ? (
            <div style={{ padding: "32px 12px", textAlign: "center", color: "var(--slate)", fontSize: 13 }}>
              No matches for "{query}".
            </div>
          ) : (
            grouped.map(({ group, entries }) => (
              <div key={group} style={{ marginBottom: 6 }}>
                <div className="eyebrow" style={{ padding: "8px 12px" }}>
                  {GROUP_LABEL[group]} · {entries.length}
                </div>
                {entries.map((entry) => {
                  const idx = cursor++;
                  const selected = idx === activeIdx;
                  return (
                    <button
                      key={entry.id}
                      type="button"
                      data-idx={idx}
                      onMouseEnter={() => setActiveIdx(idx)}
                      onClick={() => activate(entry)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 12px",
                        borderRadius: 8,
                        background: selected ? "var(--accent-soft)" : "transparent",
                        border: 0,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        color: "var(--ink)",
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          background: selected ? "var(--accent)" : "var(--surface-2)",
                          color: selected ? "#fff" : "var(--slate)",
                          display: "grid",
                          placeItems: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon name="arrR" size={13} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 500 }}>{entry.label}</div>
                        <div className="mono" style={{ fontSize: 11, color: "var(--slate)" }}>
                          {entry.path}
                        </div>
                      </div>
                      {selected ? (
                        <span className="mono" style={{ fontSize: 11, color: "var(--slate)", flexShrink: 0 }}>
                          ↵ open
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div
          style={{
            padding: "10px 14px",
            borderTop: "1px solid var(--hairline)",
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 11,
            color: "var(--slate)",
            flexShrink: 0,
          }}
        >
          <span>
            <Kbd>↑↓</Kbd> navigate
          </span>
          <span>
            <Kbd>↵</Kbd> open
          </span>
          <span>
            <Kbd>esc</Kbd> close
          </span>
          <span className="mono" style={{ marginLeft: "auto" }}>
            ⌘K / ctrl K
          </span>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd
      style={{
        padding: "2px 6px",
        background: "var(--surface-2)",
        borderRadius: 3,
        border: "1px solid var(--hairline)",
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        color: "var(--slate)",
      }}
    >
      {children}
    </kbd>
  );
}
