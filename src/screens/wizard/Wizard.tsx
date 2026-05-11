import { useState } from "react";
import Nav from "@/components/Nav";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Photo from "@/components/Photo";
import Badge from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import Stepper from "@/components/Stepper";

const STEPS = [
  { label: "Type & address" },
  { label: "Units & rent" },
  { label: "Photos" },
  { label: "Amenities & rules" },
  { label: "Review & publish" },
];

const PHOTOS = [
  { label: "cover · facade.jpg", cover: true },
  { label: "kitchen.jpg" },
  { label: "bedroom.jpg" },
  { label: "bath.jpg" },
  { label: "garden.jpg" },
];

export default function Wizard() {
  const [step, setStep] = useState(2);

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="landlord" />

      {/* Progress strip */}
      <div style={{ borderBottom: "1px solid var(--hairline)", background: "var(--surface)" }}>
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "20px 32px",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <Eyebrow>List a property</Eyebrow>
          <div style={{ flex: 1 }}>
            <Stepper
              orientation="horizontal"
              currentStep={step}
              steps={STEPS}
              onStepClick={(i) => i <= step && setStep(i)}
            />
          </div>
          <Button variant="ghost" size="sm">Save & exit</Button>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "48px 32px",
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) 360px",
          gap: 64,
        }}
      >
        <main>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 500,
              letterSpacing: "-0.025em",
              margin: "0 0 8px",
            }}
          >
            Add your photos
          </h1>
          <p style={{ fontSize: 15, color: "var(--slate)", margin: "0 0 32px" }}>
            6 minimum. The first photo is your cover — pick one that shows the unit clearly in daylight.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
            {PHOTOS.map((p) => (
              <div key={p.label} style={{ position: "relative" }}>
                <Photo ratio="4/3" label={p.label} style={{ borderRadius: 8 }} />
                {p.cover ? (
                  <span style={{ position: "absolute", top: 8, left: 8 }}>
                    <Badge tone="accent">Cover</Badge>
                  </span>
                ) : null}
                <button
                  type="button"
                  className="btn btn--icon btn--sm btn--secondary"
                  aria-label="Remove photo"
                  style={{ position: "absolute", top: 8, right: 8, background: "var(--surface)" }}
                >
                  <Icon name="trash" size={12} />
                </button>
              </div>
            ))}
            <button
              type="button"
              style={{
                aspectRatio: "4/3",
                border: "1.5px dashed var(--hairline-strong)",
                borderRadius: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                color: "var(--slate)",
                cursor: "pointer",
                background: "var(--surface-2)",
                fontFamily: "inherit",
              }}
            >
              <Icon name="upload" size={18} />
              <span style={{ fontSize: 12, fontWeight: 500 }}>Add photo</span>
            </button>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: 24,
              borderTop: "1px solid var(--hairline)",
            }}
          >
            <Button variant="ghost" leftIcon="chevL" onClick={() => setStep(Math.max(0, step - 1))}>
              Back
            </Button>
            <div style={{ display: "flex", gap: 8 }}>
              <Button variant="secondary">Save draft</Button>
              <Button
                variant="accent"
                rightIcon="arrR"
                onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}
              >
                Continue
              </Button>
            </div>
          </div>
        </main>

        <aside style={{ position: "sticky", top: 24, alignSelf: "start", display: "flex", flexDirection: "column", gap: 16 }}>
          <Card padding={20}>
            <Eyebrow style={{ marginBottom: 12 }}>Listing preview</Eyebrow>
            <Photo ratio="16/10" label="cover.jpg" style={{ borderRadius: 8, marginBottom: 12 }} />
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Sunlit Property · Caroline</div>
            <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 12 }}>
              Brixton, Johannesburg
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                fontSize: 12,
                color: "var(--slate)",
                paddingTop: 12,
                borderTop: "1px solid var(--hairline)",
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <Icon name="bed" size={12} /> 1
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <Icon name="bath" size={12} /> 1
              </span>
              <span style={{ marginLeft: "auto" }} className="tabular">
                R 4,400/mo
              </span>
            </div>
          </Card>
          <Card padding={16} style={{ background: "var(--surface-2)" }}>
            <Eyebrow style={{ marginBottom: 8, color: "var(--accent)" }}>Tip</Eyebrow>
            <div style={{ fontSize: 12, color: "var(--slate)", lineHeight: 1.5 }}>
              Listings with 6+ daylight photos get 3.4× more applications. Add a wide shot of the bathroom — it's
              the photo most tenants check.
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
