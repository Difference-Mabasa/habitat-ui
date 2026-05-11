import type { CSSProperties, ReactNode } from "react";
import { NavLink } from "react-router-dom";
import Icon, { type IconName } from "./Icon";

export interface SidebarItem {
  id: string;
  icon: IconName;
  label: string;
  to: string;
  count?: number;
  /** Force active state regardless of route match (useful for dashboard mocks). */
  active?: boolean;
}

export interface SidebarProps {
  items: SidebarItem[];
  width?: number;
  header?: ReactNode;
  footer?: ReactNode;
  style?: CSSProperties;
}

export default function Sidebar({ items, width = 240, header, footer, style }: SidebarProps) {
  return (
    <aside
      style={{
        width,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        ...style,
      }}
    >
      {header}
      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {items.map((item) => {
          const render = ({ isActive }: { isActive: boolean }): CSSProperties => {
            const active = item.active ?? isActive;
            return {
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 12px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: active ? 600 : 500,
              color: active ? "var(--ink)" : "var(--slate)",
              background: active ? "var(--surface)" : "transparent",
              border: active ? "1px solid var(--hairline)" : "1px solid transparent",
              boxShadow: active ? "var(--shadow-sm)" : undefined,
            };
          };
          return (
            <NavLink key={item.id} to={item.to} end style={render}>
              <Icon name={item.icon} size={16} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.count != null && item.count > 0 ? (
                <span className="badge badge--accent">{item.count}</span>
              ) : null}
            </NavLink>
          );
        })}
      </nav>
      {footer ? <div style={{ marginTop: "auto", paddingTop: 16 }}>{footer}</div> : null}
    </aside>
  );
}
