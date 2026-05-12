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

const ITEMS: NotificationItem[] = [
  // Money
  { id: "n1", type: "PAYMENT_RECEIVED", category: "money", icon: "cash", title: "Rent paid · R 5,400", body: "Sipho Dlamini · Studio Melville · 09:14", tone: "success", unread: true, day: "Today" },
  { id: "n2", type: "PAYMENT_FAILED", category: "money", icon: "cash", title: "Card declined · R 5,800", body: "Garden Flat · Brixton — HB-INV-04332", tone: "warn", unread: true, day: "Today" },
  { id: "n3", type: "PAYOUT_RELEASED", category: "money", icon: "cash", title: "Payout released to FNB ••3091", body: "R 24,400 net for April · 11 of 11 paid", tone: "success", day: "Yesterday" },
  // Applications
  { id: "n4", type: "APPLICATION_RECEIVED", category: "applications", icon: "user", title: "New application from Lerato P.", body: "Cottage Caroline · score 78 · 08:42", tone: "accent", unread: true, day: "Today" },
  { id: "n5", type: "APPLICATION_APPROVED", category: "applications", icon: "check", title: "Application approved", body: "Naledi K. · Studio Melville — lease being drafted", tone: "success", day: "Yesterday" },
  { id: "n6", type: "DOCUMENTS_REQUESTED", category: "applications", icon: "doc", title: "Landlord requested 6 months of statements", body: "Cottage Norwood — conditionally approved by Pieter K.", tone: "warn", unread: true, day: "Today" },
  { id: "n7", type: "APPLICATION_ON_HOLD", category: "applications", icon: "clock", title: "Application paused", body: "Flatlet Auckland Park — Ravi is reviewing in batches", tone: "warn", day: "This week" },
  { id: "n8", type: "APPLICATION_DECLINED", category: "applications", icon: "x", title: "Application declined", body: "Studio Brixton — outside Lerato's budget band", tone: "warn", day: "This week" },
  // Lease
  { id: "n9", type: "LEASE_READY", category: "lease", icon: "paper", title: "Lease ready to sign", body: "Studio Melville · LSE-2024-00482 — Thandi signed", tone: "accent", unread: true, day: "Today" },
  { id: "n10", type: "LEASE_SIGNED", category: "lease", icon: "check", title: "Lease fully signed", body: "Backroom Vilakazi — both parties · 14 May 16:02", tone: "success", day: "Yesterday" },
  { id: "n11", type: "LEASE_DECLINED", category: "lease", icon: "x", title: "Tenant declined the lease", body: "Cottage Linden — Susan B. cancelled the offer", tone: "warn", day: "This week" },
  // Mandate
  { id: "n12", type: "MANDATE_PENDING_APPROVAL", category: "mandate", icon: "key", title: "Mandate request waiting", body: "Vilakazi Property Co. → Backroom Vilakazi · 3 hours ago", tone: "warn", unread: true, day: "Today" },
  { id: "n13", type: "MANDATE_APPROVED", category: "mandate", icon: "key", title: "Mandate approved", body: "Inner City Lets accepted by Ravi Singh — Loft Maboneng", tone: "success", day: "This week" },
  { id: "n14", type: "MANDATE_REVOKED", category: "mandate", icon: "key", title: "Mandate revoked", body: "Lerato Pretorius ended Flatlet Yeoville mandate — 2 May", day: "This week" },
  // Viewings
  { id: "n15", type: "VIEWING_REQUESTED", category: "viewings", icon: "calendar", title: "New viewing request", body: "Naledi K. requested Sat 10:30 for Studio Melville", tone: "accent", unread: true, day: "Today" },
  { id: "n16", type: "VIEWING_CONFIRMED", category: "viewings", icon: "calendar", title: "Viewing confirmed · Sat 11am", body: "Aisha M. · Studio Melville", day: "Yesterday" },
  { id: "n17", type: "VIEWING_ALTERNATIVE_PROPOSED", category: "viewings", icon: "calendar", title: "Tenant proposed alternative time", body: "Sipho D. countered to Sat 14:00 · awaiting your reply", tone: "accent", day: "Yesterday" },
  // Maintenance
  { id: "n18", type: "MAINTENANCE_URGENT", category: "maintenance", icon: "flame", title: "Urgent maintenance · geyser leak", body: "Studio Melville · MNT-0421 · 07:21", tone: "warn", unread: true, day: "Today" },
  { id: "n19", type: "MAINTENANCE_RESOLVED", category: "maintenance", icon: "wrench", title: "Maintenance resolved", body: "Plumbing fix at Garden Cottage — invoiced", tone: "success", day: "Yesterday" },
  // System
  { id: "n20", type: "VERIFICATION_APPROVED", category: "system", icon: "shield", title: "FICA verification approved", body: "Sipho Dlamini's documents accepted", tone: "success", day: "Yesterday" },
  { id: "n21", type: "CREDIT_CONSENT_GRANTED", category: "system", icon: "shield", title: "TPN consent recorded", body: "Naledi K. authorised credit + TPN — ref HB-CONS-04250", day: "This week" },
  { id: "n22", type: "MESSAGE_RECEIVED", category: "system", icon: "chat", title: "New message from Thandi", body: '"Lease is ready, see attached."', day: "Yesterday" },
  { id: "n23", type: "LISTING_TIP", category: "system", icon: "trend", title: "Listing tip · add 4 more photos", body: "Studio Melville is below the photo-count benchmark", day: "This week" },
  { id: "n24", type: "SAVED_SEARCH_ALERT", category: "system", icon: "bell", title: '3 new spots match "Pet-friendly · Northcliff"', body: "Saved search alert", day: "This week" },
  { id: "n25", type: "REVIEW_REQUEST", category: "system", icon: "star", title: "Tenant review request", body: "Your lease at Studio Brixton ended — leave a review", day: "This week" },
];

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
          subtitle={`${ITEMS.length} total · 33+ typed categories from APPLICATION_APPROVED → DOCUMENTS_REQUESTED → PAYMENT_RECEIVED.`}
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
