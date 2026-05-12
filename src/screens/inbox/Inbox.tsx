import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Nav from "@/components/Nav";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import IconButton from "@/components/IconButton";
import Input from "@/components/Input";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Badge, { type BadgeTone } from "@/components/Badge";
import Avatar from "@/components/Avatar";
import Tabs from "@/components/Tabs";
import MessageBubble from "@/components/MessageBubble";

type ThreadKind = "dm" | "community";
type CommunityType = "Building" | "Area" | "Interest" | "Network";
type Role = "admin" | "moderator" | "member" | null;

interface InboxThread {
  id: string;
  kind: ThreadKind;
  name: string;
  initials: string;
  /** DM: subject (e.g. "Re: Studio · Melville"). Community: area · type. */
  subline: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  /** Community-only: number of members. */
  members?: number;
  /** Community-only: number online. */
  online?: number;
  /** Community-only: short description (used in info panel). */
  description?: string;
  /** Community-only: have I joined? */
  joined?: boolean;
  /** Community-only: my role. */
  myRole?: Role;
  /** Community-only: type. */
  communityType?: CommunityType;
  /** Community-only: auto-joined (e.g. building chat). */
  autoJoined?: boolean;
  /** Community-only: area. */
  area?: string;
  /** DM-only: counterparty role. */
  dmRole?: "Applicant" | "Tenant" | "Landlord" | "Agent" | "Contractor" | "System";
}

const THREADS: InboxThread[] = [
  // Building chat — pinned-feel, auto-joined community
  { id: "c1", kind: "community", name: "Melville Mews", initials: "MM", subline: "Melville · Building", lastMessage: "Lerato: insurance for backroom-sized policies?", lastTime: "2m", unread: 4, members: 312, online: 18, description: "Tenants of the Mews block at 14 Main Rd.", joined: true, myRole: "member", communityType: "Building", autoJoined: true, area: "Melville" },
  // Direct messages
  { id: "dm-t1", kind: "dm", name: "Sipho Dlamini", initials: "SD", subline: "Re: Studio · Melville", lastMessage: "Yes, Saturday 11am works perfectly.", lastTime: "9:42", unread: 2, dmRole: "Applicant" },
  { id: "dm-t2", kind: "dm", name: "Thandi Mokoena", initials: "TM", subline: "Lease for Studio · Melville", lastMessage: "Lease is ready. Sign at your earliest.", lastTime: "8:14", unread: 1, dmRole: "Landlord" },
  // Community
  { id: "c2", kind: "community", name: "Brixton Renters", initials: "BR", subline: "Brixton · Area", lastMessage: "Sipho: Drinks on me. Backup gas burner.", lastTime: "23m", unread: 0, members: 184, online: 12, description: "Two-year-old neighbourhood network. Pet-sitting, second-hand furniture, loadshedding tips.", joined: true, myRole: "moderator", communityType: "Area", area: "Brixton" },
  // DM
  { id: "dm-t3", kind: "dm", name: "PlumberPro · Sipho M.", initials: "PP", subline: "MNT-0421 · Geyser leaking", lastMessage: "On site at 16:00 today. Need water off 30 min.", lastTime: "Yesterday", unread: 0, dmRole: "Contractor" },
  // Community
  { id: "c3", kind: "community", name: "Caroline Cottages", initials: "CC", subline: "Brixton · Building", lastMessage: "Thandi: Reminder — building inspection Thursday 10am.", lastTime: "1h", unread: 1, members: 67, online: 4, description: "Three-property cottage cluster on Caroline St.", joined: true, myRole: "member", communityType: "Building", area: "Brixton" },
  // DM
  { id: "dm-t4", kind: "dm", name: "Lerato Ndlovu", initials: "LN", subline: "Re: Cottage · Caroline", lastMessage: "Thanks for accepting. Deposit tomorrow.", lastTime: "Tue", unread: 0, dmRole: "Tenant" },
  { id: "dm-t5", kind: "dm", name: "Lebo Properties", initials: "LP", subline: "Mandate · Q1 statement", lastMessage: "March statement attached. R3,952 collected.", lastTime: "Mon", unread: 0, dmRole: "Agent" },
  { id: "dm-t6", kind: "dm", name: "Habitat Support", initials: "HB", subline: "FICA verification approved", lastMessage: "Your tenant Sipho Dlamini's FICA documents are verified.", lastTime: "12 Mar", unread: 0, dmRole: "System" },
];

