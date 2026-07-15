import { Link } from "react-router-dom";
import {useNavigate} from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    const confirmLayout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      navigate("/login",{replace: true});
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
        <li><button onClick={handleLogout}>Logout</button></li>
      </ul>
    </div>
  );
}

export default Sidebar;