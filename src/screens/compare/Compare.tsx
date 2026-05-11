import Nav from "@/components/Nav";
import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import ComparisonTable, { type CompareProperty } from "./ComparisonTable";

const PROPERTIES: CompareProperty[] = [
  { id: "cmp1", name: "Sunlit cottage · Caroline", price: 4400, beds: 1, baths: 1, sqm: 38, distance: "1.2km", solar: true, petFriendly: true, parking: true, fibre: false, score: 86 },
  { id: "cmp2", name: "Studio · Melville", price: 5400, beds: 1, baths: 1, sqm: 32, distance: "0.4km", solar: false, petFriendly: false, parking: true, fibre: true, score: 91 },
  { id: "cmp3", name: "Garden flatlet · Brixton", price: 5200, beds: 1, baths: 1, sqm: 44, distance: "2.8km", solar: true, petFriendly: true, parking: false, fibre: true, score: 78 },
];

export default function Compare() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 32px 64px" }}>
        <PageHeader
          eyebrow="Side by side"
          title="Compare 3 spots"
          actions={
            <>
              <Button variant="ghost" size="sm" leftIcon="download">
                Export PDF
              </Button>
              <Button variant="ghost" size="sm">
                Add another
              </Button>
            </>
          }
        />
        <ComparisonTable properties={PROPERTIES} />
      </div>
    </div>
  );
}
