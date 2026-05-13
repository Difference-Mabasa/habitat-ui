import Nav from "@/components/Nav";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge, { type BadgeTone } from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import Photo from "@/components/Photo";

interface Room {
  name: string;
  done: number;
  total: number;
  photos: number;
}

const ROOMS: Room[] = [
  { name: "Bedroom", done: 0, total: 0, photos: 0 },
  { name: "Kitchenette", done: 0, total: 0, photos: 0 },
  { name: "Bathroom (shared)", done: 0, total: 0, photos: 0 },
  { name: "Exterior & locks", done: 0, total: 0, photos: 0 },
];

type CheckState = "good" | "issue" | "pending";

const CHECKS: { k: string; state: CheckState; note: string | null }[] = [
  { k: "Walls & paint", state: "pending", note: null },
  { k: "Floor & skirting", state: "pending", note: null },
  { k: "Geyser & plumbing", state: "pending", note: null },
  { k: "Door locks & keys", state: "pending", note: null },
  { k: "Window & screens", state: "pending", note: null },
  { k: "Light fittings", state: "pending", note: null },
];

const STATE_TONE: Record<CheckState, BadgeTone> = {
  good: "success",
  issue: "warn",
  pending: "neutral",
};

export default function MoveOut() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 32px" }}>
        <Eyebrow>Move-out inspection</Eyebrow>
        <h1 className="display" style={{ fontSize: 56, margin: "8px 0 24px" }}>
          WALKTHROUGH
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 24 }}>
          {/* Room list */}
          <Card padding={4}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--hairline)" }}>
              <div className="display" style={{ fontSize: 18 }}>
                ROOMS
              </div>
              <div className="mono" style={{ fontSize: 12, color: "var(--slate)", marginTop: 4 }}>
                0 / 0 checks · 0 photos
              </div>
            </div>
            {ROOMS.map((r, i) => (
              <div
                key={r.name}
                style={{
                  padding: "14px 18px",
                  borderTop: i ? "1px solid var(--hairline)" : "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: i === 0 ? "var(--surface-2)" : "transparent",
                }}
              >
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 2 }}>
                    {r.done}/{r.total} checked · {r.photos} photos
                  </div>
                </div>
                {r.done === r.total ? (
                  <Icon name="check" size={16} style={{ color: "var(--success)" }} />
                ) : (
                  <Icon name="chevR" size={14} style={{ color: "var(--slate)" }} />
                )}
              </div>
            ))}
          </Card>

          {/* Active room */}
          <Card padding={28}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <Eyebrow>Room 1 of 4</Eyebrow>
                <h2 className="display" style={{ fontSize: 32, margin: "6px 0 4px" }}>
                  BEDROOM
                </h2>
                <div style={{ fontSize: 13, color: "var(--slate)" }}>
                  Compare against move-in photos
                </div>
              </div>
              <Button variant="secondary" size="sm">
                View move-in photos
              </Button>
            </div>

            <div
              style={{
                marginTop: 22,
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 8,
              }}
            >
              {[1, 2, 3, 4, 5].map((i) => (
                <Photo key={i} label={`Move-out · #${i}`} ratio="1" />
              ))}
              <button
                type="button"
                style={{
                  border: "1.5px dashed var(--hairline-strong)",
                  borderRadius: 10,
                  display: "grid",
                  placeItems: "center",
                  color: "var(--slate)",
                  aspectRatio: "1/1",
                  background: "var(--surface-2)",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                <div style={{ textAlign: "center", fontSize: 12 }}>
                  <Icon name="upload" size={18} />
                  <div style={{ marginTop: 4 }}>Add photo</div>
                </div>
              </button>
            </div>

            <div style={{ marginTop: 28 }}>
              <Eyebrow style={{ marginBottom: 10 }}>Condition checks</Eyebrow>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {CHECKS.map((c) => (
                  <div
                    key={c.k}
                    style={{
                      padding: 14,
                      border: "1px solid var(--hairline)",
                      borderRadius: 10,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 14 }}>{c.k}</div>
                      {c.note ? (
                        <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 2 }}>{c.note}</div>
                      ) : null}
                    </div>
                    <Badge tone={STATE_TONE[c.state]}>{c.state.toUpperCase()}</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between" }}>
              <Button variant="ghost" leftIcon="chevL">
                Bedroom
              </Button>
              <Button variant="accent" rightIcon="arrR">
                Save & next room
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
