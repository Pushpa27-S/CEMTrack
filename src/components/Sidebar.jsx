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

    <li>
      <Link to="/dashboard">
        Dashboard
      </Link>
    </li>

    <li>
      <Link to="/products">
        Products
      </Link>
    </li>

    <li>
      <Link to="/customers">
        Customers
      </Link>
    </li>

    <li>
      <Link to="/billing">
        Billing
      </Link>
    </li>

    <li>
      <Link to="/reports">
        Reports
      </Link>
    </li>

    <li>
      <Link to="/stock">
        Stock
      </Link>
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

    {/* Add Product */}

    <li className="add-product-item">

      <button
        className="add-product-sidebar-btn"
        onClick={handleAddProduct}
      >
        + Add Product
      </button>

    </li>

  </ul>

</div>

);

}

export default Sidebar;