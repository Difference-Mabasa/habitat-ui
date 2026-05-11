import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import Icon, { type IconName } from "./Icon";

export interface SidebarItem {
  id: string;
  icon: IconName;
  label: string;
  to: string;
  count?: number;
}

export interface SidebarProps {
  items: SidebarItem[];
  width?: number;
  footer?: ReactNode;
}

export default function Sidebar({ items, width = 240, footer }: SidebarProps) {
  return (
    <aside
      style={{
        width,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {items.map((item) => (
          <NavLink
            key={item.id}
            to={item.to}
            end
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 12px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              color: isActive ? "var(--ink)" : "var(--slate)",
              background: isActive ? "var(--surface)" : "transparent",
              border: isActive ? "1px solid var(--hairline)" : "1px solid transparent",
              boxShadow: isActive ? "var(--shadow-sm)" : undefined,
            })}
          >
            <Icon name={item.icon} size={16} />
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.count != null && item.count > 0 ? (
              <span className="badge badge--accent">{item.count}</span>
            ) : null}
          </NavLink>
        ))}
      </nav>
      {footer ? <div style={{ marginTop: "auto", paddingTop: 16 }}>{footer}</div> : null}
    </aside>
  );
}
