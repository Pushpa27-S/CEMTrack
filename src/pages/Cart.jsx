import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CustomerLogin.css";

function Cart() {

const navigate = useNavigate();

const [cart, setCart] = useState([]);
const [showOrderPopup, setShowOrderPopup] = useState(false);

// Load cart
useEffect(() => {

const savedCart =
  JSON.parse(localStorage.getItem("cart")) || [];

setCart(savedCart);

}, []);

// Remove product
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

// Increase quantity
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
      quantity: item.quantity + 1
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

// Decrease quantity
const decreaseQuantity = (id) => {

const updatedCart = cart.map((item) => {

  if (item.id === id) {

    return {
      ...item,
      quantity: Math.max(
        1,
        item.quantity - 1
      )
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

// Calculate total
const totalAmount = cart.reduce(
(total, item) =>
total + item.price * item.quantity,
0
);

// Place order button
const handlePlaceOrder = () => {

if (cart.length === 0) {

  alert("Your cart is empty.");

  return;

}

setShowOrderPopup(true);

};

// Confirm order
const confirmOrder = () => {

if (cart.length === 0) {

  alert("Your cart is empty.");

  return;

}

const generatedOrderId =
  "ORD-" +
  Date.now()
    .toString()
    .slice(-6);

const newOrder = {

  orderId: generatedOrderId,

  date:
    new Date().toLocaleDateString(),

  status: "Placed",

  products: cart,

  totalAmount: totalAmount

};

// Get previous orders
const existingOrders =
  JSON.parse(
    localStorage.getItem("orders")
  ) || [];

// Save new order
const updatedOrders = [
  ...existingOrders,
  newOrder
];

localStorage.setItem(
  "orders",
  JSON.stringify(updatedOrders)
);

// Clear cart
localStorage.removeItem("cart");

setCart([]);

setShowOrderPopup(false);

// Go directly to My Orders
navigate("/my-orders");

};

return (

<div className="customer-home">

  {/* HEADER */}

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


  {/* CART */}

  <section className="customer-actions">

    <h1>🛒 My Cart</h1>

    {cart.length === 0 ? (

      <div className="info-box">

        <h2>Your cart is empty</h2>

        <p>
          Browse our cement products and
          add products to your cart.
        </p>

        <Link
          to="/customer-products"
          className="cart-top-btn"
          style={{
            display: "inline-block",
            marginTop: "15px"
          }}
        >
          Browse Products
        </Link>

      </div>

    ) : (

      <>

        {/* CART PRODUCTS */}

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
                  borderRadius: "10px"
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
                    marginTop: "10px"
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


                {/* REMOVE */}

                <button
                  type="button"
                  onClick={() =>
                    removeFromCart(
                      product.id
                    )
                  }
                  style={{
                    marginTop: "12px",
                    padding: "8px 14px",
                    border: "none",
                    borderRadius: "6px",
                    background: "#dc3545",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: "600"
                  }}
                >
                  🗑️ Remove
                </button>

              </div>

            </div>

          ))}

        </div>


        {/* TOTAL */}

        <div
          className="info-box"
          style={{
            marginTop: "25px"
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
          >
            🛒 Place Order
          </button>

        </div>

      </>

    )}

  </section>


  {/* ORDER CONFIRMATION POPUP */}

  {showOrderPopup && (

    <div
      className="product-modal-overlay"
      onClick={() =>
        setShowOrderPopup(false)
      }
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
            setShowOrderPopup(false)
          }
        >
          ×
        </button>

        <h2>
          Confirm Your Order
        </h2>

        <p>
          Please check your order before
          confirming.
        </p>


        {/* ORDER ITEMS */}

        <div
          style={{
            textAlign: "left",
            marginTop: "15px"
          }}
        >

          {cart.map((product) => (

            <div
              key={product.id}
              style={{
                padding: "10px 0",
                borderBottom:
                  "1px solid #ddd"
              }}
            >

              <strong>
                {product.brand}
              </strong>

              <br />

              Category:{" "}
              {product.category}

              <br />

              Quantity:{" "}
              {product.quantity}

              <br />

              Amount: ₹
              {product.price *
                product.quantity}

            </div>

          ))}

        </div>


        <h3
          style={{
            marginTop: "20px"
          }}
        >
          Total: ₹
          {totalAmount}
        </h3>


        {/* BUTTONS */}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            marginTop: "20px"
          }}
        >

          <button
            type="button"
            className="cart-top-btn"
            onClick={confirmOrder}
          >
            ✅ Confirm Order
          </button>

          <button
            type="button"
            onClick={() =>
              setShowOrderPopup(false)
            }
            style={{
              padding: "10px 18px",
              border: "none",
              borderRadius: "8px",
              background: "#6c757d",
              color: "white",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Cancel
          </button>

        </div>

      </div>

    </div>

  )}


  {/* CONTINUE SHOPPING */}

  <div
    style={{
      margin: "0 40px 40px"
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