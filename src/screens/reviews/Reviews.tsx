import Nav from "@/components/Nav";
import Photo from "@/components/Photo";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import EmptyState from "@/components/EmptyState";
import RatingReviewForm from "./RatingReviewForm";

const SUBRATINGS = [
  { id: "comm", label: "Communication", initial: 0 },
  { id: "maint", label: "Maintenance response", initial: 0 },
  { id: "accuracy", label: "Accuracy of listing", initial: 0 },
  { id: "value", label: "Value for money", initial: 0 },
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

interface PastReview {
  id: string;
  rating: number;
  quote: string;
}

const PAST_REVIEWS: PastReview[] = [];

export default function Reviews() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 32px 64px" }}>
        <Eyebrow>Lease ended</Eyebrow>
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
                <div style={{ fontSize: 15, fontWeight: 600 }}>—</div>
                <div style={{ fontSize: 12, color: "var(--slate)" }}>
                  Landlord details will appear here
                </div>
              </div>
            </div>
            <RatingReviewForm
              subratings={SUBRATINGS}
              tags={TAGS}
              initialOverall={0}
              initialSelected={[]}
              initialBody=""
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
              <Eyebrow style={{ marginBottom: 12 }}>Landlord's past reviews</Eyebrow>
              {PAST_REVIEWS.length === 0 ? (
                <EmptyState
                  icon="star"
                  title="No reviews yet"
                  size="sm"
                />
              ) : null}
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
