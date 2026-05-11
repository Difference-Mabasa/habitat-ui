/**
 * Habitat API client (talks to the backroom-api backend service).
 *
 * Dev: requests to /api are proxied to http://localhost:8080 (see vite.config.ts).
 * Prod: set VITE_API_BASE_URL to the deployed backroom-api origin.
 */
const BASE = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestInitWithJson = Omit<RequestInit, "body"> & { body?: unknown };

export async function api<T>(
  path: string,
  init: RequestInitWithJson = {},
): Promise<T> {
  const { body, headers, ...rest } = init;
  const res = await fetch(`${BASE}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await res.text();
  const data = text ? (JSON.parse(text) as unknown) : null;

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && "message" in data
        ? String((data as { message: unknown }).message)
        : null) ?? `Request failed: ${res.status}`;
    throw new ApiError(res.status, data, message);
  }
  return data as T;
}
