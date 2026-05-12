import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "@/components/Avatar";
import Badge from "@/components/Badge";
import Card from "@/components/Card";
import Icon, { type IconName } from "@/components/Icon";
import Photo from "@/components/Photo";
import FollowButton from "@/components/FollowButton";
import { toast } from "@/lib/toast";
import { TAG_TONE, type FeedPost, type FeedUser } from "./feedData";

const ROLE_BADGE: Record<FeedUser["role"], { label: string; tone: "neutral" | "accent" | "success" } | null> = {
  tenant: null,
  landlord: { label: "Landlord", tone: "accent" },
  agent: { label: "Agent", tone: "accent" },
  admin: { label: "Admin", tone: "neutral" },
};

export interface PostCardProps {
  post: FeedPost;
  author: FeedUser;
}

export default function PostCard({ post, author }: PostCardProps) {
  const navigate = useNavigate();
  const roleBadge = ROLE_BADGE[author.role];
  const [bookmarked, setBookmarked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [menuOpen]);

  const openPost = () => navigate(`/post/${post.id}`);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !bookmarked;
    setBookmarked(next);
    toast.success(next ? "Saved to your bookmarks." : "Removed from bookmarks.");
  };
  const reportPost = () => {
    setMenuOpen(false);
    toast.success("Reported — Trust & Safety will review.");
  };
  const muteAuthor = () => {
    setMenuOpen(false);
    toast.info(`Muted ${author.name}. Hidden from your feed for 30 days.`);
  };
  const blockAuthor = () => {
    setMenuOpen(false);
    toast.warn(`Blocked ${author.name}.`);
  };

  return (
    <Card
      padding={0}
      style={{ overflow: "hidden" }}
    >
      <div style={{ padding: "16px 20px 12px", display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Link to={`/u/${author.id}`} style={{ flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
          <Avatar name={author.name} size="md" tone="neutral" />
        </Link>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <Link
              to={`/u/${author.id}`}
              onClick={(e) => e.stopPropagation()}
              style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", textDecoration: "none" }}
            >
              {author.name}
            </Link>
            {author.verified ? (
              <Icon name="check" size={12} style={{ color: "var(--accent)" }} aria-label="Verified" />
            ) : null}
            {roleBadge ? <Badge tone={roleBadge.tone}>{roleBadge.label}</Badge> : null}
            <span style={{ fontSize: 12, color: "var(--slate)" }}>· {post.time}</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="pin" size={11} /> {post.area}
            <span>·</span>
            <Badge tone={TAG_TONE[post.tag]}>{post.tag}</Badge>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {!post.authorFollowed ? (
            <FollowButton initialFollowing={false} size="sm" />
          ) : null}
          <div ref={menuRef} style={{ position: "relative" }}>
            <button
              type="button"
              aria-label="More"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((v) => !v);
              }}
              style={{
                background: "transparent",
                border: "none",
                padding: 6,
                borderRadius: 6,
                cursor: "pointer",
                color: "var(--slate)",
                display: "inline-flex",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <Icon name="more" size={16} />
            </button>
            {menuOpen ? (
              <div
                role="menu"
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  right: 0,
                  width: 200,
                  background: "var(--surface)",
                  border: "1px solid var(--hairline-strong)",
                  borderRadius: 8,
                  boxShadow: "var(--shadow-lg)",
                  padding: 4,
                  zIndex: 5,
                }}
              >
                <MenuItem icon="flag" label="Report post" onClick={reportPost} />
                <MenuItem icon="bell" label={`Mute ${author.name.split(" ")[0]}`} onClick={muteAuthor} />
                <MenuItem icon="x" label="Block" onClick={blockAuthor} tone="danger" />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={openPost}
        style={{
          display: "block",
          width: "100%",
          padding: "0 20px 14px",
          background: "transparent",
          border: "none",
          textAlign: "left",
          cursor: "pointer",
          fontFamily: "inherit",
          color: "var(--ink)",
        }}
      >
        <p style={{ fontSize: 14, lineHeight: 1.55, margin: 0, whiteSpace: "pre-wrap" }}>{post.body}</p>
        {post.photoLabel ? (
          <Photo
            ratio="16/10"
            label={post.photoLabel}
            style={{ marginTop: 12, borderRadius: 10, border: "1px solid var(--hairline)" }}
          />
        ) : null}
      </button>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "10px 16px",
          borderTop: "1px solid var(--hairline)",
          background: "var(--surface-2)",
        }}
      >
        <Action icon="heart" count={post.likes} label="Like" />
        <Action icon="chat" count={post.comments} label="Comment" onClick={openPost} />
        <Action icon="refresh" count={post.reposts} label="Repost" />
        <div style={{ flex: 1 }} />
        <Action
          icon="bookmark"
          label={bookmarked ? "Saved" : "Save"}
          onClick={toggleBookmark}
          active={bookmarked}
        />
        <Action icon="arrUR" label="Share" />
      </div>
    </Card>
  );
}

function Action({
  icon,
  count,
  label,
  onClick,
  active,
}: {
  icon: IconName;
  count?: number;
  label: string;
  onClick?: (e: React.MouseEvent) => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 10px",
        background: "transparent",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: 12,
        color: active ? "var(--accent)" : "var(--slate)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <Icon name={icon} size={14} />
      {count != null ? <span className="tabular">{count}</span> : null}
    </button>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  tone,
}: {
  icon: IconName;
  label: string;
  onClick: () => void;
  tone?: "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="menuitem"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: "100%",
        padding: "8px 10px",
        background: "transparent",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: 13,
        color: tone === "danger" ? "var(--danger)" : "var(--ink)",
        textAlign: "left",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <Icon name={icon} size={14} style={{ color: tone === "danger" ? "var(--danger)" : "var(--slate)" }} />
      {label}
    </button>
  );
}
