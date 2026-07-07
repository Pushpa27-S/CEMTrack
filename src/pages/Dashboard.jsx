import React from "react";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">

      <div className="sidebar">
        <h2>CEMTrack</h2>

        <ul>
          <li>🏠 Dashboard</li>
          <li>📦 Products</li>
          <li>👥 Customers</li>
          <li>🧾 Billing</li>
          <li>📊 Reports</li>
        </ul>
      </div>

      <div className="main-content">

        <h1>Dashboard</h1>
        <p>Welcome back, Admin 👋</p>

        <div className="cards">

          <div className="card">
            <h2>120</h2>
            <p>Total Products</p>
          </div>

          <div className="card">
            <h2>58</h2>
            <p>Customers</p>
          </div>

          <div className="card">
            <h2>340</h2>
            <p>Stock Bags</p>
          </div>

          <div className="card">
            <h2>₹1,25,000</h2>
            <p>Total Sales</p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;