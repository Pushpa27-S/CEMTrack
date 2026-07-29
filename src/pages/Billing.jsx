import React, { useState, useEffect } from "react";
import "./Billing.css";

function Billing() {

  // Invoice Number
  const [invoiceNo, setInvoiceNo] = useState(1);

  // Form Fields
  const [billDate, setBillDate] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [cement, setCement] = useState("UltraTech Cement");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [total, setTotal] = useState(0);
  const [payment, setPayment] = useState("Cash");

  // Saved Bills
  const [bills, setBills] = useState([]);

  // Calculate Total Automatically
  useEffect(() => {
    const qty = Number(quantity);
    const pr = Number(price);

    if (!isNaN(qty) && !isNaN(pr)) {
      setTotal(qty * pr);
    } else {
      setTotal(0);
    }
  }, [quantity, price]);

  // Save Bill
  const saveBill = () => {

    if (
      customerName === "" ||
      phone === "" ||
      quantity === "" ||
      price === ""
    ) {
      alert("Please fill all fields");
      return;
    }

    const newBill = {
      invoice: `INV${String(invoiceNo).padStart(3, "0")}`,
      date: billDate,
      customer: customerName,
      phone,
      cement,
      quantity,
      price,
      total,
      payment,
    };

    setBills([...bills, newBill]);

    alert("Bill Saved Successfully!");

    // Next Invoice Number
    setInvoiceNo(invoiceNo + 1);

    // Clear Form
    setBillDate("");
    setCustomerName("");
    setPhone("");
    setCement("UltraTech Cement");
    setQuantity("");
    setPrice("");
    setTotal(0);
    setPayment("Cash");
  };

  // Clear Button
  const clearForm = () => {

    setBillDate("");
    setCustomerName("");
    setPhone("");
    setCement("UltraTech Cement");
    setQuantity("");
    setPrice("");
    setTotal(0);
    setPayment("Cash");

  };

  // Print Bill
  const printBill = () => {
    window.print();
  };

  return (

    <div className="billing-container">

      <h1>Billing Management</h1>
            {/* ---------- Billing Form ---------- */}

      <div className="billing-form">

        <div className="form-group">
          <label>Invoice Number</label>
          <input
            type="text"
            value={`INV${String(invoiceNo).padStart(3, "0")}`}
            readOnly
          />
        </div>

        <div className="form-group">
          <label>Bill Date</label>
          <input
            type="date"
            value={billDate}
            onChange={(e) => setBillDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Customer Name</label>
          <input
            type="text"
            placeholder="Enter Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="text"
            placeholder="Enter Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Select Cement Brand</label>

          <select
            value={cement}
            onChange={(e) => setCement(e.target.value)}
          >
            <option>UltraTech Cement</option>
            <option>ACC Cement</option>
            <option>Ambuja Cement</option>
            <option>Dalmia Cement</option>
            <option>Ramco Cement</option>
            <option>Priya Cement</option>
            <option>Maha Cement</option>
            <option>JK Cement</option>
            <option>Birla Cement</option>
            <option>Coromandel Cement</option>
            <option>JSW Cement</option>
            <option>Shree Cement</option>
          </select>

        </div>

        <div className="form-group">
          <label>Quantity (Bags)</label>
          <input
            type="number"
            placeholder="Enter Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Price per Bag</label>
          <input
            type="number"
            placeholder="Enter Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Total Amount</label>
          <input
            type="text"
            value={`₹${total}`}
            readOnly
          />
        </div>

        <div className="form-group">
          <label>Payment Method</label>

          <select
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
          >
            <option>Cash</option>
            <option>UPI</option>
            <option>Card</option>
            <option>Net Banking</option>
          </select>

        </div>

      </div>
            {/* ---------- Buttons ---------- */}

      <div className="billing-buttons">

        <button
          className="save-btn"
          onClick={saveBill}
        >
          Save Bill
        </button>

        <button
          className="print-btn"
          onClick={printBill}
        >
          Print Bill
        </button>

        <button
          className="clear-btn"
          onClick={clearForm}
        >
          Clear
        </button>

      </div>

      {/* ---------- Bill History ---------- */}

      <h2
        style={{
          marginTop: "40px",
          marginBottom: "15px",
        }}
      >
        Billing History
      </h2>

      <table className="billing-table">

        <thead>

          <tr>

            <th>Invoice</th>

            <th>Date</th>

            <th>Customer</th>

            <th>Phone</th>

            <th>Cement</th>

            <th>Quantity</th>

            <th>Price</th>

            <th>Total</th>

            <th>Payment</th>

          </tr>

        </thead>

        <tbody>

          {bills.length === 0 ? (

            <tr>

              <td
                colSpan="9"
                style={{
                  textAlign: "center",
                  padding: "20px",
                  fontWeight: "bold",
                }}
              >
                No Bills Available
              </td>

            </tr>

          ) : (

            bills.map((bill, index) => (

              <tr key={index}>

                <td>{bill.invoice}</td>

                <td>{bill.date}</td>

                <td>{bill.customer}</td>

                <td>{bill.phone}</td>

                <td>{bill.cement}</td>

                <td>{bill.quantity}</td>

                <td>₹{bill.price}</td>

                <td
                  style={{
                    color: "green",
                    fontWeight: "bold",
                  }}
                >
                  ₹{bill.total}
                </td>

                <td>{bill.payment}</td>

              </tr>

            ))

          )}

        </tbody>

      </table>
          </div>

  );

}

export default Billing;