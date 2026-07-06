import React from "react";

function About() {
  return (
    <div className="page">
      <h1>About CEMTrack</h1>

      <p>
        CEMTrack is a smart cement shop management system developed to help
        shop owners efficiently manage their daily business operations.
      </p>

      <div className="about-box">
        <h2>Our Features</h2>

        <ul>
          <li>✔ Product Management</li>
          <li>✔ Customer Management</li>
          <li>✔ Billing System</li>
          <li>✔ Stock Management</li>
          <li>✔ Sales Reports</li>
        </ul>
      </div>
    </div>
  );
}

export default About;