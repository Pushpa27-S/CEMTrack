import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CustomerLogin.css";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [paymentMethod, setPaymentMethod] =
    useState("Cash on Delivery");

  const [successAmount, setSuccessAmount] = useState(0);

  // Card details
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // Net banking details
  const [bank, setBank] = useState("");
  const [bankUserId, setBankUserId] = useState("");
  const [bankPassword, setBankPassword] = useState("");

  /* =========================================
     LOAD CART
  ========================================= */

  useEffect(() => {
    const savedCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    setCart(savedCart);
  }, []);

  /* =========================================
     SELECT / UNSELECT PRODUCT
  ========================================= */

  const toggleProductSelection = (id) => {
    setSelectedIds((previousIds) => {
      if (previousIds.includes(id)) {
        return previousIds.filter(
          (productId) => productId !== id
        );
      }

      return [...previousIds, id];
    });
  };

  /* =========================================
     SELECT ALL
  ========================================= */

  const selectAllProducts = () => {
    if (selectedIds.length === cart.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(
        cart.map((product) => product.id)
      );
    }
  };

  /* =========================================
     REMOVE PRODUCT
  ========================================= */

  const removeFromCart = (id) => {
    const updatedCart = cart.filter(
      (item) => item.id !== id
    );

    setCart(updatedCart);

    setSelectedIds((previousIds) =>
      previousIds.filter(
        (productId) => productId !== id
      )
    );

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  };

  /* =========================================
     INCREASE QUANTITY
  ========================================= */

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

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  };

  /* =========================================
     DECREASE QUANTITY
  ========================================= */

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

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  };

  /* =========================================
     SELECTED PRODUCTS
  ========================================= */

  const selectedProducts = cart.filter((product) =>
    selectedIds.includes(product.id)
  );

  /* =========================================
     SELECTED TOTAL
  ========================================= */

  const selectedTotal = selectedProducts.reduce(
    (total, item) =>
      total +
      Number(item.price) *
        Number(item.quantity),
    0
  );

  /* =========================================
     TOTAL CART AMOUNT
  ========================================= */

  const totalCartAmount = cart.reduce(
    (total, item) =>
      total +
      Number(item.price) *
        Number(item.quantity),
    0
  );

  /* =========================================
     PLACE SELECTED ORDER
  ========================================= */

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (selectedProducts.length === 0) {
      alert(
        "Please select at least one product to order."
      );
      return;
    }

    setShowPaymentPopup(true);
  };

  /* =========================================
     RESET PAYMENT DETAILS
  ========================================= */

  const resetPaymentDetails = () => {
    setCardName("");
    setCardNumber("");
    setExpiry("");
    setCvv("");

    setBank("");
    setBankUserId("");
    setBankPassword("");
  };

  /* =========================================
     CHANGE PAYMENT METHOD
  ========================================= */

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    resetPaymentDetails();
  };

  /* =========================================
     VALIDATE PAYMENT
  ========================================= */

  const validatePayment = () => {
    if (paymentMethod === "Cash on Delivery") {
      return true;
    }

    if (paymentMethod === "UPI") {
      return true;
    }

    /* CARD */

    if (paymentMethod === "Card") {
      if (
        cardName.trim() === "" ||
        cardNumber.trim() === "" ||
        expiry.trim() === "" ||
        cvv.trim() === ""
      ) {
        alert(
          "Please enter all card details."
        );

        return false;
      }

      if (cardNumber.length !== 16) {
        alert(
          "Card number must contain 16 digits."
        );

        return false;
      }

      if (cvv.length !== 3) {
        alert(
          "CVV must contain 3 digits."
        );

        return false;
      }

      return true;
    }

    /* NET BANKING */

    if (paymentMethod === "Net Banking") {
      if (
        bank === "" ||
        bankUserId.trim() === "" ||
        bankPassword.trim() === ""
      ) {
        alert(
          "Please enter all net banking details."
        );

        return false;
      }

      return true;
    }

    return false;
  };

  /* =========================================
     CONFIRM PAYMENT
  ========================================= */

  const confirmPayment = () => {
    if (selectedProducts.length === 0) {
      alert(
        "Please select a product to order."
      );
      return;
    }

    if (!validatePayment()) {
      return;
    }

    /* Generate Order ID */

    const generatedOrderId =
      "ORD-" +
      Date.now()
        .toString()
        .slice(-6);

    /* =========================================
       CREATE ORDER
    ========================================= */

    const newOrder = {
      orderId: generatedOrderId,

      date: new Date().toLocaleDateString(),

      status: "Placed",

      // ONLY SELECTED PRODUCTS
      products: selectedProducts,

      // ONLY SELECTED PRODUCTS TOTAL
      totalAmount: selectedTotal,

      paymentMethod: paymentMethod,

      // AMOUNT PAID = SELECTED TOTAL
      amountPaid: selectedTotal,
    };

    /* =========================================
       GET OLD ORDERS
    ========================================= */

    const existingOrders =
      JSON.parse(
        localStorage.getItem("orders")
      ) || [];

    /* =========================================
       SAVE ORDER
    ========================================= */

    const updatedOrders = [
      ...existingOrders,
      newOrder,
    ];

    localStorage.setItem(
      "orders",
      JSON.stringify(updatedOrders)
    );

    /* =========================================
       REMOVE ONLY ORDERED PRODUCTS FROM CART
    ========================================= */

    const remainingCart = cart.filter(
      (product) =>
        !selectedIds.includes(product.id)
    );

    setCart(remainingCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(remainingCart)
    );

    /* =========================================
       SUCCESS
    ========================================= */

    setSuccessAmount(selectedTotal);

    setShowPaymentPopup(false);

    setShowSuccessPopup(true);

    setSelectedIds([]);

    resetPaymentDetails();
  };

  /* =========================================
     MY ORDERS
  ========================================= */

  const goToMyOrders = () => {
    setShowSuccessPopup(false);

    navigate("/my-orders");
  };

  return (
    <div className="customer-home">

      {/* =====================================
          HEADER
      ===================================== */}

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
            to="/customer-home"
            className="cart-top-btn"
          >
            🏠 Home
          </Link>

        </div>

      </header>

      {/* =====================================
          CART
      ===================================== */}

      <section className="customer-actions">

        <h1>🛒 My Cart</h1>

        {cart.length === 0 ? (

          <div className="info-box">

            <h2>
              Your cart is empty
            </h2>

            <p>
              Browse our cement products
              and add products to your cart.
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

            {/* =================================
                SELECT ALL
            ================================= */}

            <div
              className="info-box"
              style={{
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >

              <label
                style={{
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >

                <input
                  type="checkbox"
                  checked={
                    cart.length > 0 &&
                    selectedIds.length ===
                      cart.length
                  }
                  onChange={
                    selectAllProducts
                  }
                />

                {" "} Select All Products

              </label>

              <span>
                Selected:{" "}
                <strong>
                  {selectedIds.length}
                </strong>
              </span>

            </div>

            {/* =================================
                PRODUCTS
            ================================= */}

            <div className="customer-card-grid">

              {cart.map((product) => {

                const isSelected =
                  selectedIds.includes(
                    product.id
                  );

                return (

                  <div
                    className="customer-feature-card"
                    key={product.id}
                    style={{
                      border: isSelected
                        ? "2px solid #ea580c"
                        : "1px solid #ddd",
                      position: "relative",
                    }}
                  >

                    {/* CHECKBOX */}

                    <div
                      style={{
                        position: "absolute",
                        top: "15px",
                        left: "15px",
                        zIndex: 2,
                      }}
                    >

                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() =>
                          toggleProductSelection(
                            product.id
                          )
                        }
                        style={{
                          width: "20px",
                          height: "20px",
                          cursor: "pointer",
                        }}
                      />

                    </div>

                    {/* IMAGE */}

                    <img
                      src={product.image}
                      alt={product.brand}
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "contain",
                        borderRadius: "10px",
                      }}
                    />

                    {/* INFORMATION */}

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
                          style={{
                            width: "32px",
                            height: "32px",
                            border: "none",
                            borderRadius: "6px",
                            background: "#ea580c",
                            color: "white",
                            fontSize: "20px",
                            cursor: "pointer",
                          }}
                        >
                          −
                        </button>

                        <span
                          style={{
                            fontWeight: "bold",
                          }}
                        >
                          {product.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            increaseQuantity(
                              product.id
                            )
                          }
                          style={{
                            width: "32px",
                            height: "32px",
                            border: "none",
                            borderRadius: "6px",
                            background: "#ea580c",
                            color: "white",
                            fontSize: "20px",
                            cursor: "pointer",
                          }}
                        >
                          +
                        </button>

                      </div>

                      {/* PRODUCT TOTAL */}

                      <p
                        style={{
                          marginTop: "12px",
                          fontWeight: "bold",
                          color: "#16a34a",
                        }}
                      >
                        Product Total: ₹
                        {Number(
                          product.price
                        ) *
                          Number(
                            product.quantity
                          )}
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
                          marginTop: "10px",
                          padding: "8px 14px",
                          border: "none",
                          borderRadius: "6px",
                          background: "#dc3545",
                          color: "white",
                          cursor: "pointer",
                          fontWeight: "600",
                        }}
                      >
                        🗑️ Remove
                      </button>

                    </div>

                  </div>

                );
              })}

            </div>

            {/* =================================
                TOTAL
            ================================= */}

            <div
              className="info-box"
              style={{
                marginTop: "25px",
                textAlign: "center",
              }}
            >

              <p>
                Cart Total:{" "}
                <strong>
                  ₹{totalCartAmount}
                </strong>
              </p>

              <h2>
                Selected Total: ₹
                {selectedTotal}
              </h2>

              <p>
                {selectedIds.length === 0
                  ? "Select a product to order."
                  : `${selectedIds.length} product(s) selected.`}
              </p>

              <button
                type="button"
                className="cart-top-btn"
                onClick={handlePlaceOrder}
              >
                🛒 Place Selected Order
              </button>

            </div>

          </>

        )}

      </section>

      {/* =====================================
          PAYMENT POPUP
      ===================================== */}

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
              maxWidth: "520px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >

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
              Payment for selected product(s)
            </p>

            {/* SELECTED PRODUCTS */}

            <div
              style={{
                textAlign: "left",
                marginTop: "15px",
                padding: "12px",
                background: "#f9fafb",
                borderRadius: "8px",
              }}
            >

              {selectedProducts.map(
                (product) => (

                  <p
                    key={product.id}
                    style={{
                      margin: "8px 0",
                    }}
                  >
                    <strong>
                      {product.brand}
                    </strong>
                    {" × "}
                    {product.quantity}
                    {" = ₹"}
                    {Number(product.price) *
                      Number(
                        product.quantity
                      )}
                  </p>

                )
              )}

            </div>

            {/* TOTAL */}

            <div
              style={{
                background: "#fff7ed",
                padding: "15px",
                borderRadius: "10px",
                marginTop: "15px",
                textAlign: "center",
              }}
            >

              <p
                style={{
                  margin: 0,
                  color: "#6b7280",
                }}
              >
                Amount to Pay
              </p>

              <h2
                style={{
                  margin: "5px 0",
                  color: "#ea580c",
                }}
              >
                ₹{selectedTotal}
              </h2>

            </div>

            {/* PAYMENT METHODS */}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginTop: "15px",
              }}
            >

              {/* CASH */}

              <label
                style={{
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >

                <input
                  type="radio"
                  name="payment"
                  value="Cash on Delivery"
                  checked={
                    paymentMethod ===
                    "Cash on Delivery"
                  }
                  onChange={(e) =>
                    handlePaymentMethodChange(
                      e.target.value
                    )
                  }
                />

                {" "} 💵 Cash on Delivery

              </label>

              {/* UPI */}

              <label
                style={{
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >

                <input
                  type="radio"
                  name="payment"
                  value="UPI"
                  checked={
                    paymentMethod === "UPI"
                  }
                  onChange={(e) =>
                    handlePaymentMethodChange(
                      e.target.value
                    )
                  }
                />

                {" "} 📱 UPI

              </label>

              {/* CARD */}

              <label
                style={{
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >

                <input
                  type="radio"
                  name="payment"
                  value="Card"
                  checked={
                    paymentMethod === "Card"
                  }
                  onChange={(e) =>
                    handlePaymentMethodChange(
                      e.target.value
                    )
                  }
                />

                {" "} 💳 Card

              </label>

              {/* NET BANKING */}

              <label
                style={{
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >

                <input
                  type="radio"
                  name="payment"
                  value="Net Banking"
                  checked={
                    paymentMethod ===
                    "Net Banking"
                  }
                  onChange={(e) =>
                    handlePaymentMethodChange(
                      e.target.value
                    )
                  }
                />

                {" "} 🏦 Net Banking

              </label>

            </div>

            {/* =================================
                CARD FORM
            ================================= */}

            {paymentMethod === "Card" && (

              <div
                style={{
                  marginTop: "20px",
                  textAlign: "left",
                }}
              >

                <h3>
                  💳 Card Details
                </h3>

                <input
                  type="text"
                  placeholder="Cardholder Name"
                  value={cardName}
                  onChange={(e) =>
                    setCardName(
                      e.target.value
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginBottom: "10px",
                    boxSizing: "border-box",
                    border: "1px solid #ccc",
                    borderRadius: "7px",
                  }}
                />

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength="16"
                  placeholder="Card Number (16 digits)"
                  value={cardNumber}
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
                    padding: "12px",
                    marginBottom: "10px",
                    boxSizing: "border-box",
                    border: "1px solid #ccc",
                    borderRadius: "7px",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                  }}
                >

                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength="5"
                    value={expiry}
                    onChange={(e) =>
                      setExpiry(
                        e.target.value
                      )
                    }
                    style={{
                      width: "50%",
                      padding: "12px",
                      border: "1px solid #ccc",
                      borderRadius: "7px",
                      boxSizing: "border-box",
                    }}
                  />

                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength="3"
                    placeholder="CVV"
                    value={cvv}
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
                      border: "1px solid #ccc",
                      borderRadius: "7px",
                      boxSizing: "border-box",
                    }}
                  />

                </div>

              </div>

            )}

            {/* =================================
                NET BANKING
            ================================= */}

            {paymentMethod ===
              "Net Banking" && (

              <div
                style={{
                  marginTop: "20px",
                  textAlign: "left",
                }}
              >

                <h3>
                  🏦 Net Banking Details
                </h3>

                <select
                  value={bank}
                  onChange={(e) =>
                    setBank(e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginBottom: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "7px",
                  }}
                >

                  <option value="">
                    Select Bank
                  </option>

                  <option value="SBI">
                    State Bank of India
                  </option>

                  <option value="HDFC">
                    HDFC Bank
                  </option>

                  <option value="ICICI">
                    ICICI Bank
                  </option>

                  <option value="Axis">
                    Axis Bank
                  </option>

                  <option value="Canara">
                    Canara Bank
                  </option>

                </select>

                <input
                  type="text"
                  placeholder="Demo User ID"
                  value={bankUserId}
                  onChange={(e) =>
                    setBankUserId(
                      e.target.value
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginBottom: "10px",
                    boxSizing: "border-box",
                    border: "1px solid #ccc",
                    borderRadius: "7px",
                  }}
                />

                <input
                  type="password"
                  placeholder="Demo Password"
                  value={bankPassword}
                  onChange={(e) =>
                    setBankPassword(
                      e.target.value
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "12px",
                    boxSizing: "border-box",
                    border: "1px solid #ccc",
                    borderRadius: "7px",
                  }}
                />

              </div>

            )}

            {/* UPI */}

            {paymentMethod === "UPI" && (

              <div
                style={{
                  marginTop: "20px",
                  padding: "15px",
                  background: "#f0fdf4",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >

                📱 UPI payment selected.

              </div>

            )}

            {/* PAY */}

            <button
              type="button"
              className="save-product-btn"
              onClick={confirmPayment}
              style={{
                width: "100%",
                marginTop: "20px",
              }}
            >
              ✅ Pay ₹{selectedTotal}
            </button>

          </div>

        </div>

      )}

      {/* =====================================
          SUCCESS POPUP
      ===================================== */}

      {showSuccessPopup && (

        <div className="product-modal-overlay">

          <div
            className="product-modal"
            style={{
              textAlign: "center",
              maxWidth: "500px",
            }}
          >

            <div
              style={{
                width: "75px",
                height: "75px",
                margin: "10px auto 20px",
                borderRadius: "50%",
                background: "#4ade80",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "45px",
                color: "white",
                fontWeight: "bold",
              }}
            >
              ✓
            </div>

            <h2
              style={{
                color: "#16a34a",
                fontSize: "28px",
              }}
            >
              Payment Successful!
            </h2>

            <p>
              Your selected product order
              has been confirmed.
            </p>

            <h3>
              Amount Paid: ₹
              {successAmount}
            </h3>

            <p>
              Payment Method:{" "}
              <strong>
                {paymentMethod}
              </strong>
            </p>

            <button
              type="button"
              className="cart-top-btn"
              onClick={goToMyOrders}
              style={{
                marginTop: "15px",
              }}
            >
              📦 View My Orders
            </button>

          </div>

        </div>

      )}

      {/* =====================================
          CONTINUE SHOPPING
      ===================================== */}

      <div
        style={{
          margin: "0 40px 40px",
        }}
      >

        <Link to="/customer-products">
          ← Continue Shopping
        </Link>

      </div>

    </div>
  );
}

export default Cart;