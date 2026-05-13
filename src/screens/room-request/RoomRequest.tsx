import { useState } from "react";
import TenantShell from "@/components/TenantShell";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Chip from "@/components/Chip";
import FormField from "@/components/FormField";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import Toggle from "@/components/Toggle";
import PageHeader from "@/components/PageHeader";
import Alert from "@/components/Alert";
import KeyValueRow from "@/components/KeyValueRow";
import Avatar from "@/components/Avatar";

const AREA_SUGGESTIONS = [
  "Westdene",
  "Auckland Park",
  "Brixton",
  "Melville",
  "Yeoville",
  "Bellevue",
  "Orlando West",
  "Diepkloof",
  "Pimville",
  "Mofolo",
  "Maboneng",
  "Braamfontein",
];

const PROPERTY_TYPES = ["Backroom", "Cottage", "Bachelor flat", "1-bed flat", "Studio", "2-bed flat"];

const AMENITIES = [
  "Own entrance",
  "Prepaid electricity",
  "Water included",
  "Parking",
  "Wi-Fi-ready",
  "Pet-friendly",
  "Secure complex",
  "Garden",
];

export default function RoomRequest() {
  const [areas, setAreas] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [openToAgents, setOpenToAgents] = useState(true);
  const [moveIn, setMoveIn] = useState("");

  const toggle = (list: string[], setList: (s: string[]) => void, value: string) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  return (
    <TenantShell activeId="request-agent">
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "32px 32px 64px" }}>
        <PageHeader
          eyebrow="Post a brief"
          title="Tell agents what you're looking for"
          subtitle="Mandated agents in your chosen areas will see this brief and propose matches. You stay anonymous until you accept a match."
        />

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 360px", gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card padding={24}>
              <Eyebrow style={{ marginBottom: 14 }}>1 · Budget & timing</Eyebrow>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <FormField label="Budget · min" helper="Rent only (excl. deposit)">
                  <Input type="text" defaultValue="" placeholder="R 0" />
                </FormField>
                <FormField label="Budget · max">
                  <Input type="text" defaultValue="" placeholder="R 0" />
                </FormField>
                <FormField label="Move-in by">
                  <Input
                    type="text"
                    value={moveIn}
                    onChange={(e) => setMoveIn(e.target.value)}
                    placeholder="ASAP or specific date"
                  />
                </FormField>
                <FormField label="Lease length">
                  <Input type="text" defaultValue="" placeholder="e.g. 6–12 months" />
                </FormField>
              </div>
            </Card>

            <Card padding={24}>
              <Eyebrow style={{ marginBottom: 14 }}>2 · Areas</Eyebrow>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {AREA_SUGGESTIONS.map((a) => (
                  <Chip
                    key={a}
                    active={areas.includes(a)}
                    onClick={() => toggle(areas, setAreas, a)}
                    leftIcon="pin"
                  >
                    {a}
                  </Chip>
                ))}
              </div>
            </Card>

            <Card padding={24}>
              <Eyebrow style={{ marginBottom: 14 }}>3 · Property type</Eyebrow>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {PROPERTY_TYPES.map((t) => (
                  <Chip
                    key={t}
                    active={types.includes(t)}
                    onClick={() => toggle(types, setTypes, t)}
                  >
                    {t}
                  </Chip>
                ))}
              </div>
            </Card>

            <Card padding={24}>
              <Eyebrow style={{ marginBottom: 14 }}>4 · Must-haves</Eyebrow>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {AMENITIES.map((a) => (
                  <Chip
                    key={a}
                    active={amenities.includes(a)}
                    onClick={() => toggle(amenities, setAmenities, a)}
                  >
                    {a}
                  </Chip>
                ))}
              </div>
            </Card>

            <Card padding={24}>
              <Eyebrow style={{ marginBottom: 14 }}>5 · Tell agents about you</Eyebrow>
              <FormField
                label="Short brief"
                helper="Plain language — what's your situation, when you need to move, anything quirky. 240 chars max."
              >
                <Textarea
                  rows={4}
                  defaultValue=""
                  placeholder="Tell agents about you in a few sentences."
                />
              </FormField>
            </Card>

            <Card padding={20}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                    Open to agent matches
                  </div>
                  <div style={{ fontSize: 12, color: "var(--slate)" }}>
                    Off: only landlords see your brief. On: mandated agents in your areas also see it.
                  </div>
                </div>
                <Toggle checked={openToAgents} onChange={(e) => setOpenToAgents(e.target.checked)} />
              </div>
            </Card>

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <Button variant="ghost">Save draft</Button>
              <Button variant="accent" leftIcon="check">Post brief</Button>
            </div>
          </div>

          <aside style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 88, alignSelf: "start" }}>
            <Card padding={20}>
              <Eyebrow style={{ marginBottom: 12 }}>Live preview</Eyebrow>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <Avatar name="" size="md" tone="neutral" />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>You</div>
                  <div style={{ fontSize: 11, color: "var(--slate)" }}>Anonymous to agents</div>
                </div>
              </div>
              <KeyValueRow label="Budget" value="R 0 – R 0" />
              <KeyValueRow label="Areas" value={`${areas.length} selected`} />
              <KeyValueRow label="Types" value={`${types.length} selected`} />
              <KeyValueRow label="Move-in" value={moveIn || "—"} />
              <KeyValueRow
                label="Visible to"
                value={openToAgents ? "Landlords + agents" : "Landlords only"}
                tone="accent"
                divider={false}
              />
            </Card>

            <Alert tone="info" title="How matching works">
              We share your brief, not your identity. Agents propose units — you decide who to message back.
            </Alert>
          </aside>
        </div>
      </div>
    </TenantShell>
  );
}
