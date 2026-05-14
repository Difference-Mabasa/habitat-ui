import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Nav from "@/components/Nav";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Badge from "@/components/Badge";
import Icon from "@/components/Icon";
import ProgressBar from "@/components/ProgressBar";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import ApplicationProgressStepper from "@/components/ApplicationProgressStepper";
import { STEP_INDEX } from "@/lib/applicationSteps";
import { useViewport } from "@/hooks/useViewport";
import { useSession } from "@/lib/session";
import { toast } from "@/lib/toast";
import {
  createApplicationsApi,
  type ApplicationDocumentResponse,
  type ApplicationResponse,
  type DocumentType,
  type RequiredDocumentsResponse,
} from "@/lib/api/applications";
import type { PropertyDetail, UnitDetail } from "@/lib/api/properties";

interface NavState {
  application?: ApplicationResponse;
  property?: Pick<PropertyDetail, "id" | "title" | "suburb" | "city">;
  unit?: Pick<UnitDetail, "id" | "title">;
}

const DOC_LABEL: Record<DocumentType, string> = {
  SA_ID: "South African ID",
  PASSPORT: "Passport",
  PAYSLIPS_3_MONTHS: "Last 3 payslips",
  BANK_STATEMENTS_3_MONTHS: "Last 3 bank statements",
  EMPLOYMENT_LETTER: "Employment letter",
  PROOF_OF_ADDRESS: "Proof of address",
};

const DOC_HINT: Record<DocumentType, string> = {
  SA_ID: "A clear scan or photo of both sides.",
  PASSPORT: "Used when you don't have an SA ID. Photo page only.",
  PAYSLIPS_3_MONTHS: "PDF or image. Most recent 3 months in one file is fine.",
  BANK_STATEMENTS_3_MONTHS: "Bank-stamped or PDF download. Most recent 3 months.",
  EMPLOYMENT_LETTER: "On the employer's letterhead, dated within the last 30 days.",
  PROOF_OF_ADDRESS: "Utility bill, lease, or bank statement — no older than 3 months.",
};

