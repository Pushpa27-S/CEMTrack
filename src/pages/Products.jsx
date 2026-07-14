import React ,{useStatefrom "react";
import "./Products.css";

import ultratech from "../assets/Ultratech.jpeg";
import acc from "../assets/Acc.jpeg";
import ambuja from "../assets/Ambuja.jpeg";
import dalmia from "../assets/Dalmia.jpeg";
import priya from "../assets/Priya.jpeg";
import ramco from "../assets/Ramco.jpeg";
import maha from "../assets/Maha.jpeg";

function Products() {
  const products = [
    {
      id: 1,
      image: ultratech,
      name: "UltraTech Cement",
      category: "OPC 53 Grade",
      price: "₹420",
      stock: 120,
      sold: 250,
    },
    {
      id: 2,
      image: acc,
      name: "Acc Cement",
      category: "PPC",
      price: "₹400",
      stock: 90,
      sold: 180,
    },
    {
      id: 3,
      image: ambuja,
      name: "Ambuja Cement",
      category: "OPC 43 Grade",
      price: "₹390",
      stock: 65,
      sold: 160,
    },
    {
      id: 4,
      image: dalmia,
      name: "Dalmia Cement",
      category: "PPC",
      price: "₹410",
      stock: 25,
      sold: 90,
    },
    {
      id: 5,
      image: priya,
      name: "Priya Cement",
      category: "OPC 53 Grade",
      price: "₹405",
      stock: 15,
      sold: 45,
    },
    {
      id: 6,
      image: ramco,
      name: "Ramco Cement",
      category: "PPC",
      price: "₹415",
      stock: 100,
      sold: 270,
    },
    {
      id: 7,
      image: maha,
      name: "Maha Cement",
      category: "OPC 53 Grade",
      price: "₹425",
      stock: 80,
      sold: 140,
    },
  ];

  return (
    <div className="products-container">

      <h1>Products Management</h1>

      {/* Statistics Cards */}

      <div className="stats-container">

        <div className="card">
          <h3>Total Products</h3>
          <p>7</p>
        </div>

        <div className="card">
          <h3>In Stock</h3>
          <p>5</p>
        </div>

        <div className="card">
          <h3>Low Stock</h3>
          <p>2</p>
        </div>

        <div className="card">
          <h3>Best Selling</h3>
          <p>Ramco Cement</p>
        </div>

      </div>

      {/* Top Controls */}

      <div className="top-controls">

        <input
          type="text"
          placeholder="Search Product..."
          className="search-box"
        />

        <select className="filter-box">
          <option>All Categories</option>
          <option>OPC 53 Grade</option>
          <option>OPC 43 Grade</option>
          <option>PPC</option>
        </select>

        <button className="add-btn">
          + Add Product
        </button>

      </div>

      {/* Product Table */}

      <table className="products-table">

        <thead>

          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Sold</th>
            <th>Action</th>
          </tr>

        </thead>

        <tbody>

          {products.map((product) => (

            <tr key={product.id}>

              <td>{product.id}</td>

              <td>
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-img"
                />
              </td>

              <td>{product.name}</td>

              <td>{product.category}</td>

              <td>{product.price}</td>

              <td>{product.stock} Bags</td>

              <td>
                {product.stock > 50 ? (
                  <span className="in-stock">In Stock</span>
                ) : (
                  <span className="low-stock">Low Stock</span>
                )}
              </td>

              <td>{product.sold}</td>

              <td>

                <button className="edit-btn">
                  Edit
                </button>

                <button className="delete-btn">
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default Products;