import React, { useState } from "react";
import "./Customers.css";

function Customers() {

  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      phone: "9876543210",
      email: "rahul@gmail.com",
      address: "Bangalore",
      orders: 12,
      status: "Active",
    },
    {
      id: 2,
      name: "Priya Singh",
      phone: "9876501234",
      email: "priya@gmail.com",
      address: "Mysore",
      orders: 8,
      status: "Active",
    },
    {
      id: 3,
      name: "Arjun Kumar",
      phone: "9988776655",
      email: "arjun@gmail.com",
      address: "Tumkur",
      orders: 4,
      status: "Inactive",
    },
    {
      id: 4,
      name: "Sneha Patel",
      phone: "9123456789",
      email: "sneha@gmail.com",
      address: "Hubli",
      orders: 10,
      status: "Active",
    },
    {
      id: 5,
      name: "Ramesh Gowda",
      phone: "9012345678",
      email: "ramesh@gmail.com",
      address: "Mandya",
      orders: 2,
      status: "Inactive",
    },
  ]);

  // Form States
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("Active");
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  // Dashboard Values
  const totalCustomers = customers.length;

  const activeCustomers = customers.filter(
    (customer) => customer.status === "Active"
  ).length;

  const inactiveCustomers = customers.filter(
    (customer) => customer.status === "Inactive"
  ).length;

  const totalOrders = customers.reduce(
    (sum, customer) => sum + customer.orders,
    0
  );

  // Search Filter
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(search.toLowerCase())
  );

  // Add Customer
  const addCustomer = () => {

    if (
      name === "" ||
      phone === "" ||
      email === "" ||
      address === ""
    ) {
      alert("Please fill all details");
      return;
    }

    const newCustomer = {
      id:
        customers.length > 0
          ? Math.max(...customers.map((c) => c.id)) + 1
          : 1,

      name,
      phone,
      email,
      address,
      orders: 0,
      status,
    };

    setCustomers([...customers, newCustomer]);

    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setStatus("Active");
  };

  // Edit Customer
  const editCustomer = (customer) => {
    setEditingId(customer.id);
    setName(customer.name);
    setPhone(customer.phone);
    setEmail(customer.email);
    setAddress(customer.address);
    setStatus(customer.status);
  };

  // Update Customer
  const updateCustomer = () => {

    setCustomers(
      customers.map((customer) =>
        customer.id === editingId
          ? {
              ...customer,
              name,
              phone,
              email,
              address,
              status,
            }
          : customer
      )
    );

    setEditingId(null);

    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setStatus("Active");
  };

  // Delete Customer
  const deleteCustomer = (id) => {
    setCustomers(
      customers.filter((customer) => customer.id !== id)
    );
  };
    return (
    <div className="customers-container">

      <h1>Customer Management</h1>

      {/* Dashboard Cards */}

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

      {/* Customer Form */}

      <div className="customer-form">

        <input
          type="text"
          placeholder="Customer Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>Active</option>
          <option>Inactive</option>
        </select>

        {editingId ? (
          <button
            className="add-btn"
            onClick={updateCustomer}
          >
            Update Customer
          </button>
        ) : (
          <button
            className="add-btn"
            onClick={addCustomer}
          >
            + Add Customer
          </button>
        )}

      </div>

      {/* Search */}

      <div className="top-bar">

        <input
          type="text"
          className="search-box"
          placeholder="Search Customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      {/* Customer Table */}

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
            <th>Actions</th>
          </tr>

        </thead>

        <tbody>

          {filteredCustomers.map((customer) => (

            <tr key={customer.id}>

              <td>{customer.id}</td>

              <td>{customer.name}</td>

              <td>{customer.phone}</td>

              <td>{customer.email}</td>

              <td>{customer.address}</td>

              <td>{customer.orders}</td>

              <td>

                <span
                  className={
                    customer.status === "Active"
                      ? "active"
                      : "inactive"
                  }
                >
                  {customer.status}
                </span>

              </td>

              <td>

                <button
                  className="edit-btn"
                  onClick={() => editCustomer(customer)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteCustomer(customer.id)}
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}
                  </tbody>

      </table>

    </div>
  );
}

export default Customers;