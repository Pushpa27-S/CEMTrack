import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Customers.css";

function MyProfile() {

const [editing, setEditing] = useState(false);

const [profile, setProfile] = useState({
name: "Customer",
email: "customer@gmail.com",
phone: "9876543210",
address: "Chennai, Tamil Nadu"
});

const handleChange = (e) => {

setProfile({
  ...profile,
  [e.target.name]: e.target.value
});

};

const handleSave = () => {

localStorage.setItem(
  "customerProfile",
  JSON.stringify(profile)
);

setEditing(false);

alert("Profile updated successfully!");

};

return (

<div className="customer-home">

  {/* HEADER */}

  <header className="customer-header">

    <div className="customer-logo">

      <h2>CEMTrack</h2>

      <span>My Profile</span>

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
        to="/my-orders"
        className="cart-top-btn"
      >
        📦 Orders
      </Link>

      <Link
        to="/customer-home"
        className="cart-top-btn"
      >
        🏠 Home
      </Link>

    </div>

  </header>


  {/* PROFILE */}

  <section className="customer-actions">

    <h1>👤 My Profile</h1>

    <div
      className="info-box"
      style={{
        maxWidth: "700px",
        margin: "0 auto"
      }}
    >

      {/* PROFILE ICON */}

      <div
        style={{
          textAlign: "center",
          marginBottom: "25px"
        }}
      >

        <div
          style={{
            width: "90px",
            height: "90px",
            margin: "0 auto",
            borderRadius: "50%",
            background: "#ecfdf5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "45px"
          }}
        >
          👤
        </div>

        <h2>
          {profile.name}
        </h2>

        <p>
          CEMTrack Customer
        </p>

      </div>


      {/* NAME */}

      <label>
        <strong>Full Name</strong>
      </label>

      <input
        type="text"
        name="name"
        value={profile.name}
        onChange={handleChange}
        disabled={!editing}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "8px",
          marginBottom: "18px",
          border: "1px solid #d1d5db",
          borderRadius: "8px",
          boxSizing: "border-box"
        }}
      />


      {/* EMAIL */}

      <label>
        <strong>Email Address</strong>
      </label>

      <input
        type="email"
        name="email"
        value={profile.email}
        onChange={handleChange}
        disabled={!editing}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "8px",
          marginBottom: "18px",
          border: "1px solid #d1d5db",
          borderRadius: "8px",
          boxSizing: "border-box"
        }}
      />


      {/* PHONE */}

      <label>
        <strong>Phone Number</strong>
      </label>

      <input
        type="tel"
        name="phone"
        value={profile.phone}
        onChange={handleChange}
        disabled={!editing}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "8px",
          marginBottom: "18px",
          border: "1px solid #d1d5db",
          borderRadius: "8px",
          boxSizing: "border-box"
        }}
      />


      {/* ADDRESS */}

      <label>
        <strong>Address</strong>
      </label>

      <textarea
        name="address"
        value={profile.address}
        onChange={handleChange}
        disabled={!editing}
        rows="4"
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "8px",
          marginBottom: "20px",
          border: "1px solid #d1d5db",
          borderRadius: "8px",
          resize: "vertical",
          boxSizing: "border-box"
        }}
      />


      {/* BUTTONS */}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          marginTop: "10px"
        }}
      >

        {!editing ? (

          <button
            type="button"
            className="cart-top-btn"
            onClick={() =>
              setEditing(true)
            }
          >
            ✏️ Edit Profile
          </button>

        ) : (

          <>

            <button
              type="button"
              className="cart-top-btn"
              onClick={handleSave}
            >
              💾 Save Changes
            </button>

            <button
              type="button"
              onClick={() =>
                setEditing(false)
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

          </>

        )}

      </div>

    </div>

  </section>


  {/* BACK */}

  <div
    style={{
      margin: "0 40px 40px"
    }}
  >

    <Link to="/customer-home">
      ← Back to Customer Home
    </Link>

  </div>

</div>

);

}

export default MyProfile;