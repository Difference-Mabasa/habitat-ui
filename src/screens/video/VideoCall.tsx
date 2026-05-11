import Icon, { type IconName } from "@/components/Icon";
import Button from "@/components/Button";
import Photo from "@/components/Photo";
import Eyebrow from "@/components/Eyebrow";

interface ChatLine {
  who: "Sipho" | "Naledi";
  msg: string;
}

const CHAT: ChatLine[] = [
  { who: "Sipho", msg: "Can you show the geyser?" },
  { who: "Naledi", msg: "Sure, walking there now" },
  { who: "Sipho", msg: "What's the prepaid rate?" },
  { who: "Naledi", msg: "R 2.40/kWh, City Power" },
];

const CONTROLS: { icon: IconName; label: string }[] = [
  { icon: "mic", label: "Mic" },
  { icon: "video", label: "Video" },
  { icon: "chat", label: "Chat" },
  { icon: "paper", label: "Notes" },
];

export default function VideoCall() {
  return (
    <div
      style={{
        background: "var(--ink)",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Photo
        label="Naledi · live viewing"
        ratio="auto"
        style={{ position: "absolute", inset: 0, borderRadius: 0, minHeight: "100vh" }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Top bar */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          right: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "var(--paper)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            aria-hidden="true"
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#FF4040",
              boxShadow: "0 0 0 4px rgba(255,64,64,0.25)",
            }}
          />
          <div>
            <div style={{ fontWeight: 600 }}>Live viewing · Backroom · Vilakazi St</div>
            <div className="mono" style={{ fontSize: 12, opacity: 0.7 }}>
              04:22 · with Naledi M.
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["Save clip", "Minimize"].map((label) => (
            <Button
              key={label}
              variant="secondary"
              size="sm"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "var(--paper)",
              }}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Self preview */}
      <div
        style={{
          position: "absolute",
          top: 80,
          right: 20,
          width: 220,
          height: 140,
          borderRadius: 12,
          overflow: "hidden",
          border: "2px solid rgba(255,255,255,0.2)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        }}
      >
        <Photo
          label="You · Sipho"
          ratio="auto"
          style={{ borderRadius: 0, minHeight: 140 }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: 8,
            padding: "2px 8px",
            background: "rgba(0,0,0,0.6)",
            color: "#fff",
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 500,
          }}
        >
          You
        </div>
      </div>

      {/* Chat panel */}
      <div
        style={{
          position: "absolute",
          top: 80,
          right: 260,
          width: 280,
          maxHeight: 360,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(20px)",
          borderRadius: 14,
          padding: 16,
          color: "var(--paper)",
        }}
      >
        <Eyebrow style={{ color: "rgba(255,255,255,0.7)", marginBottom: 10 }}>
          Notes & questions
        </Eyebrow>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
          {CHAT.map((line, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: line.who === "Sipho" ? "flex-end" : "flex-start",
              }}
            >
              <div style={{ fontSize: 10, opacity: 0.5, marginBottom: 2 }}>{line.who}</div>
              <div
                style={{
                  padding: "8px 12px",
                  background: line.who === "Sipho" ? "var(--accent)" : "rgba(255,255,255,0.15)",
                  borderRadius: 10,
                  maxWidth: "85%",
                }}
              >
                {line.msg}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Control bar */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 10,
          padding: 12,
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(20px)",
          borderRadius: 999,
          alignItems: "center",
        }}
      >
        {CONTROLS.map((c) => (
          <button
            key={c.label}
            type="button"
            aria-label={c.label}
            style={{
              width: 56,
              height: 56,
              borderRadius: 999,
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
            }}
          >
            <Icon name={c.icon} size={22} />
          </button>
        ))}
        <button
          type="button"
          aria-label="End call"
          style={{
            width: 56,
            height: 56,
            borderRadius: 999,
            background: "var(--danger)",
            border: 0,
            color: "#fff",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
          }}
        >
          <Icon name="x" size={22} />
        </button>
      </div>

      {/* Apply nudge */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          right: 32,
          padding: 18,
          background: "var(--paper)",
          borderRadius: 14,
          maxWidth: 280,
          boxShadow: "0 12px 32px rgba(0,0,0,0.3)",
        }}
      >
        <Eyebrow>Like what you see?</Eyebrow>
        <div style={{ fontWeight: 600, marginTop: 6 }}>Apply while you're on the call</div>
        <Button
          variant="accent"
          size="sm"
          style={{ marginTop: 12, width: "100%", justifyContent: "center" }}
        >
          Apply now
        </Button>
      </div>
    </div>
  );
}
