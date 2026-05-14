import { type ApiClient } from "./client";

export type ApplicationStatus =
  | "SUBMITTED"
  | "AWAITING_DOCUMENTS"
  | "DOCUMENTS_SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "ON_HOLD"
  | "INVOICE_SENT"
  | "DEPOSIT_PAID"
  | "LEASE_GENERATED"
  | "LEASE_PENDING_SIGNATURES"
  | "COMPLETED"
  | "REJECTED"
  | "WITHDRAWN"
  | "EXPIRED";

export type EmploymentStatus =
  | "EMPLOYED"
  | "SELF_EMPLOYED"
  | "STUDENT"
  | "PENSIONER"
  | "UNEMPLOYED"
  | "OTHER";

export type DocumentType =
  | "SA_ID"
  | "PASSPORT"
  | "PAYSLIPS_3_MONTHS"
  | "BANK_STATEMENTS_3_MONTHS"
  | "EMPLOYMENT_LETTER"
  | "PROOF_OF_ADDRESS";

export interface CreateApplicationPayload {
  unitId: string;
  message?: string;
  /** ISO date (YYYY-MM-DD). */
  moveInDate?: string;
  employmentStatus?: EmploymentStatus;
}

export interface ApplicationUnitRef {
  id: string;
  title: string | null;
  unitNumber: string | null;
  price: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  coverImageUrl: string | null;
}

export interface ApplicationPropertyRef {
  id: string;
  title: string | null;
  suburb: string | null;
  city: string | null;
  province: string | null;
}

export interface ApplicationTenantRef {
  id: string;
  firstName: string | null;
  surname: string | null;
  email: string | null;
}

export interface ApplicationResponse {
  id: string;
  unitId: string;
  tenantId: string;
  status: ApplicationStatus;
  message: string | null;
  moveInDate: string | null;
  employmentStatus: EmploymentStatus | null;
  decisionNote: string | null;
  decidedAt: string | null;
  createdAt: string;
  unit: ApplicationUnitRef;
  property: ApplicationPropertyRef;
  tenant: ApplicationTenantRef;
}

export interface ApplicationDocumentResponse {
  id: string;
  applicationId: string;
  docType: DocumentType;
  fileUrl: string;
  fileName: string;
  uploadedAt: string;
  verified: boolean;
}

export interface RequiredDocumentsResponse {
  required: DocumentType[];
  uploaded: ApplicationDocumentResponse[];
}

export interface UploadDocumentPayload {
  docType: DocumentType;
  fileName: string;
  fileUrl: string;
}

export type ReviewAction = "APPROVE" | "REJECT" | "ON_HOLD";

export interface ReviewApplicationPayload {
  action: ReviewAction;
  note?: string;
}

export interface ApplicationsApi {
  create(payload: CreateApplicationPayload): Promise<ApplicationResponse>;
  listMine(): Promise<ApplicationResponse[]>;
  listInbound(): Promise<ApplicationResponse[]>;
  get(applicationId: string): Promise<ApplicationResponse>;
  review(
    applicationId: string,
    payload: ReviewApplicationPayload,
  ): Promise<ApplicationResponse>;
  /** Required docs for the application + what's already uploaded. */
  listDocuments(applicationId: string): Promise<RequiredDocumentsResponse>;
  /** Record an uploaded document. */
  uploadDocument(
    applicationId: string,
    payload: UploadDocumentPayload,
  ): Promise<ApplicationDocumentResponse>;
}

export function createApplicationsApi(client: ApiClient): ApplicationsApi {
  return {
    create(payload) {
      return client.post<ApplicationResponse>("/applications", payload);
    },
    listMine() {
      return client.get<ApplicationResponse[]>("/applications/me");
    },
    listInbound() {
      return client.get<ApplicationResponse[]>("/applications/inbound");
    },
    get(applicationId) {
      return client.get<ApplicationResponse>(`/applications/${applicationId}`);
    },
    review(applicationId, payload) {
      return client.patch<ApplicationResponse>(
        `/applications/${applicationId}/review`,
        payload,
      );
    },
    listDocuments(applicationId) {
      return client.get<RequiredDocumentsResponse>(
        `/applications/${applicationId}/documents`,
      );
    },
    uploadDocument(applicationId, payload) {
      return client.post<ApplicationDocumentResponse>(
        `/applications/${applicationId}/documents`,
        payload,
      );
    },
  };
}
