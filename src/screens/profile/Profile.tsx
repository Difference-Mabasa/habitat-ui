import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Nav from "@/components/Nav";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Avatar from "@/components/Avatar";
import Badge, { type BadgeTone } from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import Chip from "@/components/Chip";
import FormField from "@/components/FormField";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import Select from "@/components/Select";
import Toggle from "@/components/Toggle";
import Radio from "@/components/Radio";
import Alert from "@/components/Alert";
import KeyValueRow from "@/components/KeyValueRow";
import ProgressBar from "@/components/ProgressBar";
import SubNav, { type SubNavItem } from "@/components/SubNav";

type SectionId =
  | "profile"
  | "identity"
  | "affordability"
  | "references"
  | "agent"
  | "notifications"
  | "privacy"
  | "sessions"
  | "danger";

const ITEMS: SubNavItem[] = [
  { id: "profile", label: "Personal info", icon: "user" },
  { id: "identity", label: "Identity verification", icon: "shield", badge: { label: "Action needed", tone: "warn" } },
  { id: "affordability", label: "Affordability", icon: "cash" },
  { id: "references", label: "References", icon: "users" },
  { id: "agent", label: "Become an agent", icon: "key" },
  { id: "notifications", label: "Notifications", icon: "bell" },
  { id: "privacy", label: "Privacy & POPIA", icon: "shield" },
  { id: "sessions", label: "Sessions", icon: "clock" },
  { id: "danger", label: "Close account", icon: "trash" },
];

const INTERESTS = [
  "Coffee lover", "Night owl", "Early bird", "Foodie", "Homebody", "Traveller", "Gym rat",
  "Pet owner", "Social butterfly", "Introvert", "Party lover", "Bookworm",
  "Movie buff", "Music lover", "Gamer", "Podcast nerd", "Netflix binger",
  "Hiking", "Photography", "Cooking", "Art & Design", "Cycling", "Running", "Yoga",
  "Dancing", "Gardening", "DIY",
  "Student", "Working professional", "Entrepreneur", "Freelancer",
  "Nature lover", "Sports fanatic", "Fashion", "Spiritual",
];

const VERIFICATIONS: { label: string; ok: boolean }[] = [
  { label: "Email", ok: true },
  { label: "Phone", ok: true },
  { label: "ID & FICA", ok: true },
  { label: "Affordability", ok: false },
];

interface ReferenceRow {
  id: string;
  type: "Previous landlord" | "Employer" | "Character";
  name: string;
  contact: string;
  status: "Verified" | "Awaiting reply" | "Sent" | "Declined";
}

const REFERENCES: ReferenceRow[] = [
  { id: "r1", type: "Previous landlord", name: "Mxolisi Ndlovu", contact: "+27 82 ••• 1102", status: "Verified" },
  { id: "r2", type: "Employer", name: "Discovery Health · HR", contact: "hr@discovery.co.za", status: "Awaiting reply" },
  { id: "r3", type: "Character", name: "Naledi Mokoena", contact: "+27 71 ••• 2230", status: "Sent" },
];

const STATUS_TONE: Record<ReferenceRow["status"], BadgeTone> = {
  Verified: "success",
  "Awaiting reply": "warn",
  Sent: "neutral",
  Declined: "danger",
};

interface SessionRow {
  id: string;
  device: string;
  os: string;
  location: string;
  lastActive: string;
  current?: boolean;
}

const SESSIONS: SessionRow[] = [
  { id: "s1", device: "MacBook Pro · Chrome", os: "macOS 15.4", location: "Joburg, ZA", lastActive: "Now", current: true },
  { id: "s2", device: "iPhone 14 · Safari", os: "iOS 18.2", location: "Joburg, ZA", lastActive: "2 hours ago" },
  { id: "s3", device: "iPad Air · Habitat app", os: "iPadOS 18.1", location: "Cape Town, ZA", lastActive: "3 days ago" },
  { id: "s4", device: "Pixel 7 · Habitat app", os: "Android 15", location: "Joburg, ZA", lastActive: "1 week ago" },
];

type NotifEvent =
  | "Viewing confirmed"
  | "Application update"
  | "Lease ready"
  | "Payment receipt"
  | "Payment due"
  | "New message"
  | "Community activity"
  | "Tips & insights";