interface MessageItem {
  id: string;
  name: string;
  body: string;
  time: string;
  own?: boolean;
  pinned?: boolean;
  hasMedia?: boolean;
}

const MESSAGES_BY_THREAD: Record<string, MessageItem[]> = {
  "dm-t1": [
    { id: "m1", name: "Sipho Dlamini", time: "14:22", body: "Hi Thandi! I just submitted my application for the studio. Long-time renter, FICA-verified, looking for a quiet spot near work." },
    { id: "m2", name: "You", time: "16:01", body: "Hi Sipho — thanks. Your score looks great. Are you available Saturday 11am for a viewing?", own: true },
    { id: "m3", name: "Sipho Dlamini", time: "16:08", body: "Yes, Saturday 11am works perfectly. Should I bring anything?" },
    { id: "m4", name: "You", time: "16:12", body: "Just a copy of your last 3 payslips if you have them.", own: true },
  ],
  "dm-t2": [
    { id: "m1", name: "Thandi Mokoena", time: "8:00", body: "Hi — lease is ready for Studio · Melville. I've signed pages 1–11 on my side." },
    { id: "m2", name: "Thandi Mokoena", time: "8:14", body: "Sign at your earliest. Move-in date stays 1 May." },
  ],
  c1: [
    { id: "m1", name: "Mandla K.", time: "Yesterday", body: "Bin collection moved to Wednesdays this week." },
    { id: "m2", name: "Lerato P.", time: "9:14", body: "Council notice for the water shutoff tomorrow 09:00–14:00.", hasMedia: true, pinned: true },
    { id: "m3", name: "You", time: "9:42", body: "Thanks Lerato. Anyone planning a Saturday braai?", own: true },
    { id: "m4", name: "Aisha B.", time: "10:02", body: "I'm in. Bringing the meat if someone handles drinks." },
  ],
  c2: [
    { id: "m1", name: "Lerato P.", time: "Yesterday", body: "Anyone using BetterBond's tenant insurance?" },
    { id: "m2", name: "Mandla K.", time: "9:14", body: "Heads up — water shutoff on Caroline St tomorrow 09:00–14:00.", hasMedia: true, pinned: true },
    { id: "m3", name: "You", time: "9:42", body: "Anyone planning a Saturday braai? I've got a spare gazebo.", own: true },
    { id: "m4", name: "Aisha B.", time: "10:02", body: "I'm in. Bringing the meat." },
    { id: "m5", name: "Sipho D.", time: "10:18", body: "Drinks on me. Bringing a backup gas burner." },
  ],
  c3: [
    { id: "m1", name: "Thandi M.", time: "1h", body: "Reminder: building inspection Thursday 10am. Geyser cupboard access only." },
    { id: "m2", name: "You", time: "1h", body: "Got it Thandi, leaving the key with Aisha.", own: true },
  ],
};

const MEMBERS_BY_COMMUNITY: Record<string, { init: string; name: string; role: "admin" | "moderator" | "member" }[]> = {
  c1: [
    { init: "LP", name: "Lerato P.", role: "admin" },
    { init: "MK", name: "Mandla K.", role: "moderator" },
    { init: "AB", name: "Aisha B.", role: "member" },
    { init: "TM", name: "Thandi M.", role: "member" },
  ],
  c2: [
    { init: "LP", name: "Lerato P.", role: "admin" },
    { init: "MK", name: "Mandla K.", role: "moderator" },
    { init: "SD", name: "Sipho D.", role: "moderator" },
    { init: "AB", name: "Aisha B.", role: "member" },
    { init: "NJ", name: "Nthabi J.", role: "member" },
  ],
};

const ROLE_TONE: Record<"admin" | "moderator" | "member", BadgeTone> = {
  admin: "danger",
  moderator: "accent",
  member: "neutral",
};

type FilterId = "all" | "direct" | "communities" | "unread";

