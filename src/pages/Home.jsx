import React from "react";
import {useNavigate} from "react-router-dom";
import "./Home.css";
import homeImage from "../assets/cement.jpeg"; 
// Change the filename if yours is different

function Home() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/AdminLogin");
  };

  return (
    <div className="home">

      <div
        className="hero"
        style={{ backgroundImage: `url(${homeImage})` }}
      >
        <div className="overlay">
          <h1>Welcome to CEMTrack</h1>

          <p>
            Smart Cement Shop Management System for Product, Customer,
            Billing, Stock and Sales Management.
          </p>

          <button className="btn" onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
      </div>

      <section className="features">

        <h2>Why Choose CEMTrack?</h2>

        <div className="feature-container">

          <div className="feature-card">
            <h3>Product Management</h3>
            <p>Manage all cement brands and stock efficiently.</p>
          </div>

          <div className="feature-card">
            <h3>Billing</h3>
            <p>Generate bills quickly with accurate calculations.</p>
          </div>

          <div className="feature-card">
            <h3>Reports</h3>
            <p>Track daily sales and monitor business performance.</p>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;