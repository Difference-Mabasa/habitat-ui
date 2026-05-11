import Nav from "@/components/Nav";
import Photo from "@/components/Photo";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import StarRating from "@/components/StarRating";
import RatingDisplay from "@/components/RatingDisplay";
import RatingReviewForm from "./RatingReviewForm";

const SUBRATINGS = [
  { id: "comm", label: "Communication", initial: 5 },
  { id: "maint", label: "Maintenance response", initial: 4 },
  { id: "accuracy", label: "Accuracy of listing", initial: 4 },
  { id: "value", label: "Value for money", initial: 3 },
];

const TAGS = [
  "Quiet",
  "Responsive landlord",
  "Good light",
  "Reliable backup power",
  "Walkable",
  "Safe area",
  "Pet-friendly",
  "Worth the rent",
  "Working fibre",
];

const PAST_REVIEWS = [
  { id: "pr1", rating: 5, quote: 'Lerato — "Best landlord I\'ve had. Direct and fair."' },
  { id: "pr2", rating: 4, quote: 'Mxolisi — "Quick on maintenance. Communication 10/10."' },
];

const INITIAL_BODY =
  "Thandi was easy to reach when the geyser leaked — fixed inside 4 hours. Studio is small but cleverly laid out. Light is amazing in the mornings. Only gripe: rent went up R200 mid-lease which felt steep for a 1-bed. Overall I'd recommend.";

export default function Reviews() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 32px 64px" }}>
        <Eyebrow>Lease ended 30 Apr</Eyebrow>
        <h1
          style={{
            fontSize: 30,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            margin: "8px 0 6px",
          }}
        >
          Leave a review
        </h1>
        <p style={{ fontSize: 14, color: "var(--slate)", margin: "0 0 32px" }}>
          Two-way: your landlord reviews you back. Both reviews unlock at the same time so neither side
          can retaliate.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 360px", gap: 32 }}>
          <Card padding={28}>
            <div
              style={{
                display: "flex",
                gap: 14,
                alignItems: "center",
                marginBottom: 20,
                paddingBottom: 20,
                borderBottom: "1px solid var(--hairline)",
              }}
            >
              <Photo ratio="1" label="" style={{ width: 56, height: 56, borderRadius: 8 }} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>Studio · Melville</div>
                <div style={{ fontSize: 12, color: "var(--slate)" }}>
                  Landlord: Thandi Mokoena · 12 months · ended 30 Apr 2025
                </div>
              </div>
            </div>
            <RatingReviewForm
              subratings={SUBRATINGS}
              tags={TAGS}
              initialOverall={4}
              initialSelected={["Quiet", "Responsive landlord", "Good light", "Safe area", "Working fibre"]}
              initialBody={INITIAL_BODY}
            />
          </Card>

          <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card padding={20}>
              <Eyebrow style={{ marginBottom: 12 }}>How this works</Eyebrow>
              <ol
                style={{
                  margin: 0,
                  paddingLeft: 16,
                  fontSize: 12,
                  color: "var(--slate)",
                  lineHeight: 1.7,
                }}
              >
                <li>You both have 14 days to leave a review.</li>
                <li>Reviews stay hidden until both submit (or 14 days pass).</li>
                <li>You can edit until the unlock moment.</li>
                <li>Landlord reviews on you carry into your tenant score.</li>
              </ol>
            </Card>

            <Card padding={20}>
              <Eyebrow style={{ marginBottom: 12 }}>Thandi's reviews from past tenants</Eyebrow>
              <div style={{ marginBottom: 8 }}>
                <RatingDisplay rating={4.7} count={18} size="lg" />
              </div>
              {PAST_REVIEWS.map((r, i) => (
                <div
                  key={r.id}
                  style={{
                    paddingTop: 12,
                    borderTop: i === 0 ? "none" : "1px solid var(--hairline)",
                    marginTop: i === 0 ? 0 : 12,
                  }}
                >
                  <div style={{ marginBottom: 4 }}>
                    <StarRating value={r.rating} size="sm" />
                  </div>
                  <div style={{ fontSize: 12, color: "var(--slate)", lineHeight: 1.5 }}>
                    {r.quote}
                  </div>
                </div>
              ))}
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
