import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Nav from "@/components/Nav";
import Icon, { type IconName } from "@/components/Icon";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import FormField from "@/components/FormField";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import Chip from "@/components/Chip";
import { useSession } from "@/lib/session";

/**
 * Profile onboarding wizard.
 *
 * Three clickable steps: Identity → Affordability → Preferences. The
 * stepper at the top is a jump-anywhere control; the bottom CTAs walk
 * forward or back one step at a time. "Skip for now" lands the user
 * on /profile with whatever they've filled in still in memory.
 *
 * The active step lives in the URL as ?step=identity|affordability|
 * preferences, so refresh + deep-link from the welcome notification +
 * the back button all behave naturally.
 *
 * State is held locally for now. A future slice adds per-step PATCH
 * against the API; for today the wizard is a self-contained shape
 * that exercises the right UX without a persistence commitment.
 *
 * Improves on backroom-ui's pattern, which has no wizard — backroom
 * exposes the same fields behind a tab-switcher with no progress
 * tracking and a single save-everything button.
 */

type StepId = "identity" | "affordability" | "preferences";

interface StepDef {
  id: StepId;
  label: string;
}

const STEPS: StepDef[] = [
  { id: "identity", label: "Identity" },
  { id: "affordability", label: "Affordability" },
  { id: "preferences", label: "Preferences" },
];

const INTEREST_OPTIONS = [
  "Quiet streets", "Walkable", "Pet-friendly", "Near transport", "Gardens",
  "Family-friendly", "Nightlife", "Coffee shops", "Co-working", "Furnished",
  "Gym access", "Solar / inverter", "Fibre", "Secure parking", "Short lease",
];

const AREA_OPTIONS = [
  "Brixton", "Melville", "Westdene", "Yeoville", "Auckland Park", "Maboneng",
  "Northcliff", "Linden", "Norwood", "Orlando West", "Pimville", "Soweto",
];

const PROPERTY_TYPES = ["Cottage", "Flat", "Studio", "House", "Backroom"];

const BEDROOM_OPTIONS = ["Studio", "1", "2", "3", "4+"];

