import React from "react";
import "./Home.css";

function Home() {
  return (
    <div className="home">

      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">CemTrack</h2>

        <ul>
          <li>🏠 Dashboard</li>
          <li>📦 Products</li>
          <li>👥 Customers</li>
          <li>🧾 Billing</li>
          <li>📊 Reports</li>
          <li>⚙️ Settings</li>
          <li>🚪 Logout</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main">

        {/* Navbar */}
        <div className="navbar">
          <h2>Dashboard</h2>

          <div className="profile">
            <span>Welcome, Admin</span>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="cards">

          <div className="card">
            <h3>Products</h3>
            <h1>120</h1>
            <p>Total Products</p>
          </div>

          <div className="card">
            <h3>Customers</h3>
            <h1>56</h1>
            <p>Registered Customers</p>
          </div>

          <div className="card">
            <h3>Sales</h3>
            <h1>₹1,25,000</h1>
            <p>Today's Sales</p>
          </div>

          <div className="card">
            <h3>Orders</h3>
            <h1>18</h1>
            <p>Pending Orders</p>
          </div>

        </div>

        {/* Recent Activity */}
        <div className="table-section">

          <h2>Recent Transactions</h2>

          <table>
            <thead>
              <tr>
                <th>Bill No</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>1001</td>
                <td>Rahul</td>
                <td>₹25,000</td>
                <td>Paid</td>
              </tr>

              <tr>
                <td>1002</td>
                <td>Aman</td>
                <td>₹18,500</td>
                <td>Pending</td>
              </tr>

              <tr>
                <td>1003</td>
                <td>Priya</td>
                <td>₹32,700</td>
                <td>Paid</td>
              </tr>

            </tbody>
          </table>

        </div>

      </div>

    </div>
  );
}

export default Home;