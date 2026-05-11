import { useState } from "react";
import Nav from "@/components/Nav";
import Button from "@/components/Button";
import IconButton from "@/components/IconButton";
import Card from "@/components/Card";
import Tabs from "@/components/Tabs";
import Eyebrow from "@/components/Eyebrow";
import PageHeader from "@/components/PageHeader";
import NotificationRow, { type NotificationTone } from "@/components/NotificationRow";
import type { IconName } from "@/components/Icon";

interface NotificationItem {
  id: string;
  icon: IconName;
  title: string;
  body: string;
  tone?: NotificationTone;
  unread?: boolean;
}

interface NotificationGroup {
  day: string;
  items: NotificationItem[];
}

const GROUPS: NotificationGroup[] = [
  {
    day: "Today",
    items: [
      { id: "n1", icon: "cash", title: "Rent paid · R 5,400", body: "Sipho Dlamini · Studio Melville · 09:14", tone: "success", unread: true },
      { id: "n2", icon: "user", title: "New application from Lerato P.", body: "Cottage Caroline · score 78 · 08:42", tone: "accent", unread: true },
      { id: "n3", icon: "flame", title: "Urgent maintenance · geyser leak", body: "Studio Melville · MNT-0421 · 07:21", tone: "warn", unread: true },
    ],
  },
  {
    day: "Yesterday",
    items: [
      { id: "n4", icon: "calendar", title: "Viewing confirmed · Sat 11am", body: "Aisha M. · Studio Melville" },
      { id: "n5", icon: "chat", title: "New message from Thandi", body: '"Lease is ready, see attached."' },
      { id: "n6", icon: "shield", title: "FICA verification approved", body: "Sipho Dlamini's documents accepted", tone: "success" },
    ],
  },
  {
    day: "This week",
    items: [
      { id: "n7", icon: "trend", title: "Listing tip: add 4 more photos", body: "Studio Melville is below the photo-count benchmark" },
      { id: "n8", icon: "bell", title: '3 new spots match "Pet-friendly · Northcliff"', body: "Saved search alert" },
      { id: "n9", icon: "star", title: "Tenant review request", body: "Your lease at Studio Brixton ended — leave a review" },
    ],
  },
];

const FILTERS = [
  { id: "all", label: "All" },
  { id: "money", label: "Money" },
  { id: "applications", label: "Applications" },
  { id: "maintenance", label: "Maintenance" },
  { id: "system", label: "System" },
];

export default function Notifications() {
  const [filter, setFilter] = useState("all");
  const unread = GROUPS.flatMap((g) => g.items).filter((n) => n.unread).length;

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="landlord" />

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 32px 64px" }}>
        <PageHeader
          eyebrow={`${unread} unread`}
          title="Notifications"
          actions={
            <>
              <Button variant="ghost" size="sm">Mark all read</Button>
              <IconButton icon="settings" label="Settings" size="sm" />
            </>
          }
        />

        <div style={{ marginBottom: 24 }}>
          <Tabs tabs={FILTERS} value={filter} onChange={setFilter} />
        </div>

        {GROUPS.map((g) => (
          <section key={g.day} style={{ marginBottom: 32 }}>
            <Eyebrow style={{ marginBottom: 12 }}>{g.day}</Eyebrow>
            <Card padding={0} style={{ overflow: "hidden" }}>
              {g.items.map((n, i) => (
                <div
                  key={n.id}
                  style={{ borderTop: i > 0 ? "1px solid var(--hairline)" : "none" }}
                >
                  <NotificationRow
                    variant="page"
                    icon={n.icon}
                    tone={n.tone}
                    title={n.title}
                    body={n.body}
                    unread={n.unread}
                  />
                </div>
              ))}
            </Card>
          </section>
        ))}
      </div>
    </div>
  );
}
