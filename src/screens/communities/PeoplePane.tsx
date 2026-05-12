import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "@/components/Avatar";
import Card from "@/components/Card";
import Chip from "@/components/Chip";
import Badge from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import Icon from "@/components/Icon";
import Input from "@/components/Input";
import FollowButton from "@/components/FollowButton";
import { USERS, type FeedUser, type UserRole } from "./feedData";

const ROLE_FILTERS: { id: UserRole | "all"; label: string }[] = [
  { id: "all", label: "Everyone" },
  { id: "tenant", label: "Tenants" },
  { id: "landlord", label: "Landlords" },
  { id: "agent", label: "Agents" },
];

const ROLE_BADGE: Record<UserRole, { label: string; tone: "neutral" | "accent" | "success" }> = {
  tenant: { label: "Tenant", tone: "neutral" },
  landlord: { label: "Landlord", tone: "accent" },
  agent: { label: "Agent", tone: "accent" },
  admin: { label: "Admin", tone: "neutral" },
};

export default function PeoplePane() {
  const [role, setRole] = useState<UserRole | "all">("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let rows = USERS;
    if (role !== "all") rows = rows.filter((u) => u.role === role);
    if (verifiedOnly) rows = rows.filter((u) => u.verified);
    const q = query.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.area.toLowerCase().includes(q) ||
          (u.bio ?? "").toLowerCase().includes(q),
      );
    }
    return rows;
  }, [role, verifiedOnly, query]);

  const suggested = USERS.slice(0, 4);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Suggested ribbon */}
      <section>
        <Eyebrow style={{ marginBottom: 12 }}>Suggested for you · same areas & buildings</Eyebrow>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {suggested.map((u) => (
            <SuggestedCard key={u.id} user={u} />
          ))}
        </div>
      </section>

      {/* Filters */}
      <section>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 220, maxWidth: 360 }}>
            <Input
              leftIcon="search"
              placeholder="Search people, areas, bios…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {ROLE_FILTERS.map((f) => (
              <Chip key={f.id} active={role === f.id} onClick={() => setRole(f.id)}>
                {f.label}
              </Chip>
            ))}
            <Chip
              active={verifiedOnly}
              leftIcon="shield"
              onClick={() => setVerifiedOnly((v) => !v)}
            >
              Verified
            </Chip>
          </div>
        </div>

        <Eyebrow style={{ marginBottom: 10 }}>
          {filtered.length} {filtered.length === 1 ? "person" : "people"}
        </Eyebrow>

        {filtered.length === 0 ? (
          <Card padding={32} style={{ textAlign: "center" }}>
            <Icon name="search" size={28} style={{ color: "var(--slate)", marginBottom: 10 }} />
            <div style={{ fontSize: 14, fontWeight: 600 }}>No matches</div>
            <p style={{ fontSize: 12, color: "var(--slate)", margin: "6px auto 0", maxWidth: 320 }}>
              Try clearing the filters, or invite a friend to join Habitat.
            </p>
          </Card>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            {filtered.map((u) => (
              <UserRow key={u.id} user={u} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function SuggestedCard({ user }: { user: FeedUser }) {
  return (
    <Card padding={16} style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
      <Link to={`/u/${user.id}`}>
        <Avatar name={user.name} size="md" tone="neutral" />
      </Link>
      <div style={{ width: "100%" }}>
        <Link
          to={`/u/${user.id}`}
          style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", textDecoration: "none" }}
        >
          {user.name}
          {user.verified ? (
            <Icon name="check" size={11} style={{ color: "var(--accent)", marginLeft: 4 }} />
          ) : null}
        </Link>
        <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 2 }}>
          {ROLE_BADGE[user.role].label} · {user.area}
        </div>
        {user.bio ? (
          <p
            style={{
              fontSize: 12,
              color: "var(--slate)",
              margin: "6px 0 0",
              lineHeight: 1.4,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {user.bio}
          </p>
        ) : null}
      </div>
      <FollowButton size="sm" />
    </Card>
  );
}

function UserRow({ user }: { user: FeedUser }) {
  const badge = ROLE_BADGE[user.role];
  return (
    <Card padding={14} style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Link to={`/u/${user.id}`} style={{ flexShrink: 0 }}>
        <Avatar name={user.name} size="md" tone="neutral" />
      </Link>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <Link
            to={`/u/${user.id}`}
            style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", textDecoration: "none" }}
          >
            {user.name}
          </Link>
          {user.verified ? (
            <Icon name="check" size={11} style={{ color: "var(--accent)" }} aria-label="Verified" />
          ) : null}
          <Badge tone={badge.tone}>{badge.label}</Badge>
        </div>
        <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 2 }}>
          {user.area} · {user.followers.toLocaleString("en-ZA")} followers
        </div>
      </div>
      <FollowButton size="sm" />
    </Card>
  );
}
