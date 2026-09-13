import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Products.css";

// ========================================
// BACKEND API
// ========================================

const API_URL = "http://localhost:5000/api/admin/products";


// ========================================
// PRODUCT IMAGE MAPPING
// Images are inside public/images
// ========================================

const getProductImage = (product) => {
  const name = (product.product_name || "").toLowerCase();
  const brand = (product.brand || "").toLowerCase();
  const category = (product.category || "").toLowerCase();

  // BIRLA WHITE

  if (
    name.includes("birla white") ||
    brand.includes("birla white")
  ) {
    return "/images/Birlawhite.webp";
  }


  // ULTRATECH

  if (
    name.includes("ultratech") ||
    brand.includes("ultratech")
  ) {
    if (
      category.includes("ppc") ||
      name.includes("ppc")
    ) {
      return "/images/Ultratech_ppc.avif";
    }

    return "/images/Ultratech_opc.jpeg";
  }


  // ACC

  if (
    name.includes("acc") ||
    brand.includes("acc")
  ) {
    if (
      category.includes("ppc") ||
      name.includes("ppc")
    ) {
      return "/images/Acc_ppc.webp";
    }

    return "/images/Acc_opc.jpg";
  }


  // AMBUJA

  if (
    name.includes("ambuja") ||
    brand.includes("ambuja")
  ) {
    if (
      category.includes("ppc") ||
      name.includes("ppc")
    ) {
      return "/images/Ambuja_ppc.jpeg";
    }

    return "/images/Ambuja_opc.webp";
  }


  // BIRLA

  if (
    name.includes("birla") ||
    brand.includes("birla")
  ) {
    if (
      category.includes("ppc") ||
      name.includes("ppc")
    ) {
      return "/images/Birla_ppc.webp";
    }

    return "/images/Birla_opc.webp";
  }


  // COROMANDEL

  if (
    name.includes("coromandel") ||
    brand.includes("coromandel")
  ) {
    return "/images/Coromandel_ppc.webp";
  }


  // DALMIA

  if (
    name.includes("dalmia") ||
    brand.includes("dalmia")
  ) {
    if (
      category.includes("ppc") ||
      name.includes("ppc")
    ) {
      return "/images/Dalmia_ppc.jpeg";
    }

    return "/images/Dalmia_opc.jpeg";
  }


  // JK WHITE

  if (
    name.includes("jk white") ||
    brand.includes("jk white")
  ) {
    return "/images/JKwhite.webp";
  }


  // JK CEMENT

  if (
    name.includes("jk") ||
    brand.includes("jk")
  ) {
    if (
      category.includes("ppc") ||
      name.includes("ppc")
    ) {
      return "/images/JK_ppc.jpeg";
    }

    return "/images/JK_opc.webp";
  }


  // JSW

  if (
    name.includes("jsw") ||
    brand.includes("jsw")
  ) {
    return "/images/Jsw_ppc.jpg";
  }


  // MAHA

  if (
    name.includes("maha") ||
    brand.includes("maha")
  ) {
    if (
      category.includes("ppc") ||
      name.includes("ppc")
    ) {
      return "/images/Maha_ppc.webp";
    }

    return "/images/Maha_opc.webp";
  }


  // PRIYA

  if (
    name.includes("priya") ||
    brand.includes("priya")
  ) {
    if (
      category.includes("ppc") ||
      name.includes("ppc")
    ) {
      return "/images/Priya_ppc.jpg";
    }

    return "/images/Priya_opc.webp";
  }


  // RAMCO

  if (
    name.includes("ramco") ||
    brand.includes("ramco")
  ) {
    if (
      category.includes("ppc") ||
      name.includes("ppc")
    ) {
      return "/images/Ramco_ppc.jpg";
    }

    return "/images/Ramco_opc.webp";
  }


  // SHREE

  if (
    name.includes("shree") ||
    brand.includes("shree")
  ) {
    if (
      category.includes("ppc") ||
      name.includes("ppc")
    ) {
      return "/images/Shree_ppc.webp";
    }

    return "/images/Shree_opc.jpeg";
  }


  // NO IMAGE

  return null;
};