export default function Inbox() {
  const [params, setParams] = useSearchParams();
  const rawFilter = params.get("filter");
  const filter: FilterId =
    rawFilter === "direct" || rawFilter === "communities" || rawFilter === "unread"
      ? rawFilter
      : "all";
  const activeId = params.get("id");
  const showInfo = params.get("info") === "1";

  const [search, setSearch] = useState("");
  const [hovered, setHovered] = useState<string | null>(null);

  const setFilter = (next: FilterId) => {
    const p = new URLSearchParams(params);
    p.set("filter", next);
    setParams(p, { replace: true });
  };
  const setActive = (id: string) => {
    const p = new URLSearchParams(params);
    p.set("id", id);
    p.delete("info");
    setParams(p, { replace: true });
  };
  const toggleInfo = () => {
    const p = new URLSearchParams(params);
    if (showInfo) p.delete("info");
    else p.set("info", "1");
    setParams(p, { replace: true });
  };

  const counts = useMemo(() => {
    return {
      all: THREADS.length,
      direct: THREADS.filter((t) => t.kind === "dm").length,
      communities: THREADS.filter((t) => t.kind === "community").length,
      unread: THREADS.filter((t) => t.unread > 0).length,
    };
  }, []);

  const visible = useMemo(() => {
    let rows = THREADS;
    if (filter === "direct") rows = rows.filter((t) => t.kind === "dm");
    if (filter === "communities") rows = rows.filter((t) => t.kind === "community");
    if (filter === "unread") rows = rows.filter((t) => t.unread > 0);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.subline.toLowerCase().includes(q) ||
          t.lastMessage.toLowerCase().includes(q),
      );
    }
    return rows;
  }, [filter, search]);

  const active = activeId ? THREADS.find((t) => t.id === activeId) ?? null : null;
  const totalUnread = THREADS.reduce((s, t) => s + t.unread, 0);

  return (
    <div
      style={{
        background: "var(--paper)",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Nav role="tenant" />

      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {/* === Left rail: chat list === */}
        <aside
          style={{
            width: 360,
            flexShrink: 0,
            borderRight: "1px solid var(--hairline)",
            background: "var(--surface)",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          {/* Rail header */}
          <div style={{ padding: "16px 16px 0" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>Inbox</div>
                <div style={{ fontSize: 11, color: "var(--slate)" }}>
                  {totalUnread > 0
                    ? `${totalUnread} unread · ${THREADS.length} chats`
                    : `${THREADS.length} chats · all caught up`}
                </div>
              </div>
              <IconButton icon="plus" label="New conversation" size="sm" />
            </div>

            {/* Search */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "0 10px",
                height: 36,
                background: "var(--surface-2)",
                border: "1px solid var(--hairline)",
                borderRadius: 8,
              }}
            >
              <Icon name="search" size={14} style={{ color: "var(--slate)" }} />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search messages, people, communities…"
                style={{ flex: 1, border: 0, background: "transparent", height: 28, padding: 0, fontSize: 13 }}
              />
              {search ? (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  style={{ background: "transparent", border: 0, cursor: "pointer", color: "var(--slate)" }}
                >
                  <Icon name="x" size={12} />
                </button>
              ) : null}
            </div>

            {/* Tabs */}
            <div style={{ marginTop: 12, marginBottom: 8 }}>
              <Tabs
                tabs={[
                  { id: "all", label: "All", count: counts.all },
                  { id: "direct", label: "Direct", count: counts.direct },
                  { id: "communities", label: "Communities", count: counts.communities },
                  { id: "unread", label: "Unread", count: counts.unread },
                ]}
                value={filter}
                onChange={(id) => setFilter(id as FilterId)}
              />
            </div>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: "auto", padding: "4px 8px 16px" }}>
            {visible.length === 0 ? (
              <div style={{ padding: 24, textAlign: "center", fontSize: 12, color: "var(--slate)" }}>
                {search ? "No results for that search." : "Nothing here."}
                {filter === "communities" ? (
                  <div style={{ marginTop: 10 }}>
                    <Link to="/communities" style={{ color: "var(--accent)", fontWeight: 600, fontSize: 12 }}>
                      Discover communities →
                    </Link>
                  </div>
                ) : null}
              </div>
            ) : (
              visible.map((t) => (
                <ThreadRow
                  key={t.id}
                  thread={t}
                  active={activeId === t.id}
                  onClick={() => setActive(t.id)}
                />
              ))
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "10px 16px",
              borderTop: "1px solid var(--hairline)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Link
              to="/communities"
              style={{ fontSize: 12, color: "var(--slate)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <Icon name="search" size={12} /> Discover communities
            </Link>
            <Link
              to="/notifications"
              style={{ fontSize: 12, color: "var(--slate)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <Icon name="bell" size={12} /> Notifications
            </Link>
          </div>
        </aside>

        {/* === Right pane === */}
        <div style={{ flex: 1, display: "flex", minWidth: 0, minHeight: 0 }}>
          {active ? (
            <ThreadPane
              thread={active}
              showInfo={showInfo}
              onToggleInfo={toggleInfo}
              hovered={hovered}
              setHovered={setHovered}
            />
          ) : (
            <WelcomePane />
          )}
        </div>
      </div>
    </div>
  );
}

function ThreadRow({
  thread,
  active,
  onClick,
}: {
  thread: InboxThread;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        gap: 10,
        padding: "10px 8px",
        borderRadius: 8,
        background: active ? "var(--surface-2)" : "transparent",
        border: 0,
        textAlign: "left",
        cursor: "pointer",
        fontFamily: "inherit",
        color: "var(--ink)",
        marginBottom: 2,
      }}
    >
      <div style={{ position: "relative", flexShrink: 0 }}>
        <Avatar
          name={thread.initials}
          size="md"
          tone={thread.kind === "community" ? "neutral" : "neutral"}
          shape={thread.kind === "community" ? "square" : "circle"}
          style={{ width: 40, height: 40, fontSize: 13 }}
        />
        {thread.kind === "community" ? (
          <span
            style={{
              position: "absolute",
              bottom: -2,
              right: -2,
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "var(--accent)",
              color: "var(--paper)",
              display: "grid",
              placeItems: "center",
              border: "2px solid var(--surface)",
            }}
            aria-hidden="true"
          >
            <Icon name="users" size={9} />
          </span>
        ) : null}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: thread.unread > 0 ? 700 : 600,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {thread.name}
          </span>
          <span style={{ fontSize: 10, color: thread.unread > 0 ? "var(--accent)" : "var(--slate)", flexShrink: 0 }}>
            {thread.lastTime}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
          <span
            style={{
              fontSize: 11,
              color: thread.unread > 0 ? "var(--ink)" : "var(--slate)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              flex: 1,
              minWidth: 0,
            }}
          >
            {thread.lastMessage}
          </span>
          {thread.unread > 0 ? (
            <span
              style={{
                background: "var(--accent)",
                color: "var(--paper)",
                fontSize: 10,
                fontWeight: 700,
                padding: "1px 6px",
                borderRadius: 999,
                flexShrink: 0,
              }}
            >
              {thread.unread}
            </span>
          ) : null}
        </div>
        <div style={{ fontSize: 10, color: "var(--slate-2)", marginTop: 2 }}>
          {thread.subline}
          {thread.autoJoined ? (
            <>
              {" · "}
              <span style={{ color: "var(--success)", fontWeight: 600 }}>auto-joined</span>
            </>
          ) : null}
          {thread.dmRole ? (
            <>
              {" · "}
              <span>{thread.dmRole}</span>
            </>
          ) : null}
        </div>
      </div>
    </button>
  );
}

function WelcomePane() {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        padding: 32,
        background: "var(--surface-2)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: "var(--surface)",
          border: "1px solid var(--hairline-strong)",
          display: "grid",
          placeItems: "center",
          color: "var(--slate)",
        }}
      >
        <Icon name="chat" size={30} />
      </div>
      <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.01em" }}>
        Pick a chat to start
      </div>
      <p style={{ fontSize: 13, color: "var(--slate)", maxWidth: 360, margin: 0, lineHeight: 1.55 }}>
        Direct messages with landlords, agents, and contractors live alongside the communities you've
        joined. Search across everything from the box above.
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <Link to="/communities" style={{ textDecoration: "none" }}>
          <Button variant="accent" leftIcon="search">Discover communities</Button>
        </Link>
        <Button variant="secondary" leftIcon="plus">New message</Button>
      </div>
    </div>
  );
}

function ThreadPane({
  thread,
  showInfo,
  onToggleInfo,
  hovered,
  setHovered,
}: {
  thread: InboxThread;
  showInfo: boolean;
  onToggleInfo: () => void;
  hovered: string | null;
  setHovered: (id: string | null) => void;
}) {
  const messages = MESSAGES_BY_THREAD[thread.id] ?? [];
  const isCommunity = thread.kind === "community";
  const showAdmin = isCommunity && (thread.myRole === "admin" || thread.myRole === "moderator");
  const members = isCommunity ? MEMBERS_BY_COMMUNITY[thread.id] ?? [] : [];
  const cantPost = isCommunity && !thread.joined;

  return (
    <div style={{ flex: 1, display: "flex", minWidth: 0 }}>
      {/* Thread column */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Header */}
        <div
          style={{
            padding: "12px 20px",
            borderBottom: "1px solid var(--hairline)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Avatar
            name={thread.initials}
            size="md"
            tone="neutral"
            shape={isCommunity ? "square" : "circle"}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 15, fontWeight: 600 }}>{thread.name}</span>
              {isCommunity ? (
                <>
                  <Badge tone="neutral">{thread.communityType}</Badge>
                  {thread.myRole === "admin" ? <Badge tone="danger">Admin</Badge> : null}
                  {thread.myRole === "moderator" ? <Badge tone="accent">Moderator</Badge> : null}
                  {thread.autoJoined ? <Badge tone="success">Auto-joined</Badge> : null}
                </>
              ) : (
                <Badge tone="neutral">{thread.dmRole}</Badge>
              )}
            </div>
            <div style={{ fontSize: 11, color: "var(--slate)" }}>
              {isCommunity
                ? `${thread.area} · ${thread.members} members · ${thread.online} online`
                : thread.subline}
            </div>
          </div>
          {!isCommunity ? (
            <>
              <Link to="/book-viewing" style={{ textDecoration: "none" }}>
                <Button variant="ghost" size="sm" leftIcon="calendar">Book viewing</Button>
              </Link>
              <Link to="/applicant" style={{ textDecoration: "none" }}>
                <Button variant="ghost" size="sm" leftIcon="check">Approve</Button>
              </Link>
            </>
          ) : null}
          <IconButton icon="search" label="Search messages" size="sm" />
          <IconButton
            icon={showInfo ? "x" : "info"}
            label={showInfo ? "Hide info" : isCommunity ? "Community info" : "Conversation info"}
            size="sm"
            onClick={onToggleInfo}
          />
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            background: "var(--surface-2)",
          }}
        >
          {cantPost ? (
            <div
              style={{
                margin: "auto",
                maxWidth: 480,
                background: "var(--surface)",
                border: "1px solid var(--hairline)",
                borderRadius: 12,
                padding: 24,
                textAlign: "center",
              }}
            >
              <Avatar
                name={thread.initials}
                size="lg"
                tone="neutral"
                shape="square"
                style={{ width: 72, height: 72, fontSize: 22, margin: "0 auto 12px" }}
              />
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{thread.name}</div>
              <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 12 }}>
                {thread.area} · {thread.communityType} · {thread.members} members
              </div>
              <p style={{ fontSize: 13, color: "var(--slate)", lineHeight: 1.55, margin: "0 0 16px" }}>
                {thread.description}
              </p>
              <Button variant="accent" leftIcon="check">Join community</Button>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button variant="ghost" size="sm" leftIcon="chevU">
                  Load older messages
                </Button>
              </div>
              {messages.length === 0 ? (
                <div style={{ textAlign: "center", color: "var(--slate)", fontSize: 13, marginTop: 40 }}>
                  No messages yet. Say hi 👋
                </div>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    onMouseEnter={() => setHovered(m.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{ position: "relative" }}
                  >
                    {m.pinned ? (
                      <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
                        <Badge tone="neutral">📌 Pinned</Badge>
                      </div>
                    ) : null}
                    <MessageBubble
                      name={m.name}
                      body={
                        m.hasMedia ? (
                          <>
                            {m.body}
                            <div
                              style={{
                                marginTop: 8,
                                padding: "8px 10px",
                                background: "var(--surface-2)",
                                borderRadius: 6,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                fontSize: 11,
                                color: "var(--slate)",
                              }}
                            >
                              <Icon name="doc" size={12} /> council-notice.pdf · 412 KB
                            </div>
                          </>
                        ) : (
                          m.body
                        )
                      }
                      time={m.time}
                      own={m.own}
                      avatarTone="neutral"
                    />
                    {hovered === m.id && (m.own || showAdmin) ? (
                      <div
                        style={{
                          position: "absolute",
                          top: -6,
                          right: 8,
                          display: "flex",
                          gap: 4,
                          padding: "4px 6px",
                          background: "var(--surface)",
                          border: "1px solid var(--hairline)",
                          borderRadius: 6,
                          boxShadow: "var(--shadow-sm)",
                        }}
                      >
                        {showAdmin && !m.pinned ? <IconButton icon="star" label="Pin" size="sm" /> : null}
                        <IconButton icon="trash" label="Delete" size="sm" />
                      </div>
                    ) : null}
                  </div>
                ))
              )}
            </>
          )}
        </div>

        {/* Composer */}
        {!cantPost ? (
          <div
            style={{
              padding: "10px 20px",
              borderTop: "1px solid var(--hairline)",
              display: "flex",
              gap: 8,
              alignItems: "center",
              background: "var(--surface)",
            }}
          >
            <IconButton icon="upload" label="Attach media" size="sm" />
            <Input placeholder={`Message ${thread.name}…`} style={{ flex: 1 }} />
            <button type="button" aria-label="Send" className="btn btn--accent btn--icon">
              <Icon name="arrR" size={16} />
            </button>
          </div>
        ) : null}
      </div>

      {/* Info rail */}
      {showInfo ? (
        <aside
          style={{
            width: 300,
            flexShrink: 0,
            borderLeft: "1px solid var(--hairline)",
            background: "var(--surface)",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 14,
            overflowY: "auto",
          }}
        >
          {isCommunity ? (
            <>
              <Card padding={14}>
                <Eyebrow style={{ marginBottom: 8 }}>About</Eyebrow>
                <p style={{ fontSize: 13, lineHeight: 1.5, margin: 0 }}>{thread.description}</p>
              </Card>

              {showAdmin ? (
                <Card padding={14}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <Eyebrow>Join requests</Eyebrow>
                    <Badge tone="warn">2</Badge>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--slate)" }}>Sipho Dlamini, Naledi Khumalo</div>
                </Card>
              ) : null}

              <Card padding={14}>
                <Eyebrow style={{ marginBottom: 8 }}>House rules</Eyebrow>
                <div style={{ fontSize: 12, lineHeight: 1.5, color: "var(--slate)" }}>
                  No marketing · No politics · Help your neighbours · Keep it kasi
                </div>
              </Card>

              <div>
                <Eyebrow style={{ marginBottom: 10 }}>Members · {thread.members}</Eyebrow>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {members.map((m) => (
                    <div key={m.init} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Avatar name={m.init} size="sm" tone="neutral" />
                      <span style={{ fontSize: 12, flex: 1 }}>{m.name}</span>
                      {m.role !== "member" ? <Badge tone={ROLE_TONE[m.role]}>{m.role}</Badge> : null}
                    </div>
                  ))}
                </div>
              </div>

              {thread.joined && !thread.autoJoined ? (
                <Button variant="ghost" leftIcon="logout" style={{ marginTop: "auto", justifyContent: "center", color: "var(--danger)" }}>
                  Leave community
                </Button>
              ) : null}
            </>
          ) : (
            <>
              <Card padding={14} style={{ textAlign: "center" }}>
                <Avatar
                  name={thread.initials}
                  size="lg"
                  tone="neutral"
                  style={{ width: 72, height: 72, fontSize: 22, margin: "0 auto 10px" }}
                />
                <div style={{ fontSize: 15, fontWeight: 600 }}>{thread.name}</div>
                <div style={{ fontSize: 11, color: "var(--slate)", marginTop: 2 }}>{thread.dmRole}</div>
                <div style={{ fontSize: 11, color: "var(--slate)", marginTop: 6 }}>{thread.subline}</div>
              </Card>
              <Card padding={14}>
                <Eyebrow style={{ marginBottom: 6 }}>Actions</Eyebrow>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <Link to="/book-viewing" style={{ textDecoration: "none" }}>
                    <Button variant="ghost" size="sm" leftIcon="calendar" style={{ justifyContent: "flex-start", width: "100%" }}>
                      Book a viewing
                    </Button>
                  </Link>
                  <Link to="/lease" style={{ textDecoration: "none" }}>
                    <Button variant="ghost" size="sm" leftIcon="paper" style={{ justifyContent: "flex-start", width: "100%" }}>
                      Send lease draft
                    </Button>
                  </Link>
                  <Link to="/applicant" style={{ textDecoration: "none" }}>
                    <Button variant="ghost" size="sm" leftIcon="check" style={{ justifyContent: "flex-start", width: "100%" }}>
                      Open applicant
                    </Button>
                  </Link>
                </div>
              </Card>
              <Card padding={14}>
                <Eyebrow style={{ marginBottom: 6 }}>Shared files</Eyebrow>
                <div style={{ fontSize: 12, color: "var(--slate)" }}>
                  No files shared yet.
                </div>
              </Card>
            </>
          )}
        </aside>
      ) : null}
    </div>
  );
}
