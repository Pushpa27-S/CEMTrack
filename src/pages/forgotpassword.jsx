import React from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Password Reset Link Sent!");
  };

  return (

    <div className="forgot-page">

      <div className="forgot-card">

        <h1>Forgot Password</h1>

        <p>
          Enter your registered email address.
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Enter Email"
            required
          />

          <button type="submit">
            Send Reset Link
          </button>

        </form>

        <Link to="/login">
          Back to Login
        </Link>

      </div>

    </div>

  );
}

export default ForgotPassword;