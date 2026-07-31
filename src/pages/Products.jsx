import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Products.css";
import productsData from "../data/ProductsData";

function Products() {

const location = useLocation();

const [products, setProducts] = useState(productsData);

const [search, setSearch] = useState("");
const [category, setCategory] = useState("All");

const [selectedProduct, setSelectedProduct] = useState(null);

const [showDetails, setShowDetails] = useState(false);
const [showEdit, setShowEdit] = useState(false);
const [showAdd, setShowAdd] = useState(false);

const [editPrice, setEditPrice] = useState("");
const [editStock, setEditStock] = useState("");

const [newBrand, setNewBrand] = useState("");
const [newCategory, setNewCategory] = useState("OPC 53");
const [newPrice, setNewPrice] = useState("");
const [newStock, setNewStock] = useState("");
const [newImage, setNewImage] = useState("");

/* =========================================
OPEN ADD PRODUCT FROM SIDEBAR
========================================= */

useEffect(() => {

if (location.state?.openAddProduct) {

  setShowAdd(true);

  // Clear navigation state so popup
  // doesn't reopen unexpectedly
  window.history.replaceState(
    {},
    document.title,
    window.location.pathname
  );
}

}, [location.state]);

/* =========================================
FILTER PRODUCTS
========================================= */

const filteredProducts = products.filter((product) => {

const matchesSearch = product.brand
  .toLowerCase()
  .includes(search.toLowerCase());

const matchesCategory =
  category === "All" ||
  product.category === category;

return matchesSearch && matchesCategory;

});

/* =========================================
PRODUCT IMAGE CLICK
========================================= */

const handleProductClick = (product) => {

setSelectedProduct(product);
setShowDetails(true);

};

/* =========================================
CLOSE DETAILS
========================================= */

const closeDetails = () => {

setShowDetails(false);

};

/* =========================================
EDIT PRODUCT
========================================= */

const handleEdit = () => {

if (!selectedProduct) {

  alert("Please click a product image first.");

  return;

}

setEditPrice(selectedProduct.price);
setEditStock(selectedProduct.stock);

setShowDetails(false);
setShowEdit(true);

};

/* =========================================
SAVE EDIT
========================================= */

const saveEdit = () => {

const updatedProducts = products.map((product) => {

  if (product.id === selectedProduct.id) {

    return {
      ...product,
      price: Number(editPrice),
      stock: Number(editStock),
    };

  }

  return product;

});

setProducts(updatedProducts);

const updatedProduct = updatedProducts.find(
  (product) => product.id === selectedProduct.id
);

setSelectedProduct(updatedProduct);

setShowEdit(false);
setShowDetails(true);

};

/* =========================================
DELETE PRODUCT
========================================= */

const handleDelete = () => {

if (!selectedProduct) {

  alert("Please click a product image first.");

  return;

}

const answer = window.confirm(
  "Do you want to delete " +
  selectedProduct.brand +
  " - " +
  selectedProduct.category +
  "?"
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

/* =========================================
ADD PRODUCT
========================================= */

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

};

return (

<div className="products-page">


  {/* =====================================
      HEADER
  ===================================== */}

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

          <option>
            All
          </option>

          <option>
            OPC 53
          </option>

          <option>
            PPC
          </option>

          <option>
            White Cement
          </option>

        </select>

      </div>


      {/* EDIT BUTTON */}

      <button
        type="button"
        className="top-action-btn edit-action"
        onClick={handleEdit}
      >

        ✏️ Edit

      </button>


      {/* DELETE BUTTON */}

      <button
        type="button"
        className="top-action-btn delete-action"
        onClick={handleDelete}
      >

        🗑️ Delete

      </button>

    </div>

  </div>


  {/* =====================================
      PRODUCT IMAGES
  ===================================== */}

  <div className="product-grid">

    {filteredProducts.map(
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
    )}

  </div>


  {/* =====================================
      PRODUCT DETAILS POPUP
  ===================================== */}

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

          <button
            type="button"
            className="modal-close"
            onClick={closeDetails}
          >
            ×
          </button>


          <img
            src={selectedProduct.image}
            alt={selectedProduct.brand}
            className="modal-image"
          />


          <h2>
            {selectedProduct.brand}
          </h2>


          <p>

            <strong>
              Category:
            </strong>{" "}

            {selectedProduct.category}

          </p>


          <p>

            <strong>
              Price:
            </strong>{" "}

            ₹{selectedProduct.price} / Bag

          </p>


          <p>

            <strong>
              Stock:
            </strong>{" "}

            {selectedProduct.stock} Bags

          </p>

        </div>

      </div>

    )}


  {/* =====================================
      EDIT PRODUCT POPUP
  ===================================== */}

  {showEdit &&
    selectedProduct && (

      <div
        className="product-modal-overlay"
      >

        <div
          className="product-modal"
          onClick={(e) =>
            e.stopPropagation()
          }
        >

          <button
            type="button"
            className="modal-close"
            onClick={() =>
              setShowEdit(false)
            }
          >
            ×
          </button>


          <h2>
            Edit Product
          </h2>


          <p>

            <strong>
              {selectedProduct.brand}
            </strong>

          </p>


          <p>

            Category:
            {" "}
            {selectedProduct.category}

          </p>


          <input
            type="number"
            value={editPrice}
            onChange={(e) =>
              setEditPrice(e.target.value)
            }
            placeholder="Price"
          />


          <input
            type="number"
            value={editStock}
            onChange={(e) =>
              setEditStock(e.target.value)
            }
            placeholder="Stock"
          />


          <button
            type="button"
            className="save-product-btn"
            onClick={saveEdit}
          >

            Save Changes

          </button>

        </div>

      </div>

    )}


  {/* =====================================
      ADD PRODUCT POPUP
  ===================================== */}

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

        <button
          type="button"
          className="modal-close"
          onClick={() =>
            setShowAdd(false)
          }
        >
          ×
        </button>


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

            <option>
              OPC 53
            </option>

            <option>
              PPC
            </option>

            <option>
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


          {/* ADD */}

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