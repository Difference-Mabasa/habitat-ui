import { useState } from "react";
import { Link } from "react-router-dom";
import TenantShell from "@/components/TenantShell";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import IconButton from "@/components/IconButton";
import Input from "@/components/Input";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Badge from "@/components/Badge";
import Avatar from "@/components/Avatar";
import Alert from "@/components/Alert";
import MessageBubble from "@/components/MessageBubble";

interface CommunityMessage {
  id: string;
  name: string;
  body: string;
  time: string;
  own?: boolean;
  landlord?: boolean;
  pinned?: boolean;
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

const MEMBERS: { init: string; name: string; role: "admin" | "moderator" | "member" }[] = [
  { init: "LP", name: "Lerato P.", role: "admin" },
  { init: "TM", name: "Thandi M.", role: "moderator" },
  { init: "SD", name: "Sipho D.", role: "moderator" },
  { init: "MK", name: "Mandla K.", role: "member" },
  { init: "AB", name: "Aisha B.", role: "member" },
  { init: "NJ", name: "Nthabi J.", role: "member" },
  { init: "RT", name: "Ravi T.", role: "member" },
  { init: "KZ", name: "Kabelo Z.", role: "member" },
];

export default function PropertyChat() {
  const [hovered, setHovered] = useState<string | null>(null);

  const community = {
    name: "Garden Cottage · Brixton",
    type: "Building chat",
    members: 12,
    online: 4,
  };

  return (
    <TenantShell activeId="communities">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 320px",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        {/* Main thread */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "1px solid var(--hairline)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div>
              <Eyebrow style={{ marginBottom: 4 }}>{community.type}</Eyebrow>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: 18, fontWeight: 600 }}>{community.name}</div>
                <Badge tone="success">Auto-joined</Badge>
              </div>
              <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 2 }}>
                {community.members} members · {community.online} online · auto-joined as a tenant of this property
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Link to="/communities" style={{ textDecoration: "none" }}>
                <Button variant="ghost" size="sm" rightIcon="arrUR">Open in Communities hub</Button>
              </Link>
              <IconButton icon="bell" label="Notifications" size="sm" />
              <IconButton icon="info" label="Community info" size="sm" />
            </div>
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
                onMouseEnter={() => setHovered(m.id)}
                onMouseLeave={() => setHovered(null)}
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
                {hovered === m.id && m.own ? (
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
                    <IconButton icon="trash" label="Delete" size="sm" />
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          {/* Composer */}
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
            <Input placeholder={`Message ${community.name}…`} style={{ flex: 1 }} />
            <button type="button" aria-label="Send" className="btn btn--accent btn--icon">
              <Icon name="arrR" size={16} />
            </button>
          </div>
        </div>

        {/* Right rail */}
        <aside
          style={{
            borderLeft: "1px solid var(--hairline)",
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            overflowY: "auto",
          }}
        >
          <Alert tone="info" title="Want more conversations?">
            This is just your building chat.{" "}
            <Link to="/communities" style={{ color: "var(--accent)", fontWeight: 600 }}>
              Browse the Communities hub
            </Link>{" "}
            to discover and join neighbourhood, area, or interest groups.
          </Alert>

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
            <Eyebrow style={{ marginBottom: 12 }}>Members · {community.members}</Eyebrow>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {MEMBERS.map((m) => (
                <div key={m.init} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar name={m.init} size="sm" tone="neutral" />
                  <span style={{ fontSize: 13, flex: 1 }}>{m.name}</span>
                  {m.role === "admin" ? (
                    <Badge tone="danger">admin</Badge>
                  ) : m.role === "moderator" ? (
                    <Badge tone="accent">moderator</Badge>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </TenantShell>
  );
}
