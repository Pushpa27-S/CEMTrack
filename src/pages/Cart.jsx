import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CustomerLogin.css";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  // Payment popup
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);

  // Selected product
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Payment mode
  const [paymentMode, setPaymentMode] = useState("Cash");

  // UPI app
  const [upiApp, setUpiApp] = useState("Google Pay");

  // UPI ID
  const [upiId, setUpiId] = useState("");

  // Card details
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // Net banking
  const [bank, setBank] = useState("");

  // ===============================
  // LOAD CART
  // ===============================

  useEffect(() => {
    const savedCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    setCart(savedCart);
  }, []);

  // ===============================
  // SAVE CART
  // ===============================

  const updateCart = (updatedCart) => {
    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  };

  // ===============================
  // REMOVE PRODUCT
  // ===============================

  const removeFromCart = (id) => {
    const updatedCart = cart.filter(
      (item) => item.id !== id
    );

    updateCart(updatedCart);

    if (
      selectedProduct &&
      selectedProduct.id === id
    ) {
      setSelectedProduct(null);
    }
  };

  // ===============================
  // INCREASE QUANTITY
  // ===============================

  const increaseQuantity = (id) => {
    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        if (item.quantity >= item.stock) {
          alert(
            "You cannot add more than available stock."
          );

          return item;
        }

        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }

      return item;
    });

    updateCart(updatedCart);

    // Update selected product also
    if (
      selectedProduct &&
      selectedProduct.id === id
    ) {
      const updatedProduct = updatedCart.find(
        (item) => item.id === id
      );

      setSelectedProduct(updatedProduct);
    }
  };

  // ===============================
  // DECREASE QUANTITY
  // ===============================

  const decreaseQuantity = (id) => {
    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          quantity: Math.max(
            1,
            item.quantity - 1
          ),
        };
      }

      return item;
    });

    updateCart(updatedCart);

    if (
      selectedProduct &&
      selectedProduct.id === id
    ) {
      const updatedProduct = updatedCart.find(
        (item) => item.id === id
      );

      setSelectedProduct(updatedProduct);
    }
  };

  // ===============================
  // SELECT PRODUCT TO ORDER
  // ===============================

  const selectProduct = (product) => {
    setSelectedProduct(product);
  };

  // ===============================
  // SELECTED PRODUCT TOTAL
  // ===============================

  const selectedSubtotal = selectedProduct
  ? Number(selectedProduct.price) *
    Number(selectedProduct.quantity)
  : 0;

const selectedGST = selectedSubtotal * 0.18;

