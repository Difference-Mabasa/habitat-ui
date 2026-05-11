export default function App() {
  return (
    <main style={{ padding: 48, maxWidth: 720 }}>
      <h1 className="display" style={{ fontSize: 64, margin: 0 }}>
        BACKROOM
      </h1>
      <p className="eyebrow" style={{ marginTop: 12 }}>
        UI scaffold ready
      </p>
      <p style={{ marginTop: 24, lineHeight: 1.6 }}>
        Vite + React + TypeScript is up. Design tokens loaded from{" "}
        <code className="mono">src/styles/tokens.css</code>. Utility classes
        available from <code className="mono">src/styles/utilities.css</code>.
      </p>
      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <button className="btn btn--accent">Accent</button>
        <button className="btn btn--primary">Primary</button>
        <button className="btn btn--secondary">Secondary</button>
      </div>
    </main>
  );
}
