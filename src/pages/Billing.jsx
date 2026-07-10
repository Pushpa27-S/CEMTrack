import React from "react";
import "./Billing.css";

function Billing() {
  return (
    <div className="billing-container">

      <h1>Billing Management</h1>

      {/* Summary Cards */}

      <div className="billing-cards">

        <div className="card">
          <h3>Today's Bills</h3>
          <p>12</p>
        </div>

        <div className="card">
          <h3>Total Sales</h3>
          <p>₹58,400</p>
        </div>

        <div className="card">
          <h3>Orders</h3>
          <p>18</p>
        </div>

        <div className="card">
          <h3>Revenue</h3>
          <p>₹1,25,000</p>
        </div>

      </div>

      {/* Billing Form */}

      <div className="billing-form">

        <div className="form-group">
          <label>Invoice Number</label>
          <input type="text" placeholder="INV001" />
        </div>

        <div className="form-group">
          <label>Bill Date</label>
          <input type="date" />
        </div>

        <div className="form-group">
          <label>Customer Name</label>
          <input type="text" placeholder="Enter Customer Name" />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input type="text" placeholder="Enter Phone Number" />
        </div>

        <div className="form-group">
          <label>Select Cement Brand</label>

          <select>
            <option>UltraTech Cement</option>
            <option>ACC Cement</option>
            <option>Ambuja Cement</option>
            <option>Dalmia Cement</option>
            <option>Ramco Cement</option>
            <option>Priya Cement</option>
            <option>Maha Cement</option>
          </select>

        </div>

        <div className="form-group">
          <label>Quantity (Bags)</label>
          <input type="number" placeholder="0" />
        </div>

        <div className="form-group">
          <label>Price per Bag</label>
          <input type="number" placeholder="₹400" />
        </div>

        <div className="form-group">
          <label>Total Amount</label>
          <input type="text" placeholder="₹0" />
        </div>

        <div className="form-group">
          <label>Payment Method</label>

          <select>
            <option>Cash</option>
            <option>UPI</option>
            <option>Card</option>
          </select>

        </div>

      </div>

      {/* Buttons */}

      <div className="billing-buttons">

        <button className="save-btn">Save Bill</button>

        <button className="print-btn">Print Bill</button>

        <button className="clear-btn">Clear</button>

      </div>

    </div>
  );
}

export default Billing;