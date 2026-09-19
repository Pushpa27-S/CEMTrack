import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

function Billing() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // FETCH BILLING DATA
  // =========================
  const fetchBills = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/admin/billing`);

      if (!response.ok) {
        throw new Error("Failed to fetch billing data");
      }

      const data = await response.json();
      setBills(data.bills || []);
    } catch (err) {
      console.error("Billing error:", err);
      setError("Cannot connect to billing backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  // =========================
  // DATE
  // =========================
  const formatDate = (date) => {
    if (!date) return "-";

    const d = new Date(date);

    if (isNaN(d.getTime())) {
      return date;
    }

    return d.toLocaleDateString("en-IN");
  };

  // =========================
  // MONEY
  // =========================
  const formatMoney = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // =========================
  // PRINT BILL
  // =========================
  const printBill = (bill) => {
    const printWindow = window.open(
      "",
      "_blank",
      "width=900,height=700"
    );

    if (!printWindow) {
      alert("Please allow pop-ups to print the bill.");
      return;
    }

    const invoiceNo =
      bill.invoice ||
      `INV${String(bill.order_id).padStart(3, "0")}`;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>

        <title>${invoiceNo} - CEMTrack Invoice</title>

        <style>

          * {
            box-sizing: border-box;
          }

          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 30px;
            color: #222;
            background: white;
          }

          .invoice {
            max-width: 850px;
            margin: auto;
            border: 1px solid #ddd;
            padding: 35px;
          }

          .header {
            text-align: center;
            border-bottom: 2px solid #222;
            padding-bottom: 20px;
            margin-bottom: 25px;
          }

          .company {
            font-size: 32px;
            font-weight: bold;
          }

          .subtitle {
            color: #666;
            margin-top: 5px;
          }

          .invoice-title {
            font-size: 24px;
            font-weight: bold;
            margin-top: 18px;
          }

          .info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 25px;
            line-height: 1.8;
          }

          .customer {
            background: #f7f7f7;
            border: 1px solid #ddd;
            padding: 15px;
            margin-bottom: 25px;
            line-height: 1.8;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th {
            background: #f56600;
            color: white;
            padding: 12px;
            border: 1px solid #ddd;
          }

          td {
            padding: 12px;
            border: 1px solid #ddd;
          }

          .right {
            text-align: right;
          }

          .center {
            text-align: center;
          }

          .summary {
            width: 350px;
            margin-left: auto;
            margin-top: 25px;
          }

          .summary div {
            display: flex;
            justify-content: space-between;
            padding: 8px;
          }

          .grand-total {
            border-top: 2px solid #222;
            font-size: 18px;
            font-weight: bold;
          }

          .footer {
            text-align: center;
            margin-top: 40px;
            border-top: 1px solid #ddd;
            padding-top: 20px;
            color: #666;
          }

          @media print {
            @page {
              size: A4;
              margin: 15mm;
            }

            body {
              padding: 0;
            }

            .invoice {
              border: none;
            }
          }

        </style>

      </head>

      <body>

        <div class="invoice">

          <div class="header">

            <div class="company">
              CEMTrack
            </div>

            <div class="subtitle">
              Cement Shop Management System
            </div>

            <div class="invoice-title">
              TAX INVOICE
            </div>

          </div>


          <div class="info">

            <div>
              <strong>Invoice No:</strong>
              ${invoiceNo}
              <br />

              <strong>Order ID:</strong>
              ${bill.order_id || "-"}
              <br />

              <strong>Date:</strong>
              ${formatDate(bill.order_date)}
            </div>

            <div>
              <strong>Payment:</strong>
              ${bill.payment_method || "-"}
              <br />

              <strong>Payment Status:</strong>
              ${bill.payment_status || "-"}
              <br />

              <strong>Order Status:</strong>
              ${bill.delivery_status || "-"}
            </div>

          </div>


          <h3>Customer Details</h3>

          <div class="customer">

            <strong>Name:</strong>
            ${bill.customer_name || "-"}
            <br />

            <strong>Email:</strong>
            ${bill.email || "-"}
            <br />

          </div>


          <h3>Product Details</h3>

          <table>

            <thead>

              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>GST</th>
                <th>Discount</th>
                <th>Total</th>
              </tr>

            </thead>

            <tbody>

              <tr>

                <td>
                  ${bill.product_name || "-"}
                </td>

                <td class="center">
                  ${bill.quantity || 0}
                </td>

                <td class="right">
                  ₹${formatMoney(bill.unit_price)}
                </td>

                <td class="right">
                  ₹${formatMoney(bill.GST)}
                </td>

                <td class="right">
                  ₹${formatMoney(bill.discount)}
                </td>

                <td class="right">
                  ₹${formatMoney(bill.total_amount)}
                </td>

              </tr>

            </tbody>

          </table>


          <div class="summary">

            <div>
              <span>Price</span>
              <span>
                ₹${formatMoney(bill.unit_price)}
              </span>
            </div>

            <div>
              <span>GST</span>
              <span>
                ₹${formatMoney(bill.GST)}
              </span>
            </div>

            <div>
              <span>Discount</span>
              <span>
                - ₹${formatMoney(bill.discount)}
              </span>
            </div>

            <div class="grand-total">
              <span>Grand Total</span>
              <span>
                ₹${formatMoney(bill.total_amount)}
              </span>
            </div>

          </div>


          <div class="footer">

            <strong>
              Thank you for shopping with CEMTrack!
            </strong>

            <br />

            This is a computer-generated invoice.

          </div>

        </div>

      </body>
      </html>
    `);

    printWindow.document.close();

    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500);
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div style={styles.loading}>
        Loading billing history...
      </div>
    );
  }

  // =========================
  // PAGE
  // =========================
  return (
    <div style={styles.page}>

      {/* HEADER */}

      <div style={styles.pageHeader}>

        <div>
          <h1 style={styles.title}>
            Billing Management
          </h1>

          <p style={styles.subtitle}>
            View and print customer billing history
          </p>
        </div>

        <button
          onClick={fetchBills}
          style={styles.refreshButton}
        >
          🔄 Refresh
        </button>

      </div>


      {/* ERROR */}

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}


      {/* EMPTY */}

      {!error && bills.length === 0 && (
        <div style={styles.empty}>
          No billing records found.
        </div>
      )}


      {/* TABLE */}

      {bills.length > 0 && (

        <div style={styles.tableContainer}>

          <table style={styles.table}>

            <thead>

              <tr>

                <th style={styles.th}>Invoice</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Cement</th>
                <th style={styles.th}>Quantity</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>GST</th>
                <th style={styles.th}>Discount</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Payment</th>
                <th style={styles.th}>Payment Status</th>
                <th style={styles.th}>Order Status</th>
                <th style={styles.th}>Action</th>

              </tr>

            </thead>


            <tbody>

              {bills.map((bill, index) => {

                const invoiceNo =
                  bill.invoice ||
                  `INV${String(bill.order_id).padStart(3, "0")}`;

                return (

                  <tr
                    key={`${bill.order_id}-${index}`}
                    style={styles.tr}
                  >

                    <td style={styles.td}>
                      <strong>{invoiceNo}</strong>
                    </td>

                    <td style={styles.td}>
                      {formatDate(bill.order_date)}
                    </td>

                    <td style={styles.td}>
                      {bill.customer_name || "-"}
                    </td>

                    <td style={styles.td}>
                      {bill.product_name || "-"}
                    </td>

                    <td style={styles.centerTd}>
                      {bill.quantity || 0}
                    </td>

                    <td style={styles.rightTd}>
                      ₹{formatMoney(bill.unit_price)}
                    </td>

                    <td style={styles.rightTd}>
                      ₹{formatMoney(bill.GST)}
                    </td>

                    <td style={styles.rightTd}>
                      ₹{formatMoney(bill.discount)}
                    </td>

                    <td style={styles.totalTd}>
                      ₹{formatMoney(bill.total_amount)}
                    </td>

                    <td style={styles.td}>
                      {bill.payment_method || "-"}
                    </td>

                    <td style={styles.td}>

                      <span style={styles.paidBadge}>
                        {bill.payment_status || "-"}
                      </span>

                    </td>

                    <td style={styles.td}>
                      {bill.delivery_status || "-"}
                    </td>

                    <td style={styles.td}>

                      <button
                        onClick={() => printBill(bill)}
                        style={styles.printButton}
                      >
                        🖨️ Print
                      </button>

                    </td>

                  </tr>

                );
              })}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}


// =====================================
// STYLES — MATCH CUSTOMERS PAGE
// =====================================

const styles = {

  page: {
    padding: "28px 45px",
    width: "100%",
    boxSizing: "border-box",
    background: "#f8fafc",
    minHeight: "100vh",
  },

  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },

  title: {
    margin: 0,
    fontSize: "30px",
    fontWeight: "700",
    color: "#111",
  },

  subtitle: {
    margin: "8px 0 0",
    fontSize: "16px",
    color: "#666",
  },

  refreshButton: {
    background: "#f56600",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "11px 18px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },

  tableContainer: {
    width: "100%",
    overflowX: "auto",
    background: "#fff",
    borderRadius: "5px",
    boxShadow: "0 1px 5px rgba(0,0,0,0.08)",
  },

  table: {
    width: "100%",
    minWidth: "1400px",
    borderCollapse: "collapse",
    background: "#fff",
  },

  th: {
    background: "#f56600",
    color: "#fff",
    padding: "14px 10px",
    textAlign: "left",
    fontSize: "14px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  tr: {
    borderBottom: "1px solid #e5e5e5",
  },

  td: {
    padding: "14px 10px",
    fontSize: "14px",
    color: "#111",
    whiteSpace: "nowrap",
  },

  centerTd: {
    padding: "14px 10px",
    textAlign: "center",
    fontSize: "14px",
    whiteSpace: "nowrap",
  },

  rightTd: {
    padding: "14px 10px",
    textAlign: "right",
    fontSize: "14px",
    whiteSpace: "nowrap",
  },

  totalTd: {
    padding: "14px 10px",
    textAlign: "right",
    fontSize: "14px",
    fontWeight: "700",
    color: "#16a34a",
    whiteSpace: "nowrap",
  },

  paidBadge: {
    display: "inline-block",
    background: "#d1fae5",
    color: "#15803d",
    padding: "6px 13px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
  },

  printButton: {
    background: "#f56600",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "8px 13px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "15px",
    borderRadius: "5px",
    marginBottom: "20px",
  },

  empty: {
    background: "#fff",
    padding: "50px",
    textAlign: "center",
    color: "#666",
    borderRadius: "5px",
  },

  loading: {
    padding: "50px",
    textAlign: "center",
    fontSize: "18px",
  },
};

export default Billing;