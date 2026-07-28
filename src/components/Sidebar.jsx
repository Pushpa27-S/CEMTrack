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

  return (

    <div className="sidebar">

      <h2>CEMTrack</h2>

      <ul>

        <li><Link to="/dashboard">Dashboard</Link></li>

        <li><Link to="/products">Products</Link></li>

        <li><Link to="/customers">Customers</Link></li>

        <li><Link to="/billing">Billing</Link></li>

        <li><Link to="/reports">Reports</Link></li>

        <li><Link to="/stock">Stock</Link></li>

        <li>
          <li>

  <button className="logout-btn"
   onClick={handleLogout}>
    Logout
  </button>
</li>
        </li>

      </ul>

    </div>

  );

}


export default Sidebar;