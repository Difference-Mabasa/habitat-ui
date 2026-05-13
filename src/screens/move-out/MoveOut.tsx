import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "@/components/Nav";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import Icon, { type IconName } from "@/components/Icon";
import Stepper, { type StepperStep } from "@/components/Stepper";
import FormField from "@/components/FormField";
import Textarea from "@/components/Textarea";
import FileUploadZone from "@/components/FileUploadZone";
import PageHeader from "@/components/PageHeader";
import Alert from "@/components/Alert";
import KeyValueRow from "@/components/KeyValueRow";
import { toast } from "@/lib/toast";

type Condition = "good" | "minor" | "damaged";

interface RoomCheck {
  id: string;
  label: string;
  icon: IconName;
  condition: Condition;
  note: string;
}

const INITIAL_ROOMS: RoomCheck[] = [
  { id: "kitchen",     label: "Kitchen",          icon: "flame",  condition: "good",     note: "" },
  { id: "bathroom",    label: "Bathroom",         icon: "bath",   condition: "good",     note: "" },
  { id: "bedroom",     label: "Bedroom",          icon: "bed",    condition: "good",     note: "" },
  { id: "living",      label: "Living area",      icon: "home",   condition: "good",     note: "" },
  { id: "appliances",  label: "Appliances",       icon: "bolt",   condition: "good",     note: "" },
  { id: "walls_floors", label: "Walls & floors",  icon: "sqm",    condition: "good",     note: "" },
  { id: "outdoor",     label: "Outdoor / parking", icon: "park",  condition: "good",     note: "" },
];

const STEPS: StepperStep[] = [
  { label: "Property condition", state: "active", detail: "Room-by-room walk-through" },
  { label: "Photos", state: "todo", detail: "Daylight, all four corners" },
  { label: "Notes & submit", state: "todo", detail: "Anything else the landlord should know" },
];

const CONDITION_META: Record<Condition, { tone: "success" | "warn" | "danger"; label: string }> = {
  good:     { tone: "success", label: "Good · no issues" },
  minor:    { tone: "warn",    label: "Minor wear & tear" },
  damaged:  { tone: "danger",  label: "Damaged · attention needed" },
};

