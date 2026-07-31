import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
const navigate = useNavigate();

const [role, setRole] = useState("Admin");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const handleLogin = (e) => {
e.preventDefault();

// Password must contain at least 8 characters
if (password.length < 8) {
  alert("Password must be at least 8 characters long.");
  return;
}

// Password rules:
// At least one uppercase letter
// At least one lowercase letter
// At least one number
// At least one special character
//
// Allowed special characters:
// ! @ # $ % ^ & *

const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/;

if (!passwordPattern.test(password)) {
  alert(
    "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character (! @ # $ % ^ & *)."
  );
  return;
}

// Login Success
alert("Login Successful");

if (role === "Admin") {
  navigate("/dashboard");
} else {
  navigate("/customer-home");
}

};

return (
<div className="login-page">

  <div className="login-card">

    <h1>CEMTrack</h1>

    <h2>Login</h2>

    <p>
      Welcome back! Please login to continue.
    </p>

    <div className="role-selection">

      <label className="role-label">

        <input
          type="radio"
          name="role"
          value="Admin"
          checked={role === "Admin"}
          onChange={(e) =>
            setRole(e.target.value)
          }
        />

        Admin

      </label>


      <label className="role-label">

        <input
          type="radio"
          name="role"
          value="Customer"
          checked={role === "Customer"}
          onChange={(e) =>
            setRole(e.target.value)
          }
        />

        Customer

      </label>

    </div>


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


      <button type="submit">
        Login
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