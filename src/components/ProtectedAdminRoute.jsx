import { Navigate, Outlet } from "react-router-dom";

function ProtectedAdminRoute() {
  const adminLoggedIn =
    localStorage.getItem("adminLoggedIn") === "true";

  const adminToken =
    localStorage.getItem("adminToken");

  if (!adminLoggedIn || !adminToken) {
    return <Navigate to="/adminlogin" replace />;
  }

  return <Outlet />;
}

export default ProtectedAdminRoute;