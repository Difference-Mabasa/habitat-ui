import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Nav from "@/components/Nav";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Badge from "@/components/Badge";
import Tabs from "@/components/Tabs";
import Chip from "@/components/Chip";
import Photo from "@/components/Photo";
import CommunityCard, { type CommunityCardData, type CommunityType } from "@/components/CommunityCard";
import FeedPane from "./FeedPane";
import PeoplePane from "./PeoplePane";
import AreaMultiSelect from "./AreaMultiSelect";

const COMMUNITIES: CommunityCardData[] = [
  { id: "c1", name: "Melville Mews", area: "Melville", type: "Building", members: 312, lastActive: "2m ago", description: "Tenants of the Mews block at 14 Main Rd. Locksmiths, plumbers, lift updates, the occasional curry.", joined: true, unread: 4, autoJoined: true },
  { id: "c2", name: "Brixton Renters", area: "Brixton", type: "Area", members: 184, lastActive: "23m ago", description: "Two-year-old neighbourhood network. Pet-sitting, second-hand furniture, loadshedding tips.", joined: true, featured: "Editor's pick" },
  { id: "c3", name: "Caroline Cottages", area: "Brixton", type: "Building", members: 67, lastActive: "1h ago", description: "Three-property cottage cluster on Caroline St. Garden duties roster, shared braai bookings.", joined: true, unread: 1 },
  { id: "c4", name: "Yeoville Backrooms", area: "Yeoville", type: "Area", members: 421, lastActive: "3h ago", description: "Backroom and bachelor flat tenants across Yeoville. Active classifieds, hood watch alerts.", joined: false, featured: "Trending" },
  { id: "c5", name: "Auckland Park Studios", area: "Auckland Park", type: "Building", members: 92, lastActive: "Yesterday", description: "The Studios on Kingsway. Wits-adjacent — exam-period quiet hours actually enforced.", joined: false },
  { id: "c6", name: "Sandton Renters Co-op", area: "Sandton", type: "Network", members: 1284, lastActive: "5m ago", description: "Largest Sandton tenant network. Insurance group buys, deposit-disputes legal helpline.", joined: false, featured: "New" },
  { id: "c7", name: "Cape Town Townhouses", area: "Sea Point", type: "Network", members: 624, lastActive: "12m ago", description: "Sea Point + Green Point townhouse renters. Body-corporate gossip, levy chatter.", joined: false },
  { id: "c8", name: "Joburg Pet-friendly tenants", area: "Joburg", type: "Interest", members: 488, lastActive: "1h ago", description: "If your lease lets you keep a dog/cat, you're welcome here. Vet recs + pet-sitting swaps.", joined: false },
  { id: "c9", name: "Soweto Tenants Network", area: "Soweto", type: "Network", members: 1842, lastActive: "8m ago", description: "Pan-Soweto tenant collective. RHA advocacy, mandate audits, area-by-area channels.", joined: false },
  { id: "c10", name: "Maboneng Lofts", area: "Maboneng", type: "Area", members: 215, lastActive: "Yesterday", description: "Inner-city loft conversions. Parking permits, building-access gossip, weekend market chatter.", joined: false },
  { id: "c11", name: "Westdene Cottages", area: "Westdene", type: "Area", members: 142, lastActive: "30m ago", description: "Garden cottages along Caroline + Park Streets. Shared gardeners, brick swaps, pet finds.", joined: false },
  { id: "c12", name: "Tembisa Working Renters", area: "Tembisa", type: "Network", members: 988, lastActive: "1h ago", description: "Working professionals across Tembisa renting backrooms and 1-bed flats.", joined: false },
];

const ARTICLES: { id: string; tag: "Article" | "Guide"; title: string; teaser: string; date: string; readMin: number }[] = [
  { id: "a1", tag: "Guide", title: "Your rights when the geyser bursts", teaser: "What the Rental Housing Act actually says about emergency repairs, and how to draft the text-message paper trail.", date: "Yesterday", readMin: 6 },
  { id: "a2", tag: "Article", title: "Loadshedding-proof your spot in 5 steps", teaser: "Solar geysers, inverters, gas hobs, and what landlords legally have to allow you to install.", date: "3 days ago", readMin: 8 },
  { id: "a3", tag: "Guide", title: "Negotiating a renewal: a 4-step script", teaser: "How to read the market, time the conversation, and counter a 12% escalation without burning the bridge.", date: "1 week ago", readMin: 5 },
  { id: "a4", tag: "Article", title: "What FICA actually means for tenants", teaser: "Why landlords ask for your ID and bank statements — and which parts you can decline.", date: "2 weeks ago", readMin: 4 },
];

