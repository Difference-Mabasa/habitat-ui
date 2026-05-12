import { Link } from "react-router-dom";
import Photo from "./Photo";
import Badge from "./Badge";
import Button from "./Button";
import Icon from "./Icon";
import Avatar from "./Avatar";

export type CommunityType = "Building" | "Area" | "Interest" | "Network";

export interface CommunityCardData {
  id: string;
  name: string;
  area: string;
  type: CommunityType;
  members: number;
  lastActive: string;
  description: string;
  joined: boolean;
  unread?: number;
  featured?: "Trending" | "Editor's pick" | "New" | null;
  /** Show "Auto-joined" badge — used for the user's building chat. */
  autoJoined?: boolean;
}

export interface CommunityCardProps {
  community: CommunityCardData;
  variant?: "grid" | "row";
  /** Override link target — defaults to /community-thread?id=… */
  href?: string;
}

export default function CommunityCard({
  community,
  variant = "grid",
  href,
}: CommunityCardProps) {
  const to = href ?? `/inbox?id=${community.id}`;
  if (variant === "row") {
    return (
      <Link
        to={to}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "12px 14px",
          background: "var(--surface)",
          border: "1px solid var(--hairline)",
          borderRadius: 10,
          textDecoration: "none",
          color: "var(--ink)",
          cursor: "pointer",
        }}
      >
        <Avatar name={community.name.slice(0, 2)} size="md" tone="neutral" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{community.name}</span>
            {community.autoJoined ? <Badge tone="success">Auto-joined</Badge> : null}
          </div>
          <div style={{ fontSize: 12, color: "var(--slate)" }}>
            {community.area} · {community.members} members · active {community.lastActive}
          </div>
        </div>
        {community.unread && community.unread > 0 ? (
          <span
            style={{
              background: "var(--accent)",
              color: "var(--paper)",
              fontSize: 10,
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: 999,
            }}
          >
            {community.unread}
          </span>
        ) : null}
        <Icon name="chevR" size={14} style={{ color: "var(--slate)" }} />
      </Link>
    );
  }

  return (
    <Link
      to={to}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "flex",
        flexDirection: "column",
        background: "var(--surface)",
        border: "1px solid var(--hairline)",
        borderRadius: 12,
        overflow: "hidden",
        cursor: "pointer",
        transition: "border-color 120ms, box-shadow 120ms",
      }}
    >
      <div style={{ position: "relative" }}>
        <Photo ratio="16/9" label={`${community.name.toLowerCase()}`} style={{ borderRadius: 0 }} />
        {community.featured ? (
          <span style={{ position: "absolute", top: 10, left: 10 }}>
            <Badge tone="accent">{community.featured}</Badge>
          </span>
        ) : null}
        <span style={{ position: "absolute", top: 10, right: 10 }}>
          <Badge tone="neutral">{community.type}</Badge>
        </span>
      </div>
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>{community.name}</div>
          </div>
          <div style={{ fontSize: 12, color: "var(--slate)", display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="pin" size={11} /> {community.area}
          </div>
        </div>

        <p
          style={{
            fontSize: 13,
            color: "var(--slate)",
            margin: 0,
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {community.description}
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            paddingTop: 10,
            marginTop: "auto",
            borderTop: "1px solid var(--hairline)",
            fontSize: 12,
            color: "var(--slate)",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Icon name="users" size={12} /> {community.members}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Icon name="clock" size={12} /> {community.lastActive}
          </span>
          <div style={{ marginLeft: "auto" }}>
            {community.joined ? (
              <Badge tone="success" leftIcon="check">Joined</Badge>
            ) : (
              <Button variant="secondary" size="sm">
                Join
              </Button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
