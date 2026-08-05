import React, { useEffect, useState } from "react";
import "./MYOrders.css";

function Orders() {
  const [orders, setOrders] = useState([]);

  // ===============================
  // FETCH ORDERS FROM CART
  // ===============================

  useEffect(() => {
    loadOrders();

    // Update orders whenever the page becomes active
    window.addEventListener("storage", loadOrders);

    return () => {
      window.removeEventListener("storage", loadOrders);
    };
  }, []);

  const loadOrders = () => {
    const savedOrders =
      JSON.parse(localStorage.getItem("orders")) || [];

    setOrders(savedOrders);
  };

  // ===============================
  // CLEAR ALL ORDERS
  // ===============================

  const clearOrders = () => {
    const answer = window.confirm(
      "Are you sure you want to clear all orders?"
    );

    if (answer) {
      localStorage.removeItem("orders");
      setOrders([]);
    }
  };

  return (
    <div className="orders-page">

      {/* ================= HEADER ================= */}

      <div className="orders-header">
        <div>
          <h1>Orders</h1>
          <p>Customer Orders</p>
        </div>

        {orders.length > 0 && (
          <button
            className="clear-orders-btn"
            onClick={clearOrders}
          >
            🗑️ Clear Orders
          </button>
        )}
      </div>

      {/* ================= NO ORDERS ================= */}

      {orders.length === 0 ? (

        <div className="no-orders">

          <div className="no-orders-icon">
            📦
          </div>

          <h2>No Orders Found</h2>

          <p>
            Orders placed by customers will
            automatically appear here.
          </p>

        </div>

      ) : (

        /* ================= ORDER LIST ================= */

        <div className="orders-container">

          {orders.map((order, index) => (

            <div
              className="order-card"
              key={order.orderId || index}
            >

              {/* ================= ORDER HEADER ================= */}

              <div className="order-top">

                <div>

                  <h2>
                    Order #{order.orderId}
                  </h2>

                  <p>
                    📅 Date: {order.date}
                  </p>

                </div>

                <span
                  className={`order-status ${
                    order.status === "Placed"
                      ? "placed"
                      : "other-status"
                  }`}
                >
                  {order.status}
                </span>

              </div>


              {/* ================= PRODUCTS ================= */}

              <div className="order-products">

                <h3>Order Details</h3>

                {order.products &&
                order.products.length > 0 ? (

                  order.products.map((product, productIndex) => (

                    <div
                      className="order-product"
                      key={
                        product.id ||
                        productIndex
                      }
                    >

                      {/* PRODUCT IMAGE */}

                      <div className="order-product-image">

                        {product.image ? (

                          <img
                            src={product.image}
                            alt={product.brand}
                          />

                        ) : (

                          <span>🧱</span>

                        )}

                      </div>


                      {/* PRODUCT DETAILS */}

                      <div className="order-product-details">

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
                            Quantity:
                          </strong>{" "}
                          {product.quantity} Bags
                        </p>

                        <p>
                          <strong>
                            Product Total:
                          </strong>{" "}
                          ₹
                          {Number(product.price) *
                            Number(product.quantity)}
                        </p>

                      </div>

                    </div>

                  ))

                ) : (

                  <p>
                    No product information available.
                  </p>

                )}

              </div>


              {/* ================= TOTAL ================= */}

              <div className="order-bottom">

                <div className="order-total">

                  <span>
                    Total Amount
                  </span>

                  <strong>
                    ₹{order.totalAmount}
                  </strong>

                </div>

                <div className="order-status-text">

                  Status:
                  {" "}
                  <strong>
                    {order.status}
                  </strong>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Orders;