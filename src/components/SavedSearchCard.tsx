import Icon from "./Icon";
import Card from "./Card";
import Button from "./Button";
import IconButton from "./IconButton";
import Badge from "./Badge";

export interface SavedSearchCardProps {
  name: string;
  matchCount: number;
  alertFrequency: "Daily" | "Weekly" | "Instant" | "Off";
  newCount?: number;
  onView?: () => void;
  onSettings?: () => void;
}

export default function SavedSearchCard({
  name,
  matchCount,
  alertFrequency,
  newCount = 0,
  onView,
  onSettings,
}: SavedSearchCardProps) {
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
        <Icon name="bell" size={14} style={{ color: "var(--accent)" }} />
        {newCount > 0 ? <Badge tone="accent">{newCount} new</Badge> : null}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{name}</div>
      <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 16 }}>
        {matchCount} matching · alerts {alertFrequency.toLowerCase()}
      </div>
      <div style={{ display: "flex", gap: 6, paddingTop: 12, borderTop: "1px solid var(--hairline)" }}>
        <Button variant="ghost" size="sm" style={{ flex: 1, justifyContent: "center" }} onClick={onView}>
          View
        </Button>
        <IconButton icon="settings" label="Settings" size="sm" onClick={onSettings} />
      </div>
    </Card>
  );
}
