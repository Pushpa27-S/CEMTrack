import React from "react";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-container">

      <header className="dashboard-header">
        <h1>Dashboard</h1>
      </header>

      <div className="cards">

        <div className="card">
          <h3>Products</h3>
          <p>150</p>
        </div>

        <div className="card">
          <h3>Customers</h3>
          <p>95</p>
        </div>

        <div className="card">
          <h3>Stock</h3>
          <p>520 Bags</p>
        </div>

        <div className="card">
          <h3>Sales</h3>
          <p>₹2,45,000</p>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;