import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {

  const navigate = useNavigate();


  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const register = (e) => {

    e.preventDefault();

    if (
      form.name === "" ||
      form.email === "" ||
      form.mobile === "" ||
      form.password === "" ||
      form.confirmPassword === ""
    ) {
      alert("Please fill all fields.");
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email)) {
      alert("Invalid Email.");
      return;
    }

    const mobileRegex = /^[0-9]{10}$/;

    if (!mobileRegex.test(form.mobile)) {
      alert("Mobile number must contain exactly 10 digits.");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(form.password)) {
      alert(
        "Password must contain:\n\nMinimum 8 characters\nOne uppercase\nOne lowercase\nOne number\nOne special character."
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    alert("Account Created Successfully!");

    navigate("/customerlogin");

  };

  return (

    <div className="register-page">

      <div className="register-card">

        <h1>CEMTrack</h1>

        <h2>Create Your Account</h2>

        <p>
          Register to access Cement Inventory Management System.
        </p>

        <form onSubmit={register}>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          <button type="submit">
            Create Account
          </button>

        </form>

        <div className="bottom-text">

          Already have an account?

          <br />

          <Link to="/customerlogin">Back to Login</Link>


        </div>

      </div>
      </div>

  );
}

export default Register;