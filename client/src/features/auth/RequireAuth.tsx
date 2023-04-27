import { type ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";

import useAuth from "@/hooks/useAuth";

function RequireAuth(): ReactElement {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? <Outlet /> : <Navigate to="/auth/login" />;
}

export default RequireAuth;
