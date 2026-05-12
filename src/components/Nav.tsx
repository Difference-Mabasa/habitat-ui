import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import Icon, { type IconName } from "./Icon";
import IconButton from "./IconButton";
import Avatar from "./Avatar";
import Eyebrow from "./Eyebrow";
import Badge from "./Badge";
import NotificationDrawer, { type NotificationItem } from "./NotificationDrawer";
import type { ChatDirectMessage } from "./ChatDrawer";
import { useSession } from "@/lib/session";
import { useViewport } from "@/hooks/useViewport";

export type NavRole = "tenant" | "landlord" | "agent" | "admin";

export interface NavLink {
  label: string;
  to: string;
}

/**
 * Cross-context primary links — catalog/CTA entry points that don't belong
 * inside any dashboard sidebar. Everything else (My applications, Saved,
 * Properties, etc.) lives in the role's sidebar to avoid duplication.
 */
const PRIMARY_LINKS: NavLink[] = [
  { label: "Browse", to: "/browse" },
  { label: "List", to: "/list-property" },
  { label: "Communities", to: "/communities" },
  { label: "Agents", to: "/agent-browse" },
];

const ROLE_LABEL: Record<NavRole, string> = {
  tenant: "Tenant",
  landlord: "Landlord",
  agent: "Agent",
  admin: "Admin",
};

/**
 * All workspaces the user can pivot into from the avatar dropdown.
 * Until auth + roles are wired up, every workspace is visible to everyone.
 * When roles land, filter this list by `user.roles` before rendering.
 */
interface WorkspaceItem {
  icon: IconName;
  label: string;
  to: string;
  role: NavRole;
  hint?: string;
}

const WORKSPACES: WorkspaceItem[] = [
  { icon: "home", label: "My Rental", to: "/tenant-portal", role: "tenant", hint: "Tenant dashboard" },
  { icon: "key", label: "Landlord dashboard", to: "/landlord-dashboard", role: "landlord", hint: "Properties · payouts · tenants" },
  { icon: "users", label: "Agent workspace", to: "/agent-overview", role: "agent", hint: "Marketplace · mandates" },
  { icon: "shield", label: "Admin queue", to: "/admin", role: "admin", hint: "Moderation · trust & safety" },
];

interface MenuItem {
  icon: IconName;
  label: string;
  to: string;
  /** Tone for the link text — defaults to ink. */
  tone?: "ink" | "danger";
}

function accountMenuFor(role: NavRole): MenuItem[] {
  return [
    { icon: "user", label: "Profile", to: "/profile" },
    { icon: "settings", label: "Settings", to: role === "landlord" ? "/dashboard-settings" : "/settings" },
    { icon: "shield", label: "Verification", to: "/verification" },
    { icon: "logout", label: "Sign out", to: "/auth", tone: "danger" },
  ];
}

export interface NavProps {
  /** Force a role for this nav instance — overrides the session's active role. */
  role?: NavRole;
  /** Force a display user — overrides the session user. */
  user?: { name: string };
  showBadges?: boolean;
  notifications?: NotificationItem[];
  dms?: ChatDirectMessage[];
}

