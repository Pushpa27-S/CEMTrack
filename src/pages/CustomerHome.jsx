import React from "react";
import { Link } from "react-router-dom";
import "./CustomerHome.css";

function CustomerHome() {
  return (
    <div className="customer-home">

      {/* TOP HEADER */}

      <header className="customer-header">

        <div className="customer-logo">
          <h2>CEMTrack</h2>
          <span>Customer Portal</span>
        </div>

        <div className="customer-header-actions">

          <Link
            to="/cart"
            className="cart-top-btn"
          >
            🛒 Cart
          </Link>

          <Link
            to="/customerlogin"
            className="customer-logout-btn"
            onClick={() => {
              localStorage.removeItem("customerLoggedIn");
              localStorage.removeItem("token");
              localStorage.removeItem("customer_id");
              localStorage.removeItem("customer");
              localStorage.removeItem("customer_name");
              localStorage.removeItem("customer_email");
            }}
          >
            Logout
          </Link>

        </div>

      </header>


      {/* WELCOME SECTION */}

      <section className="welcome-section">

        <div>

          <p className="welcome-small">
            Welcome back!
          </p>

          <h1>
            Welcome Customer
          </h1>

          <p className="welcome-message">
            Find the right cement products,
            manage your cart and track your orders
            easily with CEMTrack.
          </p>

        </div>

      </section>


      {/* QUICK ACTIONS */}

      <section className="customer-actions">

        <h2>
          What would you like to do?
        </h2>

        <div className="customer-card-grid">

          {/* PRODUCTS */}

          <Link
            to="/customer-products"
            className="customer-feature-card"
          >

            <div className="feature-icon">
              🛍️
            </div>

            <div>

              <h3>
                Browse Products
              </h3>

              <p>
                Explore available cement brands,
                categories, prices and stock.
              </p>

            </div>

          </Link>


          {/* CART */}

          <Link
            to="/cart"
            className="customer-feature-card"
          >

            <div className="feature-icon">
              🛒
            </div>

            <div>

              <h3>
                My Cart
              </h3>

              <p>
                View your selected products
                and manage quantities.
              </p>

            </div>

          </Link>


          {/* ORDERS */}

          <Link
            to="/my-orders"
            className="customer-feature-card"
          >

            <div className="feature-icon">
              📦
            </div>

            <div>

              <h3>
                My Orders
              </h3>

              <p>
                View your current and previous
                cement orders.
              </p>

            </div>

          </Link>


          {/* PROFILE */}

          <Link
            to="/my-profile"
            className="customer-feature-card"
          >

            <div className="feature-icon">
              👤
            </div>

            <div>

              <h3>
                My Profile
              </h3>

              <p>
                View and manage your
                customer information.
              </p>

            </div>

          </Link>

        </div>

      </section>


      {/* INFORMATION SECTION */}

      <section className="customer-info">

        <div className="info-box">

          <h3>
            CEMTrack
          </h3>

          <p>
            Your simple and reliable platform for
            browsing cement products and managing
            your orders.
          </p>

        </div>

        <div className="info-box">

          <h3>
            Need Help?
          </h3>

          <p>
            Contact our support team if you need
            assistance with your orders or account.
          </p>

        </div>

      </section>

    </div>
  );
}

export default CustomerHome;