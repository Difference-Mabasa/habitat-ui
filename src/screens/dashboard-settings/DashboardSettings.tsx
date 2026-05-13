import { useState } from "react";
import Nav from "@/components/Nav";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Toggle from "@/components/Toggle";
import FormField from "@/components/FormField";
import Input from "@/components/Input";
import Select from "@/components/Select";
import SubNav, { type SubNavItem } from "@/components/SubNav";
import Alert from "@/components/Alert";

const ITEMS: SubNavItem[] = [
  { id: "notifications", label: "Notifications", icon: "bell" },
  { id: "bank", label: "Payout bank", icon: "cash" },
  { id: "rent", label: "Rent collection", icon: "trend" },
  { id: "team", label: "Team access", icon: "users" },
  { id: "preferences", label: "Dashboard preferences", icon: "settings" },
  { id: "danger", label: "Danger zone", icon: "trash" },
];

type ChannelMatrix = Record<string, { push: boolean; email: boolean; sms: boolean }>;

const INITIAL_CHANNELS: ChannelMatrix = {
  "New applicant": { push: false, email: false, sms: false },
  "Lease ready to sign": { push: false, email: false, sms: false },
  "Rent received": { push: false, email: false, sms: false },
  "Rent late": { push: false, email: false, sms: false },
  "Viewing booked": { push: false, email: false, sms: false },
  "Maintenance reported": { push: false, email: false, sms: false },
  "Mandate request": { push: false, email: false, sms: false },
  "Tips & insights": { push: false, email: false, sms: false },
};

