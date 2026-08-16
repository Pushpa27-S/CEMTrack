import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    // Password must contain at least 8 characters
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    // Password rules:
    // At least one uppercase letter
    // At least one lowercase letter
    // At least one number
    // At least one special character

    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/;

    if (!passwordPattern.test(password)) {
      setError(
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character (! @ # $ % ^ & *)."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Store admin login status
        localStorage.setItem("adminLoggedIn", "true");

        // Store admin information
        if (data.owner) {
          localStorage.setItem(
            "owner",
            JSON.stringify(data.owner)
          );
        }

        // Go to admin dashboard
        navigate("/dashboard");
      } else {
        setError(
          data.message || "Invalid email or password"
        );
      }

    } catch (error) {
      console.error("Admin login error:", error);

      setError(
        "Unable to connect to the server. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>CEMTrack</h1>

        <h2>Admin Login</h2>

        <p>
          Welcome back! Please login to continue.
        </p>

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
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <div className="login-links">

          <Link to="/forgot-password">
            Forgot Password?
          </Link>

        </div>

      </div>

    </div>
  );
}

export default AdminLogin;