const selectedTotal = selectedSubtotal + selectedGST;

  // ===============================
  // OPEN PAYMENT
  // ===============================

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (!selectedProduct) {
      alert(
        "Please select one product to order."
      );

      return;
    }

    setPaymentMode("Cash");
    setUpiApp("Google Pay");

    setUpiId("");
    setCardNumber("");
    setCardName("");
    setExpiry("");
    setCvv("");
    setBank("");

    setShowPaymentPopup(true);
  };

  // ===============================
  // VALIDATE PAYMENT
  // ===============================

  const validatePayment = () => {
    // CASH
    if (paymentMode === "Cash") {
      return true;
    }

    // UPI
    if (paymentMode === "UPI") {
      if (upiId.trim() === "") {
        alert("Please enter your UPI ID.");
        return false;
      }

      return true;
    }

    // CARD
    if (paymentMode === "Card") {
      if (
        cardNumber.trim() === "" ||
        cardName.trim() === "" ||
        expiry.trim() === "" ||
        cvv.trim() === ""
      ) {
        alert(
          "Please enter all card details."
        );

        return false;
      }

      if (cardNumber.length < 12) {
        alert("Please enter a valid card number.");
        return false;
      }

      if (cvv.length < 3) {
        alert("Please enter a valid CVV.");
        return false;
      }

      return true;
    }

    // NET BANKING
    if (paymentMode === "Net Banking") {
      if (bank === "") {
        alert("Please select your bank.");
        return false;
      }

      return true;
    }

    return false;
  };

  // ===============================
  // CONFIRM PAYMENT + ORDER
  // ===============================

 const confirmPayment = async () => {
  if (!selectedProduct) {
    alert("Please select a product.");
    return;
  }

  if (!validatePayment()) {
    return;
  }

  const customerId = 101;
  const productId =
    selectedProduct.product_id || selectedProduct.id;
  const quantity =
    selectedProduct.quantity || 1;

  try {
    // Create order
    const orderResponse = await fetch(
      "http://localhost:5000/api/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: customerId,
          product_id: productId,
          quantity: quantity,
        }),
      }
    );

    const orderData = await orderResponse.json();

    if (!orderResponse.ok || !orderData.success) {
      alert(
        orderData.message ||
        "Failed to create order."
      );
      return;
    }

    const orderId = orderData.order.order_id;

    // Record payment
    console.log("SENDING PAYMENT REQUEST");
    const paymentResponse = await fetch(
      "http://localhost:5000/api/payment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: orderId,
          customer_id: customerId,
          payment_method: paymentMode,
        }),
      }
    );

    console.log("PAYMENT RESPONSE RECEIVED");
    console.log("PAYMENT STATUS:",
      paymentResponse.status);
    

    const paymentData =
      await paymentResponse.json();

    if (
      !paymentResponse.ok ||
      !paymentData.success
    ) {
      alert(
        paymentData.message ||
        "Payment failed."
      );
      return;
    }

    // Remove purchased product from cart
    const updatedCart = cart.filter(
      (item) =>
        item.id !== selectedProduct.id
    );

    updateCart(updatedCart);

    setShowPaymentPopup(false);
    setSelectedProduct(null);

    alert(
      "Payment successful!\n\n" +
      "Order ID: " +
      orderId +
      "\nAmount Paid: ₹" +
      selectedTotal
    );

    navigate("/my-orders");

  } catch (error) {
    console.error(
      "Order/Payment Error:",
      error
    );

    alert(
      "Cannot connect to backend server."
    );
  }
};

  return (
    <div className="customer-home">

      {/* ================= HEADER ================= */}

      <header className="customer-header">

        <div className="customer-logo">

          <h2>CEMTrack</h2>

          <span>Shopping Cart</span>

        </div>

        <div className="customer-header-actions">

          <Link
            to="/customer-products"
            className="cart-top-btn"
          >
            🛍️ Products
          </Link>

          <Link
            to="/my-orders"
            className="cart-top-btn"
          >
            📦 My Orders
          </Link>

          <Link
            to="/customer-home"
            className="cart-top-btn"
          >
            🏠 Home
          </Link>

        </div>

      </header>


      {/* ================= CART ================= */}

      <section className="customer-actions">

        <h1>🛒 My Cart</h1>

        {cart.length === 0 ? (

          <div className="info-box">

            <h2>
              Your cart is empty
            </h2>

            <p>
              Browse our cement products and
              add products to your cart.
            </p>

            <Link
              to="/customer-products"
              className="cart-top-btn"
              style={{
                display: "inline-block",
                marginTop: "15px",
              }}
            >
              Browse Products
            </Link>

          </div>

        ) : (

          <>

            {/* ================= PRODUCTS ================= */}

            <div className="customer-card-grid">

              {cart.map((product) => (

                <div
                  className="customer-feature-card"
                  key={product.id}
                  style={{
                    border:
                      selectedProduct?.id ===
                      product.id
                        ? "3px solid #ea580c"
                        : "1px solid #ddd",

                    cursor: "pointer",
                  }}
                  onClick={() =>
                    selectProduct(product)
                  }
                >

                  {/* SELECT */}

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >

                    <label>

                      <input
                        type="radio"
                        name="selectedProduct"
                        checked={
                          selectedProduct?.id ===
                          product.id
                        }
                        onChange={() =>
                          selectProduct(product)
                        }
                      />

                      {" "}
                      Select to Order

                    </label>

                  </div>


                  {/* IMAGE */}

                  <img
                    src={product.image}
                    alt={product.brand}
                    style={{
                      width: "90px",
                      height: "90px",
                      objectFit: "contain",
                      borderRadius: "10px",
                    }}
                  />


                  {/* DETAILS */}

                  <div>

                    <h3>
                      {product.brand}
                    </h3>

                    <p>
                      <strong>
                        Category:
                      </strong>{" "}
                      {product.category}
                    </p>

                    <p>
                      <strong>
                        Price:
                      </strong>{" "}
                      ₹{product.price} / Bag
                    </p>

                    <p>
                      <strong>
                        Available Stock:
                      </strong>{" "}
                      {product.stock} Bags
                    </p>


                    {/* QUANTITY */}

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginTop: "10px",
                      }}
                      onClick={(e) =>
                        e.stopPropagation()
                      }
                    >

                      <strong>
                        Quantity:
                      </strong>

                      <button
                        type="button"
                        onClick={() =>
                          decreaseQuantity(
                            product.id
                          )
                        }
                      >
                        −
                      </button>

                      <span>
                        {product.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          increaseQuantity(
                            product.id
                          )
                        }
                      >
                        +
                      </button>

                    </div>


                    {/* PRODUCT TOTAL */}

                    <p>

                      <strong>
                        Product Total:
                      </strong>{" "}

                      ₹
                      {Number(product.price) *
                        Number(product.quantity)}

                    </p>


                    {/* REMOVE */}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();

                        removeFromCart(
                          product.id
                        );
                      }}
                      style={{
                        marginTop: "12px",
                        padding: "8px 14px",
                        border: "none",
                        borderRadius: "6px",
                        background:
                          "#dc3545",
                        color: "white",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      🗑️ Remove
                    </button>

                  </div>

                </div>

              ))}

            </div>


            {/* ================= SELECTED PRODUCT ================= */}

            {selectedProduct && (

              <div
                className="info-box"
                style={{
                  marginTop: "25px",
                }}
              >

                <h2>
                  Selected Product
                </h2>

                <p>

                  <strong>
                    {selectedProduct.brand}
                  </strong>

                  {" - "}

                  {selectedProduct.quantity}
                  {" Bags"}

                </p>

                <h2>
                  Amount to Pay: ₹
                  {selectedTotal}
                </h2>

              </div>

            )}


            {/* ================= PLACE ORDER ================= */}

            <div
              className="info-box"
              style={{
                marginTop: "25px",
              }}
            >

              <button
                type="button"
                className="cart-top-btn"
                onClick={handlePlaceOrder}
              >
                💳 Proceed to Payment
              </button>

            </div>

          </>

        )}

      </section>


      {/* =====================================================
          PAYMENT POPUP
      ===================================================== */}

      {showPaymentPopup && selectedProduct && (

        <div
          className="product-modal-overlay"
          onClick={() =>
            setShowPaymentPopup(false)
          }
        >

          <div
            className="product-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
            style={{
              maxWidth: "520px",
              width: "95%",
            }}
          >

            {/* CLOSE */}

            <button
              type="button"
              className="modal-close"
              onClick={() =>
                setShowPaymentPopup(false)
              }
            >
              ×
            </button>


            <h2>
              💳 Payment
            </h2>

            <p>
              <strong>
                {selectedProduct.brand}
              </strong>
            </p>

            <h3
              style={{
                color: "#ea580c",
              }}
            >
              Amount to Pay: ₹
              {selectedTotal}
            </h3>


            {/* ================= PAYMENT MODE ================= */}

            <div
              style={{
                textAlign: "left",
                marginTop: "20px",
              }}
            >

              <label>
                <strong>
                  Payment Mode
                </strong>
              </label>

              <select
                value={paymentMode}
                onChange={(e) =>
                  setPaymentMode(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "11px",
                  marginTop: "8px",
                  borderRadius: "8px",
                  border:
                    "1px solid #ccc",
                }}
              >

                <option value="Cash">
                  💵 Cash
                </option>

                <option value="UPI">
                  📱 UPI
                </option>

                <option value="Card">
                  💳 Card
                </option>

                <option value="Net Banking">
                  🏦 Net Banking
                </option>

              </select>

            </div>


            {/* =================================================
                UPI
            ================================================= */}

            {paymentMode === "UPI" && (

              <div
                style={{
                  marginTop: "18px",
                  textAlign: "left",
                }}
              >

                <h3>
                  📱 Choose UPI App
                </h3>


                {/* UPI APPS */}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(2, 1fr)",
                    gap: "10px",
                    marginTop: "10px",
                  }}
                >

                  <button
                    type="button"
                    onClick={() =>
                      setUpiApp(
                        "Google Pay"
                      )
                    }
                    style={{
                      padding: "13px",
                      borderRadius: "8px",
                      border:
                        upiApp ===
                        "Google Pay"
                          ? "2px solid #ea580c"
                          : "1px solid #ddd",
                      background:
                        upiApp ===
                        "Google Pay"
                          ? "#fff7ed"
                          : "white",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    🟢 Google Pay
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      setUpiApp("PhonePe")
                    }
                    style={{
                      padding: "13px",
                      borderRadius: "8px",
                      border:
                        upiApp === "PhonePe"
                          ? "2px solid #ea580c"
                          : "1px solid #ddd",
                      background:
                        upiApp === "PhonePe"
                          ? "#fff7ed"
                          : "white",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    🟣 PhonePe
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      setUpiApp("Paytm")
                    }
                    style={{
                      padding: "13px",
                      borderRadius: "8px",
                      border:
                        upiApp === "Paytm"
                          ? "2px solid #ea580c"
                          : "1px solid #ddd",
                      background:
                        upiApp === "Paytm"
                          ? "#fff7ed"
                          : "white",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    🔵 Paytm
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      setUpiApp("Other UPI")
                    }
                    style={{
                      padding: "13px",
                      borderRadius: "8px",
                      border:
                        upiApp ===
                        "Other UPI"
                          ? "2px solid #ea580c"
                          : "1px solid #ddd",
                      background:
                        upiApp ===
                        "Other UPI"
                          ? "#fff7ed"
                          : "white",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    📲 Other UPI
                  </button>

                </div>


                {/* UPI ID */}

                <input
                  type="text"
                  placeholder="Enter UPI ID (example@upi)"
                  value={upiId}
                  onChange={(e) =>
                    setUpiId(e.target.value)
                  }
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "12px",
                    marginTop: "15px",
                    borderRadius: "8px",
                    border:
                      "1px solid #ccc",
                  }}
                />

              </div>

            )}


            {/* =================================================
                CARD
            ================================================= */}

            {paymentMode === "Card" && (

              <div
                style={{
                  marginTop: "18px",
                  textAlign: "left",
                }}
              >

                <h3>
                  💳 Card Details
                </h3>

                <input
                  type="text"
                  placeholder="Card Number"
                  value={cardNumber}
                  maxLength="16"
                  onChange={(e) =>
                    setCardNumber(
                      e.target.value.replace(
                        /\D/g,
                        ""
                      )
                    )
                  }
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "12px",
                    marginTop: "10px",
                    borderRadius: "8px",
                    border:
                      "1px solid #ccc",
                  }}
                />

                <input
                  type="text"
                  placeholder="Card Holder Name"
                  value={cardName}
                  onChange={(e) =>
                    setCardName(
                      e.target.value
                    )
                  }
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "12px",
                    marginTop: "10px",
                    borderRadius: "8px",
                    border:
                      "1px solid #ccc",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "10px",
                  }}
                >

                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    maxLength="5"
                    onChange={(e) =>
                      setExpiry(
                        e.target.value
                      )
                    }
                    style={{
                      width: "50%",
                      padding: "12px",
                      borderRadius: "8px",
                      border:
                        "1px solid #ccc",
                    }}
                  />

                  <input
                    type="password"
                    placeholder="CVV"
                    value={cvv}
                    maxLength="3"
                    onChange={(e) =>
                      setCvv(
                        e.target.value.replace(
                          /\D/g,
                          ""
                        )
                      )
                    }
                    style={{
                      width: "50%",
                      padding: "12px",
                      borderRadius: "8px",
                      border:
                        "1px solid #ccc",
                    }}
                  />

                </div>

              </div>

            )}


            {/* =================================================
                NET BANKING
            ================================================= */}

            {paymentMode ===
              "Net Banking" && (

              <div
                style={{
                  marginTop: "18px",
                  textAlign: "left",
                }}
              >

                <h3>
                  🏦 Select Bank
                </h3>

                <select
                  value={bank}
                  onChange={(e) =>
                    setBank(e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginTop: "10px",
                    borderRadius: "8px",
                    border:
                      "1px solid #ccc",
                  }}
                >

                  <option value="">
                    Select Bank
                  </option>

                  <option>
                    State Bank of India
                  </option>

                  <option>
                    HDFC Bank
                  </option>

                  <option>
                    ICICI Bank
                  </option>

                  <option>
                    Axis Bank
                  </option>

                  <option>
                    Kotak Mahindra Bank
                  </option>

                  <option>
                    Bank of Baroda
                  </option>

                </select>

              </div>

            )}


            {/* ================= CONFIRM ================= */}

            <button
              type="button"
              className="cart-top-btn"
              onClick={confirmPayment}
              style={{
                width: "100%",
                marginTop: "25px",
              }}
            >
              ✅ Pay ₹{selectedTotal}
            </button>


            <button
              type="button"
              onClick={() =>
                setShowPaymentPopup(false)
              }
              style={{
                width: "100%",
                marginTop: "10px",
                padding: "11px",
                border: "none",
                borderRadius: "8px",
                background: "#6c757d",
                color: "white",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Cancel
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default Cart;