const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n0a",
    type: "Follow",
    title: "Naledi Khumalo started following you",
    body: "Tenant · Melville · 4m",
    fullBody:
      "Naledi Khumalo started following you. She's a verified Melville tenant — open her profile to follow back or send a message.",
    unread: true,
    time: "4m",
    href: "/u/u-naledi",
    actionLabel: "View profile",
  },
  {
    id: "n0b",
    type: "Reply",
    title: "Thandi replied to your post",
    body: "\"Sello did our place too. Reliable.\"",
    fullBody:
      "Thandi Mokoena replied to your tip about Sello the plumber: \"Sello did our place too. Reliable. He also does CoJ municipal compliance certificates if you need them at lease-end.\"",
    unread: true,
    time: "12m",
    href: "/post/p1",
    actionLabel: "Open reply",
  },
  {
    id: "n0c",
    type: "Mention",
    title: "Pieter mentioned you in a post",
    body: "\"@Sipho can confirm — Sello is the plumber.\"",
    fullBody:
      "Pieter Kruger mentioned you in a post about Westdene plumbers: \"@Sipho can confirm — Sello is the plumber I keep coming back to. Brixton + Westdene.\"",
    unread: true,
    time: "1h",
    href: "/post/p7",
    actionLabel: "Open post",
  },
  {
    id: "n0d",
    type: "Like",
    title: "12 people liked your tip",
    body: "\"Plumber rec for Brixton…\" picked up traction overnight",
    fullBody:
      "Your tip \"Plumber rec for Brixton: Sello on 071 322 0918\" got 12 new likes overnight (24 total). Thandi, Naledi, and 10 others reacted.",
    unread: false,
    time: "8h",
    href: "/post/p1",
    actionLabel: "Open post",
  },
  {
    id: "n1",
    type: "Application",
    title: "Sipho Dlamini applied",
    body: "2-Bed Cottage · Brixton — submitted 14 min ago",
    fullBody:
      "Sipho Dlamini submitted an application for 2-Bed Cottage · Brixton 14 min ago. Affordability score 88, payslips and bank statements verified, FICA complete. Awaiting your review.",
    unread: true,
    time: "14m",
    href: "/applicant",
    actionLabel: "Review applicant",
  },
  {
    id: "n2",
    type: "Viewing",
    title: "New viewing request",
    body: "Naledi K. requested Sat 10:30 for Studio · Melville",
    fullBody:
      "Naledi Khumalo asked to view Studio · Melville on Saturday at 10:30. She's open to a 30-minute window. Confirm, propose another time, or decline.",
    unread: true,
    time: "1h",
    href: "/viewings",
    actionLabel: "Confirm viewing",
  },
  {
    id: "n3",
    type: "Lease",
    title: "Lease ready to sign",
    body: "Garden Flat · Westdene — 1 signature pending",
    fullBody:
      "The lease for Garden Flat · Westdene (HB-LSE-2026-00418) is drafted and waiting on your signature. Tenant has already signed.",
    unread: true,
    time: "3h",
    href: "/lease",
    actionLabel: "Send to tenant",
  },
  {
    id: "n4",
    type: "Payment",
    title: "Rent received",
    body: "R 6,800 from Lerato N. for Backroom · Yeoville",
    fullBody:
      "R 6,800 was received from Lerato Ndlovu for Backroom · Yeoville. Trust-account hold released, payout queued for T+3.",
    unread: false,
    time: "Yesterday",
    href: "/statements",
    actionLabel: "View statement",
  },
  {
    id: "n5",
    type: "Message",
    title: "Mandate update",
    body: "Khaya Properties accepted your mandate",
    fullBody:
      "Khaya Properties accepted your Full-Management mandate for Loft · Maboneng. Effective immediately — 8% fee, monthly inspections included.",
    unread: false,
    time: "2d",
    href: "/my-mandates",
    actionLabel: "Open mandate",
  },
];

const SAMPLE_DMS: ChatDirectMessage[] = [
  { id: "d1", name: "Sipho Dlamini", sub: "Re: Studio · Melville", unread: 2, last: "Hi, is the unit still available?" },
  { id: "d2", name: "Naledi Khumalo", sub: "Re: 2-Bed Cottage · Brixton", unread: 0, last: "Thanks, see you Saturday." },
  { id: "d3", name: "Lerato Ndlovu", sub: "Re: Backroom · Yeoville", unread: 1, last: "Sent the deposit just now." },
];

