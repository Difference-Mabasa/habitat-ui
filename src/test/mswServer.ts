import { setupServer } from "msw/node";
import { handlers } from "./mswHandlers";

/**
 * The MSW server is shared across the entire test run (see setup.ts).
 * Tests can override individual responses with `server.use(...)` and we
 * reset between tests so isolation holds.
 */
export const server = setupServer(...handlers);
