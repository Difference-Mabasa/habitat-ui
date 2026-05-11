import { useState } from "react";
import DrawerShell from "./DrawerShell";
import NotificationRow from "./NotificationRow";
import Chip from "./Chip";

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
}

export interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
  items: NotificationItem[];
  filters?: string[];
}

const DEFAULT_FILTERS = ["All", "Unread", "Applications", "Payments"];

export default function NotificationDrawer({
  open,
  onClose,
  items,
  filters = DEFAULT_FILTERS,
}: NotificationDrawerProps) {
  const [filter, setFilter] = useState(filters[0] ?? "All");
  const visible = items.filter((n) => {
    if (filter === "All") return true;
    if (filter === "Unread") return n.unread;
    return n.type === filter || `${n.type}s` === filter;
  });

  return (
    <DrawerShell open={open} onClose={onClose} title="Notifications">
      <div style={{ display: "flex", padding: "8px 16px", gap: 6, borderBottom: "1px solid var(--hairline)", flexWrap: "wrap" }}>
        {filters.map((f) => (
          <Chip key={f} active={f === filter} onClick={() => setFilter(f)} style={{ height: 26, fontSize: 12 }}>
            {f}
          </Chip>
        ))}
      </div>
      {visible.map((n) => (
        <NotificationRow
          key={n.id}
          type={n.type}
          title={n.title}
          body={n.body}
          time={n.time}
          unread={n.unread}
        />
      ))}
    </DrawerShell>
  );
}
