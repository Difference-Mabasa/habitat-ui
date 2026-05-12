import { useState } from "react";
import TenantShell from "@/components/TenantShell";
import Photo from "@/components/Photo";
import Icon from "@/components/Icon";
import IconButton from "@/components/IconButton";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import PriceDisplay from "@/components/PriceDisplay";
import Checkbox from "@/components/Checkbox";
import SavedSearchCard, { type AlertChannel } from "@/components/SavedSearchCard";
import { toast } from "@/lib/toast";

interface SearchRow {
  id: string;
  name: string;
  matches: number;
  newCount: number;
  frequency: "Daily" | "Weekly";
}

const SEARCHES: SearchRow[] = [
  { id: "s1", name: "Melville · 1 bed · under R5k", matches: 12, newCount: 3, frequency: "Daily" },
  { id: "s2", name: "Brixton + Auckland Park · backrooms", matches: 7, newCount: 0, frequency: "Weekly" },
  { id: "s3", name: "Pet-friendly · Northcliff", matches: 4, newCount: 1, frequency: "Daily" },
];

type NoteTone = "accent" | "success" | "warn" | "neutral";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  note?: string;
  noteTone: NoteTone;
  selected?: boolean;
}

const WISHLIST: WishlistItem[] = [
  { id: "w1", name: "Sunlit cottage · Caroline", price: 4400, note: "Viewing booked Sat 11am", noteTone: "accent", selected: true },
  { id: "w2", name: "Studio · Melville", price: 5400, note: "Application in progress", noteTone: "neutral", selected: true },
  { id: "w3", name: "Garden flatlet · Brixton", price: 5200, note: "Drop in price · was R5,500", noteTone: "success" },
  { id: "w4", name: "Backroom · Yeoville", price: 3800, noteTone: "neutral" },
  { id: "w5", name: "Loft · Maboneng", price: 7800, note: "Let — saved for ref.", noteTone: "warn" },
  { id: "w6", name: "Cottage · Norwood", price: 6200, note: "Application declined", noteTone: "warn" },
];

const NOTE_STYLE: Record<NoteTone, { bg: string; color: string }> = {
  accent: { bg: "color-mix(in oklch, var(--accent) 8%, transparent)", color: "var(--accent)" },
  success: { bg: "color-mix(in oklch, var(--success) 8%, transparent)", color: "var(--success)" },
  warn: { bg: "var(--surface-2)", color: "var(--slate)" },
  neutral: { bg: "var(--surface-2)", color: "var(--slate)" },
};

interface SearchAlertState {
  on: boolean;
  channels: Set<AlertChannel>;
}

export default function Saved() {
  const [alertsState, setAlertsState] = useState<Record<string, SearchAlertState>>(() => ({
    s1: { on: true,  channels: new Set<AlertChannel>(["email", "push"]) },
    s2: { on: true,  channels: new Set<AlertChannel>(["email"]) },
    s3: { on: false, channels: new Set<AlertChannel>(["email"]) },
  }));

  const setAlerts = (id: string, on: boolean) => {
    setAlertsState((prev) => ({ ...prev, [id]: { ...prev[id], on } }));
    toast.success(on ? "Alerts on for this search." : "Alerts paused.");
  };
  const toggleChannel = (id: string, ch: AlertChannel) => {
    setAlertsState((prev) => {
      const next = new Set(prev[id].channels);
      if (next.has(ch)) next.delete(ch);
      else next.add(ch);
      return { ...prev, [id]: { ...prev[id], channels: next } };
    });
  };

  return (
    <TenantShell activeId="saved">
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 32px 64px" }}>
        <Eyebrow>Your shortlist</Eyebrow>
        <h1
          style={{
            fontSize: 30,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            margin: "8px 0 32px",
          }}
        >
          Saved & alerts
        </h1>

        {/* Saved searches */}
        <section style={{ marginBottom: 40 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 16,
            }}
          >
            <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Saved searches</h2>
            <Button variant="ghost" size="sm" leftIcon="plus">
              New search
            </Button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {SEARCHES.map((s) => {
              const state = alertsState[s.id];
              return (
                <SavedSearchCard
                  key={s.id}
                  name={s.name}
                  matchCount={s.matches}
                  newCount={s.newCount}
                  alertFrequency={s.frequency}
                  alertsOn={state?.on ?? true}
                  channels={state?.channels}
                  onToggleAlerts={(next) => setAlerts(s.id, next)}
                  onToggleChannel={(ch) => toggleChannel(s.id, ch)}
                />
              );
            })}
          </div>
        </section>

        {/* Wishlist */}
        <section>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 16,
            }}
          >
            <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>
              Wishlist · {WISHLIST.length} spots
            </h2>
            <div style={{ display: "flex", gap: 8 }}>
              <Button variant="secondary" size="sm">
                Compare {WISHLIST.filter((w) => w.selected).length}
              </Button>
              <Button variant="ghost" size="sm">
                Sort: Price ↑
              </Button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {WISHLIST.map((w) => {
              const noteStyle = NOTE_STYLE[w.noteTone];
              return (
                <Card
                  key={w.id}
                  padding={0}
                  style={{
                    overflow: "hidden",
                    opacity: w.noteTone === "warn" ? 0.6 : 1,
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <Photo ratio="16/10" label="" style={{ borderRadius: 0 }} />
                    <IconButton
                      icon="heart"
                      label="Unsave"
                      size="sm"
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        background: "var(--paper)",
                        color: "var(--accent)",
                      }}
                    />
                    <div style={{ position: "absolute", top: 12, left: 12 }}>
                      <Checkbox aria-label={`Compare ${w.name}`} defaultChecked={w.selected} />
                    </div>
                  </div>
                  <div style={{ padding: 14 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        marginBottom: 4,
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{w.name}</div>
                      <PriceDisplay amount={w.price} period="" size="sm" />
                    </div>
                    {w.note ? (
                      <div
                        style={{
                          marginTop: 8,
                          padding: "6px 10px",
                          background: noteStyle.bg,
                          color: noteStyle.color,
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 500,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        {w.noteTone === "success" ? <Icon name="trend" size={11} /> : null}
                        {w.note}
                      </div>
                    ) : null}
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </TenantShell>
  );
}
