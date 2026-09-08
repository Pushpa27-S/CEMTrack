import React, { useEffect, useState } from "react";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/orders");
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
      } else {
        setError(data.message || "Failed to load orders");
      }
    } catch (err) {
      console.error(err);
      setError("Cannot connect to backend server");
    } finally {
      setLoading(false);
    }
  };
  const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/orders/${orderId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delivery_status: newStatus,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      alert("Order status updated successfully!");
      fetchOrders();
    } else {
      alert(data.message || "Failed to update order status");
    }
  } catch (error) {
    console.error("Update status error:", error);
    alert("Cannot connect to backend server");
  }
};

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <h2>Loading orders...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>All Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer ID</th>
              <th>Product</th>
              <th>Brand</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>GST</th>
              <th>Total Amount</th>
              <th>Order Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.customer_id}</td>
                <td>{order.product_name}</td>
                <td>{order.brand}</td>
                <td>{order.quantity}</td>
                <td>₹{order.unit_price}</td>
                <td>₹{order.GST}</td>
                <td>₹{order.total_amount}</td>
                <td>
                  {new Date(order.order_date).toLocaleDateString()}
                </td>
                <td>
  <select
    value={order.delivery_status}
    onChange={(e) =>
      updateOrderStatus(
        order.order_id,
        e.target.value
      )
    }
  >
    <option value="Pending">Pending</option>
    <option value="Confirmed">Confirmed</option>
    <option value="Processing">Processing</option>
    <option value="Delivered">Delivered</option>
    <option value="Cancelled">Cancelled</option>
  </select>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        onClick={fetchOrders}
        style={{ marginTop: "20px", padding: "10px 20px" }}
      >
        Refresh Orders
      </button>
    </div>
  );
}

export default AdminOrders;