import { type ApiClient } from "./client";
import type { ApplicationStatus } from "./applications";

export type InvoiceStatus = "PENDING" | "PAID" | "VOIDED" | "EXPIRED";

export interface InvoiceApplicationRef {
  id: string;
  status: ApplicationStatus;
}

export interface InvoiceUnitRef {
  id: string;
  title: string | null;
  unitNumber: string | null;
  price: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  coverImageUrl: string | null;
}

export interface InvoicePropertyRef {
  id: string;
  title: string | null;
  suburb: string | null;
  city: string | null;
  province: string | null;
}

export interface InvoiceResponse {
  id: string;
  invoiceRef: string;
  applicationId: string;
  tenantId: string;
  status: InvoiceStatus;
  depositAmount: number;
  firstMonthRent: number | null;
  totalAmount: number;
  issuedAt: string;
  expiresAt: string | null;
  paidAt: string | null;
  paymentReference: string | null;
  createdAt: string;
  application: InvoiceApplicationRef;
  unit: InvoiceUnitRef;
  property: InvoicePropertyRef;
}

export interface PayInvoicePayload {
  paymentReference?: string;
}

export interface InvoicesApi {
  listMine(): Promise<InvoiceResponse[]>;
  get(invoiceId: string): Promise<InvoiceResponse>;
  pay(invoiceId: string, payload?: PayInvoicePayload): Promise<InvoiceResponse>;
}

export function createInvoicesApi(client: ApiClient): InvoicesApi {
  return {
    listMine() {
      return client.get<InvoiceResponse[]>("/invoices/me");
    },
    get(invoiceId) {
      return client.get<InvoiceResponse>(`/invoices/${invoiceId}`);
    },
    pay(invoiceId, payload) {
      return client.post<InvoiceResponse>(`/invoices/${invoiceId}/pay`, payload ?? {});
    },
  };
}
