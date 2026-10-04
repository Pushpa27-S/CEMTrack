import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {

  const navigate = useNavigate();


  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = () => {

    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (confirmLogout) {
      localStorage.removeItem("adminLoggedIn");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("owner");


      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("role");


      navigate(
        "/adminlogin",
        { replace: true }
      );

    }

  };


  // ==================================================
  // ADD PRODUCT
  // ==================================================

  const handleAddProduct = () => {

    navigate(
      "/products",
      {
        state: {
          openAddProduct: true
        }
      }
    );

  };


  return (

    <aside className="sidebar">


      {/* ==================================================
          LOGO
          ================================================== */}

      <div className="sidebar-logo">

        <h2>
          CEM<span>Track</span>
        </h2>

        <p>
          Cement Inventory & Management System
        </p>

      </div>



      {/* ==================================================
          MENU
          ================================================== */}

      <nav className="sidebar-menu">


        {/* DASHBOARD */}

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive
              ? "sidebar-item active"
              : "sidebar-item"
          }
        >

          <span className="sidebar-icon"></span>

          <span>
            Dashboard
          </span>

        </NavLink>



        {/* PRODUCTS */}

        <NavLink
          to="/products"
          className={({ isActive }) =>
            isActive
              ? "sidebar-item active"
              : "sidebar-item"
          }
        >

          <span className="sidebar-icon"></span>

          <span>
            Products
          </span>

        </NavLink>



        {/* CUSTOMERS */}

        <NavLink
          to="/customers"
          className={({ isActive }) =>
            isActive
              ? "sidebar-item active"
              : "sidebar-item"
          }
        >

          <span className="sidebar-icon"></span>

          <span>
            Customers
          </span>

        </NavLink>



        {/* ORDERS */}

        <NavLink
          to="/adminorders"
          className={({ isActive }) =>
            isActive
              ? "sidebar-item active"
              : "sidebar-item"
          }
        >

          <span className="sidebar-icon"></span>

          <span>
            Orders
          </span>

        </NavLink>



        {/* BILLING */}

        <NavLink
          to="/billing"
          className={({ isActive }) =>
            isActive
              ? "sidebar-item active"
              : "sidebar-item"
          }
        >

          <span className="sidebar-icon"></span>

          <span>
            Billing
          </span>

        </NavLink>



        {/* CONTACT MESSAGES */}

        <NavLink
          to="/contact-messages"
          className={({ isActive }) =>
            isActive
              ? "sidebar-item active"
              : "sidebar-item"
          }
        >

          <span className="sidebar-icon"></span>

          <span>
            Contact Messages
          </span>

        </NavLink>



        {/* REPORTS */}

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            isActive
              ? "sidebar-item active"
              : "sidebar-item"
          }
        >

          <span className="sidebar-icon"></span>

          <span>
            Reports
          </span>

        </NavLink>



        {/* STOCK */}

        <NavLink
          to="/stock"
          className={({ isActive }) =>
            isActive
              ? "sidebar-item active"
              : "sidebar-item"
          }
        >

          <span className="sidebar-icon"></span>

          <span>
            Stock
          </span>

        </NavLink>



        {/* ADD PRODUCT */}

        <button
          type="button"
          className="sidebar-item sidebar-button"
          onClick={handleAddProduct}
        >

          <span className="sidebar-icon"></span>

          <span>
            Add Product
          </span>

        </button>



        {/* LOGOUT */}

        <button
          type="button"
          className="sidebar-item logout-button"
          onClick={handleLogout}
        >

          <span className="sidebar-icon"></span>

          <span>
            Logout
          </span>

        </button>


      </nav>

    </aside>

  );

}

export default Sidebar;