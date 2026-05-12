import { useMemo, useState } from "react";
import Nav from "@/components/Nav";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import IconButton from "@/components/IconButton";
import Input from "@/components/Input";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Badge from "@/components/Badge";
import Avatar from "@/components/Avatar";
import Tabs from "@/components/Tabs";
import Chip from "@/components/Chip";
import MessageBubble from "@/components/MessageBubble";

interface Community {
  id: string;
  name: string;
  area: string;
  members: number;
  last: string;
  unread: number;
  joined: boolean;
  myRole?: MemberRole;
}

type MemberRole = "admin" | "moderator" | "member";

const COMMUNITIES: Community[] = [
  { id: "c1", name: "Melville Mews", area: "Melville", members: 312, last: "2m ago", unread: 4, joined: true, myRole: "admin" },
  { id: "c2", name: "Brixton Renters", area: "Brixton", members: 184, last: "23m ago", unread: 0, joined: true, myRole: "moderator" },
  { id: "c3", name: "Caroline Cottages", area: "Caroline", members: 67, last: "1h ago", unread: 1, joined: true, myRole: "member" },
  { id: "c4", name: "Yeoville Backrooms", area: "Yeoville", members: 421, last: "3h ago", unread: 0, joined: false },
  { id: "c5", name: "Auckland Park Studios", area: "Auckland Park", members: 92, last: "Yesterday", unread: 0, joined: false },
];

interface CommunityMessage {
  id: string;
  name: string;
  body: string;
  time: string;
  own?: boolean;
  landlord?: boolean;
  pinned?: boolean;
  /** Older messages are loaded via "Load older" link. */
  older?: boolean;
  hasMedia?: boolean;
}

const MESSAGES: CommunityMessage[] = [
  { id: "m0", name: "Mxolisi K.", time: "Yesterday", body: "Bin collection moved to Wednesdays this week.", older: true },
  { id: "m1", name: "Lerato P.", time: "9:42", body: "Loadshedding heads up — stage 4 from 18:00 tonight. Solar geyser for sale btw, R3500, almost new.", pinned: true, hasMedia: true },
  { id: "m2", name: "You", time: "10:11", body: "Thanks Lerato. Anyone know a good locksmith on this side? Front door latch is sticking.", own: true },
  { id: "m3", name: "Mandla K.", time: "10:14", body: "Use Sipho at Melville Hardware on 7th. Fast and fair." },
  { id: "m4", name: "Thandi M.", time: "10:32", body: "Reminder: building inspection Thursday 10am. Will only need access to the geyser cupboard.", landlord: true },
];

interface JoinRequest {
  name: string;
  init: string;
  area: string;
  proof: string;
  requested: string;
}

const JOIN_REQUESTS: JoinRequest[] = [
  { name: "Sipho Dlamini", init: "SD", area: "Melville", proof: "Lease at 14 Main Rd", requested: "2h ago" },
  { name: "Naledi Khumalo", init: "NK", area: "Melville", proof: "Address verified", requested: "Yesterday" },
];

interface Member {
  init: string;
  name: string;
  role: MemberRole;
}

const MEMBERS: Member[] = [
  { init: "LP", name: "Lerato P.", role: "admin" },
  { init: "TM", name: "Thandi M.", role: "moderator" },
  { init: "SD", name: "Sipho D.", role: "moderator" },
  { init: "MK", name: "Mandla K.", role: "member" },
  { init: "AB", name: "Aisha B.", role: "member" },
  { init: "NJ", name: "Nthabi J.", role: "member" },
  { init: "RT", name: "Ravi T.", role: "member" },
  { init: "KZ", name: "Kabelo Z.", role: "member" },
];

const ROLE_TONE: Record<MemberRole, "danger" | "accent" | "neutral"> = {
  admin: "danger",
  moderator: "accent",
  member: "neutral",
};

