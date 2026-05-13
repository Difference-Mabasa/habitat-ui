import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Nav from "@/components/Nav";
import Avatar from "@/components/Avatar";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Icon from "@/components/Icon";
import Photo from "@/components/Photo";
import Textarea from "@/components/Textarea";
import EmptyState from "@/components/EmptyState";
import FollowButton from "@/components/FollowButton";
import ShareModal from "@/components/ShareModal";
import { toast } from "@/lib/toast";
import { POSTS, TAG_TONE, USERS, userById } from "@/screens/communities/feedData";

interface Comment {
  id: string;
  authorId: string;
  body: string;
  time: string;
  likes: number;
}

const SAMPLE_COMMENTS: Record<string, Comment[]> = {};

export default function PostDetail() {
  const navigate = useNavigate();
  const { postId = "" } = useParams();
  const post = POSTS.find((p) => p.id === postId);
  const [comment, setComment] = useState("");
  const [shareOpen, setShareOpen] = useState(false);

  if (!post) {
    return (
      <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
        <Nav role="tenant" />
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 32px" }}>
          <EmptyState
            icon="x"
            title="Post not found"
            description="This post may have been deleted or its link is broken."
            actions={
              <Link to="/communities" style={{ textDecoration: "none" }}>
                <Button variant="accent">Back to feed</Button>
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const author = userById(post.authorId) ?? USERS[0];
  const comments = SAMPLE_COMMENTS[post.id] ?? [];

  const submit = () => {
    if (!comment.trim()) return;
    toast.success("Reply posted.");
    setComment("");
  };

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "24px 32px 64px" }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "none",
            padding: "6px 0",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 13,
            fontWeight: 500,
            color: "var(--slate)",
            marginBottom: 14,
          }}
        >
          <Icon name="chevL" size={14} />
          Back
        </button>

        <Card padding={0} style={{ overflow: "hidden", marginBottom: 24 }}>
          <div style={{ padding: "20px 24px 12px", display: "flex", gap: 12 }}>
            <Link to={`/u/${author.id}`} style={{ flexShrink: 0 }}>
              <Avatar name={author.name} size="lg" tone="neutral" />
            </Link>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <Link
                  to={`/u/${author.id}`}
                  style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", textDecoration: "none" }}
                >
                  {author.name}
                </Link>
                {author.verified ? (
                  <Icon name="check" size={12} style={{ color: "var(--accent)" }} aria-label="Verified" />
                ) : null}
                <Badge tone="accent">{author.role}</Badge>
              </div>
              <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
                <Icon name="pin" size={11} /> {post.area}
                <span>·</span>
                <Badge tone={TAG_TONE[post.tag]}>{post.tag}</Badge>
                <span>·</span>
                <span>{post.time}</span>
              </div>
            </div>
            {!post.authorFollowed ? <FollowButton size="sm" /> : null}
          </div>

          <div style={{ padding: "8px 24px 18px" }}>
            <p style={{ fontSize: 17, lineHeight: 1.55, margin: 0, whiteSpace: "pre-wrap" }}>{post.body}</p>
            {post.photoLabel ? (
              <Photo
                ratio="16/10"
                label={post.photoLabel}
                style={{ marginTop: 14, borderRadius: 10, border: "1px solid var(--hairline)" }}
              />
            ) : null}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "12px 24px",
              borderTop: "1px solid var(--hairline)",
              fontSize: 13,
              color: "var(--slate)",
            }}
          >
            <span><strong style={{ color: "var(--ink)" }} className="tabular">{post.likes}</strong> likes</span>
            <span><strong style={{ color: "var(--ink)" }} className="tabular">{post.comments}</strong> comments</span>
            <span><strong style={{ color: "var(--ink)" }} className="tabular">{post.reposts}</strong> reposts</span>
          </div>

          <div
            style={{
              display: "flex",
              gap: 4,
              padding: "8px 16px",
              borderTop: "1px solid var(--hairline)",
              background: "var(--surface-2)",
            }}
          >
            <Button variant="ghost" size="sm" leftIcon="heart">Like</Button>
            <Button variant="ghost" size="sm" leftIcon="chat">Comment</Button>
            <Button variant="ghost" size="sm" leftIcon="refresh">Repost</Button>
            <div style={{ flex: 1 }} />
            <Button variant="ghost" size="sm" leftIcon="arrUR" onClick={() => setShareOpen(true)}>
              Share
            </Button>
          </div>
        </Card>

        {/* Reply box */}
        <Card padding={16} style={{ marginBottom: 24 }}>
          <Eyebrow style={{ marginBottom: 10 }}>Your reply</Eyebrow>
          <Textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={`Reply to ${author.name}…`}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
            <Button variant="accent" leftIcon="check" disabled={!comment.trim()} onClick={submit}>
              Reply
            </Button>
          </div>
        </Card>

        <Eyebrow style={{ marginBottom: 12 }}>
          {comments.length} {comments.length === 1 ? "reply" : "replies"}
        </Eyebrow>

        {comments.length === 0 ? (
          <EmptyState
            icon="chat"
            title="No replies yet"
            description="Be the first to reply."
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {comments.map((c) => {
              const cAuthor = userById(c.authorId);
              if (!cAuthor) return null;
              return (
                <Card key={c.id} padding={14} style={{ display: "flex", gap: 12 }}>
                  <Link to={`/u/${cAuthor.id}`} style={{ flexShrink: 0 }}>
                    <Avatar name={cAuthor.name} size="sm" tone="neutral" />
                  </Link>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Link
                        to={`/u/${cAuthor.id}`}
                        style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", textDecoration: "none" }}
                      >
                        {cAuthor.name}
                      </Link>
                      <span style={{ fontSize: 11, color: "var(--slate)" }}>· {c.time}</span>
                    </div>
                    <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.5, margin: "4px 0 8px" }}>
                      {c.body}
                    </p>
                    <div style={{ display: "flex", gap: 12, fontSize: 11, color: "var(--slate)" }}>
                      <button
                        type="button"
                        style={{
                          background: "none", border: "none", padding: 0, cursor: "pointer",
                          fontFamily: "inherit", fontSize: 11, color: "var(--slate)",
                        }}
                      >
                        ♥ {c.likes}
                      </button>
                      <button
                        type="button"
                        style={{
                          background: "none", border: "none", padding: 0, cursor: "pointer",
                          fontFamily: "inherit", fontSize: 11, color: "var(--slate)",
                        }}
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        url={`${typeof window !== "undefined" ? window.location.origin : "https://habitat.co.za"}/post/${post.id}`}
        title={`${author.name} on Habitat — ${post.tag}`}
        body={post.body}
      />
    </div>
  );
}
