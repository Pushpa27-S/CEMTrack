import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (confirmLogout) {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("role");

      navigate("/adminlogin", { replace: true });
    }
  };

  const handleAddProduct = () => {
    navigate("/products", {
      state: { openAddProduct: true }
    });
  };

  return (
    <div className="sidebar">

      <h2>CEMTrack</h2>

      <ul>

        {/* Dashboard */}
        <li>
          <Link to="/dashboard">
            Dashboard
          </Link>
        </li>

        {/* Products */}
        <li>
          <Link to="/products">
            Products
          </Link>
        </li>

        {/* Customers */}
        <li>
          <Link to="/customers">
            Customers
          </Link>
        </li>

        {/* Orders */}
        <li>
          <Link to="/adminorders">
            Orders
          </Link>
        </li>

        {/* Billing */}
        <li>
          <Link to="/billing">
            Billing
          </Link>
        </li>

        {/* Reports */}
        <li>
          <Link to="/reports">
            Reports
          </Link>
        </li>

        {/* Stock */}
        <li>
          <Link to="/stock">
            Stock
          </Link>
        </li>

        {/* Add Product */}
        <li>
          <button
            className="sidebar-link-button"
            onClick={handleAddProduct}
          >
            Add Product
          </button>
        </li>

        {/* Logout */}
        <li>
          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </li>

      </ul>

    </div>
  );
}

export default Sidebar;