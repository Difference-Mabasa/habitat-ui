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

export interface LandingApi {
  stats(): Promise<LandingStats>;
}

export function createLandingApi(client: ApiClient): LandingApi {
  return {
    stats() {
      return client.get<LandingStats>("/landing/stats");
    },
  };
}
