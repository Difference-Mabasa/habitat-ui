import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Avatar from "@/components/Avatar";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Tabs from "@/components/Tabs";
import Icon from "@/components/Icon";
import FollowButton from "@/components/FollowButton";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import { useViewport } from "@/hooks/useViewport";
import PostCard from "./PostCard";
import ComposePostDialog from "./ComposePostDialog";
import { POSTS, USERS, userById, type FeedPost } from "./feedData";

type FeedSubTab = "for_you" | "following" | "local";

const DEFAULT_USER_AREA = "Brixton";

export default function FeedPane() {
  const [params, setParams] = useSearchParams();
  const { isSm, isMd } = useViewport();
  const hideRail = isSm || isMd;
  const [sub, setSub] = useState<FeedSubTab>("for_you");
  const [composeOpen, setComposeOpen] = useState(false);
  const dataState = params.get("state") as "loading" | "error" | null;
  const clearState = () => {
    const next = new URLSearchParams(params);
    next.delete("state");
    setParams(next, { replace: true });
  };

  const visible = useMemo<FeedPost[]>(() => {
    if (sub === "following") return POSTS.filter((p) => p.authorFollowed);
    if (sub === "local") return POSTS.filter((p) => p.area === DEFAULT_USER_AREA);
    return POSTS;
  }, [sub]);

  const suggested = useMemo(() => USERS.filter((u) => u.id !== "u-sipho").slice(0, 4), []);
  const trendingAreas = ["Brixton", "Yeoville", "Maboneng", "Westdene", "Orlando West"];

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: hideRail ? "1fr" : "minmax(0, 1fr) 320px",
          gap: isSm ? 16 : 32,
        }}
      >
        <main>
          {/* Compose strip */}
          <Card padding={16} style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar name="Sipho Dlamini" size="md" tone="neutral" />
            <button
              type="button"
              onClick={() => setComposeOpen(true)}
              style={{
                flex: 1,
                textAlign: "left",
                padding: "10px 14px",
                background: "var(--surface-2)",
                border: "1px solid var(--hairline)",
                borderRadius: 999,
                fontFamily: "inherit",
                fontSize: 14,
                color: "var(--slate)",
                cursor: "pointer",
              }}
            >
              What's happening in your hood?
            </button>
            <Button variant="accent" leftIcon="plus" onClick={() => setComposeOpen(true)}>
              Post
            </Button>
          </Card>

          {/* Sub-tabs */}
          <div style={{ marginBottom: 16 }}>
            <Tabs
              variant="underline"
              tabs={[
                { id: "for_you", label: "For you" },
                { id: "following", label: "Following" },
                { id: "local", label: `Local · ${DEFAULT_USER_AREA}` },
              ]}
              value={sub}
              onChange={(v) => setSub(v as FeedSubTab)}
            />
          </div>

          {dataState === "loading" ? (
            <LoadingState rows={4} withAvatar />
          ) : dataState === "error" ? (
            <ErrorState
              title="Couldn't load your feed"
              description="We couldn't reach Habitat just now. Check your connection and retry — posts are cached and will catch up automatically."
              onRetry={clearState}
            />
          ) : visible.length === 0 ? (
            <Card padding={32} style={{ textAlign: "center" }}>
              <Icon name="bell" size={32} style={{ color: "var(--slate)", marginBottom: 12, opacity: 0.5 }} />
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
                {sub === "following"
                  ? "You're not following anyone yet"
                  : `Nothing new in ${DEFAULT_USER_AREA}`}
              </div>
              <p style={{ fontSize: 13, color: "var(--slate)", margin: "0 auto 14px", maxWidth: 360 }}>
                {sub === "following"
                  ? "Follow tenants, landlords, and agents to see their posts here."
                  : "Try the For you tab, or post something yourself."}
              </p>
              <Button variant="accent" onClick={() => setComposeOpen(true)}>
                Create the first post
              </Button>
            </Card>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {visible.map((p) => {
                const author = userById(p.authorId);
                if (!author) return null;
                return <PostCard key={p.id} post={p} author={author} />;
              })}
            </div>
          )}
        </main>

        {/* Right rail — desktop only */}
        {hideRail ? null : (
        <aside style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 88, alignSelf: "start" }}>
          <Card padding={16}>
            <Eyebrow style={{ marginBottom: 12 }}>Suggested for you</Eyebrow>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {suggested.map((u) => (
                <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Link to={`/u/${u.id}`} style={{ flexShrink: 0 }}>
                    <Avatar name={u.name} size="sm" tone="neutral" />
                  </Link>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link
                      to={`/u/${u.id}`}
                      style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", textDecoration: "none" }}
                    >
                      {u.name}
                    </Link>
                    <div style={{ fontSize: 11, color: "var(--slate)" }}>
                      {u.area} · {u.role}
                    </div>
                  </div>
                  <FollowButton size="sm" />
                </div>
              ))}
            </div>
          </Card>

          <Card padding={16}>
            <Eyebrow style={{ marginBottom: 12 }}>Trending areas</Eyebrow>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {trendingAreas.map((a, i) => (
                <Link
                  key={a}
                  to={`/browse?location=${encodeURIComponent(a)}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "6px 0",
                    fontSize: 13,
                    color: "var(--ink)",
                    textDecoration: "none",
                  }}
                >
                  <span>
                    <span className="mono" style={{ color: "var(--slate)", marginRight: 8 }}>
                      0{i + 1}
                    </span>
                    {a}
                  </span>
                  <Icon name="chevR" size={12} style={{ color: "var(--slate)" }} />
                </Link>
              ))}
            </div>
          </Card>

          <Card padding={16}>
            <Eyebrow style={{ marginBottom: 8 }}>Community chats</Eyebrow>
            <p style={{ fontSize: 12, color: "var(--slate)", margin: "0 0 10px", lineHeight: 1.5 }}>
              Building, neighbourhood and interest chats live in your inbox.
            </p>
            <Link to="/inbox?filter=communities" style={{ textDecoration: "none" }}>
              <Button variant="secondary" size="sm" rightIcon="arrR" style={{ width: "100%", justifyContent: "center" }}>
                Open chats
              </Button>
            </Link>
          </Card>
        </aside>
        )}
      </div>

      <ComposePostDialog
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
        defaultArea={DEFAULT_USER_AREA}
      />
    </>
  );
}
