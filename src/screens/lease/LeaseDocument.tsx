import { useState, type ReactNode } from "react";
import Icon from "@/components/Icon";
import Button from "@/components/Button";

export interface LeasePage {
  id: number;
  title: string;
  body: ReactNode;
}

export interface LeaseDocumentProps {
  title: string;
  pages: LeasePage[];
  totalPages: number;
  initialPage?: number;
}

export default function LeaseDocument({
  title,
  pages,
  totalPages,
  initialPage = 0,
}: LeaseDocumentProps) {
  const [pageIndex, setPageIndex] = useState(initialPage);
  const page = pages[pageIndex] ?? pages[0];

  return (
    <div style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid var(--hairline)",
          background: "var(--surface-2)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Icon name="paper" size={16} style={{ color: "var(--slate)" }} />
        <span style={{ fontSize: 13, fontWeight: 500 }}>{title}</span>
        <span className="mono" style={{ marginLeft: "auto", fontSize: 12, color: "var(--slate)" }}>
          {pageIndex + 1} / {totalPages}
        </span>
      </div>
      <div style={{ padding: "32px 48px", fontSize: 13, lineHeight: 1.7, color: "var(--ink)", minHeight: 600 }}>
        {page.body}
      </div>
      <div
        style={{
          padding: "12px 24px",
          borderTop: "1px solid var(--hairline)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "var(--surface-2)",
        }}
      >
        <Button
          variant="ghost"
          size="sm"
          leftIcon="chevL"
          disabled={pageIndex === 0}
          onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
        >
          Previous
        </Button>
        <div style={{ display: "flex", gap: 4 }}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background:
                  i < pageIndex
                    ? "var(--ink)"
                    : i === pageIndex
                      ? "var(--accent)"
                      : "var(--hairline-strong)",
              }}
            />
          ))}
        </div>
        <Button
          variant="accent"
          size="sm"
          rightIcon="chevR"
          disabled={pageIndex >= totalPages - 1}
          onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
