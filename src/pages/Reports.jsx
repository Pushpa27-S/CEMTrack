import React from "react";
import "./Reports.css";

function Reports() {
  const reports = [
    {
      id: 1,
      date: "01-03-2025",
      customer: "Rahul Sharma",
      product: "UltraTech Cement",
      quantity: 50,
      amount: "₹21,000",
    },
    {
      id: 2,
      date: "02-03-2025",
      customer: "Priya Singh",
      product: "ACC Cement",
      quantity: 40,
      amount: "₹16,000",
    },
    {
      id: 3,
      date: "03-03-2025",
      customer: "Arjun Kumar",
      product: "Ramco Cement",
      quantity: 60,
      amount: "₹24,900",
    },
    {
      id: 4,
      date: "04-03-2025",
      customer: "Sneha Patel",
      product: "Ambuja Cement",
      quantity: 30,
      amount: "₹11,700",
    },
    {
      id: 5,
      date: "05-03-2025",
      customer: "Ramesh Gowda",
      product: "Maha Cement",
      quantity: 45,
      amount: "₹19,125",
    },
  ];

  return (
    <div className="reports-container">

      <h1>Sales Reports</h1>

      <div className="report-cards">

        <div className="card">
          <h3>Total Sales</h3>
          <p>225 Bags</p>
        </div>

        <div className="card">
          <h3>Total Revenue</h3>
          <p>₹92,725</p>
        </div>

        <div className="card">
          <h3>Customers</h3>
          <p>5</p>
        </div>

        <div className="card">
          <h3>Best Seller</h3>
          <p>UltraTech</p>
        </div>

      </div>

      <div className="report-buttons">

        <button className="download-btn">
          Download Report
        </button>

        <button className="print-btn">
          Print Report
        </button>

      </div>

      <table>

        <thead>

          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Amount</th>
          </tr>

        </thead>

        <tbody>

          {reports.map((report) => (

            <tr key={report.id}>

              <td>{report.id}</td>
              <td>{report.date}</td>
              <td>{report.customer}</td>
              <td>{report.product}</td>
              <td>{report.quantity}</td>
              <td>{report.amount}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default Reports;