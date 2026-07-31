import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Products.css";
import products from "../data/ProductsData";

function CustomerProducts() {
const [search, setSearch] = useState("");
const [category, setCategory] = useState("All");

const filteredProducts = products.filter((product) => {
const matchesSearch = product.brand
.toLowerCase()
.includes(search.toLowerCase());

const matchesCategory =
  category === "All" || product.category === category;

return matchesSearch && matchesCategory;

});

return (
<div className="products-page">

  <div className="products-header">

    <h1>Available Cement Products</h1>

    <div className="top-bar">

      <input
        type="text"
        placeholder="Search Brand..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-box"
      />

      <div className="category-filter">

        <label htmlFor="category">
          <strong>Category :</strong>
        </label>

        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>All</option>
          <option>OPC 53</option>
          <option>PPC</option>
          <option>White Cement</option>
        </select>

      </div>

    </div>

  </div>

  <div className="product-grid">

    {filteredProducts.length > 0 ? (

      filteredProducts.map((product) => (

        <div className="product-card" key={product.id}>

          <img
            src={product.image}
            alt={product.brand}
            className="product-image"
          />

          <h3>{product.brand}</h3>

          <p>
            <strong>Category:</strong> {product.category}
          </p>

          <p>
            <strong>Price:</strong> ₹{product.price} / Bag
          </p>

          <p>
            <strong>Availability:</strong>{" "}
            {product.stock > 0
              ? `${product.stock} Bags Available`
              : "Out of Stock"}
          </p>

          <div className="product-buttons">

            <button
              className="view-btn"
              disabled={product.stock === 0}
            >
              View
            </button>

            <button
              className="add-btn"
              disabled={product.stock === 0}
            >
              Add to Cart
            </button>

          </div>

        </div>

      ))

    ) : (

      <p>No products found.</p>

    )}

  </div>

  <div style={{ marginTop: "30px" }}>
    <Link to="/customer-home">
      ← Back to Customer Home
    </Link>
  </div>

</div>

);
}

export default CustomerProducts;