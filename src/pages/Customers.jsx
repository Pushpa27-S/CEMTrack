import React, { useEffect, useState } from "react";
import "./Customers.css";

const API_URL = "http://localhost:5000/api/admin/customers";

function Customers() {
  // ==============================
  // STATES
  // ==============================

  const [customers, setCustomers] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  // Add customer form
  const [showAddForm, setShowAddForm] = useState(false);

  const [newCustomer, setNewCustomer] = useState({
    customer_name: "",
    email: "",
    password: "",
    phone_no: "",
    address: "",
  });

  // Edit customer
  const [showEditForm, setShowEditForm] = useState(false);

  const [editCustomer, setEditCustomer] = useState({
    id: "",
    customer_name: "",
    email: "",
    phone_no: "",
    address: "",
  });

  // ==============================
  // GET CUSTOMERS
  // ==============================

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch customers");
      }

      setCustomers(data.customers || []);
    } catch (err) {
      console.error("Fetch customers error:", err);
      setError(
        err.message ||
          "Unable to connect to the customer server"
      );
    } finally {
      setLoading(false);
    }
  };

  // Load customers when page opens
  useEffect(() => {
    fetchCustomers();
  }, []);

  // ==============================
  // ADD CUSTOMER
  // ==============================

  const handleAddChange = (e) => {
    const { name, value } = e.target;

    setNewCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addCustomer = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(newCustomer),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add customer"
        );
      }

      setMessage("Customer added successfully");

      setNewCustomer({
        customer_name: "",
        email: "",
        password: "",
        phone_no: "",
        address: "",
      });

      setShowAddForm(false);

      // Get latest data from MySQL
      fetchCustomers();
    } catch (err) {
      console.error("Add customer error:", err);

      setError(
        err.message || "Failed to add customer"
      );
    }
  };

  // ==============================
  // OPEN EDIT FORM
  // ==============================

  const openEditForm = (customer) => {
    setEditCustomer({
      id: customer.id,
      customer_name: customer.name || "",
      email: customer.email || "",
      phone_no: customer.phone || "",
      address: customer.address || "",
    });

    setShowEditForm(true);

    setMessage("");
    setError("");
  };

  // ==============================
  // EDIT CUSTOMER
  // ==============================

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateCustomer = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/${editCustomer.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            customer_name: editCustomer.customer_name,
            email: editCustomer.email,
            phone_no: editCustomer.phone_no,
            address: editCustomer.address,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update customer"
        );
      }

      setMessage("Customer updated successfully");

      setShowEditForm(false);

      // Get latest data from MySQL
      fetchCustomers();
    } catch (err) {
      console.error("Update customer error:", err);

      setError(
        err.message || "Failed to update customer"
      );
    }
  };

  // ==============================
  // DELETE CUSTOMER
  // ==============================

  const deleteCustomer = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmDelete) {
      return;
    }

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete customer"
        );
      }

      setMessage("Customer deleted successfully");

      // Get latest data from MySQL
      fetchCustomers();
    } catch (err) {
      console.error("Delete customer error:", err);

      setError(
        err.message ||
          "Customer could not be deleted"
      );
    }
  };

  // ==============================
  // SEARCH
  // ==============================

