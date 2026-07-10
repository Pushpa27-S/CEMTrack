import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function AdminLayout() {
  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        style={{
          marginLeft: "230px",
          width: "100%",
          padding: "20px",
          background: "#f4f6f9",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;