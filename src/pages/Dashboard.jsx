import React from "react";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-container">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2>CEMTrack</h2>

        <ul>
          <li>🏠 Dashboard</li>
          <li>📦 Products</li>
          <li>👥 Customers</li>
          <li>📊 Stock</li>
          <li>💰 Sales</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">

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

      </main>

    </div>
  );
}

export default Dashboard;