// ========================================
// PRODUCTS COMPONENT
// ========================================

function Products() {

  const location = useLocation();

  // ========================================
  // STATES
  // ========================================

  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [showDetails, setShowDetails] =
    useState(false);

  const [showAdd, setShowAdd] =
    useState(false);
    const [showEdit, setShowEdit] =
  useState(false);

const [editProductName, setEditProductName] =
  useState("");

const [editBrand, setEditBrand] =
  useState("");

const [editCategory, setEditCategory] =
  useState("OPC 53");

const [editPrice, setEditPrice] =
  useState("");

const [editStock, setEditStock] =
  useState("");

const [editMinimumStock, setEditMinimumStock] =
  useState("");


  // ADD PRODUCT STATES

  const [newProductName, setNewProductName] =
    useState("");

  const [newBrand, setNewBrand] =
    useState("");

  const [newCategory, setNewCategory] =
    useState("OPC 53");

  const [newPrice, setNewPrice] =
    useState("");

  const [newStock, setNewStock] =
    useState("");

  const [newMinimumStock, setNewMinimumStock] =
    useState("");


  // ========================================
  // FETCH PRODUCTS FROM DATABASE
  // ========================================

  const fetchProducts = async () => {

    try {

      const response = await fetch(API_URL);

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to load products"
        );

      }

      setProducts(data.products || []);

    } catch (error) {

      console.error(
        "Fetch products error:",
        error
      );

      alert(
        "Failed to load products from database"
      );

    }

  };


  // LOAD PRODUCTS

  useEffect(() => {

    fetchProducts();

  }, []);


  // ========================================
  // OPEN ADD PRODUCT
  // ========================================

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


  // ========================================
  // FILTER PRODUCTS
  // ========================================

  const filteredProducts =
    products.filter((product) => {

      const searchText =
        search.toLowerCase();

      const productName =
        (product.product_name || "")
          .toLowerCase();

      const productBrand =
        (product.brand || "")
          .toLowerCase();

      const matchesSearch =
        productName.includes(searchText) ||
        productBrand.includes(searchText);

      const matchesCategory =
        category === "All" ||
        product.category === category;

      return (
        matchesSearch &&
        matchesCategory
      );

    });


  // ========================================
  // CLICK PRODUCT IMAGE
  // ========================================

  const handleProductClick = (product) => {

    setSelectedProduct(product);

    setShowDetails(true);

  };
  // ========================================
// OPEN EDIT PRODUCT
// ========================================

const handleEditClick = () => {

  if (!selectedProduct) {
    alert("Please select a product first.");
    return;
  }

  setEditProductName(
    selectedProduct.product_name || ""
  );

  setEditBrand(
    selectedProduct.brand || ""
  );

  setEditCategory(
    selectedProduct.category || "OPC 53"
  );

  setEditPrice(
    selectedProduct.price || ""
  );

  setEditStock(
    selectedProduct.stock_quantity || ""
  );

  setEditMinimumStock(
    selectedProduct.minimum_stock || ""
  );

  setShowDetails(false);

  setShowEdit(true);

};


  // ========================================
  // CLOSE PRODUCT DETAILS
  // ========================================

  const closeDetails = () => {

    setShowDetails(false);

    setSelectedProduct(null);

  };


  // ========================================
  // ADD PRODUCT
  // ========================================

  const handleAddProduct = async (e) => {

    e.preventDefault();

    try {

      const response = await fetch(
        API_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            product_name:
              newProductName,

            brand:
              newBrand,

            category:
              newCategory,

            price:
              newPrice,

            stock_quantity:
              newStock,

            minimum_stock:
              newMinimumStock

          })

        }
      );

      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to add product"
        );

      }


      alert(
        "Product added successfully!"
      );


      // Reload products

      await fetchProducts();


      // Clear form

      setNewProductName("");

      setNewBrand("");

      setNewCategory("OPC 53");

      setNewPrice("");

      setNewStock("");

      setNewMinimumStock("");


      setShowAdd(false);


    } catch (error) {

      console.error(
        "Add product error:",
        error
      );

      alert(error.message);

    }

  };
  // ========================================
