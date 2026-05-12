import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Nav from "@/components/Nav";
import Avatar from "@/components/Avatar";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Icon from "@/components/Icon";
import Photo from "@/components/Photo";
import Tabs from "@/components/Tabs";
import EmptyState from "@/components/EmptyState";
import FollowButton from "@/components/FollowButton";
import PostCard from "@/screens/communities/PostCard";
import { POSTS, USERS, userById, type FeedUser } from "@/screens/communities/feedData";

type ProfileTab = "posts" | "listings" | "about";

const ROLE_BADGE: Record<FeedUser["role"], { label: string; tone: "neutral" | "accent" | "success" }> = {
  tenant: { label: "Tenant", tone: "neutral" },
  landlord: { label: "Landlord", tone: "accent" },
  agent: { label: "Agent", tone: "accent" },
  admin: { label: "Admin", tone: "neutral" },
};

export default function UserProfile() {
  const { userId = "" } = useParams();
  const user = userById(userId) ?? USERS[0];
  const [tab, setTab] = useState<ProfileTab>("posts");

  const authoredPosts = useMemo(
    () => POSTS.filter((p) => p.authorId === user.id),
    [user.id],
  );

  const showListings = user.role === "landlord" || user.role === "agent";
  const badge = ROLE_BADGE[user.role];

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />

      {/* Cover */}
      <div
        style={{
          height: 200,
          background:
            "radial-gradient(120% 80% at 80% 20%, color-mix(in oklch, var(--accent) 18%, var(--surface-2)) 0%, var(--surface-2) 60%)",
          borderBottom: "1px solid var(--hairline)",
        }}
      />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px 64px" }}>
        {/* Header overlapping cover */}
        <div style={{ marginTop: -52, marginBottom: 24, display: "flex", alignItems: "flex-end", gap: 20 }}>
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              border: "4px solid var(--paper)",
              boxShadow: "var(--shadow-md)",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <Avatar name={user.name} size="lg" tone="neutral" />
          </div>
          <div style={{ flex: 1, paddingBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}>
                {user.name}
              </h1>
              {user.verified ? (
                <Badge tone="success" leftIcon="check">Verified</Badge>
              ) : null}
              <Badge tone={badge.tone}>{badge.label}</Badge>
            </div>
            <div style={{ fontSize: 13, color: "var(--slate)", marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="pin" size={13} /> {user.area}
              <span>·</span>
              <span><strong style={{ color: "var(--ink)" }}>{user.followers.toLocaleString("en-ZA")}</strong> followers</span>
              <span>·</span>
              <span><strong style={{ color: "var(--ink)" }}>{user.following.toLocaleString("en-ZA")}</strong> following</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, paddingBottom: 8 }}>
            <Link to={`/inbox?id=dm-${user.id}`} style={{ textDecoration: "none" }}>
              <Button variant="secondary" size="sm" leftIcon="chat">
                Message
              </Button>
            </Link>
            <FollowButton size="md" />
          </div>
        </div>

        {user.bio ? (
          <p style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.6, margin: "0 0 24px", maxWidth: 720 }}>
            {user.bio}
          </p>
        ) : null}

        <Tabs
          variant="underline"
          tabs={[
            { id: "posts", label: "Posts", count: authoredPosts.length },
            ...(showListings ? [{ id: "listings", label: "Listings", count: 3 }] : []),
            { id: "about", label: "About" },
          ]}
          value={tab}
          onChange={(v) => setTab(v as ProfileTab)}
        />

        <div style={{ marginTop: 24 }}>
          {tab === "posts" &&
            (authoredPosts.length === 0 ? (
              <EmptyState
                icon="chat"
                title={`${user.name} hasn't posted yet`}
                description="Follow them to see their posts as soon as they publish."
              />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 720 }}>
                {authoredPosts.map((p) => (
                  <PostCard key={p.id} post={p} author={user} />
                ))}
              </div>
            ))}

          {tab === "listings" && showListings ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {[1, 2, 3].map((i) => (
                <Card key={i} padding={0} style={{ overflow: "hidden" }}>
                  <Photo ratio="3/2" label={`${user.area} listing ${i}`} />
                  <div style={{ padding: 14 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                      Cottage · {user.area}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--slate)" }}>
                      R {(4400 + i * 400).toLocaleString("en-ZA")} / mo · 1 bed
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : null}

          {tab === "about" ? (
            <Card padding={20} style={{ maxWidth: 720 }}>
              <Eyebrow style={{ marginBottom: 10 }}>About {user.name}</Eyebrow>
              <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.65, margin: "0 0 16px" }}>
                {user.bio ?? "No bio yet."}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", rowGap: 8, fontSize: 13 }}>
                <span style={{ color: "var(--slate)" }}>Role</span>
                <span>{badge.label}</span>
                <span style={{ color: "var(--slate)" }}>Area</span>
                <span>{user.area}</span>
                <span style={{ color: "var(--slate)" }}>Verified</span>
                <span>{user.verified ? "Yes · FICA complete" : "Not yet"}</span>
                <span style={{ color: "var(--slate)" }}>Member since</span>
                <span>2024</span>
              </div>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
