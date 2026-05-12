import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Button from "@/components/Button";
import IconButton from "@/components/IconButton";
import Chip from "@/components/Chip";
import Badge from "@/components/Badge";
import Avatar from "@/components/Avatar";
import Photo from "@/components/Photo";
import Hairline from "@/components/Hairline";
import PriceDisplay from "@/components/PriceDisplay";
import StarRating from "@/components/StarRating";
import ProgressBar from "@/components/ProgressBar";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import Select from "@/components/Select";
import Checkbox from "@/components/Checkbox";
import Radio from "@/components/Radio";
import Toggle from "@/components/Toggle";
import FormField from "@/components/FormField";
import KeyValueRow from "@/components/KeyValueRow";
import Stepper from "@/components/Stepper";
import Breadcrumbs from "@/components/Breadcrumbs";
import InlineLink from "@/components/InlineLink";
import Tabs from "@/components/Tabs";
import PageHeader from "@/components/PageHeader";
import SectionHeader from "@/components/SectionHeader";
import EmptyState from "@/components/EmptyState";
import Alert from "@/components/Alert";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import Modal from "@/components/Modal";
import ConfirmDialog from "@/components/ConfirmDialog";
import BriefCard, { type BriefCardData } from "@/components/BriefCard";
import { toast } from "@/lib/toast";

const BRIEF_OPEN: BriefCardData = {
  id: "brief-open",
  tenant: "Sipho Dlamini",
  tenantInit: "SD",
  budgetMin: 3000,
  budgetMax: 4200,
  areas: ["Orlando West", "Diepkloof"],
  moveIn: "by 1 Jun",
  status: "OPEN",
  body: "Working professional. Need a backroom or bachelor flat with own entrance and prepaid electricity. Quiet area preferred.",
  posted: "18m",
  proposals: 2,
};

const BRIEF_MATCHED: BriefCardData = {
  id: "brief-matched",
  tenant: "Aisha Mahlangu",
  tenantInit: "AM",
  budgetMin: 6500,
  budgetMax: 9000,
  areas: ["Maboneng", "Newtown"],
  moveIn: "ASAP",
  status: "MATCHED",
  body: "Matched with Loft at Maboneng — keeping brief open as backup until lease is signed.",
  posted: "Yesterday",
  proposals: 6,
};

