import { type ApiClient } from "./client";

export type ApplicationStatus = "SUBMITTED";

export type EmploymentStatus =
  | "EMPLOYED"
  | "SELF_EMPLOYED"
  | "STUDENT"
  | "PENSIONER"
  | "UNEMPLOYED"
  | "OTHER";

export interface CreateApplicationPayload {
  unitId: string;
  message?: string;
  /** ISO date (YYYY-MM-DD). */
  moveInDate?: string;
  employmentStatus?: EmploymentStatus;
}

export interface ApplicationResponse {
  id: string;
  unitId: string;
  tenantId: string;
  status: ApplicationStatus;
  message: string | null;
  moveInDate: string | null;
  employmentStatus: EmploymentStatus | null;
  createdAt: string;
}

export interface ApplicationsApi {
  /** Create a tenant application against a Unit. POST /applications. */
  create(payload: CreateApplicationPayload): Promise<ApplicationResponse>;
}

export function createApplicationsApi(client: ApiClient): ApplicationsApi {
  return {
    create(payload) {
      return client.post<ApplicationResponse>("/applications", payload);
    },
  };
}
