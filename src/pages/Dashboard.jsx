import React, { useEffect, useState } from "react";
import "./Dashboard.css";

// ========================================
// BACKEND STOCK API
// ========================================

const STOCK_API_URL =
  "http://localhost:5000/api/admin/inventory/stock";

function Dashboard() {

  // ========================================
  // STATES
  // ========================================

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);


  // ========================================
  // GET STOCK FROM DATABASE
  // ========================================

  const fetchStock = async () => {

    try {

      setLoading(true);

      const response =
        await fetch(STOCK_API_URL);

      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to load dashboard data"
        );

      }


      setProducts(
        data.products || []
      );


    } catch (error) {

      console.error(
        "Fetch dashboard stock error:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  // ========================================
  // LOAD DATA WHEN DASHBOARD OPENS
  // ========================================

  useEffect(() => {

    fetchStock();

  }, []);


  // ========================================
  // DASHBOARD CALCULATIONS
  // ========================================

  const totalProducts =
    products.length;


  const totalStock =
    products.reduce(
      (total, product) =>
        total +
        Number(
          product.stock_quantity || 0
        ),
      0
    );


  const totalBrands =
    new Set(
      products.map(
        (product) =>
          product.brand
      )
    ).size;


  const totalCategories =
    new Set(
      products.map(
        (product) =>
          product.category
      )
    ).size;


  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return (

      <div className="dashboard-container">

        <div className="dashboard-header">

          <div>

            <h1>
              Dashboard
            </h1>

            <p>
              Loading dashboard data...
            </p>

          </div>

        </div>

      </div>

    );

  }


  // ========================================
  // RETURN
  // ========================================

  return (

    <div className="dashboard-container">


      {/* HEADER */}

      <div className="dashboard-header">

        <div>

          <h1>
            Dashboard
          </h1>

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