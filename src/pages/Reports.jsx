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

  // =========================
  // DOWNLOAD REPORT
  // =========================

  const downloadReport = () => {

    const headers =
      "ID,Date,Customer,Product,Quantity,Amount\n";

    const rows = reports
      .map(
        (report) =>
          `${report.id},${report.date},${report.customer},${report.product},${report.quantity},${report.amount}`
      )
      .join("\n");

    const csv = headers + rows;

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "CemTrack_Sales_Report.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  };


  // =========================
  // PRINT REPORT
  // =========================

  const printReport = () => {
    window.print();
  };


  return (

    <div className="reports-container">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="reports-header">

        <h1>Sales Reports</h1>

        <p>
          View and manage your sales reports
        </p>

      </div>


      {/* =========================
          REPORT CARDS
      ========================= */}

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


      {/* =========================
          BUTTONS
      ========================= */}

      <div className="report-buttons">

        <button
          className="download-btn"
          onClick={downloadReport}
        >
          Download Report
        </button>


        <button
          className="print-btn"
          onClick={printReport}
        >
          Print Report
        </button>

      </div>


      {/* =================================================
          ONLY THIS SECTION WILL BE PRINTED
      ================================================= */}

      <div className="print-bill">

        {/* Bill Heading */}

        <div className="print-header">

          <h1>CemTrack</h1>

          <h2>Sales Bill</h2>

          <p>
            Cement Sales Report
          </p>

        </div>


        {/* Bill Summary */}

        <div className="bill-summary">

          <div>
            <strong>Total Sales:</strong>
            <span>225 Bags</span>
          </div>

          <div>
            <strong>Total Revenue:</strong>
            <span>₹92,725</span>
          </div>

          <div>
            <strong>Customers:</strong>
            <span>5</span>
          </div>

          <div>
            <strong>Best Seller:</strong>
            <span>UltraTech</span>
          </div>

        </div>


        {/* =========================
            BILL TABLE
        ========================= */}

        <table className="reports-table">

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

                <td>
                  {report.id}
                </td>

                <td>
                  {report.date}
                </td>

                <td>
                  {report.customer}
                </td>

                <td>
                  {report.product}
                </td>

                <td>
                  {report.quantity}
                </td>

                <td>
                  {report.amount}
                </td>

              </tr>

            ))}

          </tbody>

        </table>


        {/* =========================
            BILL FOOTER
        ========================= */}

        <div className="bill-footer">

          <p>
            Thank you for your business!
          </p>

          <p>
            <strong>CemTrack Cement Shop</strong>
          </p>

        </div>

      </div>

    </div>

  );
}

export default Reports;