import { type ApiClient } from "./client";

export type ApplicationStatus = "SUBMITTED" | "AWAITING_DOCUMENTS" | "DOCUMENTS_SUBMITTED";

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

export interface ApplicationsApi {
  create(payload: CreateApplicationPayload): Promise<ApplicationResponse>;
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