const filteredCustomers = customers.filter((customer) => {

  const searchText = search.toLowerCase();

  const id = String(customer.id || "")
    .toLowerCase();

  const name = String(customer.name || "")
    .toLowerCase();

  const phone = String(customer.phone || "")
    .toLowerCase();

  const email = String(customer.email || "")
    .toLowerCase();

  const address = String(customer.address || "")
    .toLowerCase();

  return (
    id.includes(searchText) ||
    name.includes(searchText) ||
    phone.includes(searchText) ||
    email.includes(searchText) ||
    address.includes(searchText)
  );

});

  // ==============================
  // DASHBOARD COUNTS
  // ==============================

  const totalCustomers = customers.length;

  const activeCustomers = customers.filter(
    (customer) => customer.status === "Active"
  ).length;

  const inactiveCustomers = customers.filter(
    (customer) => customer.status === "Inactive"
  ).length;

  const totalOrders = customers.reduce(
    (sum, customer) =>
      sum + Number(customer.orders || 0),
    0
  );

  // ==============================
  // JSX
  // ==============================

  return (
    <div className="customers-container">

      <h1>Customer Management</h1>

      {/* ==========================
          SUCCESS MESSAGE
      =========================== */}

      {message && (
        <div
          style={{
            backgroundColor: "#d4edda",
            color: "#155724",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "5px",
          }}
        >
          {message}
        </div>
      )}

      {/* ==========================
          ERROR MESSAGE
      =========================== */}

      {error && (
        <div
          style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "5px",
          }}
        >
          {error}
        </div>
      )}

      {/* ==========================
          DASHBOARD CARDS
      =========================== */}

      <div className="stats">

        <div className="card">
          <h3>Total Customers</h3>
          <p>{totalCustomers}</p>
        </div>

        <div className="card">
          <h3>Active Customers</h3>
          <p>{activeCustomers}</p>
        </div>

        <div className="card">
          <h3>Inactive Customers</h3>
          <p>{inactiveCustomers}</p>
        </div>

        <div className="card">
          <h3>Total Orders</h3>
          <p>{totalOrders}</p>
        </div>

      </div>

      {/* ==========================
          TOP BAR
      =========================== */}

      <div
        className="top-bar"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >

        <input
          type="text"
          className="search-box"
          placeholder="Search Customer..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <button
          type="button"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setMessage("");
            setError("");
          }}
        >
          {showAddForm
            ? "Close"
            : "+ Add Customer"}
        </button>

      </div>

      {/* ==========================
          ADD CUSTOMER FORM
      =========================== */}

      {showAddForm && (
        <form
          onSubmit={addCustomer}
          style={{
            padding: "20px",
            marginBottom: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >

          <h2>Add Customer</h2>

          <input
            type="text"
            name="customer_name"
            placeholder="Customer Name"
            value={newCustomer.customer_name}
            onChange={handleAddChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newCustomer.email}
            onChange={handleAddChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={newCustomer.password}
            onChange={handleAddChange}
            required
          />

          <input
            type="text"
            name="phone_no"
            placeholder="Phone Number"
            value={newCustomer.phone_no}
            onChange={handleAddChange}
            required
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={newCustomer.address}
            onChange={handleAddChange}
            required
          />

          <button type="submit">
            Add Customer
          </button>

        </form>
      )}

      {/* ==========================
          EDIT CUSTOMER FORM
      =========================== */}

      {showEditForm && (
        <form
          onSubmit={updateCustomer}
          style={{
            padding: "20px",
            marginBottom: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >

          <h2>Edit Customer</h2>

          <input
            type="text"
            name="customer_name"
            placeholder="Customer Name"
            value={editCustomer.customer_name}
            onChange={handleEditChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={editCustomer.email}
            onChange={handleEditChange}
            required
          />

          <input
            type="text"
            name="phone_no"
            placeholder="Phone Number"
            value={editCustomer.phone_no}
            onChange={handleEditChange}
            required
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={editCustomer.address}
            onChange={handleEditChange}
            required
          />

          <button type="submit">
            Update Customer
          </button>

          <button
            type="button"
            onClick={() =>
              setShowEditForm(false)
            }
          >
            Cancel
          </button>

        </form>
      )}

      {/* ==========================
          CUSTOMER TABLE
      =========================== */}

      {loading ? (
        <p>Loading customers...</p>
      ) : (

        <table>

          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
              <th>Orders</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {filteredCustomers.length > 0 ? (

              filteredCustomers.map(
                (customer) => (

                  <tr key={customer.id}>

                    <td>
                      {customer.id}
                    </td>

                    <td>
                      {customer.name}
                    </td>

                    <td>
                      {customer.phone}
                    </td>

                    <td>
                      {customer.email}
                    </td>

                    <td>
                      {customer.address}
                    </td>

                    <td>
                      {customer.orders}
                    </td>

                    <td>

                      {customer.status ===
                      "Active" ? (

                        <span className="active">
                          Active
                        </span>

                      ) : (

                        <span className="inactive">
                          Inactive
                        </span>

                      )}

                    </td>

                    <td>

                      <button
                        type="button"
                        className="edit-btn"
                        onClick={() =>
                          openEditForm(customer)
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() =>
                          deleteCustomer(
                            customer.id
                          )
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                )
              )

            ) : (

              <tr>

                <td
                  colSpan="8"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    fontWeight: "bold",
                  }}
                >
                  {search
                    ? "No Customers Found"
                    : "No customers available"}
                </td>

              </tr>

            )}

          </tbody>

        </table>

      )}

    </div>
  );
}

export default Customers;