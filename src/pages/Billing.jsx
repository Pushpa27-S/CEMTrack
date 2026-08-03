import React, { useState, useEffect } from "react";
import "./Billing.css";

function Billing() {

  // =========================
  // INVOICE NUMBER
  // =========================

  const [invoiceNo, setInvoiceNo] = useState(1);

  // =========================
  // FORM FIELDS
  // =========================

  const [billDate, setBillDate] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [cement, setCement] = useState("UltraTech Cement");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [total, setTotal] = useState(0);
  const [payment, setPayment] = useState("Cash");

  // =========================
  // BILLING HISTORY
  // =========================

  const [bills, setBills] = useState([]);

  // =========================
  // AUTO CALCULATE TOTAL
  // =========================

  useEffect(() => {

    const qty = Number(quantity);
    const pr = Number(price);

    if (
      quantity !== "" &&
      price !== "" &&
      !isNaN(qty) &&
      !isNaN(pr)
    ) {
      setTotal(qty * pr);
    } else {
      setTotal(0);
    }

  }, [quantity, price]);


  // =========================
  // SAVE BILL
  // =========================

  const saveBill = () => {

    if (
      customerName.trim() === "" ||
      phone.trim() === "" ||
      billDate === "" ||
      quantity === "" ||
      price === ""
    ) {

      alert("Please fill all the fields.");
      return;

    }

    const newBill = {

      invoice: `INV${String(invoiceNo).padStart(3, "0")}`,

      date: billDate,

      customer: customerName,

      phone: phone,

      cement: cement,

      quantity: quantity,

      price: price,

      total: total,

      payment: payment,

    };

    setBills((previousBills) => [
      ...previousBills,
      newBill
    ]);

    alert("Bill Saved Successfully!");

    // Next invoice number
    setInvoiceNo(invoiceNo + 1);

    // Clear form after saving
    setBillDate("");
    setCustomerName("");
    setPhone("");
    setCement("UltraTech Cement");
    setQuantity("");
    setPrice("");
    setTotal(0);
    setPayment("Cash");

  };


  // =========================
  // CLEAR FORM
  // =========================

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


  // =========================
  // PRINT BILL
  // =========================

  const printBill = () => {

    window.print();

  };


  return (

    <div className="billing-container">

      {/* =================================
          BILLING MANAGEMENT
      ================================= */}

      <h1>
        Billing Management
      </h1>


      {/* =================================
          UPPER BILLING FORM
      ================================= */}

      <div className="billing-form">


        {/* Invoice Number */}

        <div className="form-group">

          <label>
            Invoice Number
          </label>

          <input
            type="text"
            value={`INV${String(invoiceNo).padStart(3, "0")}`}
            readOnly
          />

        </div>


        {/* Bill Date */}

        <div className="form-group">

          <label>
            Bill Date
          </label>

          <input
            type="date"
            value={billDate}
            onChange={(e) =>
              setBillDate(e.target.value)
            }
          />

        </div>


        {/* Customer Name */}

        <div className="form-group">

          <label>
            Customer Name
          </label>

          <input
            type="text"
            placeholder="Enter Customer Name"
            value={customerName}
            onChange={(e) =>
              setCustomerName(e.target.value)
            }
          />

        </div>


        {/* Phone Number */}

        <div className="form-group">

          <label>
            Phone Number
          </label>

          <input
            type="text"
            placeholder="Enter Phone Number"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
          />

        </div>


        {/* Cement Brand */}

        <div className="form-group">

          <label>
            Select Cement Brand
          </label>

          <select
            value={cement}
            onChange={(e) =>
              setCement(e.target.value)
            }
          >

            <option>
              UltraTech Cement
            </option>

            <option>
              ACC Cement
            </option>

            <option>
              Ambuja Cement
            </option>

            <option>
              Dalmia Cement
            </option>

            <option>
              Ramco Cement
            </option>

            <option>
              Priya Cement
            </option>

            <option>
              Maha Cement
            </option>

            <option>
              JK Cement
            </option>

            <option>
              Birla Cement
            </option>

            <option>
              Coromandel Cement
            </option>

            <option>
              JSW Cement
            </option>

            <option>
              Shree Cement
            </option>

          </select>

        </div>


        {/* Quantity */}

        <div className="form-group">

          <label>
            Quantity (Bags)
          </label>

          <input
            type="number"
            placeholder="Enter Quantity"
            value={quantity}
            onChange={(e) =>
              setQuantity(e.target.value)
            }
          />

        </div>


        {/* Price */}

        <div className="form-group">

          <label>
            Price per Bag
          </label>

          <input
            type="number"
            placeholder="Enter Price"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
          />

        </div>


        {/* Total Amount */}

        <div className="form-group">

          <label>
            Total Amount
          </label>

          <input
            type="text"
            value={`₹${total}`}
            readOnly
          />

        </div>


        {/* Payment Method */}

        <div className="form-group">

          <label>
            Payment Method
          </label>

          <select
            value={payment}
            onChange={(e) =>
              setPayment(e.target.value)
            }
          >

            <option>
              Cash
            </option>

            <option>
              UPI
            </option>

            <option>
              Card
            </option>

            <option>
              Net Banking
            </option>

          </select>

        </div>

      </div>


      {/* =================================
          BUTTONS
      ================================= */}

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


      {/* =================================
          BILLING HISTORY
      ================================= */}

      <h2 className="billing-history-title">
        Billing History
      </h2>


      <table className="billing-table">

        <thead>

          <tr>

            <th>
              Invoice
            </th>

            <th>
              Date
            </th>

            <th>
              Customer
            </th>

            <th>
              Phone
            </th>

            <th>
              Cement
            </th>

            <th>
              Quantity
            </th>

            <th>
              Price
            </th>

            <th>
              Total
            </th>

            <th>
              Payment
            </th>

          </tr>

        </thead>


        <tbody>

          {bills.length === 0 ? (

            <tr>

              <td
                colSpan="9"
                className="no-bills"
              >
                No Bills Available
              </td>

            </tr>

          ) : (

            bills.map((bill, index) => (

              <tr key={index}>

                <td>
                  {bill.invoice}
                </td>

                <td>
                  {bill.date}
                </td>

                <td>
                  {bill.customer}
                </td>

                <td>
                  {bill.phone}
                </td>

                <td>
                  {bill.cement}
                </td>

                <td>
                  {bill.quantity}
                </td>

                <td>
                  ₹{bill.price}
                </td>

                <td className="total-cell">
                  ₹{bill.total}
                </td>

                <td>
                  {bill.payment}
                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>

  );

}

export default Billing;