const DISCOVERY_FILTERS = [
  { id: "all", label: "All", count: COMMUNITIES.length },
  { id: "mine", label: "Joined", count: COMMUNITIES.filter((c) => c.joined).length },
  { id: "discover", label: "Discover", count: COMMUNITIES.filter((c) => !c.joined).length },
];

export default function Communities() {
  const [activeId, setActiveId] = useState<string>("c1");
  const [filter, setFilter] = useState("all");
  const [areaFilter, setAreaFilter] = useState<string | null>(null);
  const [hoveredMsg, setHoveredMsg] = useState<string | null>(null);

  const active = COMMUNITIES.find((c) => c.id === activeId) ?? COMMUNITIES[0];
  const showAdmin = active.myRole === "admin" || active.myRole === "moderator";

  const listed = useMemo(() => {
    let rows = COMMUNITIES;
    if (filter === "mine") rows = rows.filter((c) => c.joined);
    if (filter === "discover") rows = rows.filter((c) => !c.joined);
    if (areaFilter) rows = rows.filter((c) => c.area === areaFilter);
    return rows;
  }, [filter, areaFilter]);

  const areas = Array.from(new Set(COMMUNITIES.map((c) => c.area)));

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "340px 1fr 340px",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        {/* Community list */}
        <div style={{ borderRight: "1px solid var(--hairline)", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "20px 20px 12px" }}>
            <h1
              style={{
                fontSize: 20,
                fontWeight: 600,
                letterSpacing: "-0.015em",
                margin: "0 0 12px",
              }}
            >
              Communities
            </h1>
            <Input leftIcon="search" placeholder="Search hoods…" style={{ fontSize: 13, height: 34 }} />
            <div style={{ marginTop: 12 }}>
              <Tabs tabs={DISCOVERY_FILTERS} value={filter} onChange={setFilter} />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
              {areas.map((a) => (
                <Chip
                  key={a}
                  active={areaFilter === a}
                  leftIcon="pin"
                  onClick={() => setAreaFilter(areaFilter === a ? null : a)}
                >
                  {a}
                </Chip>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {listed.map((c) => {
              const isActive = c.id === activeId;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveId(c.id)}
                  style={{
                    width: "100%",
                    padding: "14px 20px",
                    borderBottom: "1px solid var(--hairline)",
                    background: isActive ? "var(--surface-2)" : "transparent",
                    borderLeft: `3px solid ${isActive ? "var(--accent)" : "transparent"}`,
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "inherit",
                    color: "var(--ink)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 4,
                      gap: 6,
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      {c.myRole && c.myRole !== "member" ? (
                        <Badge tone={ROLE_TONE[c.myRole]}>{c.myRole}</Badge>
                      ) : null}
                      {c.unread > 0 ? (
                        <span
                          style={{
                            background: "var(--accent)",
                            color: "var(--paper)",
                            fontSize: 10,
                            fontWeight: 600,
                            padding: "1px 6px",
                            borderRadius: 999,
                          }}
                        >
                          {c.unread}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--slate)",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>
                      {c.area} · {c.members} members
                    </span>
                    <span>{c.last}</span>
                  </div>
                  {!c.joined ? (
                    <Button variant="ghost" size="sm" style={{ marginTop: 6, height: 24, fontSize: 11 }}>
                      Request to join
                    </Button>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* Thread view */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "1px solid var(--hairline)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{active.name}</div>
                {active.myRole === "admin" ? (
                  <Badge tone="danger">You're admin</Badge>
                ) : active.myRole === "moderator" ? (
                  <Badge tone="accent">You're a moderator</Badge>
                ) : null}
              </div>
              <div style={{ fontSize: 11, color: "var(--slate)" }}>
                {active.members} members · 8 online
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <IconButton icon="bell" label="Notifications" size="sm" />
              <IconButton icon="info" label="Community info" size="sm" />
            </div>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button variant="ghost" size="sm" leftIcon="chevU">
                Load older messages
              </Button>
            </div>

            {MESSAGES.map((m) => (
              <div
                key={m.id}
                onMouseEnter={() => setHoveredMsg(m.id)}
                onMouseLeave={() => setHoveredMsg(null)}
                style={{ position: "relative" }}
              >
                {m.pinned ? (
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
                    <Badge tone="neutral">📌 Pinned</Badge>
                  </div>
                ) : null}
                {m.landlord ? (
                  <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 6, gap: 8 }}>
                    <Badge tone="accent">Landlord</Badge>
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
                          <Icon name="doc" size={12} /> solar-geyser.jpg · 612 KB
                        </div>
                      </>
                    ) : (
                      m.body
                    )
                  }
                  time={m.time}
                  own={m.own}
                  avatarTone={m.landlord ? "ink" : "neutral"}
                />
                {hoveredMsg === m.id && (m.own || showAdmin) ? (
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
                    {showAdmin && !m.pinned ? (
                      <IconButton icon="star" label="Pin" size="sm" />
                    ) : null}
                    <IconButton
                      icon="trash"
                      label={m.own ? "Delete (you)" : "Delete (moderator)"}
                      size="sm"
                    />
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div
            style={{
              padding: "12px 24px",
              borderTop: "1px solid var(--hairline)",
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            <IconButton icon="upload" label="Attach media" size="sm" />
            <Input placeholder={`Message ${active.name}…`} style={{ flex: 1 }} />
            <button type="button" aria-label="Send" className="btn btn--accent btn--icon">
              <Icon name="arrR" size={16} />
            </button>
          </div>
        </div>

        {/* Right rail — admin panel + members */}
        <aside
          style={{ borderLeft: "1px solid var(--hairline)", padding: 20, display: "flex", flexDirection: "column", gap: 16 }}
        >
          {showAdmin && JOIN_REQUESTS.length > 0 ? (
            <Card padding={14}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <Eyebrow>Join requests</Eyebrow>
                <Badge tone="warn">{JOIN_REQUESTS.length}</Badge>
              </div>
              {JOIN_REQUESTS.map((r, i) => (
                <div
                  key={r.name}
                  style={{
                    paddingTop: i > 0 ? 10 : 0,
                    paddingBottom: i < JOIN_REQUESTS.length - 1 ? 10 : 0,
                    borderTop: i > 0 ? "1px solid var(--hairline)" : undefined,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <Avatar name={r.init} size="sm" tone="neutral" />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{r.name}</div>
                      <div style={{ fontSize: 11, color: "var(--slate)" }}>
                        {r.area} · {r.proof}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                    <Button variant="accent" size="sm" style={{ flex: 1, justifyContent: "center" }}>
                      Approve
                    </Button>
                    <Button variant="ghost" size="sm" style={{ flex: 1, justifyContent: "center" }}>
                      Decline
                    </Button>
                  </div>
                  <div style={{ fontSize: 10, color: "var(--slate-2)", marginTop: 4 }}>
                    Requested {r.requested}
                  </div>
                </div>
              ))}
            </Card>
          ) : null}

          <Card padding={14}>
            <Eyebrow style={{ marginBottom: 10 }}>House rules · pinned</Eyebrow>
            <div className="mono" style={{ fontSize: 11, color: "var(--slate)", marginBottom: 6 }}>
              HOUSE RULES
            </div>
            <div style={{ fontSize: 12, lineHeight: 1.5 }}>
              Quiet hours 22:00–07:00 · No subletting · Bin day Tues
            </div>
          </Card>

          <div>
            <Eyebrow style={{ marginBottom: 12 }}>Members · {active.members}</Eyebrow>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {MEMBERS.map((m) => (
                <div key={m.init} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar name={m.init} size="sm" tone="neutral" />
                  <span style={{ fontSize: 13, flex: 1 }}>{m.name}</span>
                  {m.role !== "member" ? <Badge tone={ROLE_TONE[m.role]}>{m.role}</Badge> : null}
                </div>
              ))}
              <Button variant="ghost" size="sm" rightIcon="chevR" style={{ alignSelf: "flex-start", marginTop: 4 }}>
                View all members
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
