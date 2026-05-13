import { Link } from "react-router-dom";
import Nav from "@/components/Nav";
import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import ComparisonTable, { type CompareProperty } from "./ComparisonTable";

const PROPERTIES: CompareProperty[] = [];

export default function Compare() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 32px 64px" }}>
        <PageHeader
          eyebrow="Side by side"
          title={`Compare ${PROPERTIES.length} spots`}
          actions={
            <>
              <Button variant="ghost" size="sm" leftIcon="download">
                Export PDF
              </Button>
              <Link to="/browse" style={{ textDecoration: "none" }}>
                <Button variant="ghost" size="sm">
                  Add another
                </Button>
              </Link>
            </>
          }
        />
        {PROPERTIES.length === 0 ? (
          <EmptyState
            icon="search"
            title="Nothing to compare yet"
            description="Add spots from your saved list or browse to compare them side by side."
            actions={
              <Link to="/browse" style={{ textDecoration: "none" }}>
                <Button variant="accent" leftIcon="search">Browse listings</Button>
              </Link>
            }
          />
        ) : (
          <ComparisonTable properties={PROPERTIES} />
        )}
      </div>
    </div>
  );
}
