import { useMemo, useState } from "react";
import Card from "@/components/Card";
import Chip from "@/components/Chip";
import Icon, { type IconName } from "@/components/Icon";

type Category = "all" | "cafes" | "schools" | "transit" | "hospitals" | "parks" | "shopping";
type PlaceCategory = Exclude<Category, "all">;

interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  distance: string;
  time: string;
  /** Position on the mock 0–100% grid. */
  xPct: number;
  yPct: number;
}

const CATEGORIES: { id: Category; label: string; icon: IconName }[] = [
  { id: "all", label: "All nearby", icon: "pin" },
  { id: "cafes", label: "Cafés", icon: "flame" },
  { id: "schools", label: "Schools", icon: "paper" },
  { id: "transit", label: "Transit", icon: "bolt" },
  { id: "hospitals", label: "Health", icon: "shield" },
  { id: "parks", label: "Parks", icon: "park" },
  { id: "shopping", label: "Shopping", icon: "cash" },
];

const CATEGORY_TONE: Record<PlaceCategory, { color: string; bg: string }> = {
  cafes: { color: "var(--accent)", bg: "var(--accent-soft)" },
  schools: { color: "var(--ink)", bg: "var(--surface-3)" },
  transit: { color: "var(--slate)", bg: "var(--surface-2)" },
  hospitals: { color: "var(--danger)", bg: "var(--danger-soft)" },
  parks: { color: "var(--success)", bg: "var(--success-soft)" },
  shopping: { color: "var(--warn)", bg: "var(--warn-soft)" },
};

const PLACES: Place[] = [
  { id: "p1", name: "7th Avenue cafés strip", category: "cafes", distance: "240 m", time: "3 min walk", xPct: 48, yPct: 38 },
  { id: "p2", name: "Father's Coffee · Brixton", category: "cafes", distance: "320 m", time: "4 min walk", xPct: 55, yPct: 32 },
  { id: "p3", name: "Brixton Library", category: "schools", distance: "550 m", time: "7 min walk", xPct: 32, yPct: 55 },
  { id: "p4", name: "Wits Main Campus", category: "schools", distance: "3.4 km", time: "8 min drive", xPct: 70, yPct: 18 },
  { id: "p5", name: "Bus stop · Caroline & 9th", category: "transit", distance: "180 m", time: "2 min walk", xPct: 58, yPct: 50 },
  { id: "p6", name: "Rea Vaya T2 · High St", category: "transit", distance: "1.2 km", time: "5 min drive", xPct: 18, yPct: 65 },
  { id: "p7", name: "Helen Joseph Hospital", category: "hospitals", distance: "4.6 km", time: "12 min drive", xPct: 22, yPct: 28 },
  { id: "p8", name: "Brixton Day Clinic", category: "hospitals", distance: "900 m", time: "11 min walk", xPct: 42, yPct: 72 },
  { id: "p9", name: "Brixton Cemetery Park", category: "parks", distance: "650 m", time: "8 min walk", xPct: 65, yPct: 70 },
  { id: "p10", name: "SABC Tower Park", category: "parks", distance: "1.1 km", time: "13 min walk", xPct: 30, yPct: 80 },
  { id: "p11", name: "Westgate Shopping Centre", category: "shopping", distance: "5.2 km", time: "15 min drive", xPct: 80, yPct: 60 },
  { id: "p12", name: "Brixton SuperSpar", category: "shopping", distance: "780 m", time: "9 min walk", xPct: 38, yPct: 22 },
];

