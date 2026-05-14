import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Nav from "@/components/Nav";
import Photo from "@/components/Photo";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import StatTile from "@/components/StatTile";
import AreaCard from "@/components/AreaCard";
import EmptyState from "@/components/EmptyState";
import Footer from "@/components/Footer";
import PropertyCard, { type PropertyCardData } from "@/components/PropertyCard";
import { useViewport } from "@/hooks/useViewport";
import { useSession } from "@/lib/session";
import { createPropertiesApi, type PopularArea, type PropertySummary } from "@/lib/api/properties";
import { createLandingApi, type LandingStats, type PopularCity } from "@/lib/api/landing";
import HeroSearch from "./HeroSearch";

/**
 * Editorial fallback shown immediately on first render (and on fetch
 * failure) so the "Trusted across" marquee never starts empty. Matches
 * the server-side `LandingContent.EDITORIAL_CITIES` list exactly.
 */
const EDITORIAL_CITIES: PopularCity[] = [
  { name: "Johannesburg", listingCount: 0 },
  { name: "Cape Town", listingCount: 0 },
  { name: "Durban", listingCount: 0 },
  { name: "Pretoria", listingCount: 0 },
  { name: "Gqeberha", listingCount: 0 },
  { name: "Polokwane", listingCount: 0 },
  { name: "Bloemfontein", listingCount: 0 },
];

/**
 * Initial chip line shown while the popular-areas request is in flight,
 * and the fallback when the request fails outright. The server has its
 * own editorial fallback for the empty-catalogue case, so a successful
 * response is always preferred over this.
 */
const EDITORIAL_POPULAR_AREAS: PopularArea[] = [
  { name: "Sandton", listingCount: 0 },
  { name: "Umhlanga", listingCount: 0 },
  { name: "Camps Bay", listingCount: 0 },
];

const FOOTER_COLUMNS = [
  { title: "Landlords", links: [
    { label: "List a property", href: "/list-property" },
    { label: "Pricing", href: "/pricing" },
    { label: "Find an agent", href: "/agent-browse" },
    { label: "Resources", href: "/help" },
  ] },
  { title: "Tenants", links: [
    { label: "Browse", href: "/browse" },
    { label: "Saved", href: "/saved" },
    { label: "How vetting works", href: "/help" },
    { label: "Communities", href: "/communities" },
  ] },
  { title: "Company", links: [
    { label: "About", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
    { label: "Blog", href: "#" },
  ] },
  { title: "Legal", links: [
    { label: "Terms", href: "#" },
    { label: "Privacy", href: "#" },
    { label: "POPIA", href: "#" },
    { label: "Contact", href: "#" },
  ] },
];

export default function Landing() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="landlord" />
      <SearchHero />
      <Hero />
      <TrustBar />
      <TopRatedNearYou />
      <ValueGrid />
      <HowItWorks />
      <FeaturedAreas />
      <Footer
        columns={FOOTER_COLUMNS}
        tagline="The calmest way to rent in South Africa. Built in Joburg."
        copyright="© 2026 Habitat · Your Spot. Your Hood."
      />
    </div>
  );
}

/** A top-rated listing with an optional pre-computed distance from the viewer. */
type TopRatedItem = PropertySummary & { distanceKm: number | null };

type LocationState = "ask" | "granted" | "denied";

/** How many cards the section renders at most. */
const TOP_RATED_VISIBLE = 4;

/** How many we ask the API for — over-fetch so location-sort has options. */
const TOP_RATED_FETCH = 8;

