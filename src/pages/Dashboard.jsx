import React from "react";
import "./Dashboard.css";
import products from "../data/ProductsData";

function Dashboard() {

  // ========================================
  // DASHBOARD CALCULATIONS
  // ========================================

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (total, product) =>
      total + Number(product.stock || 0),
    0
  );

  const totalBrands = new Set(
    products.map((product) => product.brand)
  ).size;

  const totalCategories = new Set(
    products.map((product) => product.category)
  ).size;


  // ========================================
  // RETURN
  // ========================================

  return (
    <div className="dashboard-container">

      {/* HEADER */}

      <div className="dashboard-header">

        <div>
          <h1>Dashboard</h1>

          <p>
            Welcome back! Here's what's happening
            with your cement inventory today.
          </p>
        </div>

      </div>


      {/* STAT CARDS */}

      <div className="dashboard-cards">

        {/* TOTAL PRODUCTS */}

        <div className="dashboard-card">

          <div className="dashboard-card-content">

            <h3>
              Total Products
            </h3>

            <p>
              {totalProducts}
            </p>

          </div>

        </div>


        {/* TOTAL BRANDS */}

        <div className="dashboard-card">

          <div className="dashboard-card-content">

            <h3>
              Total Brands
            </h3>

            <p>
              {totalBrands}
            </p>

          </div>

        </div>


        {/* TOTAL STOCK */}

        <div className="dashboard-card">

          <div className="dashboard-card-content">

            <h3>
              Total Stock
            </h3>

            <p>
              {totalStock} Bags
            </p>

          </div>

        </div>


        {/* CATEGORIES */}

        <div className="dashboard-card">

          <div className="dashboard-card-content">

            <h3>
              Categories
            </h3>

            <p>
              {totalCategories}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;