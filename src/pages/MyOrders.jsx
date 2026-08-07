import React, { useEffect, useState } from "react";
import "./MYOrders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);

  // ===============================
  // FETCH ORDERS
  // ===============================

  useEffect(() => {
    loadOrders();

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
  // SELECT / UNSELECT ORDER
  // ===============================

  const handleSelectOrder = (orderId) => {
    setSelectedOrders((previous) => {
      if (previous.includes(orderId)) {
        return previous.filter(
          (id) => id !== orderId
        );
      }

      return [...previous, orderId];
    });
  };

  // ===============================
  // SELECT ALL ORDERS
  // ===============================

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(
        orders.map(
          (order, index) =>
            order.orderId || `order-${index}`
        )
      );
    }
  };

  // ===============================
  // DELETE SELECTED ORDERS
  // ===============================

  const deleteSelectedOrders = () => {
    if (selectedOrders.length === 0) {
      alert("Please select at least one order.");
      return;
    }

    const answer = window.confirm(
      `Are you sure you want to delete ${selectedOrders.length} selected order(s)?`
    );

    if (!answer) {
      return;
    }

    const updatedOrders = orders.filter(
      (order, index) => {
        const orderKey =
          order.orderId || `order-${index}`;

        return !selectedOrders.includes(orderKey);
      }
    );

    localStorage.setItem(
      "orders",
      JSON.stringify(updatedOrders)
    );

    setOrders(updatedOrders);
    setSelectedOrders([]);

    alert("Selected orders deleted successfully.");
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
      setSelectedOrders([]);
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
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >

            {/* SELECT ALL */}

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >

              <input
                type="checkbox"
                checked={
                  orders.length > 0 &&
                  selectedOrders.length ===
                    orders.length
                }
                onChange={handleSelectAll}
                style={{
                  width: "18px",
                  height: "18px",
                  cursor: "pointer",
                }}
              />

              Select All

            </label>

            {/* DELETE SELECTED */}

            {selectedOrders.length > 0 && (
              <button
                className="clear-orders-btn"
                onClick={
                  deleteSelectedOrders
                }
              >
                🗑️ Delete Selected (
                {selectedOrders.length})
              </button>
            )}

            {/* CLEAR ALL */}

            <button
              className="clear-orders-btn"
              onClick={clearOrders}
            >
              🗑️ Clear All Orders
            </button>

          </div>
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

          {orders.map((order, index) => {

            const orderKey =
              order.orderId ||
              `order-${index}`;

            const isSelected =
              selectedOrders.includes(
                orderKey
              );

            return (

              <div
                className="order-card"
                key={orderKey}
                style={{
                  border: isSelected
                    ? "2px solid #ea580c"
                    : undefined,
                }}
              >

                {/* ================= ORDER HEADER ================= */}

                <div className="order-top">

                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                    }}
                  >

                    {/* CHECKBOX */}

                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() =>
                        handleSelectOrder(
                          orderKey
                        )
                      }
                      style={{
                        width: "20px",
                        height: "20px",
                        marginTop: "5px",
                        cursor: "pointer",
                      }}
                    />

                    <div>

                      <h2>
                        Order #{order.orderId}
                      </h2>

                      <p>
                        📅 Date: {order.date}
                      </p>

                    </div>

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

                  <h3>
                    Order Details
                  </h3>

                  {order.products &&
                  order.products.length > 0 ? (

                    order.products.map(
                      (product, productIndex) => (

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
                              ₹
                              {product.price}
                              {" "} / Bag
                            </p>

                            <p>
                              <strong>
                                Quantity:
                              </strong>{" "}
                              {product.quantity}
                              {" "} Bags
                            </p>

                            <p>
                              <strong>
                                Product Total:
                              </strong>{" "}
                              ₹
                              {Number(
                                product.price
                              ) *
                                Number(
                                  product.quantity
                                )}
                            </p>

                          </div>

                        </div>

                      )
                    )

                  ) : (

                    <p>
                      No product information
                      available.
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

                {/* ================= PAYMENT ================= */}

                {order.paymentMethod && (

                  <div
                    style={{
                      marginTop: "15px",
                      padding: "12px",
                      background: "#f8f9fa",
                      borderRadius: "8px",
                    }}
                  >

                    <p
                      style={{
                        margin: "5px 0",
                      }}
                    >
                      <strong>
                        Payment Method:
                      </strong>{" "}
                      {order.paymentMethod}
                    </p>

                    <p
                      style={{
                        margin: "5px 0",
                        color: "#16a34a",
                        fontWeight: "bold",
                      }}
                    >
                      <strong>
                        Amount Paid:
                      </strong>{" "}
                      ₹
                      {order.amountPaid ??
                        order.totalAmount}
                    </p>

                  </div>

                )}

              </div>

            );
          })}

        </div>

      )}

    </div>
  );
}

export default Orders;