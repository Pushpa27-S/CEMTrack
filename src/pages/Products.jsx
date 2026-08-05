import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Products.css";
import productsData from "../data/ProductsData";

function Products() {
  const location = useLocation();

  // ================================
  // PRODUCTS
  // ================================

  const [products, setProducts] = useState(productsData);

  // ================================
  // SEARCH & CATEGORY
  // ================================

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // ================================
  // SELECTED PRODUCT
  // ================================

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [showDetails, setShowDetails] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  // ================================
  // ADD PRODUCT FORM
  // ================================

  const [newBrand, setNewBrand] = useState("");
  const [newCategory, setNewCategory] = useState("OPC 53");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("");
  const [newImage, setNewImage] = useState("");

  // ================================
  // OPEN ADD PRODUCT FROM SIDEBAR
  // ================================

  useEffect(() => {
    if (location.state?.openAddProduct) {
      setShowAdd(true);

      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );
    }
  }, [location.state]);

  // ================================
  // FILTER PRODUCTS
  // ================================

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.brand
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      product.category === category;

    return matchesSearch && matchesCategory;
  });

  // ================================
  // PRODUCT CLICK
  // ================================

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowDetails(true);
  };

  // ================================
  // CLOSE DETAILS
  // ================================

  const closeDetails = () => {
    setShowDetails(false);
  };

  // ================================
  // DELETE PRODUCT
  // ================================

  const handleDelete = () => {
    if (!selectedProduct) {
      alert("Please click a product image first.");
      return;
    }

    const answer = window.confirm(
      `Do you want to delete ${selectedProduct.brand} - ${selectedProduct.category}?`
    );

    if (answer) {
      const remainingProducts = products.filter(
        (product) =>
          product.id !== selectedProduct.id
      );

      setProducts(remainingProducts);

      setSelectedProduct(null);
      setShowDetails(false);

      alert("Product deleted successfully.");
    }
  };

  // ================================
  // ADD PRODUCT
  // ================================

  const handleAddProduct = (e) => {
    e.preventDefault();

    const newProduct = {
      id:
        products.length === 0
          ? 1
          : Math.max(
              ...products.map(
                (product) => product.id
              )
            ) + 1,

      brand: newBrand,
      category: newCategory,
      price: Number(newPrice),
      stock: Number(newStock),
      image: newImage,
    };

    setProducts([
      ...products,
      newProduct
    ]);

    // Clear form

    setNewBrand("");
    setNewCategory("OPC 53");
    setNewPrice("");
    setNewStock("");
    setNewImage("");

    setShowAdd(false);

    alert("Product added successfully.");
  };

  // ================================
  // PAGE
  // ================================

  return (
    <div className="products-page">

      {/* =================================
          HEADER
      ================================= */}

      <div className="products-header">

        <h1>Products</h1>

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
              <strong>
                Category :
              </strong>
            </label>

            <select
              id="category"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >

              <option value="All">
                All
              </option>

              <option value="OPC 53">
                OPC 53
              </option>

              <option value="PPC">
                PPC
              </option>

              <option value="White Cement">
                White Cement
              </option>

            </select>

          </div>

          {/* =================================
              DELETE BUTTON
          ================================= */}

          <button
            type="button"
            className="top-action-btn delete-action"
            onClick={handleDelete}
          >
            🗑️ Delete
          </button>

        </div>

      </div>

      {/* =================================
          PRODUCT GRID
      ================================= */}

      <div className="product-grid">

        {filteredProducts.length > 0 ? (

          filteredProducts.map(
            (product) => (

              <div
                className={`product-card ${
                  selectedProduct?.id ===
                  product.id
                    ? "selected-product"
                    : ""
                }`}
                key={product.id}
              >

                <img
                  src={product.image}
                  alt={product.brand}
                  className="product-image"
                  onClick={() =>
                    handleProductClick(product)
                  }
                />

              </div>

            )
          )

        ) : (

          <p className="no-products">
            No products found.
          </p>

        )}

      </div>

      {/* =================================
          PRODUCT DETAILS POPUP
      ================================= */}

      {showDetails &&
        selectedProduct && (

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

              {/* IMAGE */}

              <img
                src={selectedProduct.image}
                alt={selectedProduct.brand}
                className="modal-image"
              />

              {/* BRAND */}

              <h2>
                {selectedProduct.brand}
              </h2>

              {/* CATEGORY */}

              <p>
                <strong>
                  Category:
                </strong>{" "}
                {selectedProduct.category}
              </p>

              {/* PRICE */}

              <p>
                <strong>
                  Price:
                </strong>{" "}
                ₹{selectedProduct.price} / Bag
              </p>

              {/* STOCK */}

              <p>
                <strong>
                  Stock:
                </strong>{" "}
                {selectedProduct.stock} Bags
              </p>

            </div>

          </div>

        )}

      {/* =================================
          ADD PRODUCT POPUP
      ================================= */}

      {showAdd && (

        <div
          className="product-modal-overlay"
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
              onClick={() =>
                setShowAdd(false)
              }
            >
              ×
            </button>

            {/* TITLE */}

            <h2>
              Add Product
            </h2>

            <form
              onSubmit={handleAddProduct}
            >

              {/* BRAND */}

              <input
                type="text"
                placeholder="Brand Name"
                value={newBrand}
                onChange={(e) =>
                  setNewBrand(e.target.value)
                }
                required
              />

              {/* CATEGORY */}

              <select
                value={newCategory}
                onChange={(e) =>
                  setNewCategory(e.target.value)
                }
              >

                <option value="OPC 53">
                  OPC 53
                </option>

                <option value="PPC">
                  PPC
                </option>

                <option value="White Cement">
                  White Cement
                </option>

              </select>

              {/* PRICE */}

              <input
                type="number"
                placeholder="Price"
                value={newPrice}
                onChange={(e) =>
                  setNewPrice(e.target.value)
                }
                required
              />

              {/* STOCK */}

              <input
                type="number"
                placeholder="Stock"
                value={newStock}
                onChange={(e) =>
                  setNewStock(e.target.value)
                }
                required
              />

              {/* IMAGE */}

              <input
                type="text"
                placeholder="/images/example.jpeg"
                value={newImage}
                onChange={(e) =>
                  setNewImage(e.target.value)
                }
                required
              />

              {/* ADD PRODUCT */}

              <button
                type="submit"
                className="save-product-btn"
              >
                Add Product
              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Products;