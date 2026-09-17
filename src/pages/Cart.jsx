import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CustomerLogin.css";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  // Payment popup
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);

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
  };

  // ===============================
  // INCREASE QUANTITY
  // ===============================

  const increaseQuantity = (id) => {
    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        const availableStock =
          Number(item.stock) ||
          Number(item.stock_quantity) ||
          0;

        if (item.quantity >= availableStock) {
          alert(
            "You cannot add more than available stock."
          );

          return item;
        }

        return {
          ...item,
          quantity: Number(item.quantity) + 1,
        };
      }

      return item;
    });

    updateCart(updatedCart);
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
            Number(item.quantity) - 1
          ),
        };
      }

      return item;
    });

    updateCart(updatedCart);
  };

  // ===============================
  // CART TOTAL
  // ===============================

  const cartSubtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price) *
        Number(item.quantity || 1),
    0
  );

  const cartGST = cartSubtotal * 0.18;

  const cartTotal = cartSubtotal + cartGST;

  // ===============================
  // OPEN PAYMENT
  // ===============================

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
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
    if (paymentMode === "Cash") {
      return true;
    }

    if (paymentMode === "UPI") {
      if (upiId.trim() === "") {
        alert("Please enter your UPI ID.");
        return false;
      }

      return true;
    }

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
        alert(
          "Please enter a valid card number."
        );

        return false;
      }

      if (cvv.length < 3) {
        alert(
          "Please enter a valid CVV."
        );

        return false;
      }

      return true;
    }

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
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (!validatePayment()) {
      return;
    }

    // GET LOGGED-IN CUSTOMER
    const customer = JSON.parse(
      localStorage.getItem("customer") || "null"
    );

    const token =
      localStorage.getItem("token");

    if (!customer?.customer_id) {
      alert(
        "Customer information not found. Please login again."
      );

      return;
    }

    if (!token) {
      alert(
        "Login session expired. Please login again."
      );

      return;
    }

    // IMPORTANT:
    // Use the actual logged-in customer's ID.
    // Do NOT use 101.
    const customerId =
      Number(customer.customer_id);

    try {
      const createdOrders = [];

      // CREATE AN ORDER FOR EACH PRODUCT
      // IN THE CART
      for (const item of cart) {
        const productId =
          item.product_id || item.id;

        const quantity =
          Number(item.quantity) || 1;

        if (!productId) {
          alert(
            "Invalid product found in cart."
          );

          return;
        }

        // ===============================
        // CREATE ORDER
        // ===============================

        const orderResponse =
          await fetch(
            "http://localhost:5000/api/orders",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                customer_id:
                  customerId,

                product_id:
                  productId,

                quantity:
                  quantity,
              }),
            }
          );

        const orderData =
          await orderResponse.json();

        if (
          !orderResponse.ok ||
          !orderData.success
        ) {
          alert(
            orderData.message ||
              "Failed to create order."
          );

          return;
        }

        const orderId =
          orderData.order.order_id;

        // ===============================
        // RECORD PAYMENT
        // ===============================

        console.log(
          "SENDING PAYMENT REQUEST"
        );

        const paymentResponse =
          await fetch(
            "http://localhost:5000/api/payment",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                order_id:
                  orderId,

                customer_id:
                  customerId,

                payment_method:
                  paymentMode,
              }),
            }
          );

        console.log(
          "PAYMENT RESPONSE RECEIVED"
        );

        console.log(
          "PAYMENT STATUS:",
          paymentResponse.status
        );

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

        createdOrders.push(orderId);
      }

      // ===============================
      // SUCCESS
      // ===============================

      localStorage.removeItem("cart");

      setCart([]);

      setShowPaymentPopup(false);

      setUpiId("");
      setCardNumber("");
      setCardName("");
      setExpiry("");
      setCvv("");
      setBank("");

      alert(
        "Payment successful!\n\n" +
          "Customer ID: " +
          customerId +
          "\n" +
          "Order ID(s): " +
          createdOrders.join(", ") +
          "\n" +
          "Amount Paid: ₹" +
          cartTotal.toFixed(2)
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

  // ===============================
  // RETURN
  // ===============================

  return (
    <div className="customer-home">

      {/* ================= HEADER ================= */}

      <header className="customer-header">

        <div className="customer-logo">

          <h2>CEMTrack</h2>

          <span>
            Shopping Cart
          </span>

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
                display:
                  "inline-block",

                marginTop:
                  "15px",
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
                  key={
                    product.id ||
                    product.product_id
                  }
                >

                  {/* IMAGE */}

                  <img
                    src={product.image}
                    alt={
                      product.brand ||
                      product.product_name ||
                      "Product"
                    }
                    style={{
                      width: "90px",
                      height: "90px",
                      objectFit:
                        "contain",
                      borderRadius:
                        "10px",
                    }}
                  />

                  {/* DETAILS */}

                  <div>

                    <h3>
                      {product.brand ||
                        product.product_name}
                    </h3>

                    <p>
                      <strong>
                        Product:
                      </strong>{" "}
                      {product.product_name ||
                        product.brand}
                    </p>

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
                      ₹
                      {Number(
                        product.price
                      ).toFixed(2)}
                      {" / Bag"}
                    </p>

                    <p>
                      <strong>
                        Available Stock:
                      </strong>{" "}
                      {Number(
                        product.stock ??
                        product.stock_quantity ??
                        0
                      )}
                      {" Bags"}
                    </p>

                    {/* QUANTITY */}

                    <div
                      style={{
                        display:
                          "flex",

                        alignItems:
                          "center",

                        gap: "12px",

                        marginTop:
                          "10px",
                      }}
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
                        {
                          product.quantity ||
                          1
                        }
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
                      {(
                        Number(
                          product.price
                        ) *
                        Number(
                          product.quantity ||
                            1
                        )
                      ).toFixed(2)}

                    </p>

                    {/* REMOVE */}

                    <button
                      type="button"
                      onClick={() =>
                        removeFromCart(
                          product.id
                        )
                      }
                      style={{
                        marginTop:
                          "12px",

                        padding:
                          "8px 14px",

                        border:
                          "none",

                        borderRadius:
                          "6px",

                        background:
                          "#dc3545",

                        color:
                          "white",

                        cursor:
                          "pointer",

                        fontWeight:
                          "600",
                      }}
                    >
                      🗑️ Remove
                    </button>

                  </div>

                </div>

              ))}

            </div>

            {/* ================= CART SUMMARY ================= */}

            <div
              className="info-box"
              style={{
                marginTop:
                  "25px",
              }}
            >

              <h2>
                Cart Summary
              </h2>

              <p>
                <strong>
                  Number of Products:
                </strong>{" "}
                {cart.length}
              </p>

              <p>
                <strong>
                  Subtotal:
                </strong>{" "}
                ₹
                {cartSubtotal.toFixed(2)}
              </p>

              <p>
                <strong>
                  GST (18%):
                </strong>{" "}
                ₹
                {cartGST.toFixed(2)}
              </p>

              <h2>
                Amount to Pay: ₹
                {cartTotal.toFixed(2)}
              </h2>

            </div>

            {/* ================= PLACE ORDER ================= */}

            <div
              className="info-box"
              style={{
                marginTop:
                  "25px",
              }}
            >

              <button
                type="button"
                className="cart-top-btn"
                onClick={
                  handlePlaceOrder
                }
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

      {showPaymentPopup && (

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
              maxWidth:
                "520px",

              width:
                "95%",
            }}
          >

            {/* CLOSE */}

            <button
              type="button"
              className="modal-close"
              onClick={() =>
                setShowPaymentPopup(
                  false
                )
              }
            >
              ×
            </button>

            <h2>
              💳 Payment
            </h2>

            <p>
              <strong>
                {cart.length} product
                {cart.length > 1
                  ? "s"
                  : ""}
              </strong>
            </p>

            <h3
              style={{
                color:
                  "#ea580c",
              }}
            >
              Amount to Pay: ₹
              {cartTotal.toFixed(2)}
            </h3>

            {/* ================= PAYMENT MODE ================= */}

            <div
              style={{
                textAlign:
                  "left",

                marginTop:
                  "20px",
              }}
            >

              <label>
                <strong>
                  Payment Mode
                </strong>
              </label>

              <select
                value={
                  paymentMode
                }
                onChange={(e) =>
                  setPaymentMode(
                    e.target.value
                  )
                }
                style={{
                  width:
                    "100%",

                  padding:
                    "11px",

                  marginTop:
                    "8px",

                  borderRadius:
                    "8px",

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

            {paymentMode ===
              "UPI" && (

              <div
                style={{
                  marginTop:
                    "18px",

                  textAlign:
                    "left",
                }}
              >

                <h3>
                  📱 Choose UPI App
                </h3>

                <div
                  style={{
                    display:
                      "grid",

                    gridTemplateColumns:
                      "repeat(2, 1fr)",

                    gap:
                      "10px",

                    marginTop:
                      "10px",
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
                      padding:
                        "13px",

                      borderRadius:
                        "8px",

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

                      cursor:
                        "pointer",

                      fontWeight:
                        "600",
                    }}
                  >
                    🟢 Google Pay
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setUpiApp(
                        "PhonePe"
                      )
                    }
                    style={{
                      padding:
                        "13px",

                      borderRadius:
                        "8px",

                      border:
                        upiApp ===
                        "PhonePe"
                          ? "2px solid #ea580c"
                          : "1px solid #ddd",

                      background:
                        upiApp ===
                        "PhonePe"
                          ? "#fff7ed"
                          : "white",

                      cursor:
                        "pointer",

                      fontWeight:
                        "600",
                    }}
                  >
                    🟣 PhonePe
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setUpiApp(
                        "Paytm"
                      )
                    }
                    style={{
                      padding:
                        "13px",

                      borderRadius:
                        "8px",

                      border:
                        upiApp ===
                        "Paytm"
                          ? "2px solid #ea580c"
                          : "1px solid #ddd",

                      background:
                        upiApp ===
                        "Paytm"
                          ? "#fff7ed"
                          : "white",

                      cursor:
                        "pointer",

                      fontWeight:
                        "600",
                    }}
                  >
                    🔵 Paytm
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setUpiApp(
                        "Other UPI"
                      )
                    }
                    style={{
                      padding:
                        "13px",

                      borderRadius:
                        "8px",

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

                      cursor:
                        "pointer",

                      fontWeight:
                        "600",
                    }}
                  >
                    📲 Other UPI
                  </button>

                </div>

                <input
                  type="text"
                  placeholder="Enter UPI ID (example@upi)"
                  value={
                    upiId
                  }
                  onChange={(e) =>
                    setUpiId(
                      e.target.value
                    )
                  }
                  style={{
                    width:
                      "100%",

                    boxSizing:
                      "border-box",

                    padding:
                      "12px",

                    marginTop:
                      "15px",

                    borderRadius:
                      "8px",

                    border:
                      "1px solid #ccc",
                  }}
                />

              </div>

            )}

            {/* =================================================
                CARD
            ================================================= */}

            {paymentMode ===
              "Card" && (

              <div
                style={{
                  marginTop:
                    "18px",

                  textAlign:
                    "left",
                }}
              >

                <h3>
                  💳 Card Details
                </h3>

                <input
                  type="text"
                  placeholder="Card Number"
                  value={
                    cardNumber
                  }
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
                    width:
                      "100%",

                    boxSizing:
                      "border-box",

                    padding:
                      "12px",

                    marginTop:
                      "10px",

                    borderRadius:
                      "8px",

                    border:
                      "1px solid #ccc",
                  }}
                />

                <input
                  type="text"
                  placeholder="Card Holder Name"
                  value={
                    cardName
                  }
                  onChange={(e) =>
                    setCardName(
                      e.target.value
                    )
                  }
                  style={{
                    width:
                      "100%",

                    boxSizing:
                      "border-box",

                    padding:
                      "12px",

                    marginTop:
                      "10px",

                    borderRadius:
                      "8px",

                    border:
                      "1px solid #ccc",
                  }}
                />

                <div
                  style={{
                    display:
                      "flex",

                    gap:
                      "10px",

                    marginTop:
                      "10px",
                  }}
                >

                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={
                      expiry
                    }
                    maxLength="5"
                    onChange={(e) =>
                      setExpiry(
                        e.target.value
                      )
                    }
                    style={{
                      width:
                        "50%",

                      padding:
                        "12px",

                      borderRadius:
                        "8px",

                      border:
                        "1px solid #ccc",
                    }}
                  />

                  <input
                    type="password"
                    placeholder="CVV"
                    value={
                      cvv
                    }
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
                      width:
                        "50%",

                      padding:
                        "12px",

                      borderRadius:
                        "8px",

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
                  marginTop:
                    "18px",

                  textAlign:
                    "left",
                }}
              >

                <h3>
                  🏦 Select Bank
                </h3>

                <select
                  value={
                    bank
                  }
                  onChange={(e) =>
                    setBank(
                      e.target.value
                    )
                  }
                  style={{
                    width:
                      "100%",

                    padding:
                      "12px",

                    marginTop:
                      "10px",

                    borderRadius:
                      "8px",

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
              onClick={
                confirmPayment
              }
              style={{
                width:
                  "100%",

                marginTop:
                  "25px",
              }}
            >
              ✅ Pay ₹
              {cartTotal.toFixed(2)}
            </button>

            <button
              type="button"
              onClick={() =>
                setShowPaymentPopup(
                  false
                )
              }
              style={{
                width:
                  "100%",

                marginTop:
                  "10px",

                padding:
                  "11px",

                border:
                  "none",

                borderRadius:
                  "8px",

                background:
                  "#6c757d",

                color:
                  "white",

                cursor:
                  "pointer",

                fontWeight:
                  "600",
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