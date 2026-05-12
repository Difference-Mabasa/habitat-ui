import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSession, type Role } from "./session";

export interface RequireAuthProps {
  children: ReactNode;
  /** If set, the signed-in user must hold at least one of these roles. */
  roles?: Role[];
}

export default function RequireAuth({ children, roles }: RequireAuthProps) {
  const { user } = useSession();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/auth"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  if (roles && !roles.some((r) => user.roles.includes(r))) {
    return <Navigate to="/landing" replace />;
  }

  return <>{children}</>;
}
