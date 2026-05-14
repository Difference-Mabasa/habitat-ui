import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import Icon, { type IconName } from "./Icon";
import IconButton from "./IconButton";
import Avatar from "./Avatar";
import Button from "./Button";
import Eyebrow from "./Eyebrow";
import Badge from "./Badge";
import NotificationDrawer, { type NotificationItem } from "./NotificationDrawer";
import type { ChatDirectMessage } from "./ChatDrawer";
import { useSession, type Role } from "@/lib/session";
import { useViewport } from "@/hooks/useViewport";
import { useNotifications } from "@/lib/useNotifications";
import type { NotificationItem as ApiNotificationItem } from "@/lib/api/notifications";
import { usePalette } from "@/lib/palette";

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
  /** The visual / nav context this workspace represents. */
  role: NavRole;
  /** The auth role to activate when the user enters this workspace. */
  authRole: Role;
  hint?: string;
}

const WORKSPACES: WorkspaceItem[] = [
  // "Tenant" and "Landlord" share the same auth role — `user` — and only
  // differ in which dashboard they land on. Agent + Admin map 1:1 to their
  // own auth roles. `role` is the workspace context for nav styling;
  // `authRole` is what session.switchActiveRole() is called with.
  { icon: "home",   label: "My Rental",          to: "/tenant-portal",      role: "tenant",   authRole: "user",  hint: "Tenant dashboard" },
  { icon: "key",    label: "Landlord dashboard", to: "/landlord-dashboard", role: "landlord", authRole: "user",  hint: "Properties · payouts · tenants" },
  { icon: "users",  label: "Agent workspace",    to: "/agent-overview",     role: "agent",    authRole: "agent", hint: "Marketplace · mandates" },
  { icon: "shield", label: "Admin queue",        to: "/admin",              role: "admin",    authRole: "admin", hint: "Moderation · trust & safety" },
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

// DMs are still mocked until the messaging slice lands; notifications now
// flow through useNotifications when no override prop is passed.
const EMPTY_DMS: ChatDirectMessage[] = [];

export default function Nav({
  role,
  user,
  showBadges = true,
  notifications: notificationsProp,
  dms = EMPTY_DMS,
}: NavProps) {
  const session = useSession();
  const isAuthenticated = session.status === "authenticated";
  // Live notifications from the API. The hook idles cleanly when signed out.
  const live = useNotifications(session.client, isAuthenticated);
  const { isSm, isMd } = useViewport();
  const isMobile = isSm || isMd;
  const navigate = useNavigate();
  const { openPalette } = usePalette();
  const [openNotif, setOpenNotif] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const location = useLocation();

  // Map the auth-level Role onto a workspace NavRole. USER covers both
  // "tenant" and "landlord" workspaces — we pick whichever the URL is
  // currently inside, so the dropdown's "current workspace" highlight
  // tracks where the user actually is. AGENT and ADMIN map 1:1.
  const sessionRole: NavRole = (() => {
    const r = session.user?.activeRole;
    if (r === "agent") return "agent";
    if (r === "admin") return "admin";
    return location.pathname.startsWith("/landlord") ? "landlord" : "tenant";
  })();
  const effectiveRole: NavRole = role ?? sessionRole;
  const effectiveUser = user ?? (session.user ? { name: session.user.name } : { name: "Guest" });
  const effectiveEmail = session.user?.email ?? null;
  // After the role collapse, session.user.roles is ("user"|"agent"|"admin"). The
  // workspace dropdown is keyed by NavRole, so unfold "user" into both tenant +
  // landlord workspaces so anyone signed in as USER sees both options.
  const authRoles = session.user?.roles ?? (["user", "agent", "admin"] as Role[]);
  const availableRoles = new Set<NavRole>();
  for (const r of authRoles) {
    if (r === "user") {
      availableRoles.add("tenant");
      availableRoles.add("landlord");
    } else if (r === "agent") {
      availableRoles.add("agent");
    } else if (r === "admin") {
      availableRoles.add("admin");
    }
  }
  const visibleWorkspaces = WORKSPACES.filter((w) => availableRoles.has(w.role));

  // Drawer items come from the prop if set (tests, stories), otherwise
  // from the live hook (mapped from the API shape to the drawer shape).
  const notifications: NotificationItem[] =
    notificationsProp ?? live.items.map(toDrawerItem);
  const unreadNotif = showBadges
    ? notificationsProp
      ? notificationsProp.filter((n) => n.unread).length
      : live.unreadCount
    : 0;
  const unreadDms = dms.reduce((sum, d) => sum + d.unread, 0);
  const accountMenu = accountMenuFor(effectiveRole);

  // Fetch the recent list whenever the drawer opens so it's never stale.
  useEffect(() => {
    if (openNotif && !notificationsProp) void live.refreshList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openNotif, notificationsProp]);
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
        <button
          type="button"
          onClick={openPalette}
          aria-label="Open command palette"
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
        </button>
        )}

        {isMobile ? (
          <IconButton icon="search" label="Search" onClick={openPalette} />
        ) : null}

        {isAuthenticated ? (
          <Link to="/inbox" aria-label="Open inbox" style={{ display: "inline-flex" }}>
            <IconButton
              icon="chat"
              label="Inbox"
              badge={showBadges ? unreadDms : undefined}
            />
          </Link>
        ) : null}
        <Link to="/help" aria-label="Open help center" style={{ display: "inline-flex" }}>
          <IconButton icon="help" label="Help center" />
        </Link>
        {isAuthenticated ? (
          <IconButton
            icon="bell"
            label="Notifications"
            badge={showBadges ? unreadNotif : undefined}
            onClick={() => {
              setOpenNotif((v) => !v);
              setOpenMenu(false);
            }}
          />
        ) : null}

        {session.status === "loading" ? null : !isAuthenticated ? (
          <div ref={menuRef} style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => {
                setOpenMenu((v) => !v);
                setOpenNotif(false);
              }}
              aria-haspopup="menu"
              aria-expanded={openMenu}
              aria-label="Sign in or create account"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                height: 36,
                padding: isSm ? "0 10px" : "0 14px",
                border: "1px solid var(--hairline)",
                borderRadius: 999,
                background: openMenu ? "var(--surface-2)" : "transparent",
                cursor: "pointer",
                fontFamily: "inherit",
                color: "var(--ink)",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              <Icon name="user" size={15} style={{ color: "var(--slate)" }} />
              {isSm ? null : <span>Sign in</span>}
              <Icon name="chevD" size={14} style={{ color: "var(--slate)" }} />
            </button>

            {openMenu ? (
              <div
                role="menu"
                style={{
                  position: "absolute",
                  top: "calc(100% + 12px)",
                  right: 0,
                  width: 288,
                  background: "var(--surface)",
                  border: "1px solid var(--hairline)",
                  borderRadius: 10,
                  boxShadow: "var(--shadow-lg)",
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  zIndex: 10,
                }}
              >
                <Eyebrow>Welcome</Eyebrow>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    lineHeight: 1.4,
                    color: "var(--slate)",
                  }}
                >
                  Save your spot, message landlords, and track your applications.
                </p>
                <Button
                  variant="accent"
                  onClick={() => {
                    setOpenMenu(false);
                    navigate("/register");
                  }}
                >
                  Create account
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setOpenMenu(false);
                    navigate("/auth");
                  }}
                >
                  Log in
                </Button>
              </div>
            ) : null}
          </div>
        ) : (
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
            <span style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.1 }}>{effectiveUser.name}</span>
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
                <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2, minWidth: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{effectiveUser.name}</span>
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--slate)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {effectiveEmail ?? ROLE_LABEL[effectiveRole]}
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
                      void session.switchActiveRole(w.authRole);
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
        )}
      </div>

      <NotificationDrawer
        open={openNotif}
        onClose={() => setOpenNotif(false)}
        items={notifications}
        onMarkAsRead={(id) => {
          if (!notificationsProp) void live.markAsRead(id);
        }}
      />
    </header>
  );
}

/**
 * Translate an API notification into the shape NotificationDrawer expects.
 * The drawer was modelled on the original mock data — id, title, body,
 * a relative `time` string, an `unread` boolean, optional `href` +
 * `actionLabel`. We keep that shape and adapt the API payload at the edge
 * so the drawer itself doesn't have to learn about `read_at` / `createdAt`.
 */
function toDrawerItem(n: ApiNotificationItem): NotificationItem {
  return {
    id: n.id,
    type: humanizeType(n.type),
    title: n.title,
    body: n.body ?? "",
    fullBody: n.body ?? undefined,
    time: formatRelativeTime(n.createdAt),
    unread: !n.read,
    href: n.actionUrl ?? undefined,
    actionLabel: n.actionLabel ?? undefined,
  };
}

function humanizeType(type: string): string {
  if (!type) return "Notification";
  return type[0] + type.slice(1).toLowerCase();
}

function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diffSec = Math.max(0, Math.round((Date.now() - then) / 1000));
  if (diffSec < 60) return "Just now";
  const min = Math.round(diffSec / 60);
  if (min < 60) return `${min}m`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day}d`;
  // For older items, fall back to a localised date.
  return new Date(iso).toLocaleDateString();
}
