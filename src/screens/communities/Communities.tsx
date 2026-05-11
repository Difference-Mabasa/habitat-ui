import { useState } from "react";
import Nav from "@/components/Nav";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import IconButton from "@/components/IconButton";
import Input from "@/components/Input";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Badge from "@/components/Badge";
import Avatar from "@/components/Avatar";
import MessageBubble from "@/components/MessageBubble";

interface Community {
  id: string;
  name: string;
  area: string;
  members: number;
  last: string;
  unread: number;
  joined: boolean;
}

const COMMUNITIES: Community[] = [
  { id: "c1", name: "Melville Mews", area: "Melville", members: 312, last: "2m ago", unread: 4, joined: true },
  { id: "c2", name: "Brixton Renters", area: "Brixton", members: 184, last: "23m ago", unread: 0, joined: true },
  { id: "c3", name: "Caroline Cottages", area: "Caroline", members: 67, last: "1h ago", unread: 1, joined: true },
  { id: "c4", name: "Yeoville Backrooms", area: "Yeoville", members: 421, last: "3h ago", unread: 0, joined: false },
  { id: "c5", name: "Auckland Park Studios", area: "Auckland Park", members: 92, last: "Yesterday", unread: 0, joined: false },
];

interface CommunityMessage {
  name: string;
  body: string;
  time: string;
  own?: boolean;
  landlord?: boolean;
  pinned?: boolean;
}

const MESSAGES: CommunityMessage[] = [
  { name: "Lerato P.", time: "9:42", body: "Loadshedding heads up — stage 4 from 18:00 tonight. Solar geyser for sale btw, R3500, almost new.", pinned: true },
  { name: "You", time: "10:11", body: "Thanks Lerato. Anyone know a good locksmith on this side? Front door latch is sticking.", own: true },
  { name: "Mandla K.", time: "10:14", body: "Use Sipho at Melville Hardware on 7th. Fast and fair." },
  { name: "Thandi M.", time: "10:32", body: "Reminder: building inspection Thursday 10am. Will only need access to the geyser cupboard.", landlord: true },
];

const MEMBER_INITIALS = ["LP", "SD", "MK", "TM", "AB", "NJ", "RT", "KZ", "MM", "BN"];

export default function Communities() {
  const [activeId, setActiveId] = useState<string>("c1");
  const active = COMMUNITIES.find((c) => c.id === activeId) ?? COMMUNITIES[0];

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "320px 1fr 320px",
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
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {COMMUNITIES.map((c) => {
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
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
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
                      Join
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
              <div style={{ fontSize: 16, fontWeight: 600 }}>{active.name}</div>
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
              gap: 18,
            }}
          >
            {MESSAGES.map((m, i) => (
              <div key={i}>
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
                  body={m.body}
                  time={m.time}
                  own={m.own}
                  avatarTone={m.landlord ? "ink" : "neutral"}
                />
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
            <Input placeholder={`Message ${active.name}…`} style={{ flex: 1 }} />
            <button type="button" aria-label="Send" className="btn btn--accent btn--icon">
              <Icon name="arrR" size={16} />
            </button>
          </div>
        </div>

        {/* Right rail — pinned & members */}
        <aside style={{ borderLeft: "1px solid var(--hairline)", padding: 20 }}>
          <Eyebrow style={{ marginBottom: 12 }}>Pinned</Eyebrow>
          <Card padding={14} style={{ marginBottom: 20 }}>
            <div
              className="mono"
              style={{ fontSize: 11, color: "var(--slate)", marginBottom: 6 }}
            >
              HOUSE RULES
            </div>
            <div style={{ fontSize: 12, lineHeight: 1.5 }}>
              Quiet hours 22:00–07:00 · No subletting · Bin day Tues
            </div>
          </Card>
          <Eyebrow style={{ marginBottom: 12 }}>Members · {active.members}</Eyebrow>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {MEMBER_INITIALS.map((i) => (
              <Avatar key={i} name={i} size="sm" tone="neutral" />
            ))}
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "var(--surface-2)",
                border: "1px dashed var(--hairline-strong)",
                display: "grid",
                placeItems: "center",
                fontSize: 10,
                color: "var(--slate)",
              }}
            >
              +{active.members - MEMBER_INITIALS.length}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
