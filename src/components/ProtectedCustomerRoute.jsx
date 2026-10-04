import { Navigate, Outlet } from "react-router-dom";

function ProtectedCustomerRoute() {
  const customerLoggedIn =
    localStorage.getItem("customerLoggedIn") === "true";

  const customerToken =
    localStorage.getItem("token");

  if (!customerLoggedIn || !customerToken) {
    return <Navigate to="/customerlogin" replace />;
  }

  return <Outlet />;
}

export default ProtectedCustomerRoute;