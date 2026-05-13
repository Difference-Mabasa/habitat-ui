import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Nav from "@/components/Nav";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import IconButton from "@/components/IconButton";
import Input from "@/components/Input";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Badge from "@/components/Badge";
import Avatar from "@/components/Avatar";
import InlineLink from "@/components/InlineLink";
import MessageBubble from "@/components/MessageBubble";
import EmptyState from "@/components/EmptyState";

interface CommunityProfile {
  id: string;
  name: string;
  area: string;
  type: "Building" | "Area" | "Interest" | "Network";
  members: number;
  online: number;
  description: string;
  joined: boolean;
  myRole: "admin" | "moderator" | "member" | null;
}

const PROFILES: Record<string, CommunityProfile> = {};

const DEFAULT_PROFILE: CommunityProfile = {
  id: "",
  name: "Community",
  area: "—",
  type: "Area",
  members: 0,
  online: 0,
  description: "",
  joined: false,
  myRole: null,
};

interface ThreadMessage {
  id: string;
  name: string;
  time: string;
  body: string;
  own?: boolean;
  pinned?: boolean;
  older?: boolean;
  hasMedia?: boolean;
}

const MESSAGES: ThreadMessage[] = [];

const MEMBERS: { init: string; name: string; role: "admin" | "moderator" | "member" }[] = [];

const ROLE_TONE = { admin: "danger", moderator: "accent", member: "neutral" } as const;

export default function CommunityThread() {
  const [params] = useSearchParams();
  const id = params.get("id") ?? "";
  const community = PROFILES[id] ?? DEFAULT_PROFILE;
  const [hovered, setHovered] = useState<string | null>(null);
  const showAdmin = community.myRole === "admin" || community.myRole === "moderator";

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Nav role="tenant" />

      {/* Community header band */}
      <div style={{ borderBottom: "1px solid var(--hairline)", background: "var(--surface)" }}>
        <div
          style={{
            maxWidth: 1440,
            margin: "0 auto",
            padding: "20px 32px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <InlineLink to="/communities" icon="chevL" iconPosition="left" size="sm" tone="slate">
            Communities hub
          </InlineLink>
          <div
            style={{
              width: 1,
              height: 24,
              background: "var(--hairline)",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar name={community.name.slice(0, 2)} size="md" tone="neutral" />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18, fontWeight: 600 }}>{community.name}</span>
                <Badge tone="neutral">{community.type}</Badge>
                {community.myRole === "admin" ? <Badge tone="danger">Admin</Badge> : null}
                {community.myRole === "moderator" ? <Badge tone="accent">Moderator</Badge> : null}
              </div>
              <div style={{ fontSize: 12, color: "var(--slate)" }}>
                {community.area} · {community.members} members · {community.online} online
              </div>
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", gap: 8 }}>
            {community.joined ? (
              <>
                <IconButton icon="bell" label="Notifications" size="sm" />
                <IconButton icon="info" label="Community info" size="sm" />
                <Button variant="ghost" size="sm">Leave</Button>
              </>
            ) : (
              <Button variant="accent" leftIcon="check">Join community</Button>
            )}
          </div>
        </div>
      </div>

      {/* Two-col body */}
      <div
        style={{
          flex: 1,
          maxWidth: 1440,
          width: "100%",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 320px",
        }}
      >
        {/* Thread */}
        <div style={{ display: "flex", flexDirection: "column" }}>
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
            {MESSAGES.length === 0 ? (
              <EmptyState
                icon="chat"
                title="No messages yet"
                description="Start the conversation."
              />
            ) : null}

            {MESSAGES.length > 0 ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button variant="ghost" size="sm" leftIcon="chevU">
                  Load older messages
                </Button>
              </div>
            ) : null}

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
                          <Icon name="doc" size={12} /> council-notice-water.pdf · 412 KB
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
            ))}
          </div>

          {community.joined ? (
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
          ) : (
            <div
              style={{
                padding: 20,
                borderTop: "1px solid var(--hairline)",
                background: "var(--surface-2)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 13, color: "var(--slate)", marginBottom: 12 }}>
                Join {community.name} to read more and post.
              </div>
              <Button variant="accent" leftIcon="check">Join community</Button>
            </div>
          )}
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
          <Card padding={14}>
            <Eyebrow style={{ marginBottom: 8 }}>About</Eyebrow>
            <p style={{ fontSize: 13, lineHeight: 1.5, margin: 0 }}>{community.description}</p>
          </Card>

          {community.myRole === "admin" || community.myRole === "moderator" ? (
            <Card padding={14}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <Eyebrow>Join requests</Eyebrow>
                <Badge tone="neutral">0</Badge>
              </div>
              <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 8 }}>
                No pending requests.
              </div>
              <Link to="/communities" style={{ color: "var(--accent)", fontSize: 12, fontWeight: 600 }}>
                Review →
              </Link>
            </Card>
          ) : null}

          <Card padding={14}>
            <Eyebrow style={{ marginBottom: 8 }}>House rules</Eyebrow>
            <div style={{ fontSize: 12, lineHeight: 1.5, color: "var(--slate)" }}>
              No marketing posts · No politics · Help your neighbours when you can · Keep it kasi
            </div>
          </Card>

          <div>
            <Eyebrow style={{ marginBottom: 12 }}>Members · {community.members}</Eyebrow>
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
