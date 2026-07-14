import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Temporary Login
    navigate("/dashboard");
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>CEMTrack</h1>

        <h2>Admin Login</h2>

        <p>Welcome back! Please login to continue.</p>

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
            Don't have an account?{" "}
            <Link to="/register">
              Register
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;