const NOTIF_INITIAL: Record<NotifEvent, { push: boolean; email: boolean; sms: boolean }> = {
  "Viewing confirmed": { push: true, email: true, sms: true },
  "Application update": { push: true, email: true, sms: false },
  "Lease ready": { push: true, email: true, sms: true },
  "Payment receipt": { push: true, email: true, sms: false },
  "Payment due": { push: true, email: true, sms: true },
  "New message": { push: true, email: false, sms: false },
  "Community activity": { push: false, email: false, sms: false },
  "Tips & insights": { push: false, email: false, sms: false },
};

interface ConsentRow {
  id: string;
  scope: string;
  granted: boolean;
  ref: string;
  when: string;
}

const CONSENTS: ConsentRow[] = [
  { id: "c1", scope: "Profile data processing (POPIA core)", granted: true, ref: "HB-CONS-04201", when: "12 Mar 2024" },
  { id: "c2", scope: "Credit check (Experian)", granted: true, ref: "HB-CONS-04212", when: "14 Mar 2024" },
  { id: "c3", scope: "TPN rental history reporting", granted: false, ref: "—", when: "—" },
  { id: "c4", scope: "Marketing & product updates", granted: false, ref: "—", when: "—" },
];

const SOWETO_AREAS = ["Orlando West", "Diepkloof", "Pimville", "Mofolo", "Klipspruit"];