/** Great-circle distance between two WGS-84 points (km). Ported from backroom. */
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function TopRatedNearYou() {
  const session = useSession();
  const api = useMemo(() => createPropertiesApi(session.client), [session.client]);
  const { isSm, isMd } = useViewport();
  const topRatedCols = isSm ? "1fr" : isMd ? "repeat(2, 1fr)" : "repeat(4, 1fr)";

  const [items, setItems] = useState<TopRatedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<LocationState>("ask");

  useEffect(() => {
    let cancelled = false;
    api.topRated(TOP_RATED_FETCH).then(
      (rows) => {
        if (cancelled) return;
        setItems(rows.map((r) => ({ ...r, distanceKm: null })));
        setLoading(false);
      },
      () => {
        if (cancelled) return;
        setLoading(false);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [api]);

  // Triggered by the "Allow Location" button — the call MUST be on a
  // user gesture for the browser to even consider granting permission.
  function requestLocation() {
    if (!navigator.geolocation) {
      setLocation("denied");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        setLocation("granted");
        setItems((current) =>
          [...current]
            .map((p) => ({
              ...p,
              distanceKm:
                p.latitude != null && p.longitude != null
                  ? haversineKm(userLat, userLng, p.latitude, p.longitude)
                  : null,
            }))
            .sort((a, b) => {
              // Properties without coords sink to the bottom; everyone
              // else sorts ascending by distance from the viewer.
              if (a.distanceKm == null) return 1;
              if (b.distanceKm == null) return -1;
              return a.distanceKm - b.distanceKm;
            }),
        );
      },
      () => setLocation("denied"),
    );
  }

  const visible = items.slice(0, TOP_RATED_VISIBLE);

  return (
    <section style={{ borderBottom: "1px solid var(--hairline)" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: isSm ? "48px 20px" : "72px 32px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 24,
            marginBottom: 28,
            flexWrap: "wrap",
          }}
        >
          <div>
            <Eyebrow style={{ marginBottom: 12 }}>Based on Ratings &amp; Your Location</Eyebrow>
            <h2
              style={{
                fontSize: 40,
                letterSpacing: "-0.025em",
                lineHeight: 1.1,
                fontWeight: 500,
                margin: 0,
              }}
            >
              Top Rated <span style={{ color: "var(--accent)" }}>Near You</span>
            </h2>
          </div>

          {location === "granted" ? (
            <Badge tone="success" leftIcon="pin">Sorted by Distance from You</Badge>
          ) : location === "denied" ? (
            <Badge tone="neutral">Showing Top-Rated · Location Off</Badge>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              leftIcon="pin"
              onClick={requestLocation}
            >
              Allow Location for Nearest Results
            </Button>
          )}
        </div>

        {loading || visible.length === 0 ? (
          <EmptyState
            icon="home"
            title="No Listings Yet"
            description="Top-rated listings will appear here once they're published."
          />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: topRatedCols, gap: 16 }}>
            {visible.map((item) => (
              <TopRatedCard key={item.id} item={item} showDistance={location === "granted"} />
            ))}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
          <Link to="/browse" style={{ textDecoration: "none" }}>
            <Button variant="ghost" rightIcon="arrR">
              Browse All Listings
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

/**
 * Map a {@link PropertySummary} to the {@link PropertyCardData} shape the
 * card consumes. The "tag" pill shows the rating when reviews exist, or
 * a "New" badge when the property hasn't been reviewed yet — same surface,
 * different content.
 */
function summaryToCardData(p: PropertySummary): PropertyCardData {
  const area = p.suburb ?? p.city ?? "—";
  const tag =
    p.ratingCount > 0
      ? `★ ${Number(p.avgRating).toFixed(1)} · ${p.ratingCount} ${p.ratingCount === 1 ? "review" : "reviews"}`
      : "New";
  return {
    id: p.id,
    title: p.title,
    area,
    price: p.headlinePrice ?? 0,
    beds: p.headlineBeds ?? 0,
    baths: p.headlineBaths ?? 0,
    sqm: p.headlineSqm ?? undefined,
    type: p.headlineUnitType ?? undefined,
    tag,
    photoSrc: p.coverImageUrl ?? undefined,
  };
}

function TopRatedCard({
  item,
  showDistance,
}: {
  item: TopRatedItem;
  showDistance: boolean;
}) {
  return (
    <div style={{ position: "relative" }}>
      <PropertyCard
        data={summaryToCardData(item)}
        variant="grid"
        href={`/property/${item.id}`}
      />
      {showDistance && item.distanceKm != null ? (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12 + 32 + 8, // dodge the save heart on the card
            background: "var(--ink)",
            color: "var(--paper)",
            padding: "4px 8px",
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 600,
            fontVariantNumeric: "tabular-nums",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            boxShadow: "var(--shadow-sm)",
            pointerEvents: "none",
          }}
        >
          <Icon name="pin" size={11} /> {item.distanceKm.toFixed(1)} km
        </div>
      ) : null}
    </div>
  );
}

function SearchHero() {
  const session = useSession();
  const api = useMemo(() => createPropertiesApi(session.client), [session.client]);
  const [popularAreas, setPopularAreas] = useState<PopularArea[]>(EDITORIAL_POPULAR_AREAS);

  // Replace the editorial trio with live ranking on mount; ignore errors
  // (the editorial defaults already render).
  useEffect(() => {
    let cancelled = false;
    api.popularAreas(3).then(
      (areas) => {
        if (!cancelled && areas.length > 0) setPopularAreas(areas);
      },
      () => {
        // Swallow — editorial fallback already renders.
      },
    );
    return () => {
      cancelled = true;
    };
  }, [api]);

  return (
    <section
      style={{
        borderBottom: "1px solid var(--hairline)",
        background:
          "radial-gradient(circle at 80% 20%, color-mix(in oklch, var(--accent) 18%, transparent), transparent 55%), var(--paper-2)",
      }}
    >
      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
          padding: "80px 32px 64px",
          textAlign: "center",
        }}
      >
        <Eyebrow style={{ marginBottom: 14, justifyContent: "center", display: "inline-flex" }}>
          Find your spot
        </Eyebrow>
        <h1
          style={{
            fontSize: 64,
            lineHeight: 1.02,
            letterSpacing: "-0.035em",
            fontWeight: 500,
            margin: "8px 0 16px",
          }}
        >
          Your Hood. <span style={{ color: "var(--accent)" }}>Your Spot.</span>
        </h1>
        <p
          style={{
            fontSize: 17,
            lineHeight: 1.55,
            color: "var(--slate)",
            margin: "0 auto 32px",
            maxWidth: 580,
          }}
        >
          Verified homes across South Africa's most sought-after neighbourhoods. Pick a suburb,
          set your budget, go.
        </p>
        <HeroSearch />
        <div style={{ marginTop: 20, fontSize: 12, color: "var(--slate)" }}>
          Popular:{" "}
          {popularAreas.map((area, i, arr) => (
            <span key={area.name}>
              <Link
                to={`/browse?location=${encodeURIComponent(area.name)}`}
                style={{ color: "var(--ink)", fontWeight: 500, textDecoration: "none" }}
              >
                {area.name}
              </Link>
              {i < arr.length - 1 ? " · " : null}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Format a count for the trust strip. Uses en-ZA grouping (e.g. "1 247")
 * once numbers cross the thousand mark, but renders the raw value below
 * that so "50" stays "50" rather than padded.
 */
function formatStat(n: number): string {
  return n.toLocaleString("en-ZA");
}

/**
 * Verbose relative-time ("12 minutes ago" / "2 hours ago" / "yesterday").
 * Distinct from Nav's compact "5m / 3h / 2d" format because hero copy
 * reads aloud — we want full words, not abbreviations. Returns an empty
 * string for invalid input so callers can fall back to a placeholder.
 */
function formatAgoVerbose(iso: string | null | undefined): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diffSec = Math.max(0, Math.round((Date.now() - then) / 1000));
  if (diffSec < 60) return "just now";
  const min = Math.round(diffSec / 60);
  if (min < 60) return `${min} ${min === 1 ? "minute" : "minutes"} ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr} ${hr === 1 ? "hour" : "hours"} ago`;
  const day = Math.round(hr / 24);
  if (day === 1) return "yesterday";
  if (day < 7) return `${day} days ago`;
  return new Date(iso).toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
}

/** Format a ZAR amount for the floating card: "R 6,800" — no decimals. */
function formatRand(amount: number | null | undefined): string {
  if (amount == null || Number.isNaN(amount)) return "—";
  return `R ${Math.round(amount).toLocaleString("en-ZA")}`;
}

function Hero() {
  const { isSm, isMd } = useViewport();
  const isMobile = isSm || isMd;
  const session = useSession();
  const api = useMemo(() => createLandingApi(session.client), [session.client]);
  const propertiesApi = useMemo(() => createPropertiesApi(session.client), [session.client]);
  const [stats, setStats] = useState<LandingStats | null>(null);
  const [latestListing, setLatestListing] = useState<PropertySummary | null>(null);

  // Pre-launch the trust strip starts on em-dashes and is replaced as soon
  // as the API responds. Errors leave the placeholders in place — a missed
  // stat strip is preferable to a broken one.
  useEffect(() => {
    let cancelled = false;
    api.stats().then(
      (s) => {
        if (!cancelled) setStats(s);
      },
      () => {
        // Swallow — placeholders already render.
      },
    );
    return () => {
      cancelled = true;
    };
  }, [api]);

  // Most-recent LISTED property — drives both the hero photo (cover image)
  // and the "Just listed" floating proof card (suburb · price · time ago).
  // Both gracefully degrade to placeholders when the catalogue is empty
  // or the fetch fails.
  useEffect(() => {
    let cancelled = false;
    propertiesApi.list({ size: 1, sort: "NEWEST", dir: "DESC" }).then(
      (page) => {
        if (!cancelled) setLatestListing(page.content[0] ?? null);
      },
      () => {},
    );
    return () => {
      cancelled = true;
    };
  }, [propertiesApi]);

  return (
    <section style={{ borderBottom: "1px solid var(--hairline)" }}>
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: isSm ? "48px 20px 40px" : "80px 32px 64px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1.05fr) minmax(0, 1fr)",
          gap: isSm ? 32 : isMd ? 48 : 80,
          alignItems: "center",
        }}
      >
        <div>
          <div
            className="eyebrow"
            style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} />
            For South African landlords
          </div>
          <h1
            style={{
              fontSize: 64,
              lineHeight: 1.02,
              letterSpacing: "-0.035em",
              fontWeight: 500,
              margin: 0,
              marginBottom: 24,
            }}
          >
            List your property.
            <br />
            <span style={{ color: "var(--slate)" }}>Vet your tenant.</span>
            <br />
            Get paid on time.
          </h1>
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.55,
              color: "var(--slate)",
              margin: 0,
              marginBottom: 36,
              maxWidth: 520,
            }}
          >
            Habitat is the calm, professional way to rent out your home — with verified tenants,
            digital leases, and rent collection in one place.
          </p>

          <div style={{ display: "flex", gap: 12, marginBottom: 40 }}>
            <Link to="/wizard">
              <Button variant="primary" size="lg" rightIcon="arrR">
                List a property
              </Button>
            </Link>
            <Link to="/browse">
              <Button variant="secondary" size="lg">
                Browse units
              </Button>
            </Link>
          </div>

          <div style={{ display: "flex", gap: 40, paddingTop: 28, borderTop: "1px solid var(--hairline)" }}>
            <StatTile
              value={stats ? formatStat(stats.activeListings) : "—"}
              label="Active Listings"
              valueTone="accent"
            />
            <StatTile
              value={stats ? formatStat(stats.registeredTenants) : "—"}
              label="Registered Tenants"
              valueTone="accent"
            />
            <StatTile
              value={stats ? formatStat(stats.suburbsCovered) : "—"}
              label="Suburbs Covered"
              valueTone="accent"
            />
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <Photo
            ratio="4/5"
            label="Property cover photo"
            src={latestListing?.coverImageUrl ?? undefined}
            alt={latestListing ? `Cover photo of ${latestListing.title}` : "A Habitat-listed property"}
          />

          {/* Floating proof cards — both live from the API:
              - "This week" tenant momentum (bottom-left) → visualises
                "Vet your tenant" with rolling-7-day registration count.
              - "Just listed" (top-right) → visualises "List your property"
                with the newest LISTED property's suburb · price · age.
              Per the design source (screen-landing.jsx:64-95), they
              protrude beyond the photo on desktop; on small viewports we
              tuck them inside to avoid horizontal overflow. */}
          <div
            className="float-a"
            style={{
              position: "absolute",
              bottom: 32,
              left: isMobile ? 16 : -32,
              padding: 16,
              width: 280,
              maxWidth: "calc(100% - 32px)",
              boxShadow: "var(--shadow-lg)",
              background: "var(--surface)",
              border: "1px solid var(--hairline)",
              borderRadius: "var(--r-md)",
            }}
          >
            <Eyebrow style={{ marginBottom: 6 }}>This week</Eyebrow>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "var(--accent-soft)",
                  color: "var(--accent)",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                <Icon name="users" size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  className="tabular"
                  style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}
                >
                  {stats ? `${formatStat(stats.tenantsLast7Days)} new ${stats.tenantsLast7Days === 1 ? "tenant" : "tenants"}` : "—"}
                </div>
                <div style={{ fontSize: 11, color: "var(--slate)" }}>
                  Joined in the last 7 days
                </div>
              </div>
            </div>
          </div>

          <div
            className="float-b"
            style={{
              position: "absolute",
              top: 24,
              right: isMobile ? 16 : -28,
              padding: 14,
              width: 240,
              maxWidth: "calc(100% - 32px)",
              boxShadow: "var(--shadow-md)",
              background: "var(--surface)",
              border: "1px solid var(--hairline)",
              borderRadius: "var(--r-md)",
            }}
          >
            <Eyebrow style={{ marginBottom: 4 }}>Just listed</Eyebrow>
            <div
              className="tabular"
              style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}
            >
              {latestListing ? formatRand(latestListing.headlinePrice) : "—"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
              <Badge tone="accent">{latestListing?.suburb ?? "Coming soon"}</Badge>
              <span style={{ fontSize: 11, color: "var(--slate)" }}>
                {formatAgoVerbose(latestListing?.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  const session = useSession();
  const api = useMemo(() => createLandingApi(session.client), [session.client]);
  const [cities, setCities] = useState<PopularCity[]>(EDITORIAL_CITIES);

  useEffect(() => {
    let cancelled = false;
    api.cities(7).then(
      (live) => {
        if (!cancelled && live.length > 0) setCities(live);
      },
      () => {
        // Swallow — editorial fallback already renders.
      },
    );
    return () => {
      cancelled = true;
    };
  }, [api]);

  // Render the list twice in the marquee track so the translateX(-50%)
  // loop point is seamless. Keys are suffixed because React doesn't allow
  // duplicate keys among siblings.
  const looped = [...cities, ...cities];

  return (
    <section
      style={{
        borderBottom: "1px solid var(--hairline)",
        background: "var(--surface-2)",
        padding: "20px 0",
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          gap: 32,
        }}
      >
        <Eyebrow style={{ flexShrink: 0 }}>Trusted across</Eyebrow>
        <div className="marquee" style={{ flex: 1, minWidth: 0 }}>
          <div className="marquee__track" style={{ gap: 32 }}>
            {looped.map((c, i) => (
              <Link
                key={`${c.name}-${i}`}
                to={`/browse?location=${encodeURIComponent(c.name)}`}
                style={{
                  fontSize: 13,
                  color: "var(--slate)",
                  fontWeight: 500,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const VALUE_ITEMS: { icon: import("@/components/Icon").IconName; t: string; b: string }[] = [
  { icon: "shield", t: "Vetted, verified tenants", b: "Every applicant is FICA verified, credit checked, and affordability scored before they reach you." },
  { icon: "paper", t: "Digital leases, signed in app", b: "Lease in plain English, signed on phone, automatically filed. No printing, no scanning, no chasing." },
  { icon: "cash", t: "Rent collection on autopilot", b: "Tenants set up debit orders. You see paid / late / pending in one dashboard, with reminders sent for you." },
  { icon: "users", t: "Optional agent network", b: "Hand the keys to a vetted local agent for showings and admin — only pay when they place a tenant." },
];

function ValueGrid() {
  const { isSm, isMd } = useViewport();
  const cols = isSm ? "1fr" : isMd ? "repeat(2, 1fr)" : "repeat(4, 1fr)";
  return (
    <section style={{ borderBottom: "1px solid var(--hairline)" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: isSm ? "56px 20px" : "80px 32px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48 }}>
          <div>
            <Eyebrow style={{ marginBottom: 12 }}>Why landlords choose Habitat</Eyebrow>
            <h2
              style={{
                fontSize: 40,
                letterSpacing: "-0.025em",
                lineHeight: 1.1,
                fontWeight: 500,
                margin: 0,
                maxWidth: 600,
              }}
            >
              Everything between "I want to rent it out" and "money in the bank."
            </h2>
          </div>
          <a
            href="#"
            style={{ fontSize: 14, color: "var(--slate)", display: "flex", alignItems: "center", gap: 6 }}
          >
            See landlord guide <Icon name="arrUR" size={14} />
          </a>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: cols,
            gap: 1,
            background: "var(--hairline)",
            border: "1px solid var(--hairline)",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {VALUE_ITEMS.map((it) => (
            <div key={it.t} style={{ padding: 28, background: "var(--surface)" }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: "var(--accent-soft)",
                  color: "var(--accent)",
                  display: "grid",
                  placeItems: "center",
                  marginBottom: 20,
                }}
              >
                <Icon name={it.icon} size={18} />
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, letterSpacing: "-0.01em" }}>
                {it.t}
              </div>
              <div style={{ fontSize: 13, color: "var(--slate)", lineHeight: 1.55 }}>{it.b}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const { isSm, isMd } = useViewport();
  const isMobile = isSm || isMd;
  const steps = [
    { n: "01", t: "Add your property", b: "Photos, address, rent. About 6 minutes from start to live." },
    { n: "02", t: "Receive applications", b: "We verify, vet, and score. You see only people who can actually afford it." },
    { n: "03", t: "Sign and collect", b: "Digital lease. Automatic rent. Maintenance requests in one inbox." },
  ];
  return (
    <section style={{ borderBottom: "1px solid var(--hairline)", background: "var(--surface-2)" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: isSm ? "56px 20px" : "80px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 2fr", gap: isSm ? 32 : 64 }}>
          <div>
            <Eyebrow style={{ marginBottom: 12 }}>How it works</Eyebrow>
            <h2 style={{ fontSize: 36, letterSpacing: "-0.025em", lineHeight: 1.15, fontWeight: 500, margin: 0 }}>
              Three steps. <br />
              Roughly a week.
            </h2>
          </div>
          <div>
            {steps.map((s, i) => (
              <div
                key={s.n}
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px 1fr auto",
                  gap: 32,
                  padding: "28px 0",
                  borderBottom: i < steps.length - 1 ? "1px solid var(--hairline)" : "none",
                  alignItems: "center",
                }}
              >
                <div className="mono" style={{ fontSize: 14, color: "var(--slate)" }}>
                  {s.n}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 500,
                      letterSpacing: "-0.015em",
                      marginBottom: 6,
                    }}
                  >
                    {s.t}
                  </div>
                  <div style={{ fontSize: 14, color: "var(--slate)", lineHeight: 1.55 }}>{s.b}</div>
                </div>
                <Icon name="arrR" size={18} style={{ color: "var(--slate-2)" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface FeaturedArea {
  name: string;
  count: number;
  priceFrom: string;
}

function FeaturedAreas() {
  const { isSm, isMd } = useViewport();
  const cols = isSm ? "1fr" : isMd ? "repeat(2, 1fr)" : "repeat(4, 1fr)";
  const areas: FeaturedArea[] = [];
  return (
    <section style={{ borderBottom: "1px solid var(--hairline)" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: isSm ? "56px 20px" : "80px 32px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <Eyebrow style={{ marginBottom: 12 }}>Popular this week</Eyebrow>
            <h2 style={{ fontSize: 32, letterSpacing: "-0.02em", lineHeight: 1.1, fontWeight: 500, margin: 0 }}>
              Where tenants are looking
            </h2>
          </div>
          <a
            href="#"
            style={{ fontSize: 14, color: "var(--slate)", display: "flex", alignItems: "center", gap: 6 }}
          >
            View all areas <Icon name="arrUR" size={14} />
          </a>
        </div>
        {areas.length === 0 ? (
          <EmptyState
            icon="pin"
            title="No areas yet"
            description="Popular suburbs will appear here as listings come online."
          />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: cols, gap: 16 }}>
            {areas.map((a) => (
              <AreaCard
                key={a.name}
                name={a.name}
                count={a.count}
                priceFrom={a.priceFrom}
                ratio="3/2"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
