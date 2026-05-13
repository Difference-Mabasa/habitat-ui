import { Link, useParams } from "react-router-dom";
import Nav from "@/components/Nav";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";
import { CATEGORY_LABELS, findArticle } from "./articles";

/**
 * Single help-centre article. The slug comes from the URL (/help/:slug);
 * if it doesn't match an entry in articles.ts we render an EmptyState
 * with a CTA back to the help index.
 */
export default function HelpArticle() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? findArticle(slug) : undefined;

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "48px 24px 96px" }}>
        <div style={{ marginBottom: 28 }}>
          <Link
            to="/help"
            style={{
              fontSize: 13,
              color: "var(--slate)",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            ← Help center
          </Link>
        </div>

        {article ? (
          <article>
            <Eyebrow style={{ marginBottom: 12 }}>{CATEGORY_LABELS[article.category]}</Eyebrow>
            <h1
              className="display"
              style={{ fontSize: 40, lineHeight: 1.1, color: "var(--ink)", margin: "0 0 14px" }}
            >
              {article.title}
            </h1>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.6,
                color: "var(--slate)",
                margin: "0 0 8px",
                maxWidth: 640,
              }}
            >
              {article.summary}
            </p>
            <div style={{ fontSize: 12, color: "var(--slate-2)", marginBottom: 36 }}>
              Last reviewed {article.updatedAt}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {article.sections.map((s) => (
                <section key={s.heading}>
                  <h2
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      color: "var(--ink)",
                      margin: "0 0 10px",
                    }}
                  >
                    {s.heading}
                  </h2>
                  {s.body.split(/\n\n+/).map((para, i) => (
                    <p
                      key={i}
                      style={{
                        fontSize: 15,
                        lineHeight: 1.7,
                        color: "var(--ink-2)",
                        margin: i === 0 ? "0 0 12px" : "0 0 12px",
                      }}
                    >
                      {renderInlineLinks(para)}
                    </p>
                  ))}
                </section>
              ))}
            </div>

            <Card padding={20} style={{ marginTop: 40, background: "var(--surface-2)" }}>
              <div style={{ fontSize: 13, color: "var(--slate)", marginBottom: 12 }}>
                Need a copy for your records?
              </div>
              <Button
                variant="ghost"
                size="sm"
                leftIcon="paper"
                onClick={() => window.print()}
                style={{ padding: 0 }}
              >
                Print this article
              </Button>
            </Card>
          </article>
        ) : (
          <Card padding={36} style={{ background: "var(--surface)" }}>
            <EmptyState
              icon="search"
              title="Article not found"
              description={
                slug ? `We couldn't find a help article matching "${slug}".` : "No article slug provided."
              }
              actions={
                <Link to="/help" style={{ textDecoration: "none" }}>
                  <Button variant="accent" size="sm" rightIcon="arrR">
                    Back to the help center
                  </Button>
                </Link>
              }
            />
          </Card>
        )}
      </div>
    </div>
  );
}

/**
 * Markdown-light link parser — turns "[label](path)" tokens into anchor
 * elements while leaving the surrounding text untouched. Only used by
 * static help-article bodies in {@link HELP_ARTICLES}; we never render
 * user-supplied content through this, so no XSS surface.
 */
function renderInlineLinks(para: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let cursor = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = re.exec(para)) !== null) {
    if (match.index > cursor) {
      out.push(para.slice(cursor, match.index));
    }
    const [, label, href] = match;
    out.push(
      <Link
        key={`l-${key++}`}
        to={href}
        style={{ color: "var(--accent)", fontWeight: 500 }}
      >
        {label}
      </Link>,
    );
    cursor = match.index + match[0].length;
  }
  if (cursor < para.length) {
    out.push(para.slice(cursor));
  }
  return out;
}