export default function Profile() {
  const [section, setSection] = useState<SectionId>("profile");
  const [interests, setInterests] = useState<string[]>(["Coffee lover", "Hiking", "Working professional", "Cooking"]);
  const [bio, setBio] = useState(
    "Senior software engineer at Discovery. Quiet, tidy, no pets, work hybrid in Sandton. Looking for a 12-month lease in Brixton or Westdene.",
  );
  const [notifs, setNotifs] = useState(NOTIF_INITIAL);
  const [feeType, setFeeType] = useState<"FIXED" | "PERCENT_OF_ANNUAL">("PERCENT_OF_ANNUAL");
  const [agentBio, setAgentBio] = useState("");
  const [areas, setAreas] = useState<string[]>(["Orlando West", "Diepkloof"]);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const toggleInterest = (i: string) => {
    setInterests((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : prev.length >= 10 ? prev : [...prev, i],
    );
  };
  const toggleArea = (a: string) =>
    setAreas((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  const setChan = (event: NotifEvent, key: "push" | "email" | "sms", value: boolean) =>
    setNotifs({ ...notifs, [event]: { ...notifs[event], [key]: value } });

  const completion = useMemo(() => {
    // mock completion calc — bio + interests + work + 3 verified items
    let pct = 30; // baseline (name, email, phone)
    if (bio.length > 20) pct += 15;
    if (interests.length >= 3) pct += 10;
    pct += VERIFICATIONS.filter((v) => v.ok).length * 10; // 3 ok → +30
    return Math.min(100, pct);
  }, [bio, interests]);

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 32px 64px" }}>
        <Eyebrow>Account</Eyebrow>
        <h1 style={{ fontSize: 30, fontWeight: 500, letterSpacing: "-0.02em", margin: "8px 0 32px" }}>
          Profile
        </h1>

        <div style={{ display: "flex", alignItems: "flex-start", gap: 32 }}>
          <div
            style={{
              position: "sticky",
              top: 88,
              width: 260,
              flexShrink: 0,
              alignSelf: "flex-start",
              height: "fit-content",
            }}
          >
            <SubNav items={ITEMS} activeId={section} onChange={(id) => setSection(id as SectionId)} />
          </div>

          {/* MAIN CONTENT — switches by section */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
            {section === "profile" && (
              <>
                <Card padding={24}>
                  <Eyebrow style={{ marginBottom: 14 }}>Basic information</Eyebrow>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <FormField label="First name" required>
                      <Input defaultValue="Sipho" />
                    </FormField>
                    <FormField label="Last name" required>
                      <Input defaultValue="Dlamini" />
                    </FormField>
                    <FormField label="Phone" helper="SA mobile · we'll send a one-time code if changed.">
                      <Input defaultValue="+27 82 184 4421" />
                    </FormField>
                    <FormField label="Email" helper="Cannot be changed — contact support to update.">
                      <Input defaultValue="sipho@discovery.co.za" readOnly />
                    </FormField>
                    <FormField label="Date of birth">
                      <Input type="date" defaultValue="1985-05-12" />
                    </FormField>
                    <FormField label="ID number" helper="Used for FICA verification only.">
                      <Input defaultValue="8504010012088" className="mono" />
                    </FormField>
                  </div>
                </Card>

                <Card padding={24}>
                  <Eyebrow style={{ marginBottom: 14 }}>About you</Eyebrow>
                  <FormField
                    label="Bio"
                    helper={`${bio.length} / 500 characters · landlords see this on your application.`}
                  >
                    <Textarea
                      rows={4}
                      value={bio}
                      onChange={(e) => setBio(e.target.value.slice(0, 500))}
                    />
                  </FormField>
                  <div style={{ marginTop: 16 }}>
                    <FormField
                      label="Interests"
                      helper={`${interests.length} / 10 · pick what's true. Landlords use these to gauge fit.`}
                    >
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {INTERESTS.map((i) => (
                          <Chip
                            key={i}
                            active={interests.includes(i)}
                            disabled={!interests.includes(i) && interests.length >= 10}
                            onClick={() => toggleInterest(i)}
                          >
                            {i}
                          </Chip>
                        ))}
                      </div>
                    </FormField>
                  </div>
                </Card>

                <Card padding={24}>
                  <Eyebrow style={{ marginBottom: 14 }}>Work &amp; education</Eyebrow>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <FormField label="Job title">
                      <Input defaultValue="Senior software engineer" />
                    </FormField>
                    <FormField label="Employer / institution">
                      <Input defaultValue="Discovery Health" />
                    </FormField>
                    <FormField label="Employment type">
                      <Select
                        defaultValue="EMPLOYED"
                        options={[
                          { value: "EMPLOYED", label: "Employed" },
                          { value: "SELF_EMPLOYED", label: "Self-employed" },
                          { value: "STUDENT", label: "Student" },
                          { value: "PENSIONER", label: "Pensioner" },
                          { value: "UNEMPLOYED", label: "Unemployed" },
                          { value: "OTHER", label: "Other" },
                        ]}
                      />
                    </FormField>
                    <FormField label="Years in current role">
                      <Input type="number" defaultValue="3" />
                    </FormField>
                    <FormField label="Highest qualification">
                      <Input defaultValue="BSc Computer Science, UCT" />
                    </FormField>
                    <FormField label="Languages spoken">
                      <Input defaultValue="English, Zulu, Sotho" />
                    </FormField>
                  </div>
                </Card>

                <Card padding={24}>
                  <Eyebrow style={{ marginBottom: 14 }}>Current location</Eyebrow>
                  <p style={{ fontSize: 13, color: "var(--slate)", marginBottom: 16 }}>
                    Helps landlords understand your commute. Used only with your consent.
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <FormField label="Street address">
                      <Input defaultValue="42 Marshall St" />
                    </FormField>
                    <FormField label="Suburb">
                      <Input defaultValue="Brixton" />
                    </FormField>
                    <FormField label="City">
                      <Input defaultValue="Johannesburg" />
                    </FormField>
                    <FormField label="Postcode">
                      <Input defaultValue="2092" className="mono" />
                    </FormField>
                  </div>
                </Card>

                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <Button variant="ghost">Discard</Button>
                  <Button variant="accent" leftIcon="check">Save changes</Button>
                </div>
              </>
            )}

            {section === "identity" && (
              <>
                <Card padding={24}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div>
                      <Eyebrow style={{ marginBottom: 4 }}>Status</Eyebrow>
                      <div style={{ fontSize: 16, fontWeight: 600 }}>Verify your identity</div>
                      <p style={{ fontSize: 13, color: "var(--slate)", margin: "4px 0 0", maxWidth: 480 }}>
                        FICA-required for any lease over R 25,000 / month. Verified profiles get 4× more
                        landlord responses.
                      </p>
                    </div>
                    <Badge tone="warn">Action needed</Badge>
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <KeyValueRow label="Document type" value="Not started" divider />
                    <KeyValueRow label="Selfie liveness" value="Not started" divider />
                    <KeyValueRow label="Home affairs match" value="Not started" divider />
                    <KeyValueRow label="Sanctions screen" value="Not started" divider={false} />
                  </div>
                  <div style={{ marginTop: 20, display: "flex", gap: 8 }}>
                    <Link to="/identity-verification" style={{ textDecoration: "none" }}>
                      <Button variant="accent" leftIcon="shield">
                        Start verification (under 60s)
                      </Button>
                    </Link>
                    <Button variant="ghost" leftIcon="chat">
                      Verify via WhatsApp
                    </Button>
                  </div>
                </Card>

                <Card padding={24}>
                  <Eyebrow style={{ marginBottom: 12 }}>Activity</Eyebrow>
                  <div style={{ fontSize: 13, color: "var(--slate)" }}>
                    No verification attempts yet. Submissions are logged here with timestamps for your records.
                  </div>
                </Card>
              </>
            )}

            {section === "affordability" && (
              <>
                <Card padding={24}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div>
                      <Eyebrow style={{ marginBottom: 4 }}>Score</Eyebrow>
                      <div style={{ fontSize: 22, fontWeight: 600 }}>84 / 100</div>
                      <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 2 }}>
                        Computed from payslips · refreshed 14 May 2026
                      </div>
                    </div>
                    <Badge tone="success">Strong</Badge>
                  </div>
                  <ProgressBar value={84} tone="success" />
                </Card>

                <Card padding={24}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <Eyebrow style={{ marginBottom: 4 }}>Bank-linked verification</Eyebrow>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>Connect via Stitch</div>
                      <p style={{ fontSize: 12, color: "var(--slate)", margin: "4px 0 0", maxWidth: 420, lineHeight: 1.5 }}>
                        Read-only. We see balances and inflows. We never store statements or move money.
                      </p>
                    </div>
                    <Toggle defaultChecked={false} />
                  </div>
                </Card>

                <Card padding={24}>
                  <Eyebrow style={{ marginBottom: 14 }}>Manual proof</Eyebrow>
                  <KeyValueRow label="Payslips (3 mo)" value="3 of 3 uploaded · verified" tone="success" divider />
                  <KeyValueRow label="Bank statements (3 mo)" value="Not uploaded" tone="warn" divider />
                  <KeyValueRow label="Employment letter" value="1 file · verified" tone="success" divider={false} />
                  <Button variant="ghost" size="sm" leftIcon="upload" style={{ marginTop: 16 }}>
                    Replace or add documents
                  </Button>
                </Card>

                <Alert tone="info" title="How affordability is calculated">
                  Habitat compares your net monthly income against rent + recurring commitments. The
                  recommended SA threshold is rent ≤ ⅓ of income. You can decline to share this at any time.
                </Alert>
              </>
            )}

            {section === "references" && (
              <>
                <Card padding={0} style={{ overflow: "hidden" }}>
                  <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--hairline)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>References on file</div>
                    <Button variant="accent" size="sm" leftIcon="plus">Request a reference</Button>
                  </div>
                  {REFERENCES.map((r, i) => (
                    <div
                      key={r.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "180px 1fr 1fr auto auto",
                        alignItems: "center",
                        gap: 12,
                        padding: "14px 20px",
                        borderTop: i > 0 ? "1px solid var(--hairline)" : undefined,
                      }}
                    >
                      <Badge tone="neutral">{r.type}</Badge>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{r.name}</div>
                      <div style={{ fontSize: 12, color: "var(--slate)" }} className="mono">{r.contact}</div>
                      <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge>
                      <Button variant="ghost" size="sm" rightIcon="chevR">Open</Button>
                    </div>
                  ))}
                </Card>

                <Alert tone="info" title="How references work">
                  We email your contact a one-tap form. They never see your other info. Landlords see only
                  the verification status — not the actual reference text — unless you opt in.
                </Alert>
              </>
            )}

            {section === "agent" && (
              <>
                <Alert tone="info" title="Become an agent on Habitat">
                  Register as an independent agent. Once saved, you appear in the agent directory and
                  landlords / tenants can contact you directly. Free until you place your first tenant.
                </Alert>

                <Card padding={24}>
                  <Eyebrow style={{ marginBottom: 14 }}>Areas covered</Eyebrow>
                  <p style={{ fontSize: 12, color: "var(--slate)", margin: "0 0 12px" }}>
                    Pick the suburbs you operate in. Tenants filter by area on{" "}
                    <Link to="/agent-browse" style={{ color: "var(--accent)", fontWeight: 600 }}>
                      /agent-browse
                    </Link>.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {SOWETO_AREAS.map((a) => (
                      <Chip
                        key={a}
                        active={areas.includes(a)}
                        leftIcon="pin"
                        onClick={() => toggleArea(a)}
                      >
                        {a}
                      </Chip>
                    ))}
                    <Chip leftIcon="plus">Add area</Chip>
                  </div>
                </Card>

                <Card padding={24}>
                  <Eyebrow style={{ marginBottom: 14 }}>Social &amp; contact</Eyebrow>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <FormField label="WhatsApp business">
                      <Input placeholder="+27 71 000 0000" />
                    </FormField>
                    <FormField label="Instagram handle">
                      <Input placeholder="@yourhandle" />
                    </FormField>
                    <FormField label="TikTok handle">
                      <Input placeholder="@yourhandle" />
                    </FormField>
                    <FormField label="Public email">
                      <Input placeholder="agent@yourname.co.za" />
                    </FormField>
                  </div>
                </Card>

                <Card padding={24}>
                  <Eyebrow style={{ marginBottom: 14 }}>Fee structure</Eyebrow>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                        Tenant fee <span style={{ color: "var(--slate)", fontWeight: 400 }}>· charged when a tenant asks you to find them a place</span>
                      </div>
                      <FormField label="Fixed amount (R)" helper="Leave blank if you don't charge tenants.">
                        <Input type="number" defaultValue="800" />
                      </FormField>
                    </div>

                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                        Landlord fee <span style={{ color: "var(--slate)", fontWeight: 400 }}>· charged when you place a tenant</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                        <Radio
                          name="fee-type"
                          value="FIXED"
                          checked={feeType === "FIXED"}
                          onChange={() => setFeeType("FIXED")}
                          label="Fixed rand amount"
                        />
                        <Radio
                          name="fee-type"
                          value="PERCENT_OF_ANNUAL"
                          checked={feeType === "PERCENT_OF_ANNUAL"}
                          onChange={() => setFeeType("PERCENT_OF_ANNUAL")}
                          label="% of annual rent"
                        />
                      </div>
                      <FormField
                        label={feeType === "PERCENT_OF_ANNUAL" ? "Percentage (e.g. 8.5)" : "Amount (R)"}
                        required
                      >
                        <Input
                          type="number"
                          defaultValue={feeType === "PERCENT_OF_ANNUAL" ? "8" : "2000"}
                        />
                      </FormField>
                    </div>
                  </div>
                </Card>

                <Card padding={24}>
                  <Eyebrow style={{ marginBottom: 14 }}>About you (agent)</Eyebrow>
                  <FormField label="Agent bio" helper={`${agentBio.length} / 2000 characters.`}>
                    <Textarea
                      rows={4}
                      value={agentBio}
                      onChange={(e) => setAgentBio(e.target.value.slice(0, 2000))}
                      placeholder="Describe your experience, the areas you know best, your approach to finding tenants…"
                    />
                  </FormField>
                </Card>

                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <Button variant="ghost">Preview public profile</Button>
                  <Button variant="accent" leftIcon="check">Save agent profile</Button>
                </div>
              </>
            )}

            {section === "notifications" && (
              <>
                <Card padding={24}>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Notification channels</div>
                  <p style={{ fontSize: 13, color: "var(--slate)", margin: "0 0 16px" }}>
                    Pick where Habitat reaches you for each event.
                  </p>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: "var(--surface-2)" }}>
                        {["Event", "Push", "Email", "SMS"].map((h) => (
                          <th
                            key={h}
                            style={{
                              padding: "10px 14px",
                              textAlign: "left",
                              fontSize: 11,
                              fontWeight: 700,
                              letterSpacing: "0.14em",
                              color: "var(--slate)",
                              textTransform: "uppercase",
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(Object.keys(notifs) as NotifEvent[]).map((row) => (
                        <tr key={row} style={{ borderTop: "1px solid var(--hairline)" }}>
                          <td style={{ padding: "12px 14px", fontWeight: 500 }}>{row}</td>
                          <td style={{ padding: "12px 14px" }}>
                            <Toggle checked={notifs[row].push} onChange={(e) => setChan(row, "push", e.target.checked)} />
                          </td>
                          <td style={{ padding: "12px 14px" }}>
                            <Toggle checked={notifs[row].email} onChange={(e) => setChan(row, "email", e.target.checked)} />
                          </td>
                          <td style={{ padding: "12px 14px" }}>
                            <Toggle checked={notifs[row].sms} onChange={(e) => setChan(row, "sms", e.target.checked)} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>

                <Card padding={24}>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Quiet hours</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <FormField label="From">
                      <Input defaultValue="21:00" className="mono" />
                    </FormField>
                    <FormField label="Until">
                      <Input defaultValue="07:00" className="mono" />
                    </FormField>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <Toggle
                      label="Allow urgent only during quiet hours"
                      helper="Lease offers, late rent, and security alerts still come through."
                      defaultChecked
                    />
                  </div>
                </Card>
              </>
            )}

            {section === "privacy" && (
              <>
                <Card padding={0} style={{ overflow: "hidden" }}>
                  <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--hairline)", fontSize: 14, fontWeight: 600 }}>
                    Active consents
                  </div>
                  {CONSENTS.map((c, i) => (
                    <div
                      key={c.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 160px 100px auto",
                        alignItems: "center",
                        gap: 12,
                        padding: "14px 20px",
                        borderTop: i > 0 ? "1px solid var(--hairline)" : undefined,
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{c.scope}</div>
                      <div className="mono" style={{ fontSize: 11, color: "var(--slate)" }}>{c.ref}</div>
                      <div style={{ fontSize: 12, color: "var(--slate)" }}>{c.when}</div>
                      <Toggle defaultChecked={c.granted} />
                    </div>
                  ))}
                </Card>

                <Card padding={24}>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Your POPIA rights</div>
                  <p style={{ fontSize: 13, color: "var(--slate)", margin: "0 0 14px", lineHeight: 1.55 }}>
                    Under the Protection of Personal Information Act you can request a copy of everything
                    Habitat stores about you, ask us to correct anything, or revoke consent at any time.
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Button variant="secondary" leftIcon="download">Download my data (.zip)</Button>
                    <Button variant="ghost" leftIcon="edit">Request a correction</Button>
                    <Button variant="ghost" leftIcon="chat">Contact our Information Officer</Button>
                  </div>
                </Card>

                <Alert tone="info" title="Data deletion">
                  Closing your account permanently removes your profile, references, and verification
                  records. Lease + payment records are retained for 5 years per SARS rules.
                </Alert>
              </>
            )}

            {section === "sessions" && (
              <Card padding={0} style={{ overflow: "hidden" }}>
                <div
                  style={{
                    padding: "16px 20px",
                    borderBottom: "1px solid var(--hairline)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Active sessions · {SESSIONS.length}</div>
                  <Button variant="ghost" size="sm" leftIcon="logout">Sign out everywhere else</Button>
                </div>
                {SESSIONS.map((s, i) => (
                  <div
                    key={s.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto 1fr 1fr 140px auto",
                      alignItems: "center",
                      gap: 16,
                      padding: "14px 20px",
                      borderTop: i > 0 ? "1px solid var(--hairline)" : undefined,
                    }}
                  >
                    <Icon
                      name={s.device.toLowerCase().includes("iphone") || s.device.toLowerCase().includes("pixel") ? "user" : "grid"}
                      size={16}
                      style={{ color: "var(--slate)" }}
                    />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{s.device}</div>
                      <div style={{ fontSize: 11, color: "var(--slate)" }}>{s.os}</div>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--slate)" }}>
                      <Icon name="pin" size={11} /> {s.location}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--slate)" }}>{s.lastActive}</div>
                    {s.current ? (
                      <Badge tone="success">This device</Badge>
                    ) : (
                      <Button variant="ghost" size="sm">Sign out</Button>
                    )}
                  </div>
                ))}
              </Card>
            )}

            {section === "danger" && (
              <>
                <Alert tone="danger" title="These actions are permanent">
                  Closing your account is irreversible. Habitat can't recover your profile, references, or
                  verification once deleted.
                </Alert>

                <Card padding={24}>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Pause notifications</div>
                  <p style={{ fontSize: 13, color: "var(--slate)", marginBottom: 12 }}>
                    Stops every push / SMS / email for 30 days. Your account stays active.
                  </p>
                  <Button variant="secondary">Pause for 30 days</Button>
                </Card>

                <Card padding={24}>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Hide profile from landlords</div>
                  <p style={{ fontSize: 13, color: "var(--slate)", marginBottom: 12 }}>
                    Existing applications stay open; landlords just can't browse to your profile.
                  </p>
                  <Toggle label="Hide from search" />
                </Card>

                <Card padding={24} style={{ borderColor: "var(--danger)" }}>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: "var(--danger)" }}>
                    Close my account
                  </div>
                  <p style={{ fontSize: 13, color: "var(--slate)", marginBottom: 14 }}>
                    Removes your profile, references, saved searches, and avatar. Lease + payment history
                    is retained for 5 years per SARS rules, then deleted.
                  </p>
                  {!deleteOpen ? (
                    <Button variant="ghost" leftIcon="trash" style={{ color: "var(--danger)" }} onClick={() => setDeleteOpen(true)}>
                      Close account…
                    </Button>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <FormField label="Type DELETE to confirm">
                        <Input placeholder="DELETE" className="mono" />
                      </FormField>
                      <div style={{ display: "flex", gap: 8 }}>
                        <Button variant="ghost" onClick={() => setDeleteOpen(false)}>Cancel</Button>
                        <Button variant="ghost" leftIcon="trash" style={{ color: "var(--danger)" }}>
                          Yes — close my account
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              </>
            )}
          </div>

          {/* RIGHT RAIL — sticky profile sidebar */}
          <aside
            style={{
              position: "sticky",
              top: 88,
              width: 280,
              flexShrink: 0,
              alignSelf: "flex-start",
              height: "fit-content",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <Card padding={20} style={{ textAlign: "center" }}>
              <Avatar
                name="Sipho Dlamini"
                size="lg"
                tone="neutral"
                style={{ width: 88, height: 88, fontSize: 28, margin: "0 auto 12px" }}
              />
              <Button variant="ghost" size="sm" leftIcon="upload">Change photo</Button>
              <div style={{ fontSize: 16, fontWeight: 600, marginTop: 12 }}>Sipho Dlamini</div>
              <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 2 }}>
                Tenant · sipho@discovery.co.za
              </div>

              <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--hairline)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                  <span style={{ color: "var(--slate)" }}>Profile completion</span>
                  <span className="tabular" style={{ fontWeight: 600 }}>{completion}%</span>
                </div>
                <ProgressBar value={completion} tone={completion >= 80 ? "success" : "accent"} />
              </div>
            </Card>

            <Card padding={20}>
              <Eyebrow style={{ marginBottom: 12 }}>Verification</Eyebrow>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {VERIFICATIONS.map((v) => (
                  <div
                    key={v.label}
                    style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}
                  >
                    <Icon
                      name={v.ok ? "check" : "clock"}
                      size={13}
                      style={{ color: v.ok ? "var(--success)" : "var(--warn)" }}
                    />
                    <span style={{ flex: 1 }}>{v.label}</span>
                    <span className="mono" style={{ fontSize: 10, color: "var(--slate)" }}>
                      {v.ok ? "OK" : "TODO"}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {interests.length > 0 ? (
              <Card padding={20}>
                <Eyebrow style={{ marginBottom: 12 }}>Interests · {interests.length}</Eyebrow>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {interests.map((i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: 11,
                        padding: "3px 8px",
                        background: "var(--surface-2)",
                        borderRadius: 999,
                        color: "var(--slate)",
                      }}
                    >
                      {i}
                    </span>
                  ))}
                </div>
              </Card>
            ) : null}
          </aside>
        </div>
      </div>
    </div>
  );
}
