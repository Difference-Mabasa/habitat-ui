import type { SidebarItem } from "@/components/Sidebar";

/**
 * Sidebar items for every tenant-dashboard surface. Adding a new item here
 * makes it appear automatically in every screen that uses `<TenantShell>`.
 */
export const TENANT_SIDEBAR: SidebarItem[] = [
  { id: "overview", icon: "grid", label: "Overview", to: "/tenant-portal" },
  { id: "applications", icon: "inbox", label: "My applications", to: "/my-apps" },
  { id: "viewings", icon: "calendar", label: "My viewings", to: "/my-viewings" },
  { id: "lease", icon: "paper", label: "Lease", to: "/lease" },
  { id: "payments", icon: "cash", label: "Payments", to: "/invoice" },
  { id: "maintenance", icon: "bolt", label: "Maintenance", to: "/maintenance" },
  { id: "communities", icon: "chat", label: "Property chat", to: "/property-chat" },
  { id: "saved", icon: "heart", label: "Saved", to: "/saved" },
  { id: "request-agent", icon: "search", label: "Request an agent", to: "/room-request" },
];

export type TenantSidebarId = (typeof TENANT_SIDEBAR)[number]["id"];