// UPDATE PRODUCT
// ========================================

const handleUpdateProduct = async (e) => {

  e.preventDefault();

  if (!selectedProduct) {
    alert("No product selected.");
    return;
  }

  try {

    const response = await fetch(
      `${API_URL}/${selectedProduct.product_id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          product_name: editProductName,

          brand: editBrand,

          category: editCategory,

          price: editPrice,

          minimum_stock: editMinimumStock

        })

      }
    );

    const data = await response.json();

    if (!response.ok) {

      throw new Error(
        data.message ||
        "Failed to update product"
      );

    }

    alert("Product updated successfully!");

    await fetchProducts();

    setShowEdit(false);

    setShowDetails(false);

    setSelectedProduct(null);

  } catch (error) {

    console.error(
      "Update product error:",
      error
    );

    alert(error.message);

  }

};


  // ========================================
  // DELETE PRODUCT
  // ========================================

  const handleDelete = async () => {

    if (!selectedProduct) {

      alert(
        "Please click a product image first."
      );

      return;

    }


    const answer =
      window.confirm(
        `Do you want to delete ${selectedProduct.product_name}?`
      );


    if (!answer) {

      return;

    }


    try {

      const response = await fetch(
        `${API_URL}/${selectedProduct.product_id}`,
        {
          method: "DELETE"
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to delete product"
        );

      }


      alert(
        "Product deleted successfully!"
      );


      await fetchProducts();


      setSelectedProduct(null);

      setShowDetails(false);


    } catch (error) {

      console.error(
        "Delete error:",
        error
      );

      alert(error.message);

    }

  };


  // ========================================
  // RETURN
  // ========================================

  return (

    <div className="products-page">


      {/* HEADER */}

      <div className="products-header">

        <h1>Products</h1>


        <div className="top-bar">


          {/* SEARCH */}

          <input
            type="text"
            placeholder="Search Product or Brand..."
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
         

        </div>

      </div>


      {/* ================================= */}
      {/* PRODUCT GRID */}
      {/* ================================= */}

      <div className="product-grid">


        {filteredProducts.length > 0 ? (


          filteredProducts.map((product) => {

            const image =
              getProductImage(product);


            return (

              <div
                key={product.product_id}
                className={`product-card ${
                  selectedProduct?.product_id ===
                  product.product_id
                    ? "selected-product"
                    : ""
                }`}
              >


                {/* PRODUCT IMAGE */}

                {image ? (

                  <img
                    src={image}
                    alt={product.product_name}

                    onClick={() =>
                      handleProductClick(product)
                    }

                    style={{
                      cursor: "pointer"
                    }}

                    onError={(e) => {

                      e.currentTarget.style.display =
                        "none";

                    }}
                  />

                ) : (

                  <div className="no-image">

                    No Image Available

                  </div>

                )}


                {/* PRODUCT NAME */}

                <h3>

                  {product.product_name}

                </h3>


                <p>

                  Click image to view details

                </p>


              </div>

            );

          })


        ) : (


          <p className="no-products">

            No products found.

          </p>

        )}


      </div>


      {/* ================================= */}
      {/* PRODUCT DETAILS POPUP */}
      {/* ================================= */}

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


              {/* CLOSE BUTTON */}

              <button
                type="button"
                className="modal-close"
                onClick={closeDetails}
              >

                ×

              </button>


              {/* PRODUCT IMAGE */}

              {getProductImage(
                selectedProduct
              ) && (

                <img
                  src={
                    getProductImage(
                      selectedProduct
                    )
                  }

                  alt={
                    selectedProduct.product_name
                  }

                  className="modal-image"
                />

              )}


              {/* DETAILS */}

              <h2>

                {selectedProduct.product_name}

              </h2>


              <p>

                <strong>
                  Brand:
                </strong>{" "}

                {selectedProduct.brand}

              </p>


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

                ₹{selectedProduct.price}
                {" "} / Bag

              </p>


              <p>

                <strong>
                  Available Stock:
                </strong>{" "}

                {selectedProduct.stock_quantity}
                {" "} Bags

              </p>


              <p>

                <strong>
                  Minimum Stock:
                </strong>{" "}

                {selectedProduct.minimum_stock}
                {" "} Bags

              </p>
              <button
  type="button"
  className="edit-btn"
  onClick={handleEditClick}
>

  ✏️ Edit Product

</button>


              {/* DELETE BUTTON */}

              <button
                type="button"
                className="delete-btn"
                onClick={handleDelete}
              >

                🗑️ Delete Product

              </button>


            </div>

          </div>

        )}
        {/* ================================= */}
{/* EDIT PRODUCT POPUP */}
{/* ================================= */}

{showEdit &&
  selectedProduct && (

    <div className="product-modal-overlay">

      <div className="product-modal add-modal">

        {/* CLOSE */}

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


        <form
          onSubmit={handleUpdateProduct}
        >


          {/* PRODUCT NAME */}

          <input
            type="text"
            placeholder="Product Name"
            value={editProductName}
            onChange={(e) =>
              setEditProductName(
                e.target.value
              )
            }
            required
          />


          {/* BRAND */}

          <input
            type="text"
            placeholder="Brand Name"
            value={editBrand}
            onChange={(e) =>
              setEditBrand(
                e.target.value
              )
            }
            required
          />


          {/* CATEGORY */}

          <select
            value={editCategory}
            onChange={(e) =>
              setEditCategory(
                e.target.value
              )
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
            value={editPrice}
            onChange={(e) =>
              setEditPrice(
                e.target.value
              )
            }
            required
          />


          {/* MINIMUM STOCK */}

          <input
            type="number"
            placeholder="Minimum Stock"
            value={editMinimumStock}
            onChange={(e) =>
              setEditMinimumStock(
                e.target.value
              )
            }
            required
          />


          {/* UPDATE BUTTON */}

          <button
            type="submit"
            className="save-product-btn"
          >

            ✏️ Update Product

          </button>


        </form>

      </div>

    </div>

  )}


      {/* ================================= */}
      {/* ADD PRODUCT POPUP */}
      {/* ================================= */}

      {showAdd && (

        <div
          className="product-modal-overlay"
        >


          <div
            className="product-modal add-modal"
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


            <h2>
              Add Product
            </h2>


            <form
              onSubmit={handleAddProduct}
            >


              {/* PRODUCT NAME */}

              <input
                type="text"
                placeholder="Product Name"
                value={newProductName}
                onChange={(e) =>
                  setNewProductName(
                    e.target.value
                  )
                }
                required
              />


              {/* BRAND */}

              <input
                type="text"
                placeholder="Brand Name"
                value={newBrand}
                onChange={(e) =>
                  setNewBrand(
                    e.target.value
                  )
                }
                required
              />


              {/* CATEGORY */}

              <select
                value={newCategory}
                onChange={(e) =>
                  setNewCategory(
                    e.target.value
                  )
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
                  setNewPrice(
                    e.target.value
                  )
                }
                required
              />


              {/* STOCK */}

              <input
                type="number"
                placeholder="Initial Stock"
                value={newStock}
                onChange={(e) =>
                  setNewStock(
                    e.target.value
                  )
                }
                required
              />


              {/* MINIMUM STOCK */}

              <input
                type="number"
                placeholder="Minimum Stock"
                value={newMinimumStock}
                onChange={(e) =>
                  setNewMinimumStock(
                    e.target.value
                  )
                }
                required
              />


              {/* ADD BUTTON */}

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