import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { type ReactElement } from "react";

function RequireAuth(): ReactElement {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
}

export default RequireAuth;
