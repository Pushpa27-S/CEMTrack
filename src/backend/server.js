import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js";
import jwt from "jsonwebtoken";
import authenticateToken from "./middleware/authMiddleware.js";

dotenv.config();
console.log("JWT_SECRET loaded:", !!process.env.JWT_SECRET);

const app = express();

app.use(cors());
app.use(express.json());


// ==================================================
// HOME / SERVER TEST
// ==================================================

app.get("/", (req, res) => {
  res.json({
    message: "CEMTrack backend is running",
  });
});


// ==================================================
// DATABASE CONNECTION TEST
// ==================================================

app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS connected");

    res.json({
      message: "Database connected successfully",
      result: rows,
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      message: "Database connection failed",
      error: error.message,
    });
  }
});


// ==================================================
// CUSTOMER LOGIN
// ==================================================

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const [rows] = await db.query(
      "SELECT customer_id, customer_name, email, password FROM customer WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const customer = rows[0];

    if (customer.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        customer_id: customer.customer_id,
        role: "customer",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    res.json({
      success: true,
      message: "Login successful",
      token: token,
      customer: {
        customer_id: customer.customer_id,
        customer_name: customer.customer_name,
        email: customer.email,
      },
    });
  } catch (error) {
    console.error("Customer login error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


// ==================================================
// ADMIN / OWNER LOGIN
// ==================================================

app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const [rows] = await db.query(
      "SELECT owner_id, owner_name, email, password FROM owner WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const owner = rows[0];

    if (owner.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        owner_id: owner.owner_id,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    res.json({
      success: true,
      message: "Admin login successful",
      token: token,
      owner: {
        owner_id: owner.owner_id,
        owner_name: owner.owner_name,
        email: owner.email,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


// ==================================================
// CUSTOMER REGISTRATION
// ==================================================

app.post("/api/register", async (req, res) => {
  try {
    const {
      customer_name,
      email,
      password,
      phone_no,
      address,
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
        message: "All fields are required",
      });
    }

    const [existingCustomer] = await db.query(
      "SELECT customer_id FROM customer WHERE email = ?",
      [email]
    );

    if (existingCustomer.length > 0) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const [result] = await db.query(
      `INSERT INTO customer
      (customer_name, email, password, phone_no, Address)
      VALUES (?, ?, ?, ?, ?)`,
      [
        customer_name,
        email,
        password,
        phone_no,
        address,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Customer registered successfully",
      customer_id: result.insertId,
    });
  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
});


// ==================================================
// CUSTOMER AUTHORIZATION MIDDLEWARE
// ==================================================

const requireCustomer = (req, res, next) => {
  if (!req.user || req.user.role !== "customer") {
    return res.status(403).json({
      success: false,
      message: "Customer access required",
    });
  }

  next();
};


// ==================================================
// ADMIN AUTHORIZATION MIDDLEWARE
// ==================================================

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
};


// ==================================================
// TEST CUSTOMER PROTECTED ROUTE
// ==================================================

app.get(
  "/api/customer/protected",
  authenticateToken,
  requireCustomer,
  (req, res) => {
    res.json({
      success: true,
      message: "Customer authorization successful",
      user: req.user,
    });
  }
);


// ==================================================
// TEST ADMIN PROTECTED ROUTE
// ==================================================

app.get(
  "/api/admin/protected",
  authenticateToken,
  requireAdmin,
  (req, res) => {
    res.json({
      success: true,
      message: "Admin authorization successful",
      user: req.user,
    });
  }
);


// ==================================================
// START SERVER
// ==================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});