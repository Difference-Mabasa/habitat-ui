import { type ApiClient } from "./client";
import type { ApplicationStatus } from "./applications";

export type LeaseStatus =
  | "PENDING_SIGNATURES"
  | "SIGNED"
  | "COMPLETED"
  | "DECLINED"
  | "VOIDED";

export type LeaseTemplate = "RHA_STANDARD" | "RHA_SIX_MONTH" | "RHA_ROOM";

export interface LeasePartyRef {
  id: string;
  firstName: string | null;
  surname: string | null;
  email: string | null;
}

export interface LeaseUnitRef {
  id: string;
  title: string | null;
  unitNumber: string | null;
  price: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  coverImageUrl: string | null;
}

export interface LeasePropertyRef {
  id: string;
  title: string | null;
  addressLine: string | null;
  suburb: string | null;
  city: string | null;
  province: string | null;
  postalCode: string | null;
}

export interface LeaseApplicationRef {
  id: string;
  status: ApplicationStatus;
}

export interface LeaseResponse {
  id: string;
  leaseRef: string;
  applicationId: string;
  status: LeaseStatus;
  template: LeaseTemplate;
  monthlyRent: number;
  deposit: number;
  termMonths: number;
  startDate: string | null;
  tenantSignedAt: string | null;
  landlordSignedAt: string | null;
  declineReason: string | null;
  createdAt: string;
  application: LeaseApplicationRef;
  tenant: LeasePartyRef;
  landlord: LeasePartyRef | null;
  unit: LeaseUnitRef;
  property: LeasePropertyRef;
}

export interface SignLeasePayload {
  otp?: string;
}

export interface DeclineLeasePayload {
  reason?: string;
}

export interface LeasesApi {
  listMine(): Promise<LeaseResponse[]>;
  listInbound(): Promise<LeaseResponse[]>;
  get(leaseId: string): Promise<LeaseResponse>;
  sign(leaseId: string, payload?: SignLeasePayload): Promise<LeaseResponse>;
  decline(leaseId: string, payload?: DeclineLeasePayload): Promise<LeaseResponse>;
}

export function createLeasesApi(client: ApiClient): LeasesApi {
  return {
    listMine() {
      return client.get<LeaseResponse[]>("/leases/me");
    },
    listInbound() {
      return client.get<LeaseResponse[]>("/leases/inbound");
    },
    get(leaseId) {
      return client.get<LeaseResponse>(`/leases/${leaseId}`);
    },
    sign(leaseId, payload) {
      return client.post<LeaseResponse>(`/leases/${leaseId}/sign`, payload ?? {});
    },
    decline(leaseId, payload) {
      return client.post<LeaseResponse>(`/leases/${leaseId}/decline`, payload ?? {});
    },
  };
}
