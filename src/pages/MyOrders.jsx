import React, { useEffect, useState } from "react";
import "./MYOrders.css";

// ==================================================
// PRODUCT IMAGE MAPPING
// Images are inside:
// public/images/
// ==================================================

const productImages = {
  1: "/images/Ultratech_opc.jpeg",
  2: "/images/Ultratech_ppc.avif",

  3: "/images/Acc_opc.jpg",
  4: "/images/Acc_ppc.webp",

  5: "/images/Ambuja_opc.webp",
  6: "/images/Ambuja_ppc.jpeg",

  7: "/images/JK_opc.webp",
  8: "/images/JK_ppc.jpeg",

  9: "/images/Dalmia_opc.jpeg",
  10: "/images/Dalmia_ppc.jpeg",

  11: "/images/Ramco_opc.webp",
  12: "/images/Ramco_ppc.jpg",

  13: "/images/Shree_opc.jpeg",
  14: "/images/Shree_ppc.webp",

  15: "/images/Birla_opc.webp",
  16: "/images/Birla_ppc.webp",

  17: "/images/Maha_opc.webp",
  18: "/images/Maha_ppc.webp",

  19: "/images/Priya_ppc.jpg",
  20: "/images/Priya_opc.webp",

  21: "/images/Coromandel_ppc.webp",
  22: "/images/Jsw_ppc.jpg",

  23: "/images/JKwhite.webp",
  24: "/images/Birlawhite.webp",
};


// ==================================================
// GET PRODUCT IMAGE
// ==================================================

const getProductImage = (productId) => {
  return (
    productImages[Number(productId)] ||
    "/images/Ultratech_opc.jpeg"
  );
};


// ==================================================
// ORDERS COMPONENT
// ==================================================

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==================================================
  // CUSTOMER ID
  // ==================================================

  const customerId =
    localStorage.getItem("customer_id") || "101";


  // ==================================================
  // FETCH ORDERS
  // ==================================================

  const loadOrders = async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

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

      // Hide cancelled orders
      const activeOrders = (data.orders || []).filter(
        (order) =>
          order.delivery_status !== "Cancelled"
      );

      setOrders(activeOrders);
    } catch (err) {
      console.error("Orders error:", err);

      setError(
        err.message || "Failed to fetch orders"
      );
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };


  // ==================================================
  // INITIAL LOAD
  // ==================================================

  useEffect(() => {
    loadOrders(true);
  }, [customerId]);


  // ==================================================
  // AUTOMATIC STATUS REFRESH
  // ==================================================

  useEffect(() => {
    const interval = setInterval(() => {
      loadOrders(false);
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [customerId]);


  // ==================================================
  // CANCEL ORDER
  // ==================================================

  const handleCancelOrder = async (order) => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel Order #${order.order_id}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/orders/${order.order_id}/cancel`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: Number(customerId),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to cancel order"
        );
      }

      // Remove cancelled order from screen
      setOrders((currentOrders) =>
        currentOrders.filter(
          (item) =>
            item.order_id !== order.order_id
        )
      );

      alert(
        `Order #${order.order_id} cancelled successfully.`
      );
    } catch (err) {
      console.error(
        "Cancel order error:",
        err
      );

      setError(
        err.message ||
          "Failed to cancel order"
      );
    }
  };


  // ==================================================
  // CAN CANCEL ORDER
  // ==================================================

  const canCancelOrder = (status) => {
    return (
      status !== "Delivered" &&
      status !== "Cancelled"
    );
  };


  // ==================================================
  // STATUS CLASS
  // ==================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Confirmed":
        return "confirmed";

      case "Processing":
        return "processing";

      case "Shipped":
        return "shipped";

      case "Out for Delivery":
        return "out-for-delivery";

      case "Delivered":
        return "delivered";

      case "Cancelled":
        return "cancelled";

      default:
        return "other-status";
    }
  };


  // ==================================================
  // LOADING
  // ==================================================

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


  // ==================================================
  // ERROR
  // ==================================================

  if (error && orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="no-orders">
          <h2>Unable to Load Orders</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }


  // ==================================================
  // NO ORDERS
  // ==================================================

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
            Orders placed by customers
            will automatically appear here.
          </p>
        </div>
      </div>
    );
  }


  // ==================================================
  // DISPLAY ORDERS
  // ==================================================

  return (
    <div className="orders-page">

      {/* PAGE HEADER */}

      <div className="orders-header">
        <div>
          <h1>Orders</h1>
          <p>Customer Orders</p>
        </div>
      </div>


      {/* ERROR MESSAGE */}

      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#b91c1c",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
            fontWeight: "600",
          }}
        >
          {error}
        </div>
      )}


      {/* ORDERS CONTAINER */}

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


              {/* ORDER STATUS */}

              <span
                className={`order-status ${getStatusClass(
                  order.delivery_status
                )}`}
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

                <div
                  className="order-product-image"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >

                  <img
                    src={getProductImage(
                      order.product_id
                    )}
                    alt={
                      order.product_name ||
                      "Cement Product"
                    }
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      borderRadius: "8px",
                    }}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "/images/Ultratech_opc.jpeg";
                    }}
                  />

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


            {/* CANCEL ORDER */}

            {canCancelOrder(
              order.delivery_status
            ) && (

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "15px",
                  paddingTop: "15px",
                  borderTop:
                    "1px solid #e5e7eb",
                }}
              >

                <button
                  type="button"
                  onClick={() =>
                    handleCancelOrder(order)
                  }
                  style={{
                    background: "#dc2626",
                    color: "#ffffff",
                    border: "none",
                    padding: "11px 20px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background =
                      "#b91c1c";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background =
                      "#dc2626";
                  }}
                >
                  Cancel Order
                </button>

              </div>

            )}

          </div>

        ))}

      </div>

    </div>
  );
}


export default Orders;