export default function MoveOut() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<RoomCheck[]>(INITIAL_ROOMS);
  const [notes, setNotes] = useState("");
  const [stepIdx, setStepIdx] = useState(0);

  const updateRoom = (id: string, patch: Partial<RoomCheck>) =>
    setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const flagged = rooms.filter((r) => r.condition !== "good");

  const submit = () => {
    toast.success("Move-out inspection submitted to the landlord.");
    navigate("/tenant-portal");
  };

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 32px 64px" }}>
        <PageHeader
          eyebrow="Lease end · Move-out inspection"
          title="Hand the place back"
          subtitle="Walk through each space, mark its condition, upload photos. The landlord uses this + their walk-through to decide your deposit refund."
          badges={<Badge tone="warn">Required · 7 days before lease end</Badge>}
        />

        <div style={{ display: "grid", gridTemplateColumns: "240px minmax(0,1fr)", gap: 32 }}>
          <Stepper orientation="vertical" steps={STEPS} currentStep={stepIdx} onStepClick={setStepIdx} />

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {stepIdx === 0 && (
              <>
                <Card padding={20}>
                  <Eyebrow style={{ marginBottom: 12 }}>Step 1 of 3 · Condition</Eyebrow>
                  <p style={{ fontSize: 13, color: "var(--slate)", margin: "0 0 16px", lineHeight: 1.5 }}>
                    Mark each space as <strong>Good</strong>, <strong>Minor wear &amp; tear</strong>, or{" "}
                    <strong>Damaged</strong>. Add a note for anything not in good condition — the more
                    detail you give now, the less back-and-forth on your deposit.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {rooms.map((r) => (
                      <RoomRow
                        key={r.id}
                        room={r}
                        onChange={(patch) => updateRoom(r.id, patch)}
                      />
                    ))}
                  </div>
                </Card>

                {flagged.length > 0 ? (
                  <Alert tone="warn" title={`${flagged.length} item${flagged.length === 1 ? "" : "s"} flagged`}>
                    The landlord will see these first. Photos for these are worth uploading at the next step.
                  </Alert>
                ) : null}

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button variant="accent" rightIcon="chevR" onClick={() => setStepIdx(1)}>
                    Continue to photos
                  </Button>
                </div>
              </>
            )}

            {stepIdx === 1 && (
              <>
                <Card padding={20}>
                  <Eyebrow style={{ marginBottom: 12 }}>Step 2 of 3 · Photos</Eyebrow>
                  <p style={{ fontSize: 13, color: "var(--slate)", margin: "0 0 16px", lineHeight: 1.5 }}>
                    Take a daylight shot of each room from a corner. Extra photos of any flagged items help.
                  </p>
                  <FileUploadZone
                    title="Drop your move-out photos"
                    helpText="JPEG / PNG · daylight preferred · 12+ photos recommended"
                    buttonLabel="Choose photos"
                    specsText="Each room: 1 wide + close-ups of any issue"
                  />
                </Card>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Button variant="ghost" leftIcon="chevL" onClick={() => setStepIdx(0)}>
                    Back
                  </Button>
                  <Button variant="accent" rightIcon="chevR" onClick={() => setStepIdx(2)}>
                    Continue
                  </Button>
                </div>
              </>
            )}

            {stepIdx === 2 && (
              <>
                <Card padding={20}>
                  <Eyebrow style={{ marginBottom: 12 }}>Step 3 of 3 · Notes & submit</Eyebrow>
                  <FormField label="Anything else the landlord should know" helper="Optional. Keys returned, mail forwarding, leftover items, etc.">
                    <Textarea
                      rows={5}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Keys returned, forwarding address, leftover items…"
                    />
                  </FormField>

                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--hairline)" }}>
                    <Eyebrow style={{ marginBottom: 10 }}>Inspection summary</Eyebrow>
                    <KeyValueRow label="Spaces inspected" value={`${rooms.length} of ${rooms.length}`} divider />
                    <KeyValueRow
                      label="Flagged"
                      value={`${flagged.length}`}
                      tone={flagged.length === 0 ? "success" : "warn"}
                      divider
                    />
                    <KeyValueRow label="Notes" value={notes ? "Included" : "None"} divider={false} />
                  </div>
                </Card>

                <Alert tone="info" title="What happens next">
                  Habitat sends this inspection to your landlord. They have 7 days to confirm or contest
                  any item. After that, your deposit refund decision lands in /tenant-portal.
                </Alert>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Button variant="ghost" leftIcon="chevL" onClick={() => setStepIdx(1)}>
                    Back
                  </Button>
                  <Button variant="accent" leftIcon="check" onClick={submit}>
                    Submit inspection
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RoomRow({
  room,
  onChange,
}: {
  room: RoomCheck;
  onChange: (patch: Partial<RoomCheck>) => void;
}) {
  const meta = CONDITION_META[room.condition];
  return (
    <Card padding={14}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: "var(--surface-2)",
            color: "var(--slate)",
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          <Icon name={room.icon} size={16} />
        </div>
        <div style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{room.label}</div>
        <Badge tone={meta.tone}>{meta.label}</Badge>
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {(Object.keys(CONDITION_META) as Condition[]).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChange({ condition: c })}
            className="chip"
            style={{
              borderColor: room.condition === c ? "var(--ink)" : "var(--hairline-strong)",
              background: room.condition === c ? "var(--ink)" : "var(--surface)",
              color: room.condition === c ? "var(--paper)" : "var(--ink)",
            }}
          >
            {CONDITION_META[c].label}
          </button>
        ))}
      </div>

      {room.condition !== "good" ? (
        <div style={{ marginTop: 10 }}>
          <Textarea
            rows={2}
            value={room.note}
            onChange={(e) => onChange({ note: e.target.value })}
            placeholder={`What about the ${room.label.toLowerCase()}?`}
          />
        </div>
      ) : null}
    </Card>
  );
}
