import type { SidebarItem } from "@/components/Sidebar";

/**
 * Sidebar items for every agent-workspace surface. Adding a new item here
 * makes it appear automatically in every screen that uses `<AgentShell>`.
 *
 * Agents do everything a landlord does (tenants / leases / payouts /
 * availability / insights) plus their own marketplace surfaces
 * (job board / requests / portfolio / mandates / agency). Shared screens
 * are linked with `?ctx=agent` so they render the AgentShell via
 * useWorkspace().
 */
export const AGENT_SIDEBAR: SidebarItem[] = [
  { id: "overview", icon: "grid", label: "Overview", to: "/agent-overview" },
  { id: "job-board", icon: "search", label: "Job board", to: "/job-board" },
  { id: "agent-requests", icon: "inbox", label: "Tenant requests", to: "/agent-requests", count: 1 },
  { id: "portfolio", icon: "home", label: "Portfolio", to: "/portfolio" },
  { id: "applications", icon: "users", label: "Applications", to: "/applicant?ctx=agent" },
  { id: "tenants", icon: "user", label: "Tenants", to: "/landlord-tenants?ctx=agent" },
  { id: "leases", icon: "paper", label: "Leases", to: "/landlord-leases?ctx=agent" },
  { id: "payments", icon: "cash", label: "Payments", to: "/statements?ctx=agent" },
  { id: "viewings", icon: "calendar", label: "Viewings", to: "/viewings?ctx=agent" },
  { id: "viewing-availability", icon: "clock", label: "Availability", to: "/viewing-availability?ctx=agent" },
  { id: "mandates", icon: "key", label: "Mandates", to: "/my-mandates" },
  { id: "agency", icon: "shield", label: "Agency", to: "/my-agency" },
  { id: "insights", icon: "trend", label: "Insights", to: "/analytics?ctx=agent" },
  { id: "notifications", icon: "bell", label: "Notifications", to: "/notifications?ctx=agent" },
];

export type AgentSidebarId = (typeof AGENT_SIDEBAR)[number]["id"];
