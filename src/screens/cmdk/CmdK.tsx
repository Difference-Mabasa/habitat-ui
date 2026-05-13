import Icon, { type IconName } from "@/components/Icon";

interface PaletteRow {
  icon: IconName;
  title: string;
  sub: string;
  selected?: boolean;
}

const GO_TO: PaletteRow[] = [
  { icon: "doc", title: "Applicants", sub: "Landlord view", selected: true },
  { icon: "doc", title: "My applications", sub: "Tenant view" },
  { icon: "doc", title: "Apply for new spot", sub: "Tenant action" },
];

const ACTIONS: PaletteRow[] = [
  { icon: "plus", title: "Approve top applicant", sub: "Landlord action" },
  { icon: "paper", title: "Generate lease draft", sub: "Landlord action" },
];

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
      }}
    >
      {children}
    </kbd>
  );
}

export default function CmdK() {
  return (
    <div style={{ background: "var(--ink)", minHeight: "100vh", position: "relative" }}>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.25,
          background: "linear-gradient(135deg, var(--ink) 0%, #321B0C 100%)",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.06,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }}
      />

      {/* Palette */}
      <div
        role="dialog"
        aria-label="Command palette"
        style={{
          position: "absolute",
          left: "50%",
          top: 120,
          transform: "translateX(-50%)",
          width: 680,
          background: "var(--paper)",
          borderRadius: 16,
          boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
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
          }}
        >
          <Icon name="search" size={20} style={{ color: "var(--slate)" }} />
          <input
            defaultValue=""
            placeholder="Type a command, search, or go to..."
            style={{
              flex: 1,
              border: 0,
              outline: "none",
              background: "transparent",
              fontSize: 17,
              color: "var(--ink)",
              fontFamily: "inherit",
            }}
          />
          <Kbd>esc</Kbd>
        </div>

        <div style={{ padding: 8 }}>
          <div className="eyebrow" style={{ padding: "8px 12px" }}>
            Go to · {GO_TO.length}
          </div>
          {GO_TO.map((r) => (
            <div
              key={r.title}
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: r.selected ? "var(--accent-soft)" : "transparent",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: r.selected ? "var(--accent)" : "var(--surface-2)",
                  color: r.selected ? "#fff" : "var(--slate)",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Icon name={r.icon} size={14} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{r.title}</div>
                <div style={{ fontSize: 12, color: "var(--slate)" }}>{r.sub}</div>
              </div>
              {r.selected ? (
                <span className="mono" style={{ fontSize: 11, color: "var(--slate)" }}>
                  ↵ open
                </span>
              ) : null}
            </div>
          ))}

          <div className="eyebrow" style={{ padding: "12px 12px 8px" }}>
            Actions · {ACTIONS.length}
          </div>
          {ACTIONS.map((r) => (
            <div
              key={r.title}
              style={{
                padding: "10px 12px",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: "var(--surface-2)",
                  color: "var(--slate)",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Icon name={r.icon} size={14} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{r.title}</div>
                <div style={{ fontSize: 12, color: "var(--slate)" }}>{r.sub}</div>
              </div>
            </div>
          ))}
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
          }}
        >
          <span>
            <Kbd>↑↓</Kbd> navigate
          </span>
          <span>
            <Kbd>↵</Kbd> select
          </span>
          <span>
            <Kbd>tab</Kbd> filter
          </span>
          <span className="mono" style={{ marginLeft: "auto" }}>
            ⌘K from anywhere
          </span>
        </div>
      </div>

      <div
        className="mono"
        style={{
          position: "absolute",
          left: "50%",
          bottom: 80,
          transform: "translateX(-50%)",
          color: "rgba(247,239,226,0.5)",
          fontSize: 12,
        }}
      >
        Press ⌘ K from anywhere to open
      </div>
    </div>
  );
}
