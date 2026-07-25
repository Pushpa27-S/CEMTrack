import React, { useState } from "react";
import "./Products.css";
import products from "../data/ProductsData";

function Products() {

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredProducts = products.filter((product) => {

    const matchesSearch =
      product.brand.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;

  });

  return (

    <div className="products-page">

      <div className="products-header">

        <h1>Products</h1>

        <div className="top-bar">

          <input
            type="text"
            placeholder="Search Brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
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

      <div className="product-grid">

        {filteredProducts.map((product) => (

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
              <strong>Price:</strong> ₹{product.price}
            </p>

            <p>
              <strong>Stock:</strong> {product.stock} Bags
            </p>

            <div className="product-buttons">

              <button className="view-btn">
                View
              </button>

              <button className="edit-btn">
                Edit
              </button>

              <button className="delete-btn">
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}

export default Products;