const AREAS = ["Brixton", "Melville", "Sandton", "Soweto", "Maboneng", "Yeoville", "Sea Point", "Auckland Park", "Westdene", "Tembisa"];
const TYPES: (CommunityType | "All")[] = ["All", "Building", "Area", "Interest", "Network"];
const SORTS = [
  { id: "active", label: "Active" },
  { id: "newest", label: "Newest" },
  { id: "members", label: "Members" },
];

type TabId = "feed" | "discover" | "people" | "articles";

export default function Communities() {
  const [tab, setTab] = useState<TabId>("feed");
  const [query, setQuery] = useState("");
  const [areas, setAreas] = useState<Set<string>>(new Set());
  const [type, setType] = useState<CommunityType | "All">("All");
  const [sort, setSort] = useState("active");

  const filtered = useMemo(() => {
    let rows = COMMUNITIES;
    if (areas.size > 0) rows = rows.filter((c) => areas.has(c.area));
    if (type !== "All") rows = rows.filter((c) => c.type === type);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      rows = rows.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.area.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q),
      );
    }
    if (sort === "members") rows = [...rows].sort((a, b) => b.members - a.members);
    return rows;
  }, [areas, type, query, sort]);

  const featured = useMemo(() => COMMUNITIES.filter((c) => c.featured).slice(0, 3), []);
  const joinedCount = useMemo(() => COMMUNITIES.filter((c) => c.joined).length, []);

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />

      {/* Hero */}
      <div
        style={{
          background:
            "radial-gradient(120% 80% at 80% 20%, color-mix(in oklch, var(--accent) 8%, var(--surface)) 0%, var(--surface) 60%)",
          borderBottom: "1px solid var(--hairline)",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 32px 32px" }}>
          <Eyebrow>Communities</Eyebrow>
          <h1 style={{ fontSize: 36, fontWeight: 500, letterSpacing: "-0.025em", margin: "8px 0 8px" }}>
            Your hood, in one feed
          </h1>
          <p style={{ fontSize: 15, color: "var(--slate)", margin: "0 0 16px", maxWidth: 620, lineHeight: 1.55 }}>
            Public posts from tenants, landlords and agents you follow. Discover communities for chat groups,
            articles for long reads. Community DMs still live in{" "}
            <Link to="/inbox?filter=communities" style={{ color: "var(--accent)", fontWeight: 600 }}>
              your inbox
            </Link>
            .
          </p>

          {tab === "discover" ? (
            <div style={{ display: "flex", gap: 10, maxWidth: 760, alignItems: "center", marginTop: 8 }}>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "0 14px",
                  height: 48,
                  background: "var(--surface)",
                  border: "1px solid var(--hairline-strong)",
                  borderRadius: 12,
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <Icon name="search" size={16} style={{ color: "var(--slate)" }} />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search communities, areas, topics…"
                  style={{ flex: 1, border: 0, background: "transparent", height: 36, padding: 0 }}
                />
              </div>
              <Button variant="accent" size="lg" leftIcon="plus">
                Create community
              </Button>
            </div>
          ) : null}

          {/* Quick stats strip */}
          <div style={{ display: "flex", gap: 24, marginTop: 18, fontSize: 13, color: "var(--slate)" }}>
            <span>
              <strong style={{ color: "var(--ink)" }}>{COMMUNITIES.length}+</strong> communities
            </span>
            <span>·</span>
            <span>
              <strong style={{ color: "var(--ink)" }}>{joinedCount}</strong> you've joined
            </span>
            <span>·</span>
            <Link to="/inbox?filter=communities" style={{ color: "var(--accent)", fontWeight: 600 }}>
              Open your chats →
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
          <Tabs
            variant="underline"
            tabs={[
              { id: "feed", label: "Feed" },
              { id: "discover", label: "Communities", count: COMMUNITIES.length },
              { id: "people", label: "People" },
              { id: "articles", label: "Articles", count: ARTICLES.length },
            ]}
            value={tab}
            onChange={(id) => setTab(id as TabId)}
          />
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 32px 64px" }}>
        {tab === "feed" && <FeedPane />}

        {tab === "people" && <PeoplePane />}

        {tab === "discover" && (
          <>
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                marginBottom: 20,
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", flex: 1, minWidth: 0, alignItems: "center" }}>
                <AreaMultiSelect options={AREAS} value={areas} onChange={setAreas} />
                {areas.size > 0 ? (
                  <button
                    type="button"
                    onClick={() => setAreas(new Set())}
                    style={{
                      background: "none",
                      border: "none",
                      padding: "0 4px",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      fontSize: 12,
                      color: "var(--slate)",
                      textDecoration: "underline",
                    }}
                  >
                    Clear areas
                  </button>
                ) : null}
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {TYPES.map((t) => (
                    <Chip key={t} active={type === t} onClick={() => setType(t)}>
                      {t}
                    </Chip>
                  ))}
                </div>
                <Tabs variant="segmented" tabs={SORTS} value={sort} onChange={setSort} />
              </div>
            </div>

            {/* Featured strip */}
            {featured.length > 0 && (areas.size === 0 && type === "All" && !query.trim()) ? (
              <div style={{ marginBottom: 32 }}>
                <Eyebrow style={{ marginBottom: 12 }}>Featured this week</Eyebrow>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                  {featured.map((c) => (
                    <CommunityCard key={c.id} community={c} />
                  ))}
                </div>
              </div>
            ) : null}

            <Eyebrow style={{ marginBottom: 12 }}>
              {filtered.length} communit{filtered.length === 1 ? "y" : "ies"} match
            </Eyebrow>
            {filtered.length === 0 ? (
              <Card padding={32} style={{ textAlign: "center" }}>
                <Icon name="search" size={32} style={{ color: "var(--slate)", marginBottom: 12 }} />
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>
                  No communities match
                </div>
                <p style={{ fontSize: 13, color: "var(--slate)", margin: "0 auto 16px", maxWidth: 320 }}>
                  Broaden your filters, or start your own community — takes about a minute.
                </p>
                <Button variant="accent" leftIcon="plus">Create community</Button>
              </Card>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {filtered.map((c) => (
                  <CommunityCard key={c.id} community={c} />
                ))}
              </div>
            )}
          </>
        )}

        {tab === "articles" && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <div>
                <Eyebrow style={{ marginBottom: 4 }}>From the Habitat blog</Eyebrow>
                <div style={{ fontSize: 18, fontWeight: 600 }}>
                  Tenant-side reads · {ARTICLES.length} new
                </div>
              </div>
              <Link to="/blog" style={{ textDecoration: "none" }}>
                <Button variant="ghost" rightIcon="arrR">Open the blog</Button>
              </Link>
            </div>

            <Card padding={0} style={{ overflow: "hidden", marginBottom: 24 }}>
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 1fr" }}>
                <Photo ratio="auto" label="featured · geyser" style={{ borderRadius: 0, minHeight: 240 }} />
                <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Badge tone="success">{ARTICLES[0].tag}</Badge>
                    <Badge tone="neutral">{ARTICLES[0].readMin} min read</Badge>
                  </div>
                  <h2 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.015em", margin: 0 }}>
                    {ARTICLES[0].title}
                  </h2>
                  <p style={{ fontSize: 14, color: "var(--slate)", margin: 0, lineHeight: 1.55 }}>
                    {ARTICLES[0].teaser}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: "var(--slate)", marginTop: "auto" }}>
                    <span>{ARTICLES[0].date}</span>
                    <span>·</span>
                    <Link to="/blog" style={{ color: "var(--accent)", fontWeight: 600 }}>
                      Read article →
                    </Link>
                  </div>
                </div>
              </div>
            </Card>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {ARTICLES.slice(1).map((a) => (
                <Link
                  key={a.id}
                  to="/blog"
                  style={{
                    display: "flex",
                    gap: 14,
                    padding: 16,
                    background: "var(--surface)",
                    border: "1px solid var(--hairline)",
                    borderRadius: 10,
                    textDecoration: "none",
                    color: "var(--ink)",
                  }}
                >
                  <Photo
                    ratio="1"
                    label={a.tag.toLowerCase()}
                    style={{ width: 88, height: 88, borderRadius: 8, flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                      <Badge tone={a.tag === "Guide" ? "success" : "accent"}>{a.tag}</Badge>
                      <Badge tone="neutral">{a.readMin} min read</Badge>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{a.title}</div>
                    <div style={{ fontSize: 13, color: "var(--slate)", lineHeight: 1.5 }}>{a.teaser}</div>
                    <div style={{ fontSize: 11, color: "var(--slate-2)", marginTop: 8 }}>{a.date}</div>
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ marginTop: 24, textAlign: "center" }}>
              <Link to="/blog" style={{ textDecoration: "none" }}>
                <Button variant="secondary" rightIcon="arrR">
                  Read everything on the blog
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
