import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      
      <Link to="/" className="logo">
        CEMTrack
      </Link>

      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/about">About</Link>
        </li>

        <li>
          <Link to="/contact">Contact</Link>
        </li>

        <li>
          <Link to="/adminlogin" className="login-btn">
            Login
          </Link>
        </li>
      </ul>

    </nav>
  );
}

export default Navbar;