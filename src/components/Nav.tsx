import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import Icon from "./Icon";
import IconButton from "./IconButton";
import Avatar from "./Avatar";
import NotificationDrawer, { type NotificationItem } from "./NotificationDrawer";
import ChatDrawer, { type ChatDirectMessage, type ChatCommunity } from "./ChatDrawer";

export type NavRole = "tenant" | "landlord" | "agent" | "admin";

export interface NavLink {
  label: string;
  to: string;
}

const TENANT_LINKS: NavLink[] = [
  { label: "Browse", to: "/browse" },
  { label: "Saved", to: "/saved" },
  { label: "My applications", to: "/my-apps" },
  { label: "My rental", to: "/tenant-portal" },
  { label: "Communities", to: "/communities" },
];

const LANDLORD_LINKS: NavLink[] = [
  { label: "Overview", to: "/landlord-dashboard" },
  { label: "Properties", to: "/landlord-dashboard" },
  { label: "Applications", to: "/applicant" },
  { label: "Tenants", to: "/tenant-portal" },
  { label: "Mandates", to: "/mandates" },
  { label: "Inbox", to: "/inbox" },
];

const AGENT_LINKS: NavLink[] = [
  { label: "Mandates", to: "/mandates" },
  { label: "Viewings", to: "/viewings" },
  { label: "Applications", to: "/applicant" },
  { label: "Inbox", to: "/inbox" },
];

const ADMIN_LINKS: NavLink[] = [
  { label: "Queue", to: "/admin" },
  { label: "Users", to: "/admin" },
  { label: "Reports", to: "/admin" },
];

const ROLE_LABEL: Record<NavRole, string> = {
  tenant: "Tenant",
  landlord: "Landlord",
  agent: "Agent",
  admin: "Admin",
};

export interface NavProps {
  role?: NavRole;
  user?: { name: string };
  showBadges?: boolean;
  notifications?: NotificationItem[];
  dms?: ChatDirectMessage[];
  communities?: ChatCommunity[];
}

const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  { id: "n1", type: "Application", title: "Sipho Dlamini applied", body: "2-Bed Cottage · Brixton — submitted 14 min ago", unread: true, time: "14m" },
  { id: "n2", type: "Viewing", title: "New viewing request", body: "Naledi K. requested Sat 10:30 for Studio · Melville", unread: true, time: "1h" },
  { id: "n3", type: "Lease", title: "Lease ready to sign", body: "Garden Flat · Westdene — 1 signature pending", unread: true, time: "3h" },
  { id: "n4", type: "Payment", title: "Rent received", body: "R 6,800 from Lerato N. for Backroom · Yeoville", unread: false, time: "Yesterday" },
  { id: "n5", type: "Message", title: "Mandate update", body: "Khaya Properties accepted your mandate", unread: false, time: "2d" },
];

const SAMPLE_DMS: ChatDirectMessage[] = [
  { id: "d1", name: "Sipho Dlamini", sub: "Re: Studio · Melville", unread: 2, last: "Hi, is the unit still available?" },
  { id: "d2", name: "Naledi Khumalo", sub: "Re: 2-Bed Cottage · Brixton", unread: 0, last: "Thanks, see you Saturday." },
  { id: "d3", name: "Lerato Ndlovu", sub: "Re: Backroom · Yeoville", unread: 1, last: "Sent the deposit just now." },
];

const SAMPLE_COMMUNITIES: ChatCommunity[] = [
  { id: "c1", name: "Westdene Tenants", count: 12, type: "Building" },
  { id: "c2", name: "Brixton Landlords", count: 38, type: "Network" },
];

function linksFor(role: NavRole): NavLink[] {
  if (role === "landlord") return LANDLORD_LINKS;
  if (role === "agent") return AGENT_LINKS;
  if (role === "admin") return ADMIN_LINKS;
  return TENANT_LINKS;
}

export default function Nav({
  role = "tenant",
  user = { name: "Thandi M." },
  showBadges = true,
  notifications = SAMPLE_NOTIFICATIONS,
  dms = SAMPLE_DMS,
  communities = SAMPLE_COMMUNITIES,
}: NavProps) {
  const [openChat, setOpenChat] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  const location = useLocation();
  const unreadNotif = notifications.filter((n) => n.unread).length;
  const unreadDms = dms.reduce((sum, d) => sum + d.unread, 0);
  const links = linksFor(role);

  return (
    <header
      style={{
        height: 64,
        borderBottom: "1px solid var(--hairline)",
        background: "var(--surface)",
        position: "relative",
        zIndex: 5,
      }}
    >
      <div
        style={{
          height: "100%",
          maxWidth: 1440,
          margin: "0 auto",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          gap: 32,
        }}
      >
        <Link to="/" aria-label="Habitat home">
          <Logo size={20} />
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 24 }}>
          {links.map((l) => {
            const active = location.pathname === l.to;
            return (
              <Link
                key={l.label}
                to={l.to}
                style={{
                  padding: "8px 12px",
                  fontSize: 14,
                  fontWeight: 500,
                  color: active ? "var(--ink)" : "var(--slate)",
                  borderRadius: 6,
                  position: "relative",
                }}
              >
                {l.label}
                {active ? (
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      bottom: -22,
                      left: 12,
                      right: 12,
                      height: 2,
                      background: "var(--ink)",
                    }}
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div style={{ flex: 1 }} />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            height: 36,
            padding: "0 12px",
            background: "var(--surface-2)",
            border: "1px solid var(--hairline)",
            borderRadius: 8,
            minWidth: 240,
            color: "var(--slate)",
          }}
        >
          <Icon name="search" size={15} />
          <span style={{ fontSize: 13 }}>Search anywhere…</span>
          <span
            style={{
              marginLeft: "auto",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--slate-2)",
            }}
          >
            ⌘K
          </span>
        </div>

        <IconButton
          icon="chat"
          label="Inbox"
          badge={showBadges ? unreadDms : undefined}
          onClick={() => {
            setOpenChat((v) => !v);
            setOpenNotif(false);
          }}
        />
        <IconButton
          icon="bell"
          label="Notifications"
          badge={showBadges ? unreadNotif : undefined}
          onClick={() => {
            setOpenNotif((v) => !v);
            setOpenChat(false);
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "4px 4px 4px 12px",
            border: "1px solid var(--hairline)",
            borderRadius: 999,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              lineHeight: 1.1,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 500 }}>{user.name}</span>
            <span style={{ fontSize: 11, color: "var(--slate)" }}>{ROLE_LABEL[role]}</span>
          </div>
          <Avatar name={user.name} size="md" />
        </div>
      </div>

      <NotificationDrawer open={openNotif} onClose={() => setOpenNotif(false)} items={notifications} />
      <ChatDrawer
        open={openChat}
        onClose={() => setOpenChat(false)}
        dms={dms}
        communities={communities}
      />
    </header>
  );
}
