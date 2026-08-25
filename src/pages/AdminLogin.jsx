import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [role, setRole] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const url =
        role === "Admin"
          ? "http://localhost:5000/api/admin/login"
          : "http://localhost:5000/api/login";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Invalid email or password");
        return;
      }

      if (role === "Admin") {
        localStorage.setItem("adminLoggedIn", "true");

        if (data.owner) {
          localStorage.setItem(
            "owner",
            JSON.stringify(data.owner)
          );
        }

        navigate("/dashboard");
      } else {
        localStorage.setItem("customerLoggedIn", "true");

        if (data.customer) {
          localStorage.setItem(
            "customer",
            JSON.stringify(data.customer)
          );
        }

        navigate("/customer-home");
      }

    } catch (error) {
      console.error("Login error:", error);
      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <h1>CEMTrack</h1>

        <h2>Login</h2>

        <p>
          Welcome back! Please select your account type
          and login.
        </p>

        <div className="role-selection">

          <label className="role-label">
            <input
              type="radio"
              name="role"
              value="Admin"
              checked={role === "Admin"}
              onChange={() => {
                setRole("Admin");
                setError("");
              }}
            />
            Admin
          </label>

          <label className="role-label">
            <input
              type="radio"
              name="role"
              value="Customer"
              checked={role === "Customer"}
              onChange={() => {
                setRole("Customer");
                setError("");
              }}
            />
            Customer
          </label>

        </div>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading
              ? "Logging in..."
              : `Login as ${role}`}
          </button>

        </form>

        <div className="login-links">

          <Link to="/forgot-password">
            Forgot Password?
          </Link>

          {role === "Customer" && (
            <p>
              Don't have an account?{" "}
              <Link to="/register">
                Register
              </Link>
            </p>
          )}

        </div>

      </div>
    </div>
  );
}

export default AdminLogin;