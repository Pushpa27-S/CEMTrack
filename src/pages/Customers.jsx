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

  const [search, setSearch] = useState("");

  // Dashboard Counts
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

  // Search
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(search.toLowerCase())
  );

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
            <th>Action</th>
          </tr>

        </thead>

        <tbody>          {filteredCustomers.length > 0 ? (

            filteredCustomers.map((customer) => (

              <tr key={customer.id}>

                <td>{customer.id}</td>

                <td>{customer.name}</td>

                <td>{customer.phone}</td>

                <td>{customer.email}</td>

                <td>{customer.address}</td>

                <td>{customer.orders}</td>

                <td>

                  {customer.status === "Active" ? (
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
                    className="delete-btn"
                    onClick={() => deleteCustomer(customer.id)}
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))

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
                No Customers Found
              </td>

            </tr>

          )}

        </tbody>

      </table>

    </div>
  );
}

export default Customers;