export default function UploadDocuments() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSm } = useViewport();
  const state = (location.state as NavState | null) ?? {};

  const session = useSession();
  const api = useMemo(() => createApplicationsApi(session.client), [session.client]);

  const application = state.application;

  const [data, setData] = useState<RequiredDocumentsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!application) {
      setLoading(false);
      setError("This page needs to be opened from a freshly-submitted application.");
      return;
    }
    let cancelled = false;
    void api.listDocuments(application.id).then(
      (res) => {
        if (cancelled) return;
        setData(res);
        setLoading(false);
      },
      (err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Couldn't load required documents.");
        setLoading(false);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [api, application]);

  if (loading) {
    return (
      <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
        <Nav role="tenant" />
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 32px" }}>
          <LoadingState rows={4} />
        </div>
      </div>
    );
  }

  if (error || !data || !application) {
    return (
      <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
        <Nav role="tenant" />
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 32px" }}>
          <EmptyState
            icon="doc"
            title="Couldn't load required documents"
            description={error ?? "Open this page from the apply flow."}
            actions={
              <Link to="/my-apps" style={{ textDecoration: "none" }}>
                <Button variant="accent">My applications</Button>
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const uploadedByType = new Map<DocumentType, ApplicationDocumentResponse>();
  data.uploaded.forEach((u) => uploadedByType.set(u.docType, u));
  const uploadedCount = data.required.filter((d) => uploadedByType.has(d)).length;
  const allUploaded = data.required.length > 0 && uploadedCount === data.required.length;

  async function handleUploaded(docType: DocumentType, fresh: ApplicationDocumentResponse) {
    // Refresh from server to pick up any side-effects (status transition,
    // verified bumps) — small payload, worth the round-trip for honesty.
    const refreshed = await api.listDocuments(application!.id);
    setData(refreshed);
    toast.success(`${DOC_LABEL[docType]} uploaded.`);
    // If this upload completed the set, jump to success.
    const nowCount = refreshed.required.filter((d) =>
      refreshed.uploaded.some((u) => u.docType === d),
    ).length;
    if (refreshed.required.length > 0 && nowCount === refreshed.required.length) {
      setTimeout(() => {
        navigate("/apply/success", {
          state: {
            application: { ...application!, status: "DOCUMENTS_SUBMITTED" },
            property: state.property,
            unit: state.unit,
          },
        });
      }, 600);
    }
    return fresh;
  }

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />

      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: isSm ? "20px 16px 64px" : "32px 32px 96px",
        }}
      >
        <ApplicationProgressStepper currentStep={STEP_INDEX.Documents} />
        <Eyebrow style={{ marginBottom: 12 }}>One last step</Eyebrow>
        <h1
          style={{
            fontSize: 32,
            letterSpacing: "-0.025em",
            lineHeight: 1.1,
            fontWeight: 500,
            margin: "0 0 8px",
          }}
        >
          Upload your supporting documents
        </h1>
        <p style={{ fontSize: 14, color: "var(--slate)", margin: "0 0 24px" }}>
          {state.unit && state.property
            ? `The landlord at ${state.property.title} asks for these before reviewing your application for ${state.unit.title}.`
            : "The landlord asks for these before reviewing your application."}
        </p>

        <Card padding={16} style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600 }}>
              {uploadedCount} of {data.required.length} uploaded
            </span>
            {allUploaded ? (
              <Badge tone="success" leftIcon="check">
                Complete
              </Badge>
            ) : (
              <Badge tone="warn">In progress</Badge>
            )}
          </div>
          <ProgressBar
            value={data.required.length === 0 ? 100 : (uploadedCount / data.required.length) * 100}
          />
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {data.required.map((docType) => (
            <DocumentRow
              key={docType}
              docType={docType}
              uploaded={uploadedByType.get(docType) ?? null}
              onUpload={async (payload) => {
                const saved = await api.uploadDocument(application.id, {
                  docType,
                  fileName: payload.fileName,
                  fileUrl: payload.fileUrl,
                });
                return handleUploaded(docType, saved);
              }}
            />
          ))}
        </div>

        <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
          {allUploaded ? (
            <Button
              variant="accent"
              size="lg"
              rightIcon="arrR"
              onClick={() =>
                navigate("/apply/success", {
                  state: {
                    application: { ...application, status: "DOCUMENTS_SUBMITTED" },
                    property: state.property,
                    unit: state.unit,
                  },
                })
              }
            >
              Continue
            </Button>
          ) : null}
          <Link to="/my-apps" style={{ textDecoration: "none" }}>
            <Button variant="ghost" size="lg">
              Finish later
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function DocumentRow({
  docType,
  uploaded,
  onUpload,
}: {
  docType: DocumentType;
  uploaded: ApplicationDocumentResponse | null;
  onUpload: (payload: { fileName: string; fileUrl: string }) => Promise<unknown>;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);

  async function handlePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      // Real file storage lands in a later slice — for now we POST the
      // filename + a stub URL so the landlord-side review can see what
      // the tenant claimed to upload. Swap to multipart once the
      // StorageService ships.
      await onUpload({
        fileName: file.name,
        fileUrl: `/uploads/stub/${docType}/${file.name}`,
      });
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message?: string }).message ?? "Upload failed.")
          : "Upload failed.";
      toast.error(msg);
    } finally {
      setBusy(false);
      // Reset the input so re-selecting the same file triggers onChange again.
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <Card padding={16}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          gap: 14,
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            background: uploaded ? "var(--success-soft)" : "var(--surface-2)",
            color: uploaded ? "var(--success)" : "var(--slate)",
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          <Icon name={uploaded ? "check" : "doc"} size={18} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>
            {DOC_LABEL[docType]}
          </div>
          <div
            style={{
              fontSize: 12,
              color: uploaded ? "var(--ink)" : "var(--slate)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {uploaded ? uploaded.fileName : DOC_HINT[docType]}
          </div>
        </div>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handlePick}
            style={{ display: "none" }}
            id={`doc-${docType}`}
          />
          <Button
            variant={uploaded ? "ghost" : "secondary"}
            size="sm"
            leftIcon="upload"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
          >
            {busy ? "Uploading…" : uploaded ? "Replace" : "Upload"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