export default function ComponentGallery() {
  const [tab, setTab] = useState("all");
  const [seg, setSeg] = useState("list");
  const [stars, setStars] = useState(3);
  const [toggle, setToggle] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [check, setCheck] = useState(true);
  const [radio, setRadio] = useState("yes");
  const [text, setText] = useState("");

  return (
    <main style={{ minHeight: "100vh", background: "var(--paper)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 32px" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <Link to="/dev" style={{ display: "inline-flex" }}>
            <Logo size={20} />
          </Link>
          <Eyebrow>Tier A + Tier B primitives</Eyebrow>
        </header>

        <PageHeader
          eyebrow="Phase 1"
          title="Component gallery"
          subtitle="Every foundation and layout primitive in every variant. If you're building a screen and you can't see your pattern here, check component-audit.md before writing new code."
          actions={
            <>
              <Button variant="ghost" leftIcon="check" onClick={() => toast.success("Saved!")}>
                Toast success
              </Button>
              <Button variant="ghost" leftIcon="x" onClick={() => toast.error("Something broke.")}>
                Toast error
              </Button>
            </>
          }
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <Section title="Buttons">
            <Row>
              <Button variant="primary">Primary</Button>
              <Button variant="accent">Accent</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
            </Row>
            <Row>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button leftIcon="plus">With left icon</Button>
              <Button rightIcon="arrR">With right icon</Button>
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
            </Row>
            <Row>
              <IconButton icon="bell" label="Notifications" badge={5} />
              <IconButton icon="chat" label="Inbox" badge={3} variant="secondary" />
              <IconButton icon="heart" label="Save" />
              <IconButton icon="settings" label="Settings" size="sm" />
            </Row>
          </Section>

          <Section title="Chips, badges, avatars">
            <Row>
              <Chip>All</Chip>
              <Chip active>Active</Chip>
              <Chip leftIcon="cash">Price</Chip>
              <Chip count={3}>Unread</Chip>
            </Row>
            <Row>
              <Badge>Neutral</Badge>
              <Badge tone="success">Success</Badge>
              <Badge tone="warn">Warn</Badge>
              <Badge tone="danger">Danger</Badge>
              <Badge tone="accent" leftIcon="sparkle">
                Accent
              </Badge>
            </Row>
            <Row>
              <Avatar name="Thandi Mokoena" size="sm" />
              <Avatar name="Sipho Dlamini" size="md" />
              <Avatar name="Naledi Khumalo" size="lg" tone="accent" />
              <Avatar name="Westdene Tenants" size="md" tone="accent" shape="square" />
            </Row>
          </Section>

          <Section title="Cards & photos">
            <Row>
              <Card padding={16} style={{ width: 200 }}>
                Plain card
              </Card>
              <Card padding={16} interactive style={{ width: 200 }}>
                Interactive card
              </Card>
            </Row>
            <Row>
              <Photo label="16/10" ratio="16/10" style={{ width: 240 }} />
              <Photo label="1/1" ratio="1/1" style={{ width: 120 }} />
            </Row>
          </Section>

          <Section title="Price, rating, progress">
            <Row>
              <PriceDisplay amount={6800} size="sm" />
              <PriceDisplay amount={6800} size="md" />
              <PriceDisplay amount={6800} size="lg" />
              <PriceDisplay amount={6800} size="xl" tone="accent" />
            </Row>
            <Row>
              <StarRating value={3.5} />
              <StarRating value={4} size="lg" />
              <StarRating value={stars} interactive onChange={setStars} />
            </Row>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 360 }}>
              <ProgressBar value={20} tone="warn" />
              <ProgressBar value={65} tone="accent" />
              <ProgressBar value={92} tone="success" height="md" />
            </div>
          </Section>

          <Section title="Form atoms">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 720 }}>
              <FormField label="Email" required helper="We use this for password resets.">
                {({ id, describedBy, invalid }) => (
                  <Input
                    id={id}
                    type="email"
                    placeholder="you@habitat.co.za"
                    aria-describedby={describedBy}
                    invalid={invalid}
                  />
                )}
              </FormField>
              <FormField label="With error" error="Required field">
                {({ id, describedBy, invalid }) => (
                  <Input id={id} aria-describedby={describedBy} invalid={invalid} />
                )}
              </FormField>
              <FormField label="Search">
                <Input leftIcon="search" placeholder="Search anywhere…" />
              </FormField>
              <FormField label="Province">
                <Select
                  placeholder="Choose…"
                  defaultValue=""
                  options={[
                    { value: "gp", label: "Gauteng" },
                    { value: "wc", label: "Western Cape" },
                    { value: "kzn", label: "KwaZulu-Natal" },
                  ]}
                />
              </FormField>
              <FormField label="Notes">
                <Textarea
                  placeholder="Anything we should know?"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </FormField>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Checkbox
                  label="I agree to the lease terms"
                  checked={check}
                  onChange={(e) => setCheck(e.target.checked)}
                />
                <Radio
                  name="pets"
                  value="yes"
                  label="Allow pets"
                  checked={radio === "yes"}
                  onChange={() => setRadio("yes")}
                />
                <Radio
                  name="pets"
                  value="no"
                  label="No pets"
                  checked={radio === "no"}
                  onChange={() => setRadio("no")}
                />
                <Toggle
                  label="Send me weekly alerts"
                  checked={toggle}
                  onChange={(e) => setToggle(e.target.checked)}
                />
              </div>
            </div>
          </Section>

          <Section title="Display composites">
            <Card padding={20} style={{ maxWidth: 420 }}>
              <Eyebrow style={{ marginBottom: 8 }}>Lease summary</Eyebrow>
              <KeyValueRow label="Monthly rent" value="R 6,800" />
              <KeyValueRow label="Deposit" value="R 13,600" divider />
              <KeyValueRow label="Term" value="12 months" divider />
              <KeyValueRow label="Affordability" value="28%" tone="success" divider />
            </Card>
            <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 720 }}>
              <Stepper
                orientation="horizontal"
                currentStep={1}
                steps={[
                  { label: "About you" },
                  { label: "Income" },
                  { label: "Documents" },
                  { label: "Review" },
                ]}
              />
              <div style={{ display: "flex", gap: 32 }}>
                <Stepper
                  orientation="vertical"
                  currentStep={2}
                  steps={[
                    { label: "ID & details", detail: "Verified" },
                    { label: "Bank statements", detail: "Uploaded" },
                    { label: "Affordability", detail: "Reviewing" },
                    { label: "Done", detail: "Pending" },
                  ]}
                />
              </div>
              <Breadcrumbs
                items={[
                  { label: "Browse", href: "/browse" },
                  { label: "Johannesburg", href: "/browse" },
                  { label: "Brixton", href: "/browse" },
                  { label: "2-Bed Cottage" },
                ]}
              />
              <Row>
                <InlineLink to="/property" icon="chevR">
                  See unit
                </InlineLink>
                <InlineLink href="#" icon="arrUR" tone="accent">
                  Landlord guide
                </InlineLink>
                <InlineLink onClick={() => toast.info("Clicked!")} icon="info" iconPosition="left">
                  Why we ask
                </InlineLink>
              </Row>
              <Tabs
                value={tab}
                onChange={setTab}
                tabs={[
                  { id: "all", label: "All", count: 12 },
                  { id: "active", label: "Active", count: 4 },
                  { id: "drafts", label: "Drafts", count: 2 },
                ]}
              />
              <Tabs
                variant="segmented"
                value={seg}
                onChange={setSeg}
                tabs={[
                  { id: "list", label: "List" },
                  { id: "split", label: "Split" },
                  { id: "map", label: "Map" },
                ]}
              />
              <Tabs
                variant="underline"
                value={tab}
                onChange={setTab}
                tabs={[
                  { id: "all", label: "All", count: 12 },
                  { id: "active", label: "Active", count: 4 },
                  { id: "drafts", label: "Drafts", count: 2 },
                ]}
              />
            </div>
          </Section>

          <Section title="Page chrome">
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <SectionHeader
                eyebrow="Section"
                title="Available units"
                subtitle="3 of 5 currently listed"
                actions={<Button variant="ghost" rightIcon="chevR">View all</Button>}
              />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                <Card padding={0} style={{ height: 240, overflow: "hidden" }}>
                  <EmptyState
                    icon="search"
                    title="No spots in this area yet"
                    description="Try expanding the radius or save the search to get notified."
                    actions={
                      <>
                        <Button variant="ghost" size="sm">Expand radius</Button>
                        <Button variant="accent" size="sm">Alert me</Button>
                      </>
                    }
                  />
                </Card>
                <Card padding={16} style={{ height: 240 }}>
                  <Eyebrow>Loading · skeleton</Eyebrow>
                  <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
                    {[0, 1, 2].map((i) => (
                      <div key={i} style={{ display: "flex", gap: 12 }}>
                        <LoadingSkeleton shape="block" width={80} height={56} />
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6, paddingTop: 4 }}>
                          <LoadingSkeleton width="70%" />
                          <LoadingSkeleton width="40%" />
                          <LoadingSkeleton width="30%" />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card padding={0} style={{ height: 240, overflow: "hidden" }}>
                  <EmptyState
                    icon="inbox"
                    title="No applications yet"
                    description="Most listings get their first application within 48 hours of going live."
                    actions={<Button variant="ghost" size="sm">View listing</Button>}
                  />
                </Card>
              </div>
              <Hairline />
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Alert tone="info">Heads up — your bank statements expire in 14 days. Re-upload to keep your application active.</Alert>
                <Alert tone="success" title="Application submitted">We've forwarded your details to the landlord.</Alert>
                <Alert tone="warn" title="Document quality">Your selfie is too dark — please retake in better lighting.</Alert>
                <Alert tone="danger" onDismiss={() => toast.info("Dismissed")}>Payment didn't go through. No funds were moved.</Alert>
              </div>
            </div>
          </Section>

          <Section title="Phase 10 additions">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <BriefCard
                brief={BRIEF_OPEN}
                actions={
                  <>
                    <Button variant="accent" size="sm" leftIcon="check">Propose a match</Button>
                    <Button variant="ghost" size="sm">Message tenant</Button>
                  </>
                }
              />
              <BriefCard
                brief={BRIEF_MATCHED}
                actions={<Button variant="ghost" size="sm" rightIcon="chevR">View brief</Button>}
              />
            </div>
            <div style={{ fontSize: 12, color: "var(--slate)" }}>
              <strong>BriefCard</strong> · Tier C · used by <code className="mono">/job-board</code> and{" "}
              <code className="mono">/agent-requests</code>. Composes Card + Avatar + Badge + Eyebrow + Icon.
              Status taxonomy: OPEN / MATCHED / FILLED / EXPIRED / CANCELLED.
            </div>
          </Section>

          <Section title="Overlays">
            <Row>
              <Button onClick={() => setOpenModal(true)}>Open modal</Button>
              <Button variant="secondary" onClick={() => setOpenConfirm(true)}>
                Open confirm dialog
              </Button>
            </Row>
            <Modal
              open={openModal}
              onClose={() => setOpenModal(false)}
              title="Modal example"
              footer={
                <>
                  <Button variant="secondary" onClick={() => setOpenModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setOpenModal(false)}>Save</Button>
                </>
              }
            >
              <p style={{ fontSize: 14, color: "var(--slate)", lineHeight: 1.6, margin: 0 }}>
                Modal content can be anything. The chrome (title bar and footer) is optional.
              </p>
            </Modal>
            <ConfirmDialog
              open={openConfirm}
              onClose={() => setOpenConfirm(false)}
              onConfirm={() => {
                setOpenConfirm(false);
                toast.success("Confirmed");
              }}
              tone="danger"
              title="Delete listing?"
              message="This will remove the listing and cancel any active applications. This can't be undone."
              confirmLabel="Delete"
            />
          </Section>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <SectionHeader title={title} />
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{children}</div>
    </section>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>{children}</div>;
}
