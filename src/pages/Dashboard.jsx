import React from "react";
import "./Dashboard.css";
import products from "../data/ProductsData";

function Dashboard() {

  // Total Products
  const totalProducts = products.length;

  // Total Stock
  const totalStock = products.reduce(
    (total, product) => total + product.stock,
    0
  );

  // Total Brands
  const totalBrands = new Set(
    products.map((product) => product.brand)
  ).size;

  // Total Categories
  const totalCategories = new Set(
    products.map((product) => product.category)
  ).size;

  return (
    <div className="dashboard-container">

      <header className="dashboard-header">
        <h1>Dashboard</h1>
      </header>

      <div className="cards">

        <div className="card">
          <h3>Total Products</h3>
          <p>{totalProducts}</p>
        </div>

        <div className="card">
          <h3>Total Brands</h3>
          <p>{totalBrands}</p>
        </div>

        <div className="card">
          <h3>Total Stock</h3>
          <p>{totalStock} Bags</p>
        </div>

        <div className="card">
          <h3>Categories</h3>
          <p>{totalCategories}</p>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;