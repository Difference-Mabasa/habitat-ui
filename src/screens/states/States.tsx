import Nav from "@/components/Nav";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import EmptyState from "@/components/EmptyState";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function States() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="landlord" />
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "32px 32px 64px" }}>
        <Eyebrow>System surfaces</Eyebrow>
        <h1
          style={{
            fontSize: 30,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            margin: "8px 0 32px",
          }}
        >
          Empty, loading, error states
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {/* No results */}
          <Frame title="No search results">
            <EmptyState
              icon="search"
              title="No spots in this area yet"
              description="Try expanding the radius or save the search to get notified."
              actions={
                <>
                  <Button variant="ghost" size="sm">
                    Expand radius
                  </Button>
                  <Button variant="accent" size="sm">
                    Alert me
                  </Button>
                </>
              }
            />
          </Frame>

          {/* Loading skeleton */}
          <Frame title="Loading · skeleton">
            <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ display: "flex", gap: 12 }}>
                  <LoadingSkeleton shape="block" width={80} height={60} />
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      paddingTop: 6,
                    }}
                  >
                    <LoadingSkeleton width="70%" />
                    <LoadingSkeleton width="40%" />
                    <LoadingSkeleton width="30%" />
                  </div>
                </div>
              ))}
            </div>
          </Frame>

          {/* 404 */}
          <Frame title="404 · not found">
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
                textAlign: "center",
              }}
            >
              <div
                className="tabular"
                style={{
                  fontSize: 56,
                  fontWeight: 500,
                  letterSpacing: "-0.04em",
                  color: "var(--slate)",
                  lineHeight: 1,
                }}
              >
                404
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 12, marginBottom: 6 }}>
                This spot's been let or removed
              </div>
              <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 16 }}>
                It might've been snapped up while you were looking.
              </div>
              <Button variant="accent" size="sm">
                Browse similar
              </Button>
            </div>
          </Frame>

          {/* No applications */}
          <Frame title="Empty inbox · landlord">
            <EmptyState
              icon="inbox"
              title="No applications yet"
              description="Most listings get their first application within 48 hours of going live."
              actions={
                <Button variant="ghost" size="sm">
                  View listing
                </Button>
              }
            />
          </Frame>

          {/* Payment failed */}
          <Frame title="Payment failed">
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "color-mix(in oklch, var(--warn) 14%, transparent)",
                  color: "var(--warn)",
                  border: "1px solid var(--warn)",
                  display: "grid",
                  placeItems: "center",
                  marginBottom: 16,
                }}
              >
                <Icon name="x" size={22} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                Payment didn't go through
              </div>
              <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 16, lineHeight: 1.5 }}>
                Your bank declined the transaction. No funds were moved.
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <Button variant="ghost" size="sm">
                  Try another card
                </Button>
                <Button variant="accent" size="sm">
                  Retry
                </Button>
              </div>
            </div>
          </Frame>

          {/* Offline */}
          <Frame title="Offline">
            <EmptyState
              icon="wifi"
              title="You're offline"
              description="Showing cached listings. We'll refresh when you're back."
              actions={
                <Button variant="ghost" size="sm">
                  Retry connection
                </Button>
              }
            />
          </Frame>
        </div>
      </div>
    </div>
  );
}

function Frame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <Eyebrow style={{ marginBottom: 8 }}>{title}</Eyebrow>
      <Card padding={0} style={{ overflow: "hidden", height: 280, display: "flex", flexDirection: "column" }}>
        {children}
      </Card>
    </div>
  );
}
