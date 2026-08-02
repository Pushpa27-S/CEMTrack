import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import "./Products.css";
import products from "../data/ProductsData";

function CustomerProducts() {

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const navigate=useNavigate();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const filteredProducts = products.filter((product) => {

    const matchesSearch = product.brand
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      product.category === category;

    return matchesSearch && matchesCategory;

  });

  // Open product details popup
  const handleProductClick = (product) => {

    setSelectedProduct(product);
    setShowDetails(true);

  };

  // Close popup
  const closeDetails = () => {

    setShowDetails(false);
    setSelectedProduct(null);

  };

  // Add product to cart
  const handleAddToCart = () => {

    if (!selectedProduct) {
      return;
    }

    if (selectedProduct.stock === 0) {
      alert("This product is currently out of stock.");
      return;
    }

    // Get existing cart
    const existingCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    // Check if product already exists
    const alreadyInCart = existingCart.find(
      (item) => item.id === selectedProduct.id
    );

    if (alreadyInCart) {

      alert(
        selectedProduct.brand +
        " - " +
        selectedProduct.category +
        " is already in your cart."
      );

      return;
    }

    // Product information saved to cart
    const cartProduct = {

      id: selectedProduct.id,

      brand: selectedProduct.brand,

      category: selectedProduct.category,

      price: selectedProduct.price,

      stock: selectedProduct.stock,

      image: selectedProduct.image,

      quantity: 1,

    };

    // Save product to cart
    localStorage.setItem(
      "cart",
      JSON.stringify([
        ...existingCart,
        cartProduct
      ])
    );

    alert(
      selectedProduct.brand +
      " - " +
      selectedProduct.category +
      " added to cart."
    );

  };

  return (

    <div className="products-page">

      {/* HEADER */}

      <div className="products-header">

        <h1>Available Cement Products</h1>

        <div className="top-bar">

          {/* SEARCH */}

          <input
            type="text"
            placeholder="Search Brand..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="search-box"
          />

          {/* CATEGORY */}

          <div className="category-filter">

            <label htmlFor="category">

              <strong>Category :</strong>

            </label>

            <select
              id="category"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >

              <option>All</option>

              <option>OPC 53</option>

              <option>PPC</option>

              <option>White Cement</option>

            </select>

          </div>

        </div>

      </div>

      {/* PRODUCT IMAGES */}

      <div className="product-grid">

        {filteredProducts.length > 0 ? (

          filteredProducts.map((product) => (

            <div
              className="product-card"
              key={product.id}
            >

              <img
                src={product.image}
                alt={product.brand}
                className="product-image"
                onClick={() =>
                  handleProductClick(product)
                }
                style={{ cursor: "pointer" }}
              />

            </div>

          ))

        ) : (

          <p>No products found.</p>

        )}

      </div>

      {/* PRODUCT DETAILS POPUP */}

      {showDetails && selectedProduct && (

        <div
          className="product-modal-overlay"
          onClick={closeDetails}
        >

          <div
            className="product-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* CLOSE */}

            <button
              type="button"
              className="modal-close"
              onClick={closeDetails}
            >
              ×
            </button>

            {/* PRODUCT IMAGE */}

            <img
              src={selectedProduct.image}
              alt={selectedProduct.brand}
              className="modal-image"
            />

            {/* PRODUCT NAME */}

            <h2>
              {selectedProduct.brand}
            </h2>

            {/* CATEGORY */}

            <p>
              <strong>Category:</strong>{" "}
              {selectedProduct.category}
            </p>

            {/* PRICE */}

            <p>
              <strong>Price:</strong>{" "}
              ₹{selectedProduct.price} / Bag
            </p>

            {/* STOCK */}

            <p>
              <strong>Availability:</strong>{" "}

              {selectedProduct.stock > 0
                ? `${selectedProduct.stock} Bags Available`
                : "Out of Stock"}

            </p>

            {/* ADD TO CART */}

            <button
              type="button"
              className="add-btn"
              disabled={
                selectedProduct.stock === 0
              }
              onClick={handleAddToCart}
            >

              {selectedProduct.stock > 0
                ? "Add to Cart"
                : "Out of Stock"}
            </button> 
            <button
              type="button"
              className="view-cart-btn"
              onClick={() => navigate("/cart")}
             >
            🛒 View Cart
           </button>


          </div>

        </div>

      )}

    </div>

  );

}

export default CustomerProducts;