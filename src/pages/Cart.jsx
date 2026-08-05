import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CustomerLogin.css";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // ================================
  // LOAD CART
  // ================================

  useEffect(() => {
    const savedCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    setCart(savedCart);
  }, []);

  // ================================
  // REMOVE PRODUCT
  // ================================

  const removeFromCart = (id) => {
    const updatedCart = cart.filter(
      (item) => item.id !== id
    );

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  };

  // ================================
  // INCREASE QUANTITY
  // ================================

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

  // ================================
  // DECREASE QUANTITY
  // ================================

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

  // ================================
  // TOTAL AMOUNT
  // ================================

  const totalAmount = cart.reduce(
    (total, item) =>
      total +
      Number(item.price) *
        Number(item.quantity),
    0
  );

  // ================================
  // PLACE ORDER
  // ================================

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setPaymentMethod("UPI");
    setPaymentSuccess(false);
    setShowPaymentPopup(true);
  };

  // ================================
  // CLOSE PAYMENT
  // ================================

  const closePaymentPopup = () => {
    if (paymentSuccess) {
      return;
    }

    setShowPaymentPopup(false);
  };

  // ================================
  // PAY NOW
  // ================================

  const handlePayment = () => {
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    // Generate Order ID
    const generatedOrderId =
      "ORD-" +
      Date.now()
        .toString()
        .slice(-6);

    // Create order
    const newOrder = {
      orderId: generatedOrderId,

      date:
        new Date().toLocaleDateString(),

      status: "Confirmed",

      products: cart,

      totalAmount: totalAmount,

      paymentMethod: paymentMethod,

      paymentStatus:
        paymentMethod === "Cash on Delivery"
          ? "Pending"
          : "Paid",
    };

    // Get existing orders
    const existingOrders =
      JSON.parse(
        localStorage.getItem("orders")
      ) || [];

    // Save order
    const updatedOrders = [
      ...existingOrders,
      newOrder,
    ];

    localStorage.setItem(
      "orders",
      JSON.stringify(updatedOrders)
    );

    // Show success
    setPaymentSuccess(true);

    // Clear cart
    localStorage.removeItem("cart");
    setCart([]);

    // Go to My Orders after short delay
    setTimeout(() => {
      setShowPaymentPopup(false);
      navigate("/my-orders");
    }, 1800);
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
          CART SECTION
      ===================================== */}

      <section className="customer-actions">

        <h1>🛒 My Cart</h1>

        {cart.length === 0 ? (

          /* =================================
             EMPTY CART
          ================================= */

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
                CART PRODUCTS
            ================================= */}

            <div className="customer-card-grid">

              {cart.map((product) => (

                <div
                  className="customer-feature-card"
                  key={product.id}
                >

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
                          cursor: "pointer",
                          fontSize: "18px",
                          fontWeight: "bold",
                        }}
                      >
                        −
                      </button>

                      <span
                        style={{
                          fontWeight: "bold",
                          minWidth: "25px",
                          textAlign: "center",
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
                          cursor: "pointer",
                          fontSize: "18px",
                          fontWeight: "bold",
                        }}
                      >
                        +
                      </button>

                    </div>


                    {/* ITEM TOTAL */}

                    <p
                      style={{
                        marginTop: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      Item Total: ₹
                      {Number(product.price) *
                        Number(product.quantity)}
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
                        marginTop: "8px",
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

              ))}

            </div>


            {/* =================================
                TOTAL + PLACE ORDER
            ================================= */}

            <div
              className="info-box"
              style={{
                marginTop: "25px",
                textAlign: "center",
              }}
            >

              <h2>
                Total Amount: ₹
                {totalAmount}
              </h2>

              <button
                type="button"
                className="cart-top-btn"
                onClick={handlePlaceOrder}
                style={{
                  marginTop: "10px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                🛒 Place Order
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
          onClick={closePaymentPopup}
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0, 0, 0, 0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >

          <div
            className="product-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
            style={{
              width: "100%",
              maxWidth: "480px",
              background: "#ffffff",
              borderRadius: "18px",
              padding: "30px",
              boxSizing: "border-box",
              position: "relative",
              boxShadow:
                "0 15px 40px rgba(0,0,0,0.25)",
            }}
          >

            {/* CLOSE BUTTON */}

            {!paymentSuccess && (

              <button
                type="button"
                className="modal-close"
                onClick={() =>
                  setShowPaymentPopup(false)
                }
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "10px",
                  border: "none",
                  background: "transparent",
                  fontSize: "28px",
                  cursor: "pointer",
                }}
              >
                ×
              </button>

            )}


            {!paymentSuccess ? (

              <>
                {/* PAYMENT TITLE */}

                <h2
                  style={{
                    textAlign: "center",
                    marginBottom: "8px",
                  }}
                >
                  💳 Payment
                </h2>

                <p
                  style={{
                    textAlign: "center",
                    color: "#666",
                  }}
                >
                  Complete your payment to
                  confirm the order.
                </p>


                {/* =================================
                    AMOUNT
                ================================= */}

                <div
                  style={{
                    marginTop: "20px",
                    padding: "20px",
                    borderRadius: "12px",
                    background: "#fff7ed",
                    border:
                      "1px solid #fed7aa",
                    textAlign: "center",
                  }}
                >

                  <p
                    style={{
                      margin: 0,
                      color: "#666",
                    }}
                  >
                    Amount to Pay
                  </p>

                  <h1
                    style={{
                      margin:
                        "8px 0 0",
                      color: "#ea580c",
                    }}
                  >
                    ₹{totalAmount}
                  </h1>

                </div>


                {/* =================================
                    PAYMENT METHOD
                ================================= */}

                <div
                  style={{
                    marginTop: "25px",
                  }}
                >

                  <h3>
                    Select Payment Method
                  </h3>


                  {/* UPI */}

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "12px",
                      marginTop: "10px",
                      border:
                        "1px solid #ddd",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >

                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI"
                      checked={
                        paymentMethod === "UPI"
                      }
                      onChange={(e) =>
                        setPaymentMethod(
                          e.target.value
                        )
                      }
                    />

                    <span>
                      📱 UPI
                    </span>

                  </label>


                  {/* CARD */}

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "12px",
                      marginTop: "10px",
                      border:
                        "1px solid #ddd",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >

                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Card"
                      checked={
                        paymentMethod === "Card"
                      }
                      onChange={(e) =>
                        setPaymentMethod(
                          e.target.value
                        )
                      }
                    />

                    <span>
                      💳 Card
                    </span>

                  </label>


                  {/* NET BANKING */}

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "12px",
                      marginTop: "10px",
                      border:
                        "1px solid #ddd",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >

                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Net Banking"
                      checked={
                        paymentMethod ===
                        "Net Banking"
                      }
                      onChange={(e) =>
                        setPaymentMethod(
                          e.target.value
                        )
                      }
                    />

                    <span>
                      🏦 Net Banking
                    </span>

                  </label>


                  {/* CASH ON DELIVERY */}

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "12px",
                      marginTop: "10px",
                      border:
                        "1px solid #ddd",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >

                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={
                        paymentMethod ===
                        "Cash on Delivery"
                      }
                      onChange={(e) =>
                        setPaymentMethod(
                          e.target.value
                        )
                      }
                    />

                    <span>
                      💵 Cash on Delivery
                    </span>

                  </label>

                </div>


                {/* =================================
                    PAYMENT BUTTON
                ================================= */}

                <button
                  type="button"
                  onClick={handlePayment}
                  style={{
                    width: "100%",
                    marginTop: "25px",
                    padding: "14px",
                    border: "none",
                    borderRadius: "9px",
                    background: "#ea580c",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  💰 Pay ₹{totalAmount}
                </button>


                {/* CANCEL */}

                <button
                  type="button"
                  onClick={() =>
                    setShowPaymentPopup(false)
                  }
                  style={{
                    width: "100%",
                    marginTop: "10px",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "9px",
                    background: "#f3f4f6",
                    color: "#333",
                    fontSize: "15px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>

              </>

            ) : (

              /* =================================
                 PAYMENT SUCCESS
              ================================= */

              <div
                style={{
                  textAlign: "center",
                  padding: "20px 5px",
                }}
              >

                <div
                  style={{
                    fontSize: "60px",
                  }}
                >
                  ✅
                </div>

                <h2
                  style={{
                    color: "#16a34a",
                    marginTop: "10px",
                  }}
                >
                  Payment Successful!
                </h2>

                <p>
                  Your order has been
                  confirmed successfully.
                </p>

                <h3>
                  Amount Paid: ₹
                  {totalAmount}
                </h3>

                <p
                  style={{
                    color: "#666",
                  }}
                >
                  Payment Method:{" "}
                  <strong>
                    {paymentMethod}
                  </strong>
                </p>

              </div>

            )}

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