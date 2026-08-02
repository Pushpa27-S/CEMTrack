import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./CustomerLogin.css";

function MyOrders() {

const [orders, setOrders] = useState([]);

useEffect(() => {

const savedOrders =
  JSON.parse(
    localStorage.getItem("orders")
  ) || [];

setOrders(savedOrders);

}, []);

return (

<div className="customer-home">

  {/* HEADER */}

  <header className="customer-header">

    <div className="customer-logo">

      <h2>CEMTrack</h2>

      <span>My Orders</span>

    </div>

    <div className="customer-header-actions">

      <Link
        to="/customer-products"
        className="cart-top-btn"
      >
        🛍️ Products
      </Link>

      <Link
        to="/cart"
        className="cart-top-btn"
      >
        🛒 Cart
      </Link>

      <Link
        to="/customer-home"
        className="cart-top-btn"
      >
        🏠 Home
      </Link>

    </div>

  </header>


  {/* ORDERS */}

  <section className="customer-actions">

    <h1>📦 My Orders</h1>

    {orders.length === 0 ? (

      <div className="info-box">

        <h2>
          No Orders Yet
        </h2>

        <p>
          You have not placed any
          orders yet.
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

      <div>

        {orders
          .slice()
          .reverse()
          .map((order) => (

          <div
            className="info-box"
            key={order.orderId}
            style={{
              marginBottom: "25px"
            }}
          >

            {/* ORDER HEADER */}

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px"
              }}
            >

              <h2>
                Order{" "}
                {order.orderId}
              </h2>

              <span
                style={{
                  background:
                    "#dcfce7",
                  color:
                    "#166534",
                  padding:
                    "6px 12px",
                  borderRadius:
                    "20px",
                  fontWeight:
                    "700"
                }}
              >
                {order.status}
              </span>

            </div>


            <p>
              <strong>
                Order Date:
              </strong>{" "}
              {order.date}
            </p>


            <h3>
              Products
            </h3>


            {/* PRODUCTS */}

            {order.products.map(
              (product) => (

              <div
                key={product.id}
                style={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: "15px",
                  padding:
                    "15px 0",
                  borderBottom:
                    "1px solid #e5e7eb"
                }}
              >

                <img
                  src={product.image}
                  alt={product.brand}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit:
                      "contain"
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
                      Quantity:
                    </strong>{" "}
                    {product.quantity}
                  </p>

                  <p>
                    <strong>
                      Price:
                    </strong>{" "}
                    ₹{product.price}
                    {" "} / Bag
                  </p>

                  <p>
                    <strong>
                      Amount:
                    </strong>{" "}
                    ₹
                    {product.price *
                      product.quantity}
                  </p>

                </div>

              </div>

            ))}


            {/* TOTAL */}

            <h2
              style={{
                marginTop: "20px"
              }}
            >
              Total Amount: ₹
              {order.totalAmount}
            </h2>

          </div>

        ))}

      </div>

    )}

  </section>


  {/* BACK */}

  <div
    style={{
      margin:
        "0 40px 40px"
    }}
  >

    <Link to="/customer-home">
      ← Back to Customer Home
    </Link>

  </div>

</div>

);
}

export default MyOrders;