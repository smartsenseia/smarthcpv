import { Navigate, Outlet, useLocation } from "react-router-dom";

function hasToken() {
  return Boolean(localStorage.getItem("access_token"));
}

export default function ProtectedRoute() {
  const location = useLocation();

  if (!hasToken()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
