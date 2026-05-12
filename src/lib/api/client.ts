/**
 * Tiny fetch wrapper around the habitat-api.
 *
 * Responsibilities:
 *  1. Build the full URL from a path-only string.
 *  2. Auto-inject the Bearer token from a getter callback.
 *  3. Parse `ApiError` responses into typed exceptions.
 *  4. Single-flight refresh on 401 — if the wrapper sees an expired access
 *     token, it asks the refresh callback for a new one and replays the
 *     original request exactly once.
 *
 * The session layer (SessionProvider) is the only consumer that supplies
 * the token getters + refresh callback. Tests can swap them out via the
 * createClient factory.
 */

const DEFAULT_BASE_URL = "/api/v1";

export interface ApiErrorBody {
  status: number;
  code: string;
  message: string;
  requestId?: string;
  timestamp?: string;
  errors?: Array<{ field: string; message: string }>;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly requestId?: string;
  readonly fieldErrors?: Array<{ field: string; message: string }>;

  constructor(body: ApiErrorBody) {
    super(body.message);
    this.name = "ApiError";
    this.status = body.status;
    this.code = body.code;
    this.requestId = body.requestId;
    this.fieldErrors = body.errors;
  }
}

export interface ApiClientOptions {
  baseUrl?: string;
  getAccessToken?: () => string | null;
  /** Asked for a new access token after a 401. Return null to give up. */
  refreshAccessToken?: () => Promise<string | null>;
  /** Called when refresh fails — usually drives a sign-out + redirect. */
  onAuthFailure?: () => void;
  /** Test override — swap out global fetch. */
  fetchImpl?: typeof fetch;
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  /** Body will be JSON-stringified unless it's a FormData. */
  body?: unknown;
  /** When true, the wrapper won't try to refresh on 401. */
  skipAuthRefresh?: boolean;
}

export interface ApiClient {
  get<T>(path: string, opts?: RequestOptions): Promise<T>;
  post<T>(path: string, body?: unknown, opts?: RequestOptions): Promise<T>;
  patch<T>(path: string, body?: unknown, opts?: RequestOptions): Promise<T>;
  put<T>(path: string, body?: unknown, opts?: RequestOptions): Promise<T>;
  delete<T>(path: string, opts?: RequestOptions): Promise<T>;
  request<T>(method: string, path: string, opts?: RequestOptions): Promise<T>;
}

export function createClient(options: ApiClientOptions = {}): ApiClient {
  const baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
  const fetchImpl = options.fetchImpl ?? globalThis.fetch.bind(globalThis);

  async function executeRequest(
    method: string,
    path: string,
    opts: RequestOptions,
    isRetry: boolean,
  ): Promise<Response> {
    const headers = new Headers(opts.headers);
    const isJson = opts.body !== undefined && !(opts.body instanceof FormData);
    if (isJson && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    if (!headers.has("Accept")) headers.set("Accept", "application/json");

    const token = options.getAccessToken?.();
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const init: RequestInit = {
      ...opts,
      method,
      headers,
      body:
        opts.body === undefined
          ? undefined
          : opts.body instanceof FormData
            ? opts.body
            : JSON.stringify(opts.body),
    };

    const res = await fetchImpl(buildUrl(baseUrl, path), init);

    if (res.status === 401 && !opts.skipAuthRefresh && !isRetry && options.refreshAccessToken) {
      const next = await options.refreshAccessToken().catch(() => null);
      if (!next) {
        options.onAuthFailure?.();
        return res;
      }
      // Replay with the new token, but ONLY once — `isRetry` flag prevents loops.
      return executeRequest(method, path, opts, true);
    }

    return res;
  }

  async function request<T>(method: string, path: string, opts: RequestOptions = {}): Promise<T> {
    const res = await executeRequest(method, path, opts, false);

    if (res.status === 204 || res.headers.get("Content-Length") === "0") {
      return undefined as T;
    }

    const text = await res.text();
    if (!res.ok) {
      throw new ApiError(parseError(text, res.status));
    }
    if (!text) return undefined as T;
    try {
      return JSON.parse(text) as T;
    } catch {
      throw new ApiError({
        status: res.status,
        code: "MALFORMED_JSON",
        message: "Response body was not valid JSON.",
      });
    }
  }

  return {
    request,
    get: (path, opts) => request("GET", path, opts),
    post: (path, body, opts) => request("POST", path, { ...opts, body }),
    patch: (path, body, opts) => request("PATCH", path, { ...opts, body }),
    put: (path, body, opts) => request("PUT", path, { ...opts, body }),
    delete: (path, opts) => request("DELETE", path, opts),
  };
}

function buildUrl(baseUrl: string, path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith(baseUrl)) return path;
  return `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

function parseError(text: string, status: number): ApiErrorBody {
  try {
    const parsed = JSON.parse(text) as Partial<ApiErrorBody>;
    return {
      status: parsed.status ?? status,
      code: parsed.code ?? "UNKNOWN_ERROR",
      message: parsed.message ?? "Request failed.",
      requestId: parsed.requestId,
      timestamp: parsed.timestamp,
      errors: parsed.errors,
    };
  } catch {
    return {
      status,
      code: "UNKNOWN_ERROR",
      message: text || "Request failed.",
    };
  }
}
