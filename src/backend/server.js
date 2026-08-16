import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js";

dotenv.config();

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

    // Check that both fields were entered
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find customer using email
    const [rows] = await db.query(
      "SELECT customer_id, customer_name, email, password FROM customer WHERE email = ?",
      [email]
    );

    // Email does not exist
    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const customer = rows[0];

    // Check password
    if (customer.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Customer login successful
    res.json({
      success: true,
      message: "Login successful",
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

    // Check that both fields were entered
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find owner/admin using email
    const [rows] = await db.query(
      "SELECT owner_id, owner_name, email, password FROM owner WHERE email = ?",
      [email]
    );

    // Email does not exist
    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const owner = rows[0];

    // Check password
    if (owner.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Admin login successful
    res.json({
      success: true,
      message: "Admin login successful",
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
// START SERVER
// ==================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});