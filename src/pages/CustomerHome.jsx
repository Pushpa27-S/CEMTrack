import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./CustomerHome.css";

function CustomerHome() {
<<<<<<< HEAD
=======

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  /* =========================================
     AUTOMATIC CUSTOMER MESSAGE
     ========================================= */

  useEffect(() => {

    const customerId =
      localStorage.getItem("customer_id");

    if (!customerId) {
      return;
    }

    const checkMessages = async () => {

      try {

        const response = await fetch(
          `http://localhost:5000/api/contact/customer/${customerId}`
        );

        const data = await response.json();

        if (
          !data.success ||
          !data.messages ||
          data.messages.length === 0
        ) {
          return;
        }

        const latestReply = data.messages.find(
          (msg) =>
            msg.admin_reply &&
            msg.replied_at
        );

        if (!latestReply) {
          return;
        }

        const replyKey =
          `cemtrack_reply_seen_${customerId}_${latestReply.message_id}`;

        const alreadySeen =
          localStorage.getItem(replyKey);

        if (!alreadySeen) {

          setPopupMessage(
            latestReply.admin_reply
          );

          setShowPopup(true);

          localStorage.setItem(
            replyKey,
            "true"
          );
        }

      } catch (error) {

        console.error(
          "CONTACT MESSAGE CHECK ERROR:",
          error
        );

      }

    };

    checkMessages();

    const interval =
      setInterval(checkMessages, 5000);

    return () => {
      clearInterval(interval);
    };

  }, []);


>>>>>>> b47205cdad27bb3aa6ca5627d5787a6a301b6307
  return (
    <div className="customer-home">


      {/* =========================================
          AUTOMATIC THANK YOU POPUP
          ========================================= */}

      {showPopup && (

        <div
          className="customer-popup-overlay"
        >

          <div
            className="customer-popup"
          >

            <div className="customer-popup-icon">
              ✓
            </div>

            <h2>
              CEMTrack Cement
            </h2>

            <p>
              {popupMessage}
            </p>

            <button
              className="customer-popup-btn"
              onClick={() => setShowPopup(false)}
            >
              OK
            </button>

          </div>

        </div>

      )}


      {/* =========================================
          HEADER
          ========================================= */}

      <header className="customer-header">

        <div className="customer-logo">

          <h2>
            CEMTrack
          </h2>

          <span>
            Customer Portal
          </span>

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


      {/* =========================================
          WELCOME SECTION
          ========================================= */}

      <section className="welcome-section">

        <div>

          <span className="welcome-small-text">
            Welcome back!
          </span>

          <h1>
            Welcome Customer
          </h1>

          <p>
            Find the right cement products, manage your cart
            and track your orders easily with CEMTrack.
          </p>

        </div>

      </section>


      {/* =========================================
          CUSTOMER ACTIONS
          ========================================= */}

      <section className="customer-actions">

        <h2>
          What would you like to do?
        </h2>


        <div className="customer-card-grid">

<<<<<<< HEAD
          {/* PRODUCTS */}
=======

          {/* BROWSE PRODUCTS */}
>>>>>>> b47205cdad27bb3aa6ca5627d5787a6a301b6307

          <Link
            to="/customer-products"
            className="customer-feature-card"
          >

            <div className="feature-icon">
              🛍️
            </div>

            <h3>
              Browse Products
            </h3>

            <p>
              Explore available cement brands,
              categories, prices and stock.
            </p>

          </Link>


          {/* MY CART */}

          <Link
            to="/cart"
            className="customer-feature-card"
          >

            <div className="feature-icon">
              🛒
            </div>

            <h3>
              My Cart
            </h3>

            <p>
              View your selected products
              and manage quantities.
            </p>

          </Link>


          {/* MY ORDERS */}

          <Link
            to="/my-orders"
            className="customer-feature-card"
          >

            <div className="feature-icon">
              📦
            </div>

            <h3>
              My Orders
            </h3>

            <p>
              View your current and previous
              cement orders.
            </p>

          </Link>


          {/* MY PROFILE */}

          <Link
            to="/my-profile"
            className="customer-feature-card"
          >

            <div className="feature-icon">
              👤
            </div>

            <h3>
              My Profile
            </h3>

            <p>
              View and manage your customer
              information.
            </p>

          </Link>

        </div>

      </section>


      {/* =========================================
          CUSTOMER INFORMATION
          ========================================= */}

      <section className="customer-info">


        <div>

          <h3>
            CEMTrack
          </h3>

          <p>
            Your simple and reliable platform for
            browsing cement products and managing
            your orders.
          </p>

        </div>


        <div>

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