export default function Nav({
  role,
  user,
  showBadges = true,
  notifications = SAMPLE_NOTIFICATIONS,
  dms = SAMPLE_DMS,
}: NavProps) {
  const session = useSession();
  const { isSm, isMd } = useViewport();
  const isMobile = isSm || isMd;
  // Effective role + display name: caller's explicit prop wins, else session user, else tenant fallback.
  const sessionRole = (session.user?.activeRole ?? "tenant") as NavRole;
  const effectiveRole: NavRole = role ?? sessionRole;
  const effectiveUser = user ?? (session.user ? { name: session.user.name } : { name: "Guest" });
  const availableRoles = new Set<NavRole>(
    (session.user?.roles ?? (["tenant", "landlord", "agent", "admin"] as NavRole[])) as NavRole[],
  );
  const visibleWorkspaces = WORKSPACES.filter((w) => availableRoles.has(w.role));
  const navigate = useNavigate();
  const [openNotif, setOpenNotif] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const location = useLocation();
  const unreadNotif = notifications.filter((n) => n.unread).length;
  const unreadDms = dms.reduce((sum, d) => sum + d.unread, 0);
  const accountMenu = accountMenuFor(effectiveRole);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = () => {
    void session.logout();
    setOpenMenu(false);
    navigate("/landing");
  };

  // Close menu on outside click.
  useEffect(() => {
    if (!openMenu) return;
    function onPointerDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [openMenu]);

  // Close menu on route change.
  useEffect(() => {
    setOpenMenu(false);
  }, [location.pathname]);

  return (
    <header
      style={{
        height: 64,
        flexShrink: 0,
        borderBottom: "1px solid var(--hairline)",
        background: "var(--surface)",
        position: "sticky",
        top: 0,
        zIndex: 5,
      }}
    >
      <div
        style={{
          height: "100%",
          maxWidth: 1440,
          margin: "0 auto",
          padding: isSm ? "0 16px" : "0 32px",
          display: "flex",
          alignItems: "center",
          gap: isSm ? 12 : 24,
        }}
      >
        <Link to="/" aria-label="Habitat home">
          <Logo size={20} />
        </Link>

        {isMobile ? null : (
        <nav style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 16 }}>
          {PRIMARY_LINKS.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.label}
                to={link.to}
                style={{
                  padding: "8px 12px",
                  fontSize: 14,
                  fontWeight: 500,
                  color: active ? "var(--ink)" : "var(--slate)",
                  borderRadius: 6,
                  position: "relative",
                }}
              >
                {link.label}
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
        )}

        <div style={{ flex: 1 }} />

        {isMobile ? null : (
        <Link
          to="/cmdk"
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
            cursor: "pointer",
            fontFamily: "inherit",
            textDecoration: "none",
          }}
          aria-label="Open command palette"
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
        </Link>
        )}

        {isMobile ? (
          <Link
            to="/cmdk"
            aria-label="Open search"
            style={{ display: "inline-flex" }}
          >
            <IconButton icon="search" label="Search" />
          </Link>
        ) : null}

        <Link to="/inbox" aria-label="Open inbox" style={{ display: "inline-flex" }}>
          <IconButton
            icon="chat"
            label="Inbox"
            badge={showBadges ? unreadDms : undefined}
          />
        </Link>
        <IconButton
          icon="bell"
          label="Notifications"
          badge={showBadges ? unreadNotif : undefined}
          onClick={() => {
            setOpenNotif((v) => !v);
            setOpenMenu(false);
          }}
        />

        <div ref={menuRef} style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => {
              setOpenMenu((v) => !v);
              setOpenNotif(false);
            }}
            aria-haspopup="menu"
            aria-expanded={openMenu}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "4px 10px 4px 12px",
              border: "1px solid var(--hairline)",
              borderRadius: 999,
              background: openMenu ? "var(--surface-2)" : "transparent",
              cursor: "pointer",
              fontFamily: "inherit",
              color: "var(--ink)",
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
              <span style={{ fontSize: 13, fontWeight: 500 }}>{effectiveUser.name}</span>
              <span style={{ fontSize: 11, color: "var(--slate)" }}>{ROLE_LABEL[effectiveRole]}</span>
            </div>
            <Avatar name={effectiveUser.name} size="md" />
            <Icon name="chevD" size={14} style={{ color: "var(--slate)" }} />
          </button>

          {openMenu ? (
            <div
              role="menu"
              style={{
                position: "absolute",
                top: "calc(100% + 12px)",
                right: 0,
                width: 280,
                background: "var(--surface)",
                border: "1px solid var(--hairline)",
                borderRadius: 10,
                boxShadow: "var(--shadow-lg)",
                padding: 8,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                zIndex: 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 10px 12px",
                  borderBottom: "1px solid var(--hairline)",
                  marginBottom: 8,
                }}
              >
                <Avatar name={effectiveUser.name} size="md" />
                <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{effectiveUser.name}</span>
                  <span style={{ fontSize: 11, color: "var(--slate)" }}>
                    {ROLE_LABEL[effectiveRole]} · habitat.co.za
                  </span>
                </div>
              </div>

              <Eyebrow style={{ padding: "4px 10px 6px" }}>Workspaces</Eyebrow>
              {visibleWorkspaces.map((w) => {
                const isCurrent = w.role === effectiveRole;
                return (
                  <Link
                    key={w.label}
                    to={w.to}
                    role="menuitem"
                    onClick={() => {
                      void session.switchActiveRole(w.role);
                      setOpenMenu(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px",
                      borderRadius: 6,
                      fontSize: 13,
                      color: "var(--ink)",
                      textDecoration: "none",
                      background: isCurrent ? "var(--surface-2)" : "transparent",
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 6,
                        background: isCurrent ? "var(--accent-soft)" : "var(--surface-2)",
                        color: isCurrent ? "var(--accent)" : "var(--slate)",
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon name={w.icon} size={14} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{w.label}</div>
                      {w.hint ? (
                        <div style={{ fontSize: 11, color: "var(--slate)" }}>{w.hint}</div>
                      ) : null}
                    </div>
                    {isCurrent ? <Badge tone="accent">Current</Badge> : null}
                  </Link>
                );
              })}

              <div style={{ height: 1, background: "var(--hairline)", margin: "8px 0 6px" }} />

              <Eyebrow style={{ padding: "0 10px 4px" }}>Account</Eyebrow>
              {accountMenu.map((item) => {
                const isSignOut = item.icon === "logout";
                const sharedStyle = {
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 10px",
                  borderRadius: 6,
                  fontSize: 13,
                  color: item.tone === "danger" ? "var(--danger)" : "var(--ink)",
                  textDecoration: "none",
                  width: "100%",
                  background: "none",
                  border: "none",
                  fontFamily: "inherit",
                  cursor: "pointer",
                } as const;
                if (isSignOut) {
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={handleSignOut}
                      role="menuitem"
                      style={{ ...sharedStyle, textAlign: "left" }}
                    >
                      <Icon
                        name={item.icon}
                        size={14}
                        style={{ color: "var(--danger)" }}
                      />
                      {item.label}
                    </button>
                  );
                }
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    role="menuitem"
                    style={sharedStyle}
                  >
                    <Icon
                      name={item.icon}
                      size={14}
                      style={{ color: item.tone === "danger" ? "var(--danger)" : "var(--slate)" }}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      <NotificationDrawer open={openNotif} onClose={() => setOpenNotif(false)} items={notifications} />
    </header>
  );
}
