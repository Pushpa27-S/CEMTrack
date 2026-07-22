import React, { useState } from "react";
import "./Stock.css";

function Purchase() {
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (product === "" || quantity === "") {
      setMessage("Please fill all fields.");
      return;
    }

    setMessage(
      `Purchase Recorded Successfully!\nProduct: ${product}\nQuantity Received: ${quantity}`
    );

    setProduct("");
    setQuantity("");
  };

  return (
    <div className="stock-container">
      <h2>Purchase Management</h2>

      <form onSubmit={handleSubmit}>
        <label>Product Name</label>
        <input
          type="text"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder="Enter product name"
        />

        <label>Quantity Received</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Enter quantity"
        />

        <button type="submit" className="btn btn-primary">
          Record Purchase
        </button>
      </form>

      {message && <p className="form-success">{message}</p>}
    </div>
  );
}

export default Purchase;