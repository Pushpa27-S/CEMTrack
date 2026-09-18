import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

function Billing() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================================
  // FETCH BILLING HISTORY
  // ================================
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
      console.error("Billing fetch error:", err);
      setError("Cannot connect to billing backend.");
    } finally {
      setLoading(false);
    }
  };

  // Load billing history when page opens
  useEffect(() => {
    fetchBills();
  }, []);

  // ================================
  // FORMAT DATE
  // ================================
  const formatDate = (date) => {
    if (!date) return "-";

    const d = new Date(date);

    if (isNaN(d.getTime())) {
      return date;
    }

    return d.toLocaleDateString("en-IN");
  };

  // ================================
  // FORMAT MONEY
  // ================================
  const formatMoney = (amount) => {
    const number = Number(amount || 0);

    return number.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // ================================
  // PRINT SELECTED BILL
  // ================================
  const printBill = (bill) => {
    const printWindow = window.open(
      "",
      "_blank",
      "width=900,height=700"
    );

    if (!printWindow) {
      alert(
        "Please allow pop-ups for localhost to print the bill."
      );
      return;
    }

    const invoiceNo =
      bill.invoice ||
      `INV${String(bill.order_id).padStart(3, "0")}`;

    const customerName = bill.customer_name || "-";
    const email = bill.email || "-";
    const phone = bill.phone || "-";
    const productName = bill.product_name || "-";

    const quantity = bill.quantity || 0;

    const unitPrice = formatMoney(bill.unit_price);
    const gst = formatMoney(bill.GST);
    const discount = formatMoney(bill.discount);
    const total = formatMoney(bill.total_amount);

    const paymentMethod = bill.payment_method || "-";
    const paymentStatus = bill.payment_status || "-";
    const orderStatus = bill.delivery_status || "-";

    printWindow.document.write(`
      <!DOCTYPE html>

      <html>
        <head>

          <title>${invoiceNo} - CEMTrack Invoice</title>

          <meta charset="UTF-8" />

          <style>

            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 30px;
              font-family: Arial, Helvetica, sans-serif;
              background: white;
              color: #222;
            }

            .invoice {
              width: 100%;
              max-width: 850px;
              margin: 0 auto;
              border: 1px solid #cccccc;
              padding: 35px;
            }

            /* HEADER */

            .header {
              text-align: center;
              border-bottom: 2px solid #222;
              padding-bottom: 20px;
              margin-bottom: 25px;
            }

            .company-name {
              font-size: 32px;
              font-weight: bold;
              margin-bottom: 5px;
            }

            .company-description {
              font-size: 14px;
              color: #555;
            }

            .invoice-title {
              font-size: 24px;
              font-weight: bold;
              margin-top: 20px;
            }

            /* INVOICE INFORMATION */

            .invoice-info {
              display: flex;
              justify-content: space-between;
              gap: 30px;
              margin-bottom: 25px;
              line-height: 1.8;
            }

            .invoice-info-box {
              width: 50%;
            }

            .invoice-info-box:last-child {
              text-align: right;
            }

            /* CUSTOMER */

            .section-title {
              font-size: 17px;
              font-weight: bold;
              margin-bottom: 10px;
            }

            .customer-box {
              background: #f7f7f7;
              border: 1px solid #dddddd;
              padding: 15px;
              margin-bottom: 25px;
              line-height: 1.7;
            }

            /* TABLE */

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
            }

            th {
              background: #eeeeee;
              border: 1px solid #cccccc;
              padding: 12px 8px;
              font-size: 13px;
              text-align: left;
            }

            td {
              border: 1px solid #cccccc;
              padding: 12px 8px;
              font-size: 13px;
            }

            .right {
              text-align: right;
            }

            .center {
              text-align: center;
            }

            /* TOTAL */

            .summary {
              width: 350px;
              margin-left: auto;
              margin-top: 25px;
            }

            .summary-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #eeeeee;
            }

            .summary-total {
              display: flex;
              justify-content: space-between;
              padding: 14px 0;
              margin-top: 5px;
              border-top: 2px solid #222;
              font-size: 19px;
              font-weight: bold;
            }

            /* PAYMENT */

            .payment-box {
              margin-top: 30px;
              padding: 15px;
              border: 1px solid #cccccc;
              line-height: 1.8;
            }

            /* FOOTER */

            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #cccccc;
              color: #666;
              font-size: 13px;
            }

            /* PRINT */

            @media print {

              @page {
                size: A4;
                margin: 15mm;
              }

              body {
                padding: 0;
              }

              .invoice {
                max-width: none;
                border: none;
                padding: 0;
              }

            }

          </style>

        </head>

        <body>

          <div class="invoice">

            <!-- HEADER -->

            <div class="header">

              <div class="company-name">
                CEMTrack
              </div>

              <div class="company-description">
                Cement Shop Management System
              </div>

              <div class="invoice-title">
                TAX INVOICE
              </div>

            </div>


            <!-- INVOICE INFORMATION -->

            <div class="invoice-info">

              <div class="invoice-info-box">

                <strong>Invoice No:</strong>
                ${invoiceNo}

                <br />

                <strong>Order ID:</strong>
                ${bill.order_id || "-"}

                <br />

                <strong>Date:</strong>
                ${formatDate(bill.order_date)}

              </div>


              <div class="invoice-info-box">

                <strong>Payment:</strong>
                ${paymentMethod}

                <br />

                <strong>Payment Status:</strong>
                ${paymentStatus}

                <br />

                <strong>Order Status:</strong>
                ${orderStatus}

              </div>

            </div>


            <!-- CUSTOMER -->

            <div class="section-title">
              Customer Details
            </div>

            <div class="customer-box">

              <strong>Name:</strong>
              ${customerName}

              <br />

              <strong>Email:</strong>
              ${email}

              <br />

              <strong>Phone:</strong>
              ${phone}

            </div>


            <!-- PRODUCT TABLE -->

            <div class="section-title">
              Product Details
            </div>

            <table>

              <thead>

                <tr>

                  <th>
                    Cement Product
                  </th>

                  <th class="center">
                    Quantity
                  </th>

                  <th class="right">
                    Unit Price
                  </th>

                  <th class="right">
                    GST
                  </th>

                  <th class="right">
                    Discount
                  </th>

                  <th class="right">
                    Total
                  </th>

                </tr>

              </thead>


              <tbody>

                <tr>

                  <td>
                    ${productName}
                  </td>

                  <td class="center">
                    ${quantity}
                  </td>

                  <td class="right">
                    ₹${unitPrice}
                  </td>

                  <td class="right">
                    ₹${gst}
                  </td>

                  <td class="right">
                    ₹${discount}
                  </td>

                  <td class="right">
                    ₹${total}
                  </td>

                </tr>

              </tbody>

            </table>


            <!-- SUMMARY -->

            <div class="summary">

              <div class="summary-row">

                <span>
                  Subtotal
                </span>

                <span>
                  ₹${unitPrice}
                </span>

              </div>


              <div class="summary-row">

                <span>
                  GST
                </span>

                <span>
                  ₹${gst}
                </span>

              </div>


              <div class="summary-row">

                <span>
                  Discount
                </span>

                <span>
                  - ₹${discount}
                </span>

              </div>


              <div class="summary-total">

                <span>
                  Grand Total
                </span>

                <span>
                  ₹${total}
                </span>

              </div>

            </div>


            <!-- PAYMENT -->

            <div class="payment-box">

              <strong>
                Payment Information
              </strong>

              <br />

              Payment Method:
              ${paymentMethod}

              <br />

              Payment Status:
              ${paymentStatus}

            </div>


            <!-- FOOTER -->

            <div class="footer">

              <strong>
                Thank you for shopping with CEMTrack!
              </strong>

              <br />

              This is a computer-generated invoice and does not
              require a signature.

            </div>

          </div>

        </body>

      </html>
    `);

    printWindow.document.close();

    // Give browser time to render the invoice
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500);
  };

  // ================================
  // LOADING
  // ================================
  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
          fontSize: "20px",
          textAlign: "center",
        }}
      >
        Loading billing history...
      </div>
    );
  }

  // ================================
  // MAIN PAGE
  // ================================
  return (
    <div
      style={{
        padding: "25px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >

      {/* PAGE HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >

        <div>

          <h1
            style={{
              margin: 0,
              fontSize: "28px",
            }}
          >
            Billing Management
          </h1>

          <p
            style={{
              marginTop: "8px",
              color: "#666",
            }}
          >
            View and print customer billing history
          </p>

        </div>


        <button
          onClick={fetchBills}
          style={{
            background: "#1976d2",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          🔄 Refresh
        </button>

      </div>


      {/* ERROR */}

      {error && (
        <div
          style={{
            background: "#ffe5e5",
            color: "#c62828",
            padding: "15px",
            borderRadius: "6px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}


      {/* NO BILLS */}

      {!error && bills.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "50px",
            background: "#f7f7f7",
            borderRadius: "8px",
            color: "#666",
          }}
        >
          No billing records found.
        </div>
      )}


      {/* BILLING TABLE */}

      {bills.length > 0 && (
        <div
          style={{
            width: "100%",
            overflowX: "auto",
            background: "white",
            borderRadius: "8px",
          }}
        >

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "1300px",
            }}
          >

            <thead>

              <tr
                style={{
                  background: "#075985",
                  color: "white",
                }}
              >

                <th style={thStyle}>
                  Invoice
                </th>

                <th style={thStyle}>
                  Date
                </th>

                <th style={thStyle}>
                  Customer
                </th>

                <th style={thStyle}>
                  Phone
                </th>

                <th style={thStyle}>
                  Cement
                </th>

                <th style={thStyle}>
                  Quantity
                </th>

                <th style={thStyle}>
                  Price
                </th>

                <th style={thStyle}>
                  GST
                </th>

                <th style={thStyle}>
                  Discount
                </th>

                <th style={thStyle}>
                  Total
                </th>

                <th style={thStyle}>
                  Payment
                </th>

                <th style={thStyle}>
                  Payment Status
                </th>

                <th style={thStyle}>
                  Order Status
                </th>

                <th style={thStyle}>
                  Action
                </th>

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
                    style={{
                      borderBottom: "1px solid #ddd",
                    }}
                  >

                    {/* INVOICE */}

                    <td style={tdStyle}>
                      <strong>
                        {invoiceNo}
                      </strong>
                    </td>


                    {/* DATE */}

                    <td style={tdStyle}>
                      {formatDate(bill.order_date)}
                    </td>


                    {/* CUSTOMER */}

                    <td style={tdStyle}>
                      {bill.customer_name || "-"}
                    </td>


                    {/* PHONE */}

                    <td style={tdStyle}>
                      {bill.phone || "-"}
                    </td>


                    {/* CEMENT */}

                    <td style={tdStyle}>
                      {bill.product_name || "-"}
                    </td>


                    {/* QUANTITY */}

                    <td
                      style={{
                        ...tdStyle,
                        textAlign: "center",
                      }}
                    >
                      {bill.quantity || 0}
                    </td>


                    {/* PRICE */}

                    <td
                      style={{
                        ...tdStyle,
                        textAlign: "right",
                      }}
                    >
                      ₹{formatMoney(bill.unit_price)}
                    </td>


                    {/* GST */}

                    <td
                      style={{
                        ...tdStyle,
                        textAlign: "right",
                      }}
                    >
                      ₹{formatMoney(bill.GST)}
                    </td>


                    {/* DISCOUNT */}

                    <td
                      style={{
                        ...tdStyle,
                        textAlign: "right",
                      }}
                    >
                      ₹{formatMoney(bill.discount)}
                    </td>


                    {/* TOTAL */}

                    <td
                      style={{
                        ...tdStyle,
                        textAlign: "right",
                        fontWeight: "bold",
                        color: "#138a36",
                      }}
                    >
                      ₹{formatMoney(bill.total_amount)}
                    </td>


                    {/* PAYMENT */}

                    <td style={tdStyle}>
                      {bill.payment_method || "-"}
                    </td>


                    {/* PAYMENT STATUS */}

                    <td
                      style={{
                        ...tdStyle,
                        color:
                          bill.payment_status === "Paid"
                            ? "#138a36"
                            : "#d97706",
                        fontWeight: "bold",
                      }}
                    >
                      {bill.payment_status || "-"}
                    </td>


                    {/* ORDER STATUS */}

                    <td style={tdStyle}>
                      {bill.delivery_status || "-"}
                    </td>


                    {/* PRINT */}

                    <td style={tdStyle}>

                      <button
                        onClick={() => printBill(bill)}
                        style={{
                          background: "#16a34a",
                          color: "white",
                          border: "none",
                          padding: "8px 14px",
                          borderRadius: "5px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        🖨️ Print Bill
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


// ====================================
// TABLE STYLES
// ====================================

const thStyle = {
  padding: "13px 10px",
  textAlign: "left",
  whiteSpace: "nowrap",
  fontSize: "14px",
};

const tdStyle = {
  padding: "12px 10px",
  whiteSpace: "nowrap",
  fontSize: "14px",
};


export default Billing;