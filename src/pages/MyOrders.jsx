import React, { useEffect, useState } from "react";
import "./MYOrders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // GET CUSTOMER ID
  // ==========================================

  const customerId = localStorage.getItem("customer_id") || "101";

  // ==========================================
  // FETCH ORDERS FROM DATABASE
  // ==========================================

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/orders/customer/${customerId}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to fetch orders"
          );
        }

        setOrders(data.orders || []);

      } catch (err) {
        console.error("Orders error:", err);
        setError(err.message);

      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [customerId]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="orders-page">
        <div className="no-orders">
          <h2>Loading Orders...</h2>
          <p>Please wait.</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="orders-page">
        <div className="no-orders">
          <h2>Unable to Load Orders</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // NO ORDERS
  // ==========================================

  if (orders.length === 0) {
    return (
      <div className="orders-page">

        <div className="orders-header">
          <div>
            <h1>Orders</h1>
            <p>Customer Orders</p>
          </div>
        </div>

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

      </div>
    );
  }

  // ==========================================
  // DISPLAY ORDERS
  // ==========================================

  return (
    <div className="orders-page">

      <div className="orders-header">

        <div>
          <h1>Orders</h1>
          <p>Customer Orders</p>
        </div>

      </div>

      <div className="orders-container">

        {orders.map((order) => (

          <div
            className="order-card"
            key={order.order_id}
          >

            {/* ORDER HEADER */}

            <div className="order-top">

              <div>

                <h2>
                  Order #{order.order_id}
                </h2>

                <p>
                  📅 Date:{" "}
                  {order.order_date
                    ? new Date(
                        order.order_date
                      ).toLocaleString()
                    : "N/A"}
                </p>

                <p>
                  👤 Customer ID:{" "}
                  {order.customer_id}
                </p>

              </div>

              <span
                className={`order-status ${
                  order.delivery_status === "Placed"
                    ? "placed"
                    : "other-status"
                }`}
              >
                {order.delivery_status}
              </span>

            </div>

            {/* ORDER DETAILS */}

            <div className="order-products">

              <h3>
                Order Details
              </h3>

              <div className="order-product">

                {/* PRODUCT IMAGE */}

                <div className="order-product-image">
                  <span>🧱</span>
                </div>

                {/* PRODUCT DETAILS */}

                <div className="order-product-details">

                  <h3>
                    {order.brand ||
                      order.product_name}
                  </h3>

                  <p>
                    <strong>
                      Product:
                    </strong>{" "}
                    {order.product_name}
                  </p>

                  <p>
                    <strong>
                      Category:
                    </strong>{" "}
                    {order.category}
                  </p>

                  <p>
                    <strong>
                      Price:
                    </strong>{" "}
                    ₹{order.unit_price} / Bag
                  </p>

                  <p>
                    <strong>
                      Quantity:
                    </strong>{" "}
                    {order.quantity} Bags
                  </p>

                  <p>
                    <strong>
                      GST:
                    </strong>{" "}
                    ₹{order.GST}
                  </p>

                  <p>
                    <strong>
                      Discount:
                    </strong>{" "}
                    ₹{order.discount}
                  </p>

                </div>

              </div>

            </div>

            {/* TOTAL */}

            <div className="order-bottom">

              <div className="order-total">

                <span>
                  Total Amount
                </span>

                <strong>
                  ₹{order.total_amount}
                </strong>

              </div>

              <div className="order-status-text">

                Status:{" "}

                <strong>
                  {order.delivery_status}
                </strong>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Orders;