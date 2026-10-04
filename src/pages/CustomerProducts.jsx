import React, { useState, useEffect } from "react";

import { Link,useNavigate } from "react-router-dom";

import "./CustomerProducts.css";

import productsData from "../data/ProductsData";



function CustomerProducts() {



  const [products, setProducts] = useState(productsData);



  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");



  const navigate = useNavigate();



  const [selectedProduct, setSelectedProduct] = useState(null);

  const [showDetails, setShowDetails] = useState(false);







  // ======================================================

  // GET PRICE AND STOCK FROM DATABASE

  // ======================================================



  useEffect(() => {



    const fetchProductDetails = async () => {



      try {



        const response = await fetch(

          "http\://localhost:5000/api/admin/products"

        );



        const data = await response.json();

        console.log("DATABASE PRODUCTS:", data.products);

        console.log("FULL DATABASE RESPONSE:", data);



        if (!data.success) {



          console.error(

            "Failed to fetch product details from database"

          );



          return;



        }





        // Keep ProductsData.js as the main product list.

        // Only update PRICE and STOCK from database.



        setProducts((currentProducts) => {



          return currentProducts.map((localProduct) => {



            const normalizeText = (value) => {



              return String(value || "")

                .toLowerCase()

                .replace(/\s+/g, " ")

                .trim();



            };





            const databaseProduct =

              data.products.find(

                (dbProduct) =>

                  Number(dbProduct.product_id) ===

                  Number(localProduct.id)

              );



            // If matching database product is found,

            // ONLY price and stock are replaced.



            if (databaseProduct) {



              return {



                ...localProduct,



                price: Number(databaseProduct.price),



                stock: Number(

                  databaseProduct.stock_quantity

                ),



              };



            }





            // If no matching database product is found,

            // keep the existing ProductsData.js product unchanged.



            return localProduct;



          });



        });



      } catch (error) {



        console.error(

          "Error fetching product details:",

          error

        );



      }



    };





    fetchProductDetails();



  }, []);





  // ==================================================

  // FILTER PRODUCTS

  // ==================================================





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



  // ==================================================

  // OPEN PRODUCT DETAILS

  // ==================================================





  const handleProductClick = (product) => {



    setSelectedProduct(product);

    setShowDetails(true);



  };







  // Close popup



  // ==================================================

  // CLOSE PRODUCT DETAILS

  // ==================================================



  const closeDetails = () => {



    setShowDetails(false);

    setSelectedProduct(null);



  };







  // Add product to cart



  // ==================================================

  // ADD PRODUCT TO CART
  // ==================================================





  const handleAddToCart = () => {



    if (!selectedProduct) {

      return;

    }



    // Check stock

    if (

      selectedProduct.stock === undefined ||

      selectedProduct.stock <= 0

    ) {



      alert(

        "This product is currently out of stock."

      );



      return;



    }



    // ==================================================

    // GET EXISTING CART

    // ==================================================



    let existingCart = [];



    try {



      const savedCart =

        localStorage.getItem("cart");



      if (savedCart) {



        const parsedCart =

          JSON.parse(savedCart);



        if (Array.isArray(parsedCart)) {



          existingCart = parsedCart;



        }



      }



    } catch (error) {



      console.error(

        "CART LOAD ERROR:",

        error

      );



      existingCart = [];



    }



    // ==================================================

    // CHECK IF SAME PRODUCT ALREADY EXISTS

    // ==================================================



    const alreadyInCart =

      existingCart.some(

        (item) =>

          Number(item.id) ===

          Number(selectedProduct.id)

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
// ==================================================

    // CREATE CART PRODUCT

    // ==================================================



    const cartProduct = {



      id: selectedProduct.id,



      brand: selectedProduct.brand,



      category: selectedProduct.category,



      price: selectedProduct.price,



      stock: selectedProduct.stock,



      image: selectedProduct.image,



      quantity: 1



    };



    // ==================================================

    // ADD PRODUCT TO CART

    // ==================================================



    const updatedCart = [

      ...existingCart,

      cartProduct

    ];



    localStorage.setItem(

      "cart",

      JSON.stringify(updatedCart)

    );



    // ==================================================

    // SUCCESS MESSAGE

    // ==================================================



    alert(

      selectedProduct.brand +

      " - " +

      selectedProduct.category +

      " added to cart."

    );



  };



  // ==================================================

  // PAGE

  // =================================================



  return (



    <div className="customer-products-page">



      {/* ==================================================

          HEADER

      ================================================== */}



      <div className="products-header">



        <h1>

          Available Cement Products

        </h1>



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



        </div>



      </div>



      {/* ==================================================

          PRODUCT GRID

      ================================================== */}



      <div className="product-grid">



        {filteredProducts.length > 0 ? (



          filteredProducts.map(

            (product) => (



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

                  style={{

                    cursor: "pointer"

                  }}

                />



              </div>



            )

          )



        ) : (



          <p>

            No products found.

          </p>



        )}



      </div>



      {/* ==================================================

          PRODUCT DETAILS POPUP

      ================================================== */}



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

                  Availability:

                </strong>{" "}



                {selectedProduct.stock > 0

                  ? `${selectedProduct.stock} Bags Available`

                  : "Out of Stock"}



              </p>



              {/* ADD TO CART */}



              <button

                type="button"

                className="add-btn"

                disabled={

                  !selectedProduct.stock ||

                  selectedProduct.stock <= 0

                }

                onClick={handleAddToCart}

              >



                {selectedProduct.stock > 0

                  ? "Add to Cart"

                  : "Out of Stock"}



              </button>



              {/* VIEW CART */}



              <button

                type="button"

                className="view-cart-btn"

                onClick={() =>

                  navigate("/cart")

                }

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