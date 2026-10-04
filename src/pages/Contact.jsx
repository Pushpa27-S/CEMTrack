import React, { useState } from "react";
import "./Contact.css";
import contactBg from "../assets/contact.jpeg";

function Contact() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [sending, setSending] = useState(false);


  // ==================================================
// HANDLE INPUT
// ==================================================

const handleChange = (e) => {

  const {
    name,
    value
  } = e.target;

  // Name and Subject should contain
  // letters and spaces only
  if (
    name === "name" ||
    name === "subject"
  ) {

    const lettersOnly =
      /^[A-Za-z\s]*$/;

    if (!lettersOnly.test(value)) {
      return;
    }

  }

  setFormData((previous) => ({
    ...previous,
    [name]: value
  }));

};
  

  // ==================================================
// SEND MESSAGE
// ==================================================

const handleSubmit = async (e) => {

  e.preventDefault();


  // NAME VALIDATION

  if (!/^[A-Za-z\s]+$/.test(formData.name.trim())) {

    alert(
      "Name should contain letters and spaces only."
    );

    return;
  }


  // SUBJECT VALIDATION

  if (!/^[A-Za-z\s]+$/.test(formData.subject.trim())) {

    alert(
      "Subject should contain letters and spaces only."
    );

    return;
  }


  setSending(true);

  try {

  

      // Get logged-in customer's ID
      const customerId =
        localStorage.getItem("customer_id");

      const response = await fetch(
        "http://localhost:5000/api/contact",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            customer_id: customerId
              ? Number(customerId)
              : null,

            name: formData.name,

            email: formData.email,

            subject: formData.subject,

            message: formData.message
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Unable to send message"
        );

      }

      alert(
        "Your message has been sent successfully!"
      );

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });

    } catch (error) {

      console.error(
        "CONTACT ERROR:",
        error
      );

      alert(
        error.message ||
        "Unable to send message"
      );

    } finally {

      setSending(false);

    }

  };


  return (

    <div className="contact-page">

      {/* HERO */}

      <div
        className="contact-hero"
        style={{
          backgroundImage: `url(${contactBg})`
        }}
      >

        <div className="contact-overlay">

          <h1>
            Contact Us
          </h1>

          <p>
            We'd love to hear from you. Reach out for
            product enquiries, billing support,
            dealership information, or any assistance
            regarding CEMTrack.
          </p>

        </div>

      </div>


      {/* CONTACT INFORMATION */}

      <section className="contact-info">

        <div className="contact-card">

          <h2>
            📍 Address
          </h2>

          <p>
            CEMTrack Head Office
            <br />
            Bengaluru, Karnataka
            <br />
            India
          </p>

        </div>


        <div className="contact-card">

          <h2>
            📞 Phone
          </h2>

          <p>
            +91 98765 43210
            <br />
            +91 99887 77665
          </p>

        </div>


        <div className="contact-card">

          <h2>
            📧 Email
          </h2>

          <p>
            support@cemtrack.com
            <br />
            info@cemtrack.com
          </p>

        </div>

      </section>


      {/* SEND MESSAGE */}

      <section className="contact-form-section">

        <h2>
          Send us a Message
        </h2>

        <form
          className="contact-form"
          onSubmit={handleSubmit}
        >

          <input
            type="text"
            name="name"
            placeholder="Enter your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />


          <input
            type="email"
            name="email"
            placeholder="Enter your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />


          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />


          <textarea
            name="message"
            rows="6"
            placeholder="Write your message..."
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>


          <button
            type="submit"
            disabled={sending}
          >
            {sending
              ? "Sending..."
              : "Send Message"}
          </button>

        </form>

      </section>

    </div>

  );

}

export default Contact;