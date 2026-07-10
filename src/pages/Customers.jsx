import React from "react";
import "./Customers.css";

function Customers() {

  const customers = [
    {
      id: 1,
      name: "Rahul Sharma",
      phone: "9876543210",
      email: "rahul@gmail.com",
      address: "Bangalore",
      orders: 12,
      status: "Active"
    },
    {
      id: 2,
      name: "Priya Singh",
      phone: "9876501234",
      email: "priya@gmail.com",
      address: "Mysore",
      orders: 8,
      status: "Active"
    },
    {
      id: 3,
      name: "Arjun Kumar",
      phone: "9988776655",
      email: "arjun@gmail.com",
      address: "Tumkur",
      orders: 4,
      status: "Inactive"
    },
    {
      id: 4,
      name: "Sneha Patel",
      phone: "9123456789",
      email: "sneha@gmail.com",
      address: "Hubli",
      orders: 10,
      status: "Active"
    },
    {
      id: 5,
      name: "Ramesh Gowda",
      phone: "9012345678",
      email: "ramesh@gmail.com",
      address: "Mandya",
      orders: 2,
      status: "Inactive"
    }
  ];

  return (
    <div className="customers-container">

      <h1>Customers Management</h1>

      {/* Cards */}

      <div className="stats">

        <div className="card">
          <h3>Total Customers</h3>
          <p>5</p>
        </div>

        <div className="card">
          <h3>Active</h3>
          <p>3</p>
        </div>

        <div className="card">
          <h3>Inactive</h3>
          <p>2</p>
        </div>

        <div className="card">
          <h3>Total Orders</h3>
          <p>36</p>
        </div>

      </div>

      {/* Search */}

      <div className="top-bar">

        <input
          type="text"
          placeholder="Search Customer..."
          className="search-box"
        />

        <button className="add-btn">
          + Add Customer
        </button>

      </div>

      {/* Table */}

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

          {customers.map((customer) => (

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

                <button className="edit-btn">
                  Edit
                </button>

                <button className="delete-btn">
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