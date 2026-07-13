import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    // Backend will be added later
    alert("Registration Successful!");

    navigate("/login");
  };

  return (
    <div className="register-page">

      <div className="register-card">

        <h1>CEMTrack</h1>

        <h2>Create Account</h2>

        <p>Register to access the Cement Shop Management System.</p>

        <form onSubmit={handleRegister}>

          <input
            type="text"
            placeholder="Full Name"
            required
          />

          <input
            type="email"
            placeholder="Email"
            required
          />

          <input
            type="tel"
            placeholder="Phone Number"
            required
          />

          <input
            type="password"
            placeholder="Password"
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            required
          />

          <button type="submit">
            Register
          </button>

        </form>

        <p className="bottom-text">
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>

      </div>

    </div>
  );
}

export default Register;