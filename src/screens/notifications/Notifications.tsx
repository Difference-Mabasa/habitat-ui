import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import LandlordShell from "@/components/LandlordShell";
import AgentShell from "@/components/AgentShell";
import { useWorkspace } from "@/lib/useWorkspace";
import Button from "@/components/Button";
import IconButton from "@/components/IconButton";
import Card from "@/components/Card";
import Tabs from "@/components/Tabs";
import Eyebrow from "@/components/Eyebrow";
import PageHeader from "@/components/PageHeader";
import Alert from "@/components/Alert";
import Badge from "@/components/Badge";
import NotificationRow, { type NotificationTone } from "@/components/NotificationRow";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import type { IconName } from "@/components/Icon";

type NotificationCategory = "money" | "applications" | "lease" | "mandate" | "viewings" | "maintenance" | "system";

interface NotificationItem {
  id: string;
  type: string;
  category: NotificationCategory;
  icon: IconName;
  title: string;
  body: string;
  tone?: NotificationTone;
  unread?: boolean;
  day: "Today" | "Yesterday" | "This week";
}

const ITEMS: NotificationItem[] = [];

const CATEGORY_FILTERS: { id: NotificationCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "money", label: "Money" },
  { id: "applications", label: "Applications" },
  { id: "lease", label: "Lease" },
  { id: "mandate", label: "Mandate" },
  { id: "viewings", label: "Viewings" },
  { id: "maintenance", label: "Maintenance" },
  { id: "system", label: "System" },
];

const DAY_ORDER: NotificationItem["day"][] = ["Today", "Yesterday", "This week"];

const TYPE_DESTINATION: Record<string, string> = {
  PAYMENT_RECEIVED: "/statements",
  PAYMENT_FAILED: "/payment",
  PAYOUT_RELEASED: "/statements",
  APPLICATION_RECEIVED: "/applicant",
  APPLICATION_APPROVED: "/applicant",
  DOCUMENTS_REQUESTED: "/my-apps",
  APPLICATION_ON_HOLD: "/my-apps",
  APPLICATION_DECLINED: "/my-apps",
  LEASE_READY: "/lease",
  LEASE_SIGNED: "/lease",
  LEASE_DECLINED: "/lease",
  MANDATE_PENDING_APPROVAL: "/mandate-approvals",
  MANDATE_APPROVED: "/my-mandates",
  MANDATE_REVOKED: "/my-mandates",
  VIEWING_REQUESTED: "/viewings",
  VIEWING_CONFIRMED: "/viewings",
  VIEWING_ALTERNATIVE_PROPOSED: "/viewings",
  MAINTENANCE_URGENT: "/maintenance",
  MAINTENANCE_RESOLVED: "/maintenance",
  VERIFICATION_APPROVED: "/verification",
  CREDIT_CONSENT_GRANTED: "/profile",
  MESSAGE_RECEIVED: "/inbox",
  LISTING_TIP: "/landlord-properties",
  SAVED_SEARCH_ALERT: "/browse",
  REVIEW_REQUEST: "/reviews",
};

export default function Notifications() {
  const ws = useWorkspace();
  const Shell = ws === "agent" ? AgentShell : LandlordShell;
  const [filter, setFilter] = useState<NotificationCategory | "all">("all");
  const [bulkRead, setBulkRead] = useState(false);
  const [showBellShake, setShowBellShake] = useState(true);
  const [params, setParams] = useSearchParams();
  const dataState = params.get("state") as "loading" | "error" | null;
  const clearDataState = () => {
    const next = new URLSearchParams(params);
    next.delete("state");
    setParams(next, { replace: true });
  };

  const visible = useMemo(
    () => (filter === "all" ? ITEMS : ITEMS.filter((n) => n.category === filter)),
    [filter],
  );
  const unread = bulkRead ? 0 : visible.filter((n) => n.unread).length;

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: ITEMS.length };
    for (const c of CATEGORY_FILTERS) {
      if (c.id !== "all") map[c.id] = ITEMS.filter((n) => n.category === c.id).length;
    }
    return map;
  }, []);

  const grouped = DAY_ORDER.map((day) => ({
    day,
    items: visible.filter((n) => n.day === day),
  })).filter((g) => g.items.length > 0);

  return (
    <Shell activeId="notifications">
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "32px 32px 64px" }}>
        <PageHeader
          eyebrow={
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              {unread} unread{" "}
              {unread > 0 ? <Badge tone="accent">live</Badge> : null}
            </span>
          }
          title="Notifications"
          subtitle="Typed categories from APPLICATION_APPROVED → DOCUMENTS_REQUESTED → PAYMENT_RECEIVED."
          actions={
            <>
              <Button
                variant="ghost"
                size="sm"
                disabled={unread === 0}
                onClick={() => setBulkRead(true)}
              >
                Mark all read
              </Button>
              <IconButton icon="settings" label="Settings" size="sm" />
            </>
          }
        />

        {showBellShake ? (
          <div style={{ marginBottom: 16 }}>
            <Alert
              tone="info"
              title="Bell shakes when a new typed notification arrives"
              onDismiss={() => setShowBellShake(false)}
            >
              Each category triggers its own icon + accent. Unread tally updates live; the bell in the nav
              gives a one-shot shake so it's noticeable without being noisy.
            </Alert>
          </div>
        ) : null}

        <div style={{ marginBottom: 20 }}>
          <Tabs
            tabs={CATEGORY_FILTERS.map((f) => ({
              id: f.id,
              label: f.label,
              count: counts[f.id],
            }))}
            value={filter}
            onChange={(id) => setFilter(id as NotificationCategory | "all")}
          />
        </div>

        {dataState === "loading" ? (
          <Card padding={0} style={{ overflow: "hidden" }}>
            <LoadingState rows={5} variant="list" withAvatar />
          </Card>
        ) : dataState === "error" ? (
          <ErrorState
            title="Couldn't load notifications"
            description="We couldn't reach the notifications service. Retry, or check the bell drawer for cached items."
            onRetry={clearDataState}
          />
        ) : null}

        {dataState ? null : grouped.map((g) => (
          <section key={g.day} style={{ marginBottom: 32 }}>
            <Eyebrow style={{ marginBottom: 12 }}>{g.day} · {g.items.length}</Eyebrow>
            <Card padding={0} style={{ overflow: "hidden" }}>
              {g.items.map((n, i) => {
                const dest = TYPE_DESTINATION[n.type] ?? "/notifications";
                return (
                  <Link
                    key={n.id}
                    to={dest}
                    style={{
                      display: "block",
                      textDecoration: "none",
                      color: "inherit",
                      borderTop: i > 0 ? "1px solid var(--hairline)" : "none",
                    }}
                  >
                    <NotificationRow
                      variant="page"
                      icon={n.icon}
                      tone={n.tone}
                      title={n.title}
                      body={
                        <span>
                          {n.body}{" "}
                          <span className="mono" style={{ fontSize: 10, color: "var(--slate-2)", marginLeft: 6 }}>
                            {n.type}
                          </span>
                        </span>
                      }
                      unread={n.unread && !bulkRead}
                    />
                  </Link>
                );
              })}
            </Card>
          </section>
        ))}

        {grouped.length === 0 ? (
          <Card padding={32} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 14, color: "var(--slate)" }}>
              No notifications in this category yet.
            </div>
          </Card>
        ) : null}
      </div>
    </Shell>
  );
}
