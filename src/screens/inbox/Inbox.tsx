import { useState } from "react";
import Nav from "@/components/Nav";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import IconButton from "@/components/IconButton";
import Input from "@/components/Input";
import MessageBubble from "@/components/MessageBubble";
import InboxThreadList, { type InboxThread } from "./InboxThreadList";

const THREADS: InboxThread[] = [
  { id: "t1", name: "Sipho Dlamini", initials: "SD", role: "Applicant", subject: "Studio · Melville", preview: "Hi Thandi — I'd love to view this Saturday if it's still…", time: "9:42", unread: 2 },
  { id: "t2", name: "Thandi Mokoena", initials: "TM", role: "Landlord", subject: "Lease for Studio · Melville", preview: "Lease is ready. I've signed pages 1–11. Sign at your…", time: "8:14", unread: 1 },
  { id: "t3", name: "PlumberPro · Sipho M.", initials: "PP", role: "Contractor", subject: "MNT-0421 · Geyser leaking", preview: "On site at 16:00 today. Will need water off for 30 min.", time: "Yesterday", unread: 0 },
  { id: "t4", name: "Lerato P.", initials: "LP", role: "Applicant", subject: "Cottage · Caroline", preview: "Thanks for accepting. I'll send the deposit tomorrow.", time: "Tue", unread: 0 },
  { id: "t5", name: "Lebo Properties", initials: "LP", role: "Agent", subject: "Mandate Q1 statement", preview: "March statement attached. R3,952 collected, R316 in…", time: "Mon", unread: 0 },
  { id: "t6", name: "Habitat Support", initials: "HB", role: "System", subject: "FICA verification approved", preview: "Your tenant Sipho Dlamini's FICA documents are verified.", time: "12 Mar", unread: 0 },
];

const FILTERS = [
  { id: "all", label: "All", count: 24 },
  { id: "applicants", label: "Applicants", count: 8 },
  { id: "tenants", label: "Tenants", count: 11 },
  { id: "agents", label: "Agents", count: 3 },
];

const MESSAGES = [
  { name: "Sipho Dlamini", time: "14:22", body: "Hi Thandi! I just submitted my application for the studio. Long-time renter, FICA-verified, looking for a quiet spot near work. Happy to share more if useful.", own: false },
  { name: "Thandi Mokoena", time: "16:01", body: "Hi Sipho — thanks. Your score looks great. Are you available Saturday 11am for a viewing?", own: true },
  { name: "Sipho Dlamini", time: "16:08", body: "Yes, Saturday 11am works perfectly. Should I bring anything?", own: false },
];

export default function Inbox() {
  const [activeThread, setActiveThread] = useState("t1");
  const [activeFilter, setActiveFilter] = useState("all");
  const [reply, setReply] = useState(
    "Just a copy of your last 3 payslips if you have them — saves us time on Saturday.",
  );
  const thread = THREADS.find((t) => t.id === activeThread);

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="landlord" />
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "360px 1fr",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <InboxThreadList
          threads={THREADS}
          activeId={activeThread}
          filters={FILTERS}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onSelect={setActiveThread}
        />

        {/* Thread detail */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "1px solid var(--hairline)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{thread?.name ?? "—"}</div>
              <div style={{ fontSize: 11, color: "var(--slate)" }}>
                Re: {thread?.subject} · application HB-A-2025-04 ·{" "}
                <a href="#" style={{ color: "var(--accent)" }}>
                  view application
                </a>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Button variant="ghost" size="sm" leftIcon="calendar">
                Book viewing
              </Button>
              <Button variant="ghost" size="sm" leftIcon="check">
                Approve
              </Button>
              <IconButton icon="x" label="Close thread" size="sm" />
            </div>
          </div>

          <div
            style={{
              flex: 1,
              padding: "24px 32px",
              display: "flex",
              flexDirection: "column",
              gap: 18,
              overflowY: "auto",
            }}
          >
            <div
              className="mono"
              style={{ textAlign: "center", fontSize: 11, color: "var(--slate)" }}
            >
              —  Mon 11 Mar  —
            </div>
            {MESSAGES.map((m, i) => (
              <MessageBubble
                key={i}
                name={m.name}
                body={m.body}
                time={m.time}
                own={m.own}
              />
            ))}
          </div>

          <div
            style={{
              padding: "12px 24px",
              borderTop: "1px solid var(--hairline)",
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            <IconButton icon="upload" label="Attach file" />
            <Input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Reply…"
              style={{ flex: 1 }}
            />
            <button
              type="button"
              aria-label="Send"
              className="btn btn--accent btn--icon"
            >
              <Icon name="arrR" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
