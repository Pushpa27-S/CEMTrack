import React from "react";

function Contact() {
  return (
    <div className="page">
      <h1>Contact Us</h1>

      <div className="contact-box">
        <p><strong>Email:</strong> cemtrack@gmail.com</p>
        <p><strong>Phone:</strong> +91 9876543210</p>
        <p><strong>Location:</strong> Bengaluru, Karnataka</p>

        <button className="btn">Send Message</button>
      </div>
    </div>
  );
}

export default Contact;