export default function NearbyPlaces() {
  const [cat, setCat] = useState<Category>("all");
  const [activeId, setActiveId] = useState<string | null>(null);

  const visible = useMemo(
    () => (cat === "all" ? PLACES : PLACES.filter((p) => p.category === cat)),
    [cat],
  );
  const counts = useMemo(() => {
    const map: Record<string, number> = { all: PLACES.length };
    for (const c of CATEGORIES) {
      if (c.id !== "all") map[c.id] = PLACES.filter((p) => p.category === c.id).length;
    }
    return map;
  }, []);

  const active = visible.find((p) => p.id === activeId);

  return (
    <div>
      {/* Category chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {CATEGORIES.map((c) => (
          <Chip
            key={c.id}
            active={cat === c.id}
            leftIcon={c.icon}
            count={counts[c.id]}
            onClick={() => setCat(c.id)}
          >
            {c.label}
          </Chip>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 300px", gap: 16 }}>
        {/* Map */}
        <div
          style={{
            position: "relative",
            height: 320,
            borderRadius: 12,
            overflow: "hidden",
            background: `
              repeating-linear-gradient(0deg, transparent 0 56px, rgba(11,13,18,0.04) 56px 57px),
              repeating-linear-gradient(90deg, transparent 0 56px, rgba(11,13,18,0.04) 56px 57px),
              var(--surface-2)
            `,
          }}
        >
          {/* This-spot pin */}
          <button
            type="button"
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -100%)",
              background: "var(--ink)",
              color: "var(--paper)",
              border: "2px solid var(--paper)",
              borderRadius: 999,
              padding: "6px 12px",
              fontSize: 12,
              fontWeight: 600,
              boxShadow: "var(--shadow-md)",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              cursor: "default",
              fontFamily: "inherit",
              zIndex: 4,
            }}
          >
            <Icon name="home" size={12} /> This spot
          </button>

          {/* Place pins */}
          {visible.map((p) => {
            const tone = CATEGORY_TONE[p.category];
            const isActive = activeId === p.id;
            const catIcon = CATEGORIES.find((c) => c.id === p.category)!.icon;
            return (
              <button
                key={p.id}
                type="button"
                onMouseEnter={() => setActiveId(p.id)}
                onMouseLeave={() => setActiveId(null)}
                onFocus={() => setActiveId(p.id)}
                onBlur={() => setActiveId(null)}
                aria-label={`${p.name} · ${p.distance} · ${p.time}`}
                style={{
                  position: "absolute",
                  left: `${p.xPct}%`,
                  top: `${p.yPct}%`,
                  transform: `translate(-50%, -50%) scale(${isActive ? 1.18 : 1})`,
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: isActive ? tone.color : tone.bg,
                  color: isActive ? "var(--paper)" : tone.color,
                  border: `1.5px solid ${tone.color}`,
                  display: "grid",
                  placeItems: "center",
                  boxShadow: isActive ? "var(--shadow-md)" : "var(--shadow-sm)",
                  cursor: "pointer",
                  transition: "transform 120ms, background 120ms",
                  zIndex: isActive ? 5 : 1,
                  fontFamily: "inherit",
                }}
              >
                <Icon name={catIcon} size={14} />
              </button>
            );
          })}

          {/* Hover tooltip */}
          {active ? (
            <div
              style={{
                position: "absolute",
                bottom: 12,
                left: 12,
                right: 12,
                padding: "10px 14px",
                background: "var(--ink)",
                color: "var(--paper)",
                borderRadius: 10,
                boxShadow: "var(--shadow-md)",
                display: "flex",
                alignItems: "center",
                gap: 10,
                pointerEvents: "none",
              }}
            >
              <Icon
                name={CATEGORIES.find((c) => c.id === active.category)!.icon}
                size={14}
                style={{ color: "var(--accent)" }}
              />
              <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{active.name}</div>
              <div className="mono" style={{ fontSize: 11, color: "var(--slate-3)" }}>
                {active.distance} · {active.time}
              </div>
            </div>
          ) : null}
        </div>

        {/* List */}
        <Card padding={0} style={{ height: 320, overflowY: "auto" }}>
          {visible.map((p, i) => {
            const tone = CATEGORY_TONE[p.category];
            const isActive = activeId === p.id;
            const catIcon = CATEGORIES.find((c) => c.id === p.category)!.icon;
            return (
              <button
                key={p.id}
                type="button"
                onMouseEnter={() => setActiveId(p.id)}
                onMouseLeave={() => setActiveId(null)}
                onFocus={() => setActiveId(p.id)}
                onBlur={() => setActiveId(null)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 14px",
                  background: isActive ? "var(--surface-2)" : "transparent",
                  border: 0,
                  borderTop: i > 0 ? "1px solid var(--hairline)" : undefined,
                  borderLeft: `2px solid ${isActive ? tone.color : "transparent"}`,
                  cursor: "pointer",
                  textAlign: "left",
                  color: "var(--ink)",
                  fontFamily: "inherit",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: tone.bg,
                    color: tone.color,
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name={catIcon} size={13} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {p.name}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--slate)", display: "flex", gap: 6 }}>
                    <span>{p.distance}</span>
                    <span>·</span>
                    <span>{p.time}</span>
                  </div>
                </div>
              </button>
            );
          })}
          {visible.length === 0 ? (
            <div style={{ padding: 20, textAlign: "center", color: "var(--slate)", fontSize: 13 }}>
              Nothing in this category nearby.
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
