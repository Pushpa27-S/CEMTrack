import React from "react";
import "./About.css";
import aboutBg from "../assets/about.jpeg";

function About() {
  return (
    <div className="about-page">

      {/* Hero Section */}
      <div
        className="about-hero"
        style={{ backgroundImage: `url(${aboutBg})` }}
      >
        <div className="about-overlay">

          <h1>About CEMTrack</h1>

          <p>
            CEMTrack is a complete Cement Shop Management System that helps
            dealers manage products, customers, billing, stock, and reports
            efficiently from a single platform.
          </p>

          <a href="#features">
            <button className="about-btn">
              Explore Features
            </button>
          </a>

        </div>
      </div>

      {/* About */}
      <section className="about-content">

        <h2>Who We Are</h2>

        <p>
          CEMTrack is developed to simplify the daily operations of cement
          dealers and distributors. Instead of maintaining registers and
          manual records, our system digitizes inventory management, customer
          information, billing, stock monitoring, and sales reporting in one
          easy-to-use application.
        </p>

      </section>

      {/* Mission & Vision */}
      <section className="mission-section">

        <div className="mission-card">
          <h2>🎯 Our Mission</h2>

          <p>
            To provide a reliable, fast, and intelligent management solution
            that improves productivity and minimizes manual work for cement
            businesses.
          </p>
        </div>

        <div className="mission-card">
          <h2>🚀 Our Vision</h2>

          <p>
            To become the preferred digital management solution for cement
            shops and construction material suppliers through innovation and
            technology.
          </p>
        </div>

      </section>

      {/* Features */}
      <section id="features" className="features-section">

        <h2>Why Choose CEMTrack?</h2>

        <div className="feature-grid">

          <div className="feature-box">
            <h3>📦 Product Management</h3>
            <p>
              Organize all cement brands, prices, stock levels and inventory.
            </p>
          </div>

          <div className="feature-box">
            <h3>👥 Customer Management</h3>
            <p>
              Store customer details, purchase history and contact information.
            </p>
          </div>

          <div className="feature-box">
            <h3>💰 Billing System</h3>
            <p>
              Generate professional invoices quickly with automated billing.
            </p>
          </div>

          <div className="feature-box">
            <h3>📊 Reports & Analytics</h3>
            <p>
              Monitor sales, stock availability and business performance.
            </p>
          </div>

          <div className="feature-box">
            <h3>🏬 Stock Management</h3>
            <p>
              Track incoming and outgoing cement bags with low stock alerts.
            </p>
          </div>

          <div className="feature-box">
            <h3>🔒 Secure System</h3>
            <p>
              Secure login and centralized data management for your business.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}

export default About;