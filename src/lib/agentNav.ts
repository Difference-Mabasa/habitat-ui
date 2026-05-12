import type { SidebarItem } from "@/components/Sidebar";

/**
 * Sidebar items for every agent-workspace surface. Adding a new item here
 * makes it appear automatically in every screen that uses `<AgentShell>`.
 *
 * Agents can be independent or part of an agency. The "Agency" item renders
 * a setup state for independent agents.
 */
export const AGENT_SIDEBAR: SidebarItem[] = [
  { id: "overview", icon: "grid", label: "Overview", to: "/agent-overview" },
  { id: "job-board", icon: "search", label: "Job board", to: "/job-board" },
  { id: "agent-requests", icon: "inbox", label: "Tenant requests", to: "/agent-requests", count: 1 },
  { id: "portfolio", icon: "home", label: "Portfolio", to: "/portfolio" },
  { id: "mandates", icon: "key", label: "Mandates", to: "/my-mandates" },
  { id: "agency", icon: "shield", label: "Agency", to: "/my-agency" },
  { id: "applications", icon: "users", label: "Applications", to: "/applicant?ctx=agent" },
  { id: "viewings", icon: "calendar", label: "Viewings", to: "/viewings?ctx=agent" },
  { id: "notifications", icon: "bell", label: "Notifications", to: "/notifications?ctx=agent" },
];

export type AgentSidebarId = (typeof AGENT_SIDEBAR)[number]["id"];
