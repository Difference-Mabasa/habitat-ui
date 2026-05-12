import type { SidebarItem } from "@/components/Sidebar";

/**
 * Sidebar items for every landlord-dashboard surface. Adding a new item here
 * makes it appear automatically in every screen that uses `<LandlordShell>`.
 */
export const LANDLORD_SIDEBAR: SidebarItem[] = [
  { id: "overview", icon: "grid", label: "Overview", to: "/landlord-dashboard" },
  { id: "properties", icon: "home", label: "Properties", to: "/landlord-properties" },
  { id: "applications", icon: "inbox", label: "Applications", to: "/applicant", count: 7 },
  { id: "tenants", icon: "users", label: "Tenants", to: "/landlord-tenants" },
  { id: "leases", icon: "paper", label: "Leases", to: "/landlord-leases" },
  { id: "payments", icon: "cash", label: "Payments", to: "/statements" },
  { id: "viewings", icon: "calendar", label: "Viewings", to: "/viewings" },
  { id: "viewing-availability", icon: "clock", label: "Availability", to: "/viewing-availability" },
  { id: "mandate-approvals", icon: "key", label: "Mandates", to: "/mandate-approvals", count: 2 },
  { id: "insights", icon: "trend", label: "Insights", to: "/analytics" },
  { id: "notifications", icon: "bell", label: "Notifications", to: "/notifications" },
];

export type LandlordSidebarId = (typeof LANDLORD_SIDEBAR)[number]["id"];
