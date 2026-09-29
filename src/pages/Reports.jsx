import React, { useEffect, useState } from "react";
import "./Reports.css";

function Reports() {

  // =====================================================
  // REPORT API
  // =====================================================

  const REPORT_API_URL =
    "http://localhost:5000/api/admin/reports";


  // =====================================================
  // REPORT DATA
  // =====================================================

  const [reports, setReports] = useState([]);

  const [summary, setSummary] = useState({
    totalSales: 0,
    totalRevenue: 0,
    customers: 0,
    bestSeller: "N/A",
  });


  // =====================================================
  // LOADING
  // =====================================================

  const [loading, setLoading] = useState(true);


  // =====================================================
  // ERROR
  // =====================================================

  const [error, setError] = useState("");


  // =====================================================
  // FETCH REPORTS
  // =====================================================

  useEffect(() => {

    fetchReports();

  }, []);


  const fetchReports = async () => {

    try {

      setLoading(true);

      setError("");


      const response = await fetch(
        REPORT_API_URL
      );


      if (!response.ok) {

        throw new Error(
          `HTTP error: ${response.status}`
        );

      }


      const data = await response.json();


      if (data.success) {

        setReports(
          data.reports || []
        );


        setSummary({

          totalSales:
            Number(
              data.summary?.totalSales || 0
            ),

          totalRevenue:
            Number(
              data.summary?.totalRevenue || 0
            ),

          customers:
            Number(
              data.summary?.customers || 0
            ),

          bestSeller:
            data.summary?.bestSeller ||
            "N/A",

        });

      }

      else {

        setError(
          data.message ||
          "Failed to load reports"
        );

      }

    }

    catch (error) {

      console.error(
        "Error fetching reports:",
        error
      );


      setError(
        "Unable to load sales reports."
      );

    }

    finally {

      setLoading(false);

    }

  };


  // =====================================================
  // DOWNLOAD REPORT
  // =====================================================

  const downloadReport = () => {

    if (reports.length === 0) {

      alert(
        "No report data available to download."
      );

      return;

    }


    const headers =
      "ID,Date,Customer,Product,Quantity,Amount\n";


    const rows = reports

      .map(
        (report) =>
          `${report.id},${report.date},${report.customer},${report.product},${report.quantity},${report.amount}`
      )

      .join("\n");


    const csv =
      headers + rows;


    const blob = new Blob(
      [csv],
      {
        type: "text/csv",
      }
    );


    const url =
      window.URL.createObjectURL(
        blob
      );


    const link =
      document.createElement("a");


    link.href = url;


    link.download =
      "CemTrack_Sales_Report.csv";


    document.body.appendChild(
      link
    );


    link.click();


    document.body.removeChild(
      link
    );


    window.URL.revokeObjectURL(
      url
    );

  };


  // =====================================================
  // PRINT REPORT
  // =====================================================

  const printReport = () => {

    window.print();

  };


  // =====================================================
  // FORMAT REVENUE
  // =====================================================

  const formatAmount = (amount) => {

    return `₹${Number(
      amount || 0
    ).toLocaleString("en-IN")}`;

  };


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="reports-container">


      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="reports-header">

        <h1>
          Sales Reports
        </h1>

        <p>
          View and manage your sales reports
        </p>

      </div>


      {/* =================================================
          REPORT CARDS
      ================================================= */}

      <div className="report-cards">


        {/* TOTAL SALES */}

        <div className="card">

          <h3>
            Total Sales
          </h3>

          <p>

            {loading
              ? "Loading..."
              : `${summary.totalSales} Bags`}

          </p>

        </div>


        {/* TOTAL REVENUE */}

        <div className="card">

          <h3>
            Total Revenue
          </h3>

          <p>

            {loading
              ? "Loading..."
              : formatAmount(
                  summary.totalRevenue
                )}

          </p>

        </div>


        {/* CUSTOMERS */}

        <div className="card">

          <h3>
            Customers
          </h3>

          <p>

            {loading
              ? "Loading..."
              : summary.customers}

          </p>

        </div>


        {/* BEST SELLER */}

        <div className="card">

          <h3>
            Best Seller
          </h3>

          <p>

            {loading
              ? "Loading..."
              : summary.bestSeller}

          </p>

        </div>

      </div>


      {/* =================================================
          ERROR MESSAGE
      ================================================= */}

      {error && (

        <p
          style={{
            color: "red",
            textAlign: "center",
            marginTop: "15px",
          }}
        >

          {error}

        </p>

      )}


      {/* =================================================
          BUTTONS
      ================================================= */}

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


        {/* =================================================
            BILL HEADING
        ================================================= */}

        <div className="print-header">

          <h1>
            CemTrack
          </h1>

          <h2>
            Sales Bill
          </h2>

          <p>
            Cement Sales Report
          </p>

        </div>


        {/* =================================================
            BILL SUMMARY
        ================================================= */}

        <div className="bill-summary">


          <div>

            <strong>
              Total Sales:
            </strong>

            <span>

              {loading
                ? "Loading..."
                : `${summary.totalSales} Bags`}

            </span>

          </div>


          <div>

            <strong>
              Total Revenue:
            </strong>

            <span>

              {loading
                ? "Loading..."
                : formatAmount(
                    summary.totalRevenue
                  )}

            </span>

          </div>


          <div>

            <strong>
              Customers:
            </strong>

            <span>

              {loading
                ? "Loading..."
                : summary.customers}

            </span>

          </div>


          <div>

            <strong>
              Best Seller:
            </strong>

            <span>

              {loading
                ? "Loading..."
                : summary.bestSeller}

            </span>

          </div>

        </div>


        {/* =================================================
            BILL TABLE
        ================================================= */}

        <table className="reports-table">


          <thead>

            <tr>

              <th>
                ID
              </th>

              <th>
                Date
              </th>

              <th>
                Customer
              </th>

              <th>
                Product
              </th>

              <th>
                Quantity
              </th>

              <th>
                Amount
              </th>

            </tr>

          </thead>


          <tbody>


            {loading ? (

              <tr>

                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                  }}
                >

                  Loading sales reports...

                </td>

              </tr>

            ) : reports.length === 0 ? (

              <tr>

                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                  }}
                >

                  No sales records found.

                </td>

              </tr>

            ) : (

              reports.map(
                (report) => (

                  <tr
                    key={report.id}
                  >

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
                      {formatAmount(
                        report.amount
                      )}
                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>


        {/* =================================================
            BILL FOOTER
        ================================================= */}

        <div className="bill-footer">

          <p>
            Thank you for your business!
          </p>

          <p>

            <strong>
              CemTrack Cement Shop
            </strong>

          </p>

        </div>


      </div>


    </div>

  );

}

export default Reports;