import { type ApiClient } from "./client";

/**
 * Public landing-page aggregates served by {@code GET /landing/stats}.
 * All counts are non-negative integers; zero is a legitimate value for
 * any of them (pre-launch / fresh staging).
 */
export interface LandingStats {
  activeListings: number;
  /**
   * Users whose currently active role is `USER`. Labelled "Registered
   * tenants" on the landing — see the API DTO docstring for why this
   * isn't quite "verified tenants" yet.
   */
  registeredTenants: number;
  /** Distinct non-blank suburb values across LISTED properties. */
  suburbsCovered: number;
  /** USER-active-role accounts created in the rolling last 7 days. */
  tenantsLast7Days: number;
}

export interface PopularCity {
  /** City name — also a valid value for `/browse?location=…`. */
  name: string;
  /** Number of LISTED properties in this city. Zero for editorial-fallback rows. */
  listingCount: number;
}

export interface LandingApi {
  stats(): Promise<LandingStats>;
  /**
   * Cities with the most LISTED properties, capped at `size` (default 7).
   * The server falls back to an editorial list when the catalogue is
   * empty, so the response is never empty.
   */
  cities(size?: number): Promise<PopularCity[]>;
}

export function createLandingApi(client: ApiClient): LandingApi {
  return {
    stats() {
      return client.get<LandingStats>("/landing/stats");
    },
    cities(size) {
      const path = size != null
        ? `/landing/cities?size=${encodeURIComponent(String(size))}`
        : "/landing/cities";
      return client.get<PopularCity[]>(path);
    },
  };
}