export default function DashboardSettings() {
  const [section, setSection] = useState("notifications");
  const [channels, setChannels] = useState<ChannelMatrix>(INITIAL_CHANNELS);

  const setChan = (row: string, key: "push" | "email" | "sms", value: boolean) =>
    setChannels({ ...channels, [row]: { ...channels[row], [key]: value } });

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="landlord" />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 32px 64px" }}>
        <Eyebrow>Account · Landlord</Eyebrow>
        <h1
          style={{
            fontSize: 30,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            margin: "8px 0 32px",
          }}
        >
          Dashboard settings
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "240px minmax(0,1fr)", gap: 48 }}>
          <div style={{ position: "sticky", top: 88, alignSelf: "start" }}>
            <SubNav items={ITEMS} activeId={section} onChange={setSection} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {section === "notifications" && (
              <>
                <Card padding={24}>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>
                    Notification channels
                  </div>
                  <p style={{ fontSize: 13, color: "var(--slate)", margin: "0 0 18px" }}>
                    Choose where Habitat reaches you for each event type.
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
                      {Object.entries(channels).map(([row, c]) => (
                        <tr key={row} style={{ borderTop: "1px solid var(--hairline)" }}>
                          <td style={{ padding: "12px 14px", fontWeight: 500 }}>{row}</td>
                          <td style={{ padding: "12px 14px" }}>
                            <Toggle checked={c.push} onChange={(e) => setChan(row, "push", e.target.checked)} />
                          </td>
                          <td style={{ padding: "12px 14px" }}>
                            <Toggle checked={c.email} onChange={(e) => setChan(row, "email", e.target.checked)} />
                          </td>
                          <td style={{ padding: "12px 14px" }}>
                            <Toggle checked={c.sms} onChange={(e) => setChan(row, "sms", e.target.checked)} />
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
                      helper="Late rent, lease decline, and security alerts still come through."
                      defaultChecked
                    />
                  </div>
                </Card>
              </>
            )}

            {section === "bank" && (
              <>
                <Card padding={24}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 600 }}>Payout bank account</div>
                      <div style={{ fontSize: 13, color: "var(--slate)", marginTop: 4 }}>
                        Where Habitat sends rent after escrow release.
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 16, padding: 14, border: "1px solid var(--hairline)", borderRadius: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>No bank account on file</div>
                      <div style={{ fontSize: 12, color: "var(--slate)" }}>
                        Add a payout account to receive rent after escrow release.
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" leftIcon="plus">Add</Button>
                  </div>
                </Card>

                <Card padding={24}>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Payout schedule</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <FormField label="Frequency">
                      <Select
                        defaultValue="monthly"
                        options={[
                          { value: "monthly", label: "Monthly · 3rd of month" },
                          { value: "weekly", label: "Weekly · Fridays" },
                          { value: "ondemand", label: "On demand" },
                        ]}
                      />
                    </FormField>
                    <FormField label="Currency">
                      <Select
                        defaultValue="ZAR"
                        options={[{ value: "ZAR", label: "ZAR · South African Rand" }]}
                      />
                    </FormField>
                  </div>
                </Card>
              </>
            )}

            {section === "rent" && (
              <Card padding={24}>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Rent collection defaults</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <FormField label="Due day" helper="Default for new leases — overridable per lease.">
                    <Select
                      defaultValue="1"
                      options={[
                        { value: "1", label: "1st of month" },
                        { value: "15", label: "15th" },
                        { value: "25", label: "25th (post-payday)" },
                      ]}
                    />
                  </FormField>
                  <FormField label="Grace period">
                    <Select
                      defaultValue="3"
                      options={[
                        { value: "0", label: "None" },
                        { value: "3", label: "3 days" },
                        { value: "5", label: "5 days" },
                      ]}
                    />
                  </FormField>
                  <FormField label="Late fee">
                    <Input defaultValue="R 250" className="tabular" />
                  </FormField>
                  <FormField label="Auto-debit retries">
                    <Select
                      defaultValue="2"
                      options={[
                        { value: "0", label: "Off" },
                        { value: "2", label: "Twice (Day 2, Day 5)" },
                        { value: "3", label: "Three times (Day 2, 5, 10)" },
                      ]}
                    />
                  </FormField>
                </div>
                <Toggle
                  label="Send reminder 3 days before due"
                  helper="Push + SMS to the tenant; you stay copied."
                  defaultChecked
                />
              </Card>
            )}

            {section === "team" && (
              <Card padding={24}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>Team access</div>
                  <Button variant="accent" size="sm" leftIcon="plus">Invite member</Button>
                </div>
                <p style={{ fontSize: 13, color: "var(--slate)" }}>
                  Co-managers can view properties and approve mandates, but can't change banking details.
                </p>
              </Card>
            )}

            {section === "preferences" && (
              <Card padding={24}>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Dashboard preferences</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <Toggle label="Use compact tables" helper="Tighter row height across portfolio + tenants." />
                  <Toggle label="Show projected rent income" helper="Adds a 12-month forecast to the overview chart." defaultChecked />
                  <Toggle label="Group properties by suburb" defaultChecked />
                </div>
              </Card>
            )}

            {section === "danger" && (
              <>
                <Alert tone="danger" title="These actions are permanent">
                  Read each one carefully. Habitat can't recover a deleted account or a withdrawn mandate.
                </Alert>
                <Card padding={24}>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>Pause new applications</div>
                  <p style={{ fontSize: 13, color: "var(--slate)", marginBottom: 12 }}>
                    Stops fresh applicants from finding your listings. Existing tenants and leases keep running.
                  </p>
                  <Button variant="secondary">Pause for 30 days</Button>
                </Card>
                <Card padding={24} style={{ borderColor: "var(--danger)" }}>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 10, color: "var(--danger)" }}>
                    Close landlord account
                  </div>
                  <p style={{ fontSize: 13, color: "var(--slate)", marginBottom: 12 }}>
                    Withdraws all mandates, ends pending applications, and removes your listings. Tenant data
                    stays for 90 days for legal reasons.
                  </p>
                  <Button variant="ghost" style={{ color: "var(--danger)" }} leftIcon="trash">
                    Close account
                  </Button>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
