import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CustomerLogin.css";

function CustomerLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {

        // ==================================================
        // CLEAR OLD CUSTOMER SESSION
        // ==================================================

        localStorage.removeItem("customer_id");
        localStorage.removeItem("customer");
        localStorage.removeItem("customer_name");
        localStorage.removeItem("customer_email");
        localStorage.removeItem("token");


        // ==================================================
        // CHECK CUSTOMER DATA
        // ==================================================

        if (!data.customer || !data.customer.customer_id) {
          throw new Error(
            "Customer ID was not received from the server."
          );
        }


        // ==================================================
        // STORE CURRENT CUSTOMER LOGIN
        // ==================================================

        localStorage.setItem(
          "customerLoggedIn",
          "true"
        );


        // ==================================================
        // IMPORTANT:
        // STORE THE CURRENT CUSTOMER ID
        // ==================================================

        localStorage.setItem(
          "customer_id",
          String(data.customer.customer_id)
        );


        // ==================================================
        // STORE CUSTOMER INFORMATION
        // ==================================================

        localStorage.setItem(
          "customer",
          JSON.stringify(data.customer)
        );


        localStorage.setItem(
          "customer_name",
          data.customer.customer_name || ""
        );


        localStorage.setItem(
          "customer_email",
          data.customer.email || ""
        );


        // ==================================================
        // STORE JWT TOKEN
        // ==================================================

        if (data.token) {
          localStorage.setItem(
            "token",
            data.token
          );
        }


        // ==================================================
        // GO TO CUSTOMER HOME
        // ==================================================

        navigate("/customer-home");

      } else {

        setError(
          data.message ||
          "Invalid email or password"
        );

      }

    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      setError(
        error.message ===
          "Customer ID was not received from the server."
          ? error.message
          : "Unable to connect to the server. Please try again."
      );

    } finally {

      setLoading(false);

    }
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
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />


          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />


          {error && (
            <p className="login-error">
              {error}
            </p>
          )}


          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>


        <div className="customer-login-links">

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

export default CustomerLogin;