export default function Onboarding() {
  const session = useSession();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const stepParam = params.get("step") as StepId | null;
  const currentStepId: StepId = isStepId(stepParam) ? stepParam : STEPS[0].id;
  const currentIndex = STEPS.findIndex((s) => s.id === currentStepId);

  const goToStep = (id: StepId) => {
    const next = new URLSearchParams(params);
    next.set("step", id);
    setParams(next, { replace: false });
  };

  const goNext = () => {
    if (currentIndex < STEPS.length - 1) goToStep(STEPS[currentIndex + 1].id);
    else navigate("/profile");
  };
  const goBack = () => {
    if (currentIndex > 0) goToStep(STEPS[currentIndex - 1].id);
  };

  // ── Identity state ─────────────────────────────────────────────────
  const [firstName, setFirstName] = useState(session.user?.firstName ?? "");
  const [surname, setSurname] = useState(session.user?.surname ?? "");
  const [phone, setPhone] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [suburb, setSuburb] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [jobTitle, setJobTitle] = useState("");
  const [employer, setEmployer] = useState("");
  const [education, setEducation] = useState("");

  // Hydrate first/surname if the session loads after this screen mounts.
  useEffect(() => {
    if (session.user?.firstName && !firstName) setFirstName(session.user.firstName);
    if (session.user?.surname && !surname) setSurname(session.user.surname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.user?.firstName, session.user?.surname]);

  // ── Affordability state ────────────────────────────────────────────
  const [affordabilityChoice, setAffordabilityChoice] = useState<string>("connect-bank");

  // ── Preferences state ──────────────────────────────────────────────
  const [bedrooms, setBedrooms] = useState<string>("");
  const [maxRent, setMaxRent] = useState("");
  const [preferredAreas, setPreferredAreas] = useState<string[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [moveInDate, setMoveInDate] = useState("");

  const toggleInterest = (i: string) =>
    setInterests((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  const toggleArea = (a: string) =>
    setPreferredAreas((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  const togglePropertyType = (t: string) =>
    setPropertyTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Nav role="tenant" />

      <SubHeader currentIndex={currentIndex} onJump={goToStep} />

      <div style={{ maxWidth: 880, margin: "0 auto", width: "100%", padding: "32px 24px 96px" }}>
        {currentStepId === "identity" && (
          <IdentityStep
            firstName={firstName} setFirstName={setFirstName}
            surname={surname} setSurname={setSurname}
            phone={phone} setPhone={setPhone}
            addressLine={addressLine} setAddressLine={setAddressLine}
            suburb={suburb} setSuburb={setSuburb}
            city={city} setCity={setCity}
            province={province} setProvince={setProvince}
            postalCode={postalCode} setPostalCode={setPostalCode}
            bio={bio} setBio={setBio}
            interests={interests} toggleInterest={toggleInterest}
            jobTitle={jobTitle} setJobTitle={setJobTitle}
            employer={employer} setEmployer={setEmployer}
            education={education} setEducation={setEducation}
          />
        )}

        {currentStepId === "affordability" && (
          <AffordabilityStep
            choice={affordabilityChoice}
            onChoose={setAffordabilityChoice}
          />
        )}

        {currentStepId === "preferences" && (
          <PreferencesStep
            bedrooms={bedrooms} setBedrooms={setBedrooms}
            maxRent={maxRent} setMaxRent={setMaxRent}
            preferredAreas={preferredAreas} toggleArea={toggleArea}
            propertyTypes={propertyTypes} togglePropertyType={togglePropertyType}
            moveInDate={moveInDate} setMoveInDate={setMoveInDate}
          />
        )}

        <Footer
          isFirst={currentIndex === 0}
          isLast={currentIndex === STEPS.length - 1}
          onBack={goBack}
          onNext={goNext}
        />
      </div>
    </div>
  );
}

function isStepId(s: string | null): s is StepId {
  return s === "identity" || s === "affordability" || s === "preferences";
}

// ── Sub-header (stepper) ─────────────────────────────────────────────

function SubHeader({ currentIndex, onJump }: { currentIndex: number; onJump: (id: StepId) => void }) {
  return (
    <div
      style={{
        padding: "16px 32px",
        borderBottom: "1px solid var(--hairline)",
        background: "var(--surface)",
      }}
    >
      <div
        style={{
          maxWidth: 880,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <Link
          to="/profile"
          style={{ fontSize: 13, color: "var(--slate)", textDecoration: "none", fontWeight: 500 }}
        >
          ← Profile
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {STEPS.map((s, i) => {
            const active = i === currentIndex;
            const done = i < currentIndex;
            return (
              <div key={s.id} style={{ display: "flex", alignItems: "center" }}>
                <button
                  type="button"
                  onClick={() => onJump(s.id)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 4px",
                    background: "transparent",
                    border: 0,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    color: active ? "var(--accent)" : done ? "var(--ink)" : "var(--slate)",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      border: `1.5px solid ${active ? "var(--accent)" : done ? "var(--success)" : "var(--hairline-strong)"}`,
                      background: done
                        ? "var(--success)"
                        : active
                          ? "color-mix(in oklch, var(--accent) 12%, transparent)"
                          : "transparent",
                      color: done ? "var(--paper)" : active ? "var(--accent)" : "var(--slate)",
                      display: "grid",
                      placeItems: "center",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {done ? <Icon name="check" size={12} /> : i + 1}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: active ? 600 : 500 }}>{s.label}</span>
                </button>
                {i < STEPS.length - 1 ? (
                  <span
                    aria-hidden="true"
                    style={{
                      width: 24,
                      height: 1,
                      background: i < currentIndex ? "var(--success)" : "var(--hairline-strong)",
                      margin: "0 8px",
                    }}
                  />
                ) : null}
              </div>
            );
          })}
        </div>

        <Link to="/profile" style={{ textDecoration: "none" }}>
          <Button variant="ghost" size="sm">
            Skip for now
          </Button>
        </Link>
      </div>
    </div>
  );
}

// ── Step 1: Identity ─────────────────────────────────────────────────

interface IdentityStepProps {
  firstName: string; setFirstName: (v: string) => void;
  surname: string; setSurname: (v: string) => void;
  phone: string; setPhone: (v: string) => void;
  addressLine: string; setAddressLine: (v: string) => void;
  suburb: string; setSuburb: (v: string) => void;
  city: string; setCity: (v: string) => void;
  province: string; setProvince: (v: string) => void;
  postalCode: string; setPostalCode: (v: string) => void;
  bio: string; setBio: (v: string) => void;
  interests: string[]; toggleInterest: (v: string) => void;
  jobTitle: string; setJobTitle: (v: string) => void;
  employer: string; setEmployer: (v: string) => void;
  education: string; setEducation: (v: string) => void;
}

function IdentityStep(p: IdentityStepProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <header>
        <Eyebrow style={{ marginBottom: 8 }}>Step 1 · Identity</Eyebrow>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.01em", margin: "0 0 6px" }}>
          Tell us about yourself
        </h1>
        <p style={{ fontSize: 14, color: "var(--slate)", margin: 0, lineHeight: 1.6 }}>
          The basics landlords need to verify you're the right tenant. You can edit any of this
          later in your profile.
        </p>
      </header>

      <Card padding={24}>
        <Eyebrow style={{ marginBottom: 14 }}>Personal details</Eyebrow>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <FormField label="First name" required>
            <Input value={p.firstName} onChange={(e) => p.setFirstName(e.target.value)} />
          </FormField>
          <FormField label="Surname" required>
            <Input value={p.surname} onChange={(e) => p.setSurname(e.target.value)} />
          </FormField>
          <FormField label="Phone" helper="SA mobile — we'll send a one-time code to verify.">
            <Input
              type="tel"
              value={p.phone}
              onChange={(e) => p.setPhone(e.target.value)}
              placeholder="+27 71 000 0000"
            />
          </FormField>
        </div>
      </Card>

      <Card padding={24}>
        <Eyebrow style={{ marginBottom: 14 }}>Current address</Eyebrow>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <FormField label="Street address">
            <Input
              value={p.addressLine}
              onChange={(e) => p.setAddressLine(e.target.value)}
              placeholder="12 Vilakazi Street"
            />
          </FormField>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <FormField label="Suburb">
              <Input value={p.suburb} onChange={(e) => p.setSuburb(e.target.value)} placeholder="Orlando West" />
            </FormField>
            <FormField label="City">
              <Input value={p.city} onChange={(e) => p.setCity(e.target.value)} placeholder="Johannesburg" />
            </FormField>
            <FormField label="Province">
              <Input value={p.province} onChange={(e) => p.setProvince(e.target.value)} placeholder="Gauteng" />
            </FormField>
            <FormField label="Postal code">
              <Input
                value={p.postalCode}
                onChange={(e) => p.setPostalCode(e.target.value)}
                placeholder="1804"
                className="mono"
              />
            </FormField>
          </div>
        </div>
      </Card>

      <Card padding={24}>
        <Eyebrow style={{ marginBottom: 14 }}>About you</Eyebrow>
        <FormField label="Bio" helper="A short intro for landlords. 500 characters max.">
          <Textarea
            value={p.bio}
            onChange={(e) => p.setBio(e.target.value)}
            rows={4}
            maxLength={500}
            placeholder="A few lines about who you are, what you're looking for, and what makes you a great tenant."
          />
        </FormField>

        <div style={{ marginTop: 18 }}>
          <Eyebrow style={{ marginBottom: 10 }}>Interests · {p.interests.length}</Eyebrow>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {INTEREST_OPTIONS.map((i) => (
              <Chip
                key={i}
                active={p.interests.includes(i)}
                onClick={() => p.toggleInterest(i)}
              >
                {i}
              </Chip>
            ))}
          </div>
        </div>
      </Card>

      <Card padding={24}>
        <Eyebrow style={{ marginBottom: 14 }}>Employment</Eyebrow>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <FormField label="Job title">
            <Input value={p.jobTitle} onChange={(e) => p.setJobTitle(e.target.value)} placeholder="Software engineer" />
          </FormField>
          <FormField label="Employer">
            <Input value={p.employer} onChange={(e) => p.setEmployer(e.target.value)} placeholder="Habitat" />
          </FormField>
          <FormField label="Education" helper="Highest qualification.">
            <Input
              value={p.education}
              onChange={(e) => p.setEducation(e.target.value)}
              placeholder="BSc Computer Science, UCT"
            />
          </FormField>
        </div>
      </Card>
    </div>
  );
}

// ── Step 2: Affordability ────────────────────────────────────────────

interface AffordabilityOption {
  id: string;
  icon: IconName;
  title: string;
  body: string;
  recommended?: boolean;
}

const AFFORDABILITY_OPTIONS: AffordabilityOption[] = [
  {
    id: "connect-bank",
    icon: "bolt",
    title: "Connect your bank · 30 seconds",
    body: "Read-only via Stitch. We compute affordability in real time and never store statements.",
    recommended: true,
  },
  {
    id: "payslips",
    icon: "upload",
    title: "Upload 3 months of payslips",
    body: "PDF or image. We extract income via OCR. Takes 2 minutes.",
  },
  {
    id: "statements",
    icon: "doc",
    title: "Upload 3 months of bank statements",
    body: "PDF or stamped statements. Verified within an hour.",
  },
  {
    id: "employer-ref",
    icon: "user",
    title: "Add an employer reference",
    body: "We email your HR contact. Slowest option (3–5 days).",
  },
];

function AffordabilityStep({ choice, onChoose }: { choice: string; onChoose: (id: string) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <header>
        <Eyebrow style={{ marginBottom: 8 }}>Step 2 · Affordability</Eyebrow>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.01em", margin: "0 0 6px" }}>
          Show landlords you can afford the rent
        </h1>
        <p style={{ fontSize: 14, color: "var(--slate)", margin: 0, lineHeight: 1.6 }}>
          Pick whichever works for you. Verified affordability gets you 4× faster landlord
          responses and unlocks instant-apply on most listings.
        </p>
      </header>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {AFFORDABILITY_OPTIONS.map((o) => {
          const selected = choice === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => onChoose(o.id)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: 16,
                border: `1px solid ${selected ? "var(--accent)" : "var(--hairline)"}`,
                background: selected
                  ? "color-mix(in oklch, var(--accent) 4%, var(--surface))"
                  : "var(--surface)",
                borderRadius: 10,
                cursor: "pointer",
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
                fontFamily: "inherit",
                color: "var(--ink)",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: selected ? "var(--accent)" : "var(--surface-3)",
                  color: selected ? "var(--paper)" : "var(--slate)",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                <Icon name={o.icon} size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{o.title}</div>
                  {o.recommended ? <Badge tone="accent">Recommended</Badge> : null}
                </div>
                <div style={{ fontSize: 12, color: "var(--slate)", lineHeight: 1.5 }}>{o.body}</div>
              </div>
              <Icon name="chevR" size={14} style={{ color: "var(--slate)", marginTop: 12 }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Step 3: Preferences ──────────────────────────────────────────────

interface PreferencesStepProps {
  bedrooms: string; setBedrooms: (v: string) => void;
  maxRent: string; setMaxRent: (v: string) => void;
  preferredAreas: string[]; toggleArea: (v: string) => void;
  propertyTypes: string[]; togglePropertyType: (v: string) => void;
  moveInDate: string; setMoveInDate: (v: string) => void;
}

function PreferencesStep(p: PreferencesStepProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <header>
        <Eyebrow style={{ marginBottom: 8 }}>Step 3 · Preferences</Eyebrow>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.01em", margin: "0 0 6px" }}>
          What are you looking for?
        </h1>
        <p style={{ fontSize: 14, color: "var(--slate)", margin: 0, lineHeight: 1.6 }}>
          Tell us roughly what you want — we'll surface listings that match and pre-fill filters
          on the browse screen. You can change these any time.
        </p>
      </header>

      <Card padding={24}>
        <Eyebrow style={{ marginBottom: 14 }}>Bedrooms</Eyebrow>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {BEDROOM_OPTIONS.map((b) => (
            <Chip key={b} active={p.bedrooms === b} onClick={() => p.setBedrooms(b)}>
              {b}
            </Chip>
          ))}
        </div>
      </Card>

      <Card padding={24}>
        <Eyebrow style={{ marginBottom: 14 }}>Property type · {p.propertyTypes.length}</Eyebrow>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {PROPERTY_TYPES.map((t) => (
            <Chip
              key={t}
              active={p.propertyTypes.includes(t)}
              onClick={() => p.togglePropertyType(t)}
            >
              {t}
            </Chip>
          ))}
        </div>
      </Card>

      <Card padding={24}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <FormField label="Max monthly rent (R)" helper="Total rent before utilities.">
            <Input
              type="number"
              value={p.maxRent}
              onChange={(e) => p.setMaxRent(e.target.value)}
              placeholder="6500"
              className="tabular"
            />
          </FormField>
          <FormField label="Move-in date">
            <Input type="date" value={p.moveInDate} onChange={(e) => p.setMoveInDate(e.target.value)} />
          </FormField>
        </div>
      </Card>

      <Card padding={24}>
        <Eyebrow style={{ marginBottom: 14 }}>Preferred areas · {p.preferredAreas.length}</Eyebrow>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {AREA_OPTIONS.map((a) => (
            <Chip key={a} active={p.preferredAreas.includes(a)} onClick={() => p.toggleArea(a)}>
              {a}
            </Chip>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── Footer (back / next) ─────────────────────────────────────────────

function Footer({
  isFirst,
  isLast,
  onBack,
  onNext,
}: {
  isFirst: boolean;
  isLast: boolean;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div
      style={{
        marginTop: 28,
        paddingTop: 20,
        borderTop: "1px solid var(--hairline)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Button variant="ghost" leftIcon="chevL" disabled={isFirst} onClick={onBack}>
        Back
      </Button>
      <Button variant="accent" rightIcon={isLast ? undefined : "arrR"} onClick={onNext}>
        {isLast ? "Finish" : "Continue"}
      </Button>
    </div>
  );
}
