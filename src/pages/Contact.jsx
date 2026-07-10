import React from "react";
import "./Contact.css";
import contactBg from "../assets/contact.jpeg";

function Contact() {
  return (
    <div className="contact-page">

      {/* Hero Section */}
      <div
        className="contact-hero"
        style={{ backgroundImage: `url(${contactBg})` }}
      >
        <div className="contact-overlay">

          <h1>Contact Us</h1>

          <p>
            We'd love to hear from you. Reach out for product enquiries,
            billing support, dealership information, or any assistance
            regarding CEMTrack.
          </p>

        </div>
      </div>

      {/* Contact Information */}

      <section className="contact-info">

        <div className="contact-card">
          <h2>📍 Address</h2>

          <p>
            CEMTrack Head Office<br />
            Bengaluru, Karnataka<br />
            India
          </p>

        </div>

        <div className="contact-card">
          <h2>📞 Phone</h2>

          <p>
            +91 98765 43210<br />
            +91 99887 77665
          </p>

        </div>

        <div className="contact-card">
          <h2>📧 Email</h2>

          <p>
            support@cemtrack.com<br />
            info@cemtrack.com
          </p>

        </div>

      </section>

      {/* Contact Form */}

      <section className="contact-form-section">

        <h2>Send us a Message</h2>

        <form className="contact-form">

          <input
            type="text"
            placeholder="Enter your Name"
          />

          <input
            type="email"
            placeholder="Enter your Email"
          />

          <input
            type="text"
            placeholder="Subject"
          />

          <textarea
            rows="6"
            placeholder="Write your message..."
          ></textarea>

          <button type="submit">
            Send Message
          </button>

        </form>

      </section>

    </div>
  );
}

export default Contact;