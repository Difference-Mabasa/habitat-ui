import { Fragment } from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12,
          color: "var(--slate)",
        }}
      >
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <Fragment key={`${item.label}-${i}`}>
              <li>
                {item.href && !last ? (
                  <Link to={item.href} style={{ color: "var(--slate)" }}>
                    {item.label}
                  </Link>
                ) : (
                  <span style={{ color: last ? "var(--ink)" : "var(--slate)", fontWeight: last ? 500 : 400 }}>
                    {item.label}
                  </span>
                )}
              </li>
              {!last ? (
                <li aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", color: "var(--slate-3)" }}>
                  <Icon name="chevR" size={12} />
                </li>
              ) : null}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
