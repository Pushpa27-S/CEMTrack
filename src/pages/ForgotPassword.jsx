import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {

  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();

    if (email.trim() === "") {
      alert("Please enter your registered email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    alert("Password reset link has been sent to your registered email.");

    navigate("/adminlogin");
  };

  return (
    <div className="forgot-page">

      <div className="forgot-card">

        <h1>CEMTrack</h1>

        <h2>Forgot Password</h2>

        <p>
          Enter your registered email address to receive a password reset link.
        </p>

        <form onSubmit={handleReset}>

          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit">
            Send Reset Link
          </button>

        </form>

        <Link to="/adminlogin">
          Back to Login
        </Link>

      </div>

    </div>
  );
}

export default ForgotPassword;