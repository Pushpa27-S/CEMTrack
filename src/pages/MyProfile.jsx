import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MyProfile.css";

function MyProfile() {

  const emptyProfile = {
    name: "",
    email: "",
    phone: "",
    address: ""
  };

  const [profile, setProfile] = useState(emptyProfile);
  const [originalProfile, setOriginalProfile] = useState(emptyProfile);

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);


  // ==================================================
  // LOAD CURRENT CUSTOMER
  // ==================================================

  useEffect(() => {

    const storedCustomer =
      JSON.parse(
        localStorage.getItem("customer") || "{}"
      );

    const storedCustomerId =
      localStorage.getItem("customer_id");

    /*
      IMPORTANT:
      The customer object contains the actual logged-in
      customer ID. Use that first.

      Example:
      customer = { customer_id: 101, customer_name: "Amit Verma" }

      This prevents an old customer_id value such as 104
      from loading another customer's profile.
    */

    const customerId =
      storedCustomer.customer_id ||
      storedCustomerId;


    console.log(
      "CURRENT CUSTOMER ID:",
      customerId
    );

    console.log(
      "CURRENT CUSTOMER:",
      storedCustomer
    );


    if (!customerId) {

      console.error(
        "Customer ID not found in localStorage."
      );

      setLoading(false);
      return;
    }


    fetch(
      `http://localhost:5000/api/admin/customers/${customerId}`
    )
      .then(async (response) => {

        const data =
          await response.json();

        console.log(
          "PROFILE API RESPONSE:",
          data
        );


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Unable to load customer profile."
          );

        }

        return data;

      })


      .then((data) => {

        /*
          Backend response:

          {
            success: true,
            customer: {
              id: 101,
              name: "Amit Verma",
              phone: "9876500001",
              email: "amit@gmail.com",
              address: "Koramangala, Bangalore"
            }
          }
        */

        const customer =
          data.customer || data;


        const customerData = {

          name:
            customer.name ||
            customer.customer_name ||
            "",

          email:
            customer.email ||
            "",

          phone:
            customer.phone ||
            customer.phone_no ||
            "",

          address:
            customer.address ||
            ""

        };


        console.log(
          "PROFILE DATA:",
          customerData
        );


        setProfile(customerData);

        setOriginalProfile(customerData);


        /*
          Keep localStorage customer information
          synchronized with the customer returned
          from the database.
        */

        const updatedCustomer = {

          ...storedCustomer,

          customer_id:
            Number(customer.id || customer.customer_id),

          customer_name:
            customer.name ||
            customer.customer_name ||
            "",

          email:
            customer.email ||
            ""

        };


        localStorage.setItem(
          "customer",
          JSON.stringify(updatedCustomer)
        );


        localStorage.setItem(
          "customer_id",
          String(
            customer.id ||
            customer.customer_id
          )
        );


        localStorage.setItem(
          "customer_name",
          customer.name ||
          customer.customer_name ||
          ""
        );


        localStorage.setItem(
          "customer_email",
          customer.email ||
          ""
        );

      })


      .catch((error) => {

        console.error(
          "PROFILE LOAD ERROR:",
          error
        );

      })


      .finally(() => {

        setLoading(false);

      });

  }, []);


  // ==================================================
  // HANDLE INPUT
  // ==================================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;


    setProfile((previous) => ({

      ...previous,

      [name]: value

    }));

  };


  // ==================================================
  // SAVE PROFILE
  // ==================================================

  const handleSave = async () => {

    const storedCustomer =
      JSON.parse(
        localStorage.getItem("customer") || "{}"
      );


    /*
      IMPORTANT:
      Again use customer_id from the stored
      customer object first.
    */

    const customerId =
      storedCustomer.customer_id ||
      localStorage.getItem("customer_id");


    if (!customerId) {

      alert(
        "Customer ID not found. Please login again."
      );

      return;
    }


    setSaving(true);


    try {

      const response =
        await fetch(
          `http://localhost:5000/api/admin/customers/${customerId}`,
          {
            method: "PUT",

            headers: {
              "Content-Type": "application/json"
            },

            body: JSON.stringify({

              customer_name:
                profile.name,

              email:
                profile.email,

              phone_no:
                profile.phone,

              address:
                profile.address

            })

          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Unable to update profile."
        );

      }


      // Update original profile
      setOriginalProfile(profile);

      // Exit edit mode
      setEditing(false);


      // ==================================================
      // UPDATE LOCAL STORAGE
      // ==================================================

      const updatedCustomer = {

        ...storedCustomer,

        customer_id:
          Number(customerId),

        customer_name:
          profile.name,

        email:
          profile.email

      };


      localStorage.setItem(
        "customer",
        JSON.stringify(updatedCustomer)
      );


      localStorage.setItem(
        "customer_id",
        String(customerId)
      );


      localStorage.setItem(
        "customer_name",
        profile.name
      );


      localStorage.setItem(
        "customer_email",
        profile.email
      );


      alert(
        "Profile updated successfully!"
      );


    } catch (error) {

      console.error(
        "PROFILE UPDATE ERROR:",
        error
      );


      alert(
        error.message ||
        "Unable to update profile."
      );


    } finally {

      setSaving(false);

    }

  };


  // ==================================================
  // CANCEL EDIT
  // ==================================================

  const handleCancel = () => {

    setProfile(originalProfile);

    setEditing(false);

  };


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {

    return (

      <div className="my-profile-page">

        <div className="profile-loading">
          Loading profile...
        </div>

      </div>

    );

  }


  // ==================================================
  // PAGE
  // ==================================================

  return (

    <div className="my-profile-page">


      {/* HEADER */}

      <header className="profile-header">

        <div className="profile-header-logo">

          <h2>
            CEMTrack
          </h2>

          <span>
            My Profile
          </span>

        </div>


        <div className="profile-header-actions">

          <Link to="/customer-products">
            🛍️ Products
          </Link>

          <Link to="/cart">
            🛒 Cart
          </Link>

          <Link to="/my-orders">
            📦 Orders
          </Link>

          <Link to="/customer-home">
            🏠 Home
          </Link>

        </div>

      </header>


      {/* MAIN */}

      <main className="profile-main">


        <div className="profile-page-title">

          <h1>
            👤 My Profile
          </h1>

        </div>


        {/* PROFILE CARD */}

        <div className="profile-card">


          <div className="profile-avatar">
            👤
          </div>


          <div className="profile-customer-name">

            <h2>
              {profile.name || "Customer"}
            </h2>

            <p>
              CEMTrack Customer
            </p>

          </div>


          {/* FORM */}

          <div className="profile-form">


            {/* FULL NAME */}

            <div className="profile-field">

              <label>
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                disabled={!editing}
              />

            </div>


            {/* EMAIL */}

            <div className="profile-field">

              <label>
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                disabled={!editing}
              />

            </div>


            {/* PHONE */}

            <div className="profile-field">

              <label>
                Phone Number
              </label>

              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                disabled={!editing}
              />

            </div>


            {/* ADDRESS */}

            <div className="profile-field">

              <label>
                Address
              </label>

              <textarea
                name="address"
                value={profile.address}
                onChange={handleChange}
                disabled={!editing}
              />

            </div>


            {/* BUTTONS */}

            <div className="profile-buttons">


              {!editing ? (

                <button
                  type="button"
                  className="edit-profile-btn"
                  onClick={() =>
                    setEditing(true)
                  }
                >
                  ✏️ Edit Profile
                </button>

              ) : (

                <>

                  <button
                    type="button"
                    className="save-profile-btn"
                    onClick={handleSave}
                    disabled={saving}
                  >

                    {saving
                      ? "Saving..."
                      : "💾 Save Profile"}

                  </button>


                  <button
                    type="button"
                    className="cancel-profile-btn"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                </>

              )}

            </div>

          </div>

        </div>


        {/* BACK */}

        <div className="profile-back">

          <Link to="/customer-home">
            ← Back to Customer Home
          </Link>

        </div>


      </main>

    </div>

  );

}

export default MyProfile;