import type { PropertyCardData } from "@/components/PropertyCard";
import type { PropertySummary } from "@/lib/api/properties";

/**
 * Adapter from the API's {@link PropertySummary} DTO to the design-system
 * {@link PropertyCardData} props shape. Shared between every page that
 * renders a card grid (landing's Top Rated Near You, /browse, future map
 * drawers) so rating display, title casing, and headline fallbacks stay
 * consistent.
 *
 * <p>The {@code tag} pill is intentionally omitted when {@code ratingCount}
 * is zero — un-reviewed listings render no tag at all rather than a "New"
 * fallback. Review count + reviewer breakdown live on /property/:id, not
 * on the card.
 */
export function summaryToCardData(p: PropertySummary): PropertyCardData {
  return {
    id: p.id,
    title: p.title,
    area: p.suburb ?? p.city ?? "—",
    price: p.headlinePrice ?? 0,
    beds: p.headlineBeds ?? 0,
    baths: p.headlineBaths ?? 0,
    sqm: p.headlineSqm ?? undefined,
    type: p.headlineUnitType ? titleCaseEnum(p.headlineUnitType) : undefined,
    tag: p.ratingCount > 0 ? `★ ${Number(p.avgRating).toFixed(1)}` : undefined,
    photoSrc: p.coverImageUrl ?? undefined,
  };
}

/** "APARTMENT_BLOCK" → "Apartment Block". Local to the mapper. */
function titleCaseEnum(s: string): string {
  return s
    .toLowerCase()
    .split("_")
    .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}
