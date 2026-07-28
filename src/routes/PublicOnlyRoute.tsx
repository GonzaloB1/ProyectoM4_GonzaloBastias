import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";

export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}