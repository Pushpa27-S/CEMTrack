import React from "react";
import "./Stock.css";

function Stock() {
  const stock = [
    {
      id: 1,
      product: "UltraTech Cement",
      stock: 120,
      status: "In Stock",
    },
    {
      id: 2,
      product: "ACC Cement",
      stock: 20,
      status: "Low Stock",
    },
    {
      id: 3,
      product: "Ambuja Cement",
      stock: 80,
      status: "In Stock",
    },
    {
      id: 4,
      product: "Dalmia Cement",
      stock: 15,
      status: "Low Stock",
    },
    {
      id: 5,
      product: "Priya Cement",
      stock: 65,
      status: "In Stock",
    },
    {
      id: 6,
      product: "Ramco Cement",
      stock: 95,
      status: "In Stock",
    },
    {
      id: 7,
      product: "Maha Cement",
      stock: 40,
      status: "In Stock",
    },
  ];

  return (
    <div className="stock-container">

      <h1>Stock Management</h1>

      <div className="stock-cards">

        <div className="card">
          <h3>Total Products</h3>
          <p>7</p>
        </div>

        <div className="card">
          <h3>Total Stock</h3>
          <p>435 Bags</p>
        </div>

        <div className="card">
          <h3>Low Stock</h3>
          <p>2 Products</p>
        </div>

        <div className="card">
          <h3>Out of Stock</h3>
          <p>0</p>
        </div>

      </div>

      <div className="stock-actions">

        <input
          type="text"
          placeholder="Search Product..."
        />

        <button>Add Stock</button>
        <button>Update Stock</button>
        <button>Delete Product</button>

      </div>

      <table>

        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Available Stock</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

          {stock.map((item) => (

            <tr key={item.id}>

              <td>{item.id}</td>
              <td>{item.product}</td>
              <td>{item.stock}</td>

              <td>

                <span
                  className={
                    item.status === "In Stock"
                      ? "in-stock"
                      : "low-stock"
                  }
                >
                  {item.status}
                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default Stock;