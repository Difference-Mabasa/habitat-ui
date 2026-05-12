import Icon from "./Icon";
import Card from "./Card";
import Button from "./Button";
import IconButton from "./IconButton";
import Badge from "./Badge";
import Toggle from "./Toggle";
import Chip from "./Chip";

export type AlertChannel = "email" | "push" | "whatsapp";

export interface SavedSearchCardProps {
  name: string;
  matchCount: number;
  alertFrequency: "Daily" | "Weekly" | "Instant" | "Off";
  newCount?: number;
  alertsOn?: boolean;
  channels?: Set<AlertChannel>;
  onToggleAlerts?: (next: boolean) => void;
  onToggleChannel?: (channel: AlertChannel) => void;
  onView?: () => void;
  onSettings?: () => void;
}

const CHANNEL_META: { id: AlertChannel; label: string; icon: "chat" | "bell" }[] = [
  { id: "email",    label: "Email",    icon: "chat" },
  { id: "push",     label: "Push",     icon: "bell" },
  { id: "whatsapp", label: "WhatsApp", icon: "chat" },
];

export default function SavedSearchCard({
  name,
  matchCount,
  alertFrequency,
  newCount = 0,
  alertsOn = true,
  channels,
  onToggleAlerts,
  onToggleChannel,
  onView,
  onSettings,
}: SavedSearchCardProps) {
  const ch = channels ?? new Set<AlertChannel>(["email"]);

  return (
    <Card padding={18}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <Icon name="bell" size={14} style={{ color: alertsOn ? "var(--accent)" : "var(--slate)" }} />
        {newCount > 0 ? <Badge tone="accent">{newCount} new</Badge> : null}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{name}</div>
      <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 14 }}>
        {matchCount} matching · alerts {alertsOn ? alertFrequency.toLowerCase() : "off"}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 0",
          borderTop: "1px solid var(--hairline)",
        }}
      >
        <Toggle
          checked={alertsOn}
          onChange={(e) => onToggleAlerts?.(e.target.checked)}
        />
        <span style={{ fontSize: 12, color: "var(--ink)" }}>
          {alertsOn ? "Alert me on new matches" : "Alerts off"}
        </span>
      </div>

      {alertsOn ? (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
          {CHANNEL_META.map((c) => (
            <Chip
              key={c.id}
              active={ch.has(c.id)}
              leftIcon={c.icon}
              onClick={() => onToggleChannel?.(c.id)}
              style={{ height: 26, fontSize: 11 }}
            >
              {c.label}
            </Chip>
          ))}
        </div>
      ) : null}

      <div style={{ display: "flex", gap: 6, paddingTop: 10, borderTop: "1px solid var(--hairline)" }}>
        <Button variant="ghost" size="sm" style={{ flex: 1, justifyContent: "center" }} onClick={onView}>
          View
        </Button>
        <IconButton icon="settings" label="Settings" size="sm" onClick={onSettings} />
      </div>
    </Card>
  );
}
