import db from "../db.js";
// ==========================================
// CUSTOMER VALIDATION
// ==========================================

const isValidCustomerName = (value) => {
  return (
    typeof value === "string" &&
    /^[A-Za-z\s]+$/.test(value.trim())
  );
};

const isValidEmail = (value) => {
  return (
    typeof value === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
  );
};

const isValidPassword = (value) => {
  return (
    typeof value === "string" &&
    value.length >= 8 &&
    /[A-Z]/.test(value) &&
    /[a-z]/.test(value) &&
    /[0-9]/.test(value) &&
    /[^A-Za-z0-9]/.test(value)
  );
};

const isValidPhone = (value) => {
  return /^\d{10}$/.test(String(value));
};

const isValidAddress = (value) => {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
};

// ==========================================
// GET ALL CUSTOMERS
// ==========================================

export const getCustomers = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT
        c.customer_id AS id,
        c.customer_name AS name,
        c.phone_no AS phone,
        c.email,
        c.address,

        COUNT(o.order_id) AS orders,

        CASE
          WHEN COUNT(o.order_id) > 0
          THEN 'Active'
          ELSE 'Inactive'
        END AS status

      FROM customer c

      LEFT JOIN orders o
        ON c.customer_id = o.customer_id

      GROUP BY
        c.customer_id,
        c.customer_name,
        c.phone_no,
        c.email,
        c.address

      ORDER BY c.customer_id DESC
    `);

    res.json({
      success: true,
      customers: rows
    });

  } catch (error) {

    console.error("Get customers error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch customers"
    });

  }
};


// ==========================================
// GET CUSTOMER BY ID
// ==========================================

export const getCustomerById = async (req, res) => {

  try {

    const { id } = req.params;

    const [rows] = await db.query(`
      SELECT
        c.customer_id AS id,
        c.customer_name AS name,
        c.phone_no AS phone,
        c.email,
        c.address,

        COUNT(o.order_id) AS orders,

        CASE
          WHEN COUNT(o.order_id) > 0
          THEN 'Active'
          ELSE 'Inactive'
        END AS status

      FROM customer c

      LEFT JOIN orders o
        ON c.customer_id = o.customer_id

      WHERE c.customer_id = ?

      GROUP BY
        c.customer_id,
        c.customer_name,
        c.phone_no,
        c.email,
        c.address
    `, [id]);

    if (rows.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });

    }

    res.json({
      success: true,
      customer: rows[0]
    });

  } catch (error) {

    console.error("Get customer error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch customer"
    });

  }

};


// ==========================================
// ADD CUSTOMER
// ==========================================

export const addCustomer = async (req, res) => {

  try {

    const {
      customer_name,
      email,
      password,
      phone_no,
      address
    } = req.body;

    if (
      !customer_name ||
      !email ||
      !password ||
      !phone_no ||
      !address
    ) {

      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });

    }
    // ==========================================
// VALIDATE CUSTOMER NAME
// ==========================================

if (!isValidCustomerName(customer_name)) {

  return res.status(400).json({
    success: false,
    message:
      "Please enter a valid customer name. Numbers are not allowed."
  });

}


// ==========================================
// VALIDATE EMAIL
// ==========================================

if (!isValidEmail(email)) {

  return res.status(400).json({
    success: false,
    message:
      "Please enter a valid email address."
  });

}


// ==========================================
// VALIDATE PASSWORD
// ==========================================

if (!isValidPassword(password)) {

  return res.status(400).json({
    success: false,
    message:
      "Password must be at least 8 characters and contain uppercase, lowercase, number and special character."
  });

}


// ==========================================
// VALIDATE PHONE NUMBER
// ==========================================

if (!isValidPhone(phone_no)) {

  return res.status(400).json({
    success: false,
    message:
      "Please enter a valid 10-digit phone number."
  });

}


// ==========================================
// VALIDATE ADDRESS
// ==========================================

if (!isValidAddress(address)) {

  return res.status(400).json({
    success: false,
    message:
      "Address is required."
  });

}

    const [existing] = await db.query(
      "SELECT customer_id FROM customer WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {

      return res.status(409).json({
        success: false,
        message: "Customer with this email already exists"
      });

    }

    const [result] = await db.query(
      `
      INSERT INTO customer
      (
        customer_name,
        email,
        password,
        phone_no,
        address
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        customer_name,
        email,
        password,
        phone_no,
        address
      ]
    );

    res.status(201).json({
      success: true,
      message: "Customer added successfully",
      customer_id: result.insertId
    });

  } catch (error) {

    console.error("Add customer error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add customer"
    });

  }

};


// ==========================================
// UPDATE CUSTOMER
// ==========================================

export const updateCustomer = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      customer_name,
      email,
      phone_no,
      address
    } = req.body;

    if (
      !customer_name ||
      !email ||
      !phone_no ||
      !address
    ) {

      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });

    }

    const [result] = await db.query(
      `
      UPDATE customer

      SET
        customer_name = ?,
        email = ?,
        phone_no = ?,
        address = ?

      WHERE customer_id = ?
      `,
      [
        customer_name,
        email,
        phone_no,
        address,
        id
      ]
    );

    if (result.affectedRows === 0) {

      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });

    }

    res.json({
      success: true,
      message: "Customer updated successfully"
    });

  } catch (error) {

    console.error("Update customer error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update customer"
    });

  }

};


// ==========================================
// DELETE CUSTOMER
// ==========================================

export const deleteCustomer = async (req, res) => {

  try {

    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM customer WHERE customer_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {

      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });

    }

    res.json({
      success: true,
      message: "Customer deleted successfully"
    });

  } catch (error) {

    console.error("Delete customer error:", error);

    res.status(500).json({
      success: false,
      message:
        "Customer cannot be deleted because orders or payments are linked to this customer"
    });

  }

};