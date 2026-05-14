import { Link, useLocation } from "react-router-dom";
import Nav from "@/components/Nav";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Icon from "@/components/Icon";
import Eyebrow from "@/components/Eyebrow";
import { useViewport } from "@/hooks/useViewport";
import type { ApplicationResponse } from "@/lib/api/applications";
import type { PropertyDetail, UnitDetail } from "@/lib/api/properties";

interface ApplySuccessState {
  application?: ApplicationResponse;
  property?: Pick<PropertyDetail, "id" | "title" | "suburb" | "city">;
  unit?: Pick<UnitDetail, "id" | "title">;
}

/**
 * Landing page after a successful POST /applications. Shows confirmation
 * + next-steps. Receives the freshly-created application via router state
 * so we don't refetch what we already have. Direct navigation (no state)
 * still renders a graceful generic version.
 */
export default function ApplySuccess() {
  const location = useLocation();
  const state = (location.state as ApplySuccessState | null) ?? {};
  const { isSm } = useViewport();

  const { application, property, unit } = state;

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />

      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: isSm ? "48px 16px" : "72px 32px",
          textAlign: "center",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "var(--success-soft)",
            color: "var(--success)",
            display: "grid",
            placeItems: "center",
            margin: "0 auto 24px",
          }}
        >
          <Icon name="check" size={32} />
        </div>

        <Eyebrow style={{ justifyContent: "center", display: "inline-flex", marginBottom: 12 }}>
          Application submitted
        </Eyebrow>
        <h1
          style={{
            fontSize: 36,
            letterSpacing: "-0.025em",
            lineHeight: 1.1,
            fontWeight: 500,
            margin: "0 0 12px",
          }}
        >
          You're in the queue.
        </h1>
        <p
          style={{
            fontSize: 16,
            color: "var(--slate)",
            lineHeight: 1.5,
            margin: "0 auto 32px",
            maxWidth: 480,
          }}
        >
          {unit && property ? (
            <>
              Your application for <strong style={{ color: "var(--ink)" }}>{unit.title}</strong>{" "}
              at <strong style={{ color: "var(--ink)" }}>{property.title}</strong> is with the
              landlord. We'll let you know the moment they respond.
            </>
          ) : (
            <>
              Your application is with the landlord. We'll let you know the moment they respond.
            </>
          )}
        </p>

        <Card padding={20} style={{ textAlign: "left", marginBottom: 32 }}>
          <Eyebrow style={{ marginBottom: 12 }}>What happens next</Eyebrow>
          <Step
            number={1}
            title="Landlord reviews your profile"
            body="They'll see your employment status, message, and preferred move-in date."
          />
          <Step
            number={2}
            title="Documents (if requested)"
            body="If they need supporting documents — payslips, ID, proof of address — we'll let you know and walk you through uploading them."
            divider
          />
          <Step
            number={3}
            title="Decision in your inbox"
            body="Approval, counter-offer, or polite decline — all surface in your Habitat inbox."
            divider
          />
        </Card>

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link to="/my-apps" style={{ textDecoration: "none" }}>
            <Button variant="accent" size="lg" rightIcon="arrR">
              Track my applications
            </Button>
          </Link>
          <Link to="/browse" style={{ textDecoration: "none" }}>
            <Button variant="ghost" size="lg">
              Keep browsing
            </Button>
          </Link>
        </div>

        {application ? (
          <div
            style={{
              marginTop: 32,
              fontSize: 11,
              color: "var(--slate-2)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Reference · {application.id}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Step({
  number,
  title,
  body,
  divider = false,
}: {
  number: number;
  title: string;
  body: string;
  divider?: boolean;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "32px 1fr",
        gap: 14,
        alignItems: "start",
        paddingTop: divider ? 14 : 0,
        marginTop: divider ? 14 : 0,
        borderTop: divider ? "1px solid var(--hairline)" : "none",
      }}
    >
      <span
        className="mono"
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "var(--surface-2)",
          color: "var(--ink)",
          display: "grid",
          placeItems: "center",
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        {number}
      </span>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 13, color: "var(--slate)", lineHeight: 1.5 }}>{body}</div>
      </div>
    </div>
  );
}
