import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { isSuperAdmin } from "@/lib/auth";

export function SuperAdminRoute() {
  const user = useAuthStore((s) => s.user);

  if (!isSuperAdmin(user)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
