import { Link } from "react-router-dom";
import Nav from "@/components/Nav";
import Icon, { type IconName } from "@/components/Icon";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Input from "@/components/Input";
import { HELP_ARTICLES } from "./articles";

interface Category {
  icon: IconName;
  name: string;
  count: number;
}

const CATEGORIES: Category[] = [
  { icon: "home", name: "Listings", count: 24 },
  { icon: "doc", name: "Applications", count: 18 },
  { icon: "key", name: "Leases & deposits", count: 12 },
  { icon: "cash", name: "Payments & payouts", count: 9 },
  { icon: "shield", name: "Safety & disputes", count: 14 },
  { icon: "user", name: "Account & profile", count: 11 },
];

/** Articles surfaced as quick links on the help index. */
const FEATURED_SLUGS = ["terms-of-service", "popia-notice"] as const;

export default function Help() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />

      {/* Search hero */}
      <div style={{ background: "var(--ink)", color: "var(--paper)", padding: "56px 32px 80px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <Eyebrow style={{ color: "var(--accent)" }}>Help center</Eyebrow>
          <h1
            className="display"
            style={{ fontSize: 64, color: "var(--paper)", margin: "8px 0 24px" }}
          >
            HOW CAN WE HELP?
          </h1>
          <div
            style={{
              background: "var(--paper)",
              borderRadius: 12,
              padding: 6,
              display: "flex",
              alignItems: "center",
              gap: 4,
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <div style={{ paddingLeft: 14, color: "var(--slate)" }}>
              <Icon name="search" size={20} />
            </div>
            <Input
              placeholder="Search articles, e.g. 'deposit return'"
              style={{
                flex: 1,
                border: 0,
                padding: "14px 12px",
                fontSize: 15,
                background: "transparent",
                height: "auto",
              }}
            />
            <Button variant="accent">Search</Button>
          </div>
          <div style={{ marginTop: 16, fontSize: 13, color: "rgba(247,239,226,0.6)" }}>
            Popular: refund timeline · POPIA · safety tips · WhatsApp support
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1100,
          margin: "-48px auto 0",
          padding: "0 32px 64px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Categories */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {CATEGORIES.map((c) => (
            <Card
              key={c.name}
              padding={22}
              interactive
              style={{ display: "flex", alignItems: "center", gap: 16 }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "var(--accent-soft)",
                  color: "var(--accent)",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Icon name={c.icon} size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{c.name}</div>
                <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 2 }}>
                  {c.count} articles
                </div>
              </div>
              <Icon name="chevR" size={16} style={{ color: "var(--slate)" }} />
            </Card>
          ))}
        </div>

        <div style={{ marginTop: 48, display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 28 }}>
          {/* Featured articles */}
          <div>
            <div className="display" style={{ fontSize: 28, marginBottom: 16 }}>
              FEATURED ARTICLES
            </div>
            <Card padding={0} style={{ overflow: "hidden" }}>
              {FEATURED_SLUGS.map((slug, i) => {
                const article = HELP_ARTICLES.find((a) => a.slug === slug);
                if (!article) return null;
                return (
                  <Link
                    key={article.slug}
                    to={`/help/${article.slug}`}
                    style={{
                      padding: "18px 22px",
                      borderTop: i ? "1px solid var(--hairline)" : "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      textDecoration: "none",
                      color: "var(--ink)",
                    }}
                  >
                    <span style={{ flex: 1 }}>
                      <span style={{ fontSize: 14, fontWeight: 500, display: "block" }}>
                        {article.title}
                      </span>
                      <span style={{ fontSize: 12, color: "var(--slate)", marginTop: 4, display: "block" }}>
                        {article.summary}
                      </span>
                    </span>
                    <Icon name="chevR" size={16} style={{ color: "var(--slate)", marginLeft: 16 }} />
                  </Link>
                );
              })}
            </Card>
          </div>

          {/* Contact */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Card padding={22}>
              <div className="display" style={{ fontSize: 22 }}>
                STILL STUCK?
              </div>
              <p style={{ fontSize: 13, color: "var(--slate)", margin: "8px 0 16px" }}>
                We typically reply within 2 hours, 7am–9pm.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Button
                  variant="accent"
                  style={{ justifyContent: "space-between", width: "100%", height: 48 }}
                  leftIcon="chat"
                >
                  <span style={{ flex: 1, textAlign: "left", marginLeft: 4 }}>WhatsApp us</span>
                  <span className="mono" style={{ fontSize: 11, opacity: 0.85 }}>
                    +27 61 822 9100
                  </span>
                </Button>
                <Button
                  variant="secondary"
                  leftIcon="inbox"
                  rightIcon="arrR"
                  style={{ justifyContent: "space-between", width: "100%", height: 48 }}
                >
                  <span style={{ flex: 1, textAlign: "left", marginLeft: 4 }}>Open a ticket</span>
                </Button>
              </div>
            </Card>
            <Card padding={22} style={{ background: "var(--surface-2)", borderColor: "transparent" }}>
              <Icon name="shield" size={18} style={{ color: "var(--accent)" }} />
              <div style={{ fontWeight: 600, marginTop: 8 }}>Dispute or fraud?</div>
              <p style={{ fontSize: 13, color: "var(--slate)", marginTop: 4 }}>
                If you suspect a scam or want to dispute a deposit, open a priority case.
              </p>
              <Button variant="ghost" size="sm" rightIcon="arrR" style={{ padding: 0, marginTop: 10 }}>
                Open priority case
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
