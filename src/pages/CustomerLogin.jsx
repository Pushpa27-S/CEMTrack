import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function CustomerLogin() {

  const navigate = useNavigate();

  const handleLogin = (e) => {

    e.preventDefault();

    navigate("/customer-home");

  };

  return (

    <div className="login-page">

      <div className="login-card">

        <h1>CEMTrack</h1>

        <h2>Customer Login</h2>

        <p>
          Welcome! Login to browse products and place your orders.
        </p>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Enter Email"
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            required
          />

          <button type="submit">
            Login
          </button>

        </form>

        <div className="login-links">

          <Link to="/forgot-password">
            Forgot Password?
          </Link>

          <p>

            Don't have an account?

            <Link to="/register">
              Register
            </Link>

          </p>

        </div>

      </div>

    </div>

  );

}

export default CustomerLogin;