import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
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
      </ul>
    </div>
  );
}

export default Sidebar;