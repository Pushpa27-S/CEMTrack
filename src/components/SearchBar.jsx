import React, { useState } from "react";
import "./SearchBar.css";

const SearchBar = () => {
  const products = [
    { id: 1, name: "UltraTech Cement", brand: "UltraTech", type: "OPC 53" },
    { id: 2, name: "ACC Cement", brand: "ACC", type: "PPC" },
    { id: 3, name: "Ambuja Cement", brand: "Ambuja", type: "OPC 43" },
    { id: 4, name: "Dalmia Cement", brand: "Dalmia", type: "PSC" },
    { id: 5, name: "Shree Cement", brand: "Shree", type: "OPC 53" },
  ];

  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.brand.toLowerCase().includes(search.toLowerCase()) ||
    product.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="search-container">
      <h2>CEMTrack Product Search</h2>

      <input
        type="text"
        placeholder="Search by Product, Brand or Type..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      <table className="search-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Brand</th>
            <th>Type</th>
          </tr>
        </thead>

        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.brand}</td>
                <td>{product.type}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No products found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SearchBar;