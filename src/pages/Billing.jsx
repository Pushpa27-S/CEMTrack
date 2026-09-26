import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

function Billing() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================
  // FETCH BILLING HISTORY
  // ============================================

  const fetchBills = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/admin/billing`);

      if (!response.ok) {
        throw new Error("Failed to fetch billing history");
      }

      const data = await response.json();

      if (data.success) {
        setBills(data.bills || []);
      } else {
        setError(data.message || "Failed to load billing history");
      }
    } catch (err) {
      console.error("Billing fetch error:", err);
      setError("Cannot connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  // ============================================
  // FORMAT DATE
  // ============================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString();
  };

  // ============================================
  // FORMAT MONEY
  // ============================================

  const formatMoney = (amount) => {
    if (amount === null || amount === undefined) {
      return "₹0.00";
    }

    return `₹${Number(amount).toFixed(2)}`;
  };

  // ============================================
  // PRINT BILL
  // ============================================

  const printBill = (bill) => {
    const printWindow = window.open("", "_blank", "width=900,height=700");

    if (!printWindow) {
      alert("Please allow pop-ups to print the bill.");
      return;
    }

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${bill.order_id}</title>

        <style>
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 30px;
            font-family: Arial, sans-serif;
            color: #111;
            background: #fff;
          }

          .invoice {
            max-width: 800px;
            margin: auto;
            border: 1px solid #ddd;
            padding: 30px;
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 3px solid #f28c28;
            padding-bottom: 20px;
            margin-bottom: 25px;
          }

          .company-name {
            font-size: 28px;
            font-weight: 700;
            color: #111;
          }

          .company-subtitle {
            margin-top: 6px;
            font-size: 13px;
            color: #111;
          }

          .invoice-title {
            text-align: right;
            font-size: 22px;
            font-weight: 700;
            color: #f28c28;
          }

          .invoice-number {
            margin-top: 6px;
            font-size: 13px;
            color: #111;
          }

          .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 25px;
          }

          .info-box {
            width: 48%;
            background: #fff;
            border: 1px solid #ddd;
            padding: 15px;
          }

          .info-box h3 {
            margin: 0 0 10px;
            font-size: 15px;
            color: #f28c28;
          }

          .info-box p {
            margin: 5px 0;
            font-size: 13px;
            color: #111;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }

          th {
            background: #111;
            color: #fff;
            padding: 12px;
            text-align: left;
            font-size: 13px;
          }

          td {
            padding: 12px;
            border-bottom: 1px solid #ddd;
            font-size: 13px;
            color: #111;
          }

          .summary {
            width: 300px;
            margin-left: auto;
            margin-top: 20px;
          }

          .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 7px 0;
            font-size: 13px;
            color: #111;
          }

          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            margin-top: 8px;
            border-top: 2px solid #111;
            font-size: 16px;
            font-weight: 700;
            color: #111;
          }

          .footer {
            margin-top: 40px;
            padding-top: 15px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 12px;
            color: #111;
          }

          @media print {
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

            <div>
              <div class="company-name">
                CEMTrack
              </div>

              <div class="company-subtitle">
                Cement Inventory & Management System
              </div>
            </div>

            <div>
              <div class="invoice-title">
                TAX INVOICE
              </div>

              <div class="invoice-number">
                Invoice #${bill.order_id}
              </div>
            </div>

          </div>


          <div class="info-section">

            <div class="info-box">

              <h3>
                Customer Details
              </h3>

              <p>
                <strong>Customer ID:</strong>
                ${bill.customer_id || "-"}
              </p>

              <p>
                <strong>Name:</strong>
                ${bill.customer_name || "-"}
              </p>

              <p>
                <strong>Email:</strong>
                ${bill.email || "-"}
              </p>

              <p>
                <strong>Phone:</strong>
                ${bill.phone_no || "-"}
              </p>

            </div>


            <div class="info-box">

              <h3>
                Order Details
              </h3>

              <p>
                <strong>Order ID:</strong>
                ${bill.order_id || "-"}
              </p>

              <p>
                <strong>Order Date:</strong>
                ${formatDate(bill.order_date)}
              </p>

              <p>
                <strong>Payment Status:</strong>
                ${bill.payment_status || "Paid"}
              </p>

              <p>
                <strong>Delivery Status:</strong>
                ${bill.delivery_status || "-"}
              </p>

            </div>

          </div>


          <table>

            <thead>

              <tr>
                <th>Product</th>
                <th>Brand</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>GST</th>
                <th>Total</th>
              </tr>

            </thead>


            <tbody>

              <tr>

                <td>
                  ${bill.product_name || "-"}
                </td>

                <td>
                  ${bill.brand || "-"}
                </td>

                <td>
                  ${bill.quantity || 0}
                </td>

                <td>
                  ${formatMoney(bill.unit_price)}
                </td>

                <td>
                  ${formatMoney(bill.GST)}
                </td>

                <td>
                  ${formatMoney(bill.total_amount)}
                </td>

              </tr>

            </tbody>

          </table>


          <div class="summary">

            <div class="summary-row">
              <span>Subtotal</span>
              <span>
                ${formatMoney(
                  Number(bill.total_amount || 0) -
                  Number(bill.GST || 0)
                )}
              </span>
            </div>

            <div class="summary-row">
              <span>GST</span>
              <span>
                ${formatMoney(bill.GST)}
              </span>
            </div>

            <div class="total-row">
              <span>Total Amount</span>
              <span>
                ${formatMoney(bill.total_amount)}
              </span>
            </div>

          </div>


          <div class="footer">
            Thank you for choosing CEMTrack.
          </div>

        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>

      </body>
      </html>
    `;

    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
  };

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <div style={styles.loading}>
        Loading billing history...
      </div>
    );
  }

  // ============================================
  // PAGE
  // ============================================

  return (
    <div style={styles.page}>

      {/* ========================================
          HEADER
      ======================================== */}

      <div style={styles.pageHeader}>

        <div>

          <h1 style={styles.title}>
            Billing
          </h1>

          <p style={styles.subtitle}>
            View and manage customer billing history
          </p>

        </div>


        <button
          onClick={fetchBills}
          style={styles.refreshButton}
        >
          Refresh
        </button>

      </div>


      {/* ========================================
          ERROR
      ======================================== */}

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}


      {/* ========================================
          EMPTY
      ======================================== */}

      {!error && bills.length === 0 && (
        <div style={styles.empty}>
          No billing records found.
        </div>
      )}


      {/* ========================================
          BILLING TABLE
      ======================================== */}

      {bills.length > 0 && (

        <div style={styles.tableContainer}>

          <table style={styles.table}>

            <thead>

              <tr>

                <th style={styles.th}>
                  Bill ID
                </th>

                <th style={styles.th}>
                  Order ID
                </th>

                <th style={styles.th}>
                  Customer ID
                </th>

                <th style={styles.th}>
                  Customer Name
                </th>

                <th style={styles.th}>
                  Product
                </th>

                <th style={styles.th}>
                  Brand
                </th>

                <th style={styles.th}>
                  Quantity
                </th>

                <th style={styles.th}>
                  Unit Price
                </th>

                <th style={styles.th}>
                  GST
                </th>

                <th style={styles.th}>
                  Total Amount
                </th>

                <th style={styles.th}>
                  Order Date
                </th>

                <th style={styles.th}>
                  Payment Status
                </th>

                <th style={styles.th}>
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {bills.map((bill) => (

                <tr
                  key={bill.bill_id || bill.order_id}
                  style={styles.tr}
                >

                  <td style={styles.td}>
                    {bill.bill_id || "-"}
                  </td>

                  <td style={styles.td}>
                    {bill.order_id || "-"}
                  </td>

                  <td style={styles.td}>
                    {bill.customer_id || "-"}
                  </td>

                  <td style={styles.td}>
                    {bill.customer_name || "-"}
                  </td>

                  <td style={styles.td}>
                    {bill.product_name || "-"}
                  </td>

                  <td style={styles.td}>
                    {bill.brand || "-"}
                  </td>

                  <td style={styles.centerTd}>
                    {bill.quantity || 0}
                  </td>

                  <td style={styles.rightTd}>
                    {formatMoney(bill.unit_price)}
                  </td>

                  <td style={styles.rightTd}>
                    {formatMoney(bill.GST)}
                  </td>

                  <td style={styles.totalTd}>
                    {formatMoney(bill.total_amount)}
                  </td>

                  <td style={styles.td}>
                    {formatDate(bill.order_date)}
                  </td>

                  <td style={styles.centerTd}>

                    <span style={styles.paidBadge}>
                      {bill.payment_status || "Paid"}
                    </span>

                  </td>

                  <td style={styles.centerTd}>

                    <button
                      onClick={() => printBill(bill)}
                      style={styles.printButton}
                    >
                      Print
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}


// ==================================================
// BILLING UI STYLES
// BLACK + WHITE + ORANGE
// FONT SIZES / WEIGHTS PRESERVED
// ==================================================

const styles = {

  page: {
    padding: "28px 45px",
    width: "100%",
    boxSizing: "border-box",
    background: "#fff",
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
    color: "#111",
  },


  refreshButton: {
    background: "#f28c28",
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
    border: "1px solid #e5e5e5",
  },


  table: {
    width: "100%",
    minWidth: "1400px",
    borderCollapse: "collapse",
    background: "#fff",
  },


  th: {
    background: "#111",
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
    background: "#fff",
  },


  centerTd: {
    padding: "14px 10px",
    textAlign: "center",
    fontSize: "14px",
    whiteSpace: "nowrap",
    background: "#fff",
  },


  rightTd: {
    padding: "14px 10px",
    textAlign: "right",
    fontSize: "14px",
    whiteSpace: "nowrap",
    background: "#fff",
  },


  totalTd: {
    padding: "14px 10px",
    textAlign: "right",
    fontSize: "14px",
    fontWeight: "700",
    color: "#111",
    whiteSpace: "nowrap",
    background: "#fff",
  },


  paidBadge: {
    display: "inline-block",
    background: "#f28c28",
    color: "#fff",
    padding: "6px 13px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
  },


  printButton: {
    background: "#f28c28",
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
    background: "#fff",
    color: "#111",
    padding: "15px",
    borderRadius: "5px",
    marginBottom: "20px",
    borderLeft: "4px solid #111",
    border: "1px solid #ddd",
  },


  empty: {
    background: "#fff",
    padding: "50px",
    textAlign: "center",
    color: "#111",
    borderRadius: "5px",
    border: "1px solid #e5e5e5",
  },


  loading: {
    padding: "50px",
    textAlign: "center",
    fontSize: "18px",
    color: "#111",
    background: "#fff",
    minHeight: "100vh",
  },

};

export default Billing;