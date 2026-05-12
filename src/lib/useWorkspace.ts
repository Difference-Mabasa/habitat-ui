import { useSearchParams } from "react-router-dom";

export type Workspace = "landlord" | "agent";

/**
 * Reads the `?ctx=` query param to decide which shell a shared screen
 * (applicant / viewings / notifications) should render. Defaults to
 * landlord context. Pass `?ctx=agent` from the agent sidebar links.
 */
export function useWorkspace(defaultWorkspace: Workspace = "landlord"): Workspace {
  const [params] = useSearchParams();
  const ctx = params.get("ctx");
  if (ctx === "agent" || ctx === "landlord") return ctx;
  return defaultWorkspace;
}
