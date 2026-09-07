import express from "express";
console.log("PAYMENT ROUTE VERSION LOADED");
console.log("THIS IS THE PAYMENT CODE WE ARE RUNNING");
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
    success: true,
    message: "CEMTrack backend is running"
  });
});


// ==================================================
// DATABASE CONNECTION TEST
// ==================================================

app.get("/api/test-db", async (req, res) => {
  try {

    const [rows] = await db.query(
      "SELECT 1 AS connected"
    );

    res.json({
      success: true,
      message: "Database connected successfully",
      result: rows
    });

  } catch (error) {

    console.error("Database connection error:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message
    });
  }
});


// ==================================================
// CUSTOMER LOGIN
// ==================================================
console.log("PAYMENT API REGISTERED");
app.post("/api/login", async (req, res) => {
  try {

<<<<<<< Updated upstream
=======
    const {
      email,
      password
    } = req.body;

>>>>>>> Stashed changes
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const [rows] = await db.query(
      `SELECT
        customer_id,
        customer_name,
        email,
        password
       FROM customer
       WHERE email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const customer = rows[0];

    if (customer.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

<<<<<<< Updated upstream
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
=======
    res.json({
      success: true,
      message: "Login successful",

>>>>>>> Stashed changes
      customer: {
        customer_id: customer.customer_id,
        customer_name: customer.customer_name,
        email: customer.email
      }
    });
  } catch (error) {

    console.error("Customer login error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});


// ==================================================
// ADMIN LOGIN
// ==================================================

app.post("/api/admin/login", async (req, res) => {
  try {

<<<<<<< Updated upstream
=======
    const {
      email,
      password
    } = req.body;

>>>>>>> Stashed changes
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const [rows] = await db.query(
      `SELECT
        owner_id,
        owner_name,
        email,
        password
       FROM owner
       WHERE email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const owner = rows[0];

    if (owner.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

<<<<<<< Updated upstream
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
=======
    res.json({
      success: true,
      message: "Admin login successful",

>>>>>>> Stashed changes
      owner: {
        owner_id: owner.owner_id,
        owner_name: owner.owner_name,
        email: owner.email
      }
    });
  } catch (error) {

    console.error("Admin login error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});


// ==================================================
// CUSTOMER REGISTRATION
<<<<<<< Updated upstream
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
=======
// ==================================================

app.post("/api/register", async (req, res) => {

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

    const [existingCustomer] =
      await db.query(
        `SELECT customer_id
         FROM customer
         WHERE email = ?`,
        [email]
      );

    if (existingCustomer.length > 0) {

      return res.status(409).json({
        success: false,
        message: "An account with this email already exists"
      });
    }

    const [result] =
      await db.query(
        `INSERT INTO customer
        (
          customer_name,
          email,
          password,
          phone_no,
          address
        )
        VALUES (?, ?, ?, ?, ?)`,
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

      message: "Customer registered successfully",

      customer_id: result.insertId

    });

  } catch (error) {

    console.error("Registration error:", error);

    res.status(500).json({

      success: false,

      message: "Registration failed",

      error: error.message

    });
  }
});


// ==================================================
// GET ALL PRODUCTS
// ==================================================

app.get("/api/products", async (req, res) => {

  try {

    const [rows] =
      await db.query(
        `SELECT
          product_id,
          product_name,
          brand,
          category,
          price,
          stock_quantity,
          minimum_stock,
          last_updated
         FROM products
         ORDER BY product_id`
      );

    res.json({
      success: true,
      products: rows
    });

  } catch (error) {

    console.error("Get products error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message
    });
  }
});


// ==================================================
// GET SINGLE PRODUCT
// ==================================================

app.get("/api/products/:productId", async (req, res) => {

  try {

    const { productId } = req.params;

    const [rows] =
      await db.query(
        `SELECT
          product_id,
          product_name,
          brand,
          category,
          price,
          stock_quantity,
          minimum_stock,
          last_updated
         FROM products
         WHERE product_id = ?`,
        [productId]
      );

    if (rows.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      product: rows[0]
    });

  } catch (error) {

    console.error("Get product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message
    });
  }
});


// ==================================================
// CHECK PRODUCT STOCK
// ==================================================

app.get("/api/products/:productId/stock", async (req, res) => {

  try {

    const { productId } = req.params;

    const [rows] =
      await db.query(
        `SELECT
          product_id,
          product_name,
          stock_quantity,
          price
         FROM products
         WHERE product_id = ?`,
        [productId]
      );

    if (rows.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      product: rows[0]
    });

  } catch (error) {

    console.error("Stock check error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to check stock",
      error: error.message
    });
  }
});


// ==================================================
// CART - ADD PRODUCT
// ==================================================

app.post("/api/cart", async (req, res) => {

  try {

    const {
      customer_id,
      product_id,
      quantity
    } = req.body;

    if (!customer_id || !product_id) {

      return res.status(400).json({
        success: false,
        message: "customer_id and product_id are required"
      });
    }

    const qty = Number(quantity) || 1;

    if (qty < 1) {

      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1"
      });
    }

    const [products] = await db.query(
      `SELECT
        product_id,
        product_name,
        price,
        stock_quantity
       FROM products
       WHERE product_id = ?`,
      [product_id]
    );

    if (products.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const product = products[0];

    if (qty > Number(product.stock_quantity)) {

      return res.status(400).json({
        success: false,
        message:
          `Only ${product.stock_quantity} bags are available`
      });
    }

    const [existing] = await db.query(
      `SELECT *
       FROM cart
       WHERE customer_id = ?
       AND product_id = ?`,
      [customer_id, product_id]
    );

    if (existing.length > 0) {

      const newQuantity =
        Number(existing[0].quantity) + qty;

      if (
        newQuantity >
        Number(product.stock_quantity)
      ) {

        return res.status(400).json({
          success: false,
          message:
            `Only ${product.stock_quantity} bags are available`
        });
      }

      await db.query(
        `UPDATE cart
         SET quantity = ?
         WHERE cart_id = ?`,
        [
          newQuantity,
          existing[0].cart_id
        ]
      );

      return res.json({
        success: true,
        message: "Cart quantity updated",
        cart_id: existing[0].cart_id,
        quantity: newQuantity
      });
    }

    const [result] = await db.query(
      `INSERT INTO cart
       (customer_id, product_id, quantity)
       VALUES (?, ?, ?)`,
      [
        customer_id,
        product_id,
        qty
      ]
    );

    res.status(201).json({
      success: true,
      message: "Product added to cart",
      cart_id: result.insertId,
      quantity: qty
    });

  } catch (error) {

    console.error("Add to cart error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
      error: error.message
    });
  }
});


// ==================================================
// CART - VIEW CUSTOMER CART
// ==================================================

app.get("/api/cart/:customerId", async (req, res) => {

  try {

    const { customerId } = req.params;

    const [rows] = await db.query(
      `SELECT
        c.cart_id,
        c.customer_id,
        c.product_id,
        p.product_name,
        p.brand,
        p.category,
        p.price,
        p.stock_quantity,
        c.quantity,
        (p.price * c.quantity) AS item_total
       FROM cart c
       INNER JOIN products p
         ON c.product_id = p.product_id
       WHERE c.customer_id = ?`,
      [customerId]
    );

    const total = rows.reduce(
      (sum, item) =>
        sum + Number(item.item_total),
      0
    );

    res.json({
      success: true,
      cart: rows,
      total: total.toFixed(2)
    });

  } catch (error) {

    console.error("Get cart error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
      error: error.message
    });
  }
});


// ==================================================
// CART - CHANGE QUANTITY
// ==================================================

app.put("/api/cart/:cartId", async (req, res) => {

  try {

    const { cartId } = req.params;
    const { quantity } = req.body;

    const qty = Number(quantity);

    if (!Number.isInteger(qty) || qty < 1) {

      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1"
      });
    }

    const [items] = await db.query(
      `SELECT
        c.cart_id,
        p.stock_quantity
       FROM cart c
       INNER JOIN products p
         ON c.product_id = p.product_id
       WHERE c.cart_id = ?`,
      [cartId]
    );

    if (items.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Cart item not found"
      });
    }

    if (
      qty >
      Number(items[0].stock_quantity)
    ) {

      return res.status(400).json({
        success: false,
        message:
          `Only ${items[0].stock_quantity} bags are available`
      });
    }

    await db.query(
      `UPDATE cart
       SET quantity = ?
       WHERE cart_id = ?`,
      [qty, cartId]
    );

    res.json({
      success: true,
      message: "Cart quantity updated",
      quantity: qty
    });

  } catch (error) {

    console.error("Update cart error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update cart",
      error: error.message
    });
  }
});


// ==================================================
// CART - REMOVE PRODUCT
// ==================================================

app.delete("/api/cart/:cartId", async (req, res) => {

  try {

    const { cartId } = req.params;

    const [result] = await db.query(
      `DELETE FROM cart
       WHERE cart_id = ?`,
      [cartId]
    );

    if (result.affectedRows === 0) {

      return res.status(404).json({
        success: false,
        message: "Cart item not found"
      });
    }

    res.json({
      success: true,
      message: "Product removed from cart"
    });

  } catch (error) {

    console.error("Remove cart error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to remove product",
      error: error.message
    });
  }
});


// ==================================================
// CREATE ORDER
// ==================================================

app.post("/api/orders", async (req, res) => {

  const connection = await db.getConnection();

  try {

    const {
      customer_id,
      product_id,
      quantity
    } = req.body;

    console.log("ORDER DATA RECEIVED:",req.body);

    if (
      !customer_id ||
      !product_id ||
      !quantity
    ) {

      return res.status(400).json({
        success: false,
        message:
          "customer_id, product_id and quantity are required"
      });
    }

    const itemQuantity = Number(quantity);

    if (
      !Number.isInteger(itemQuantity) ||
      itemQuantity <= 0
    ) {

      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than zero"
      });
    }

    await connection.beginTransaction();

    const [products] =
      await connection.query(
        `SELECT
          product_id,
          product_name,
          price,
          stock_quantity
         FROM products
         WHERE product_id = ?
         FOR UPDATE`,
        [product_id]
      );

    if (products.length === 0) {

      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const product = products[0];

    if (
      Number(product.stock_quantity) <
      itemQuantity
    ) {

      await connection.rollback();

      return res.status(400).json({
        success: false,
        message:
          `Only ${product.stock_quantity} bags are available`
      });
    }

    const unitPrice = Number(product.price);

    const GST = Number(
      (
        unitPrice *
        itemQuantity *
        0.18
      ).toFixed(2)
    );

    const discount = 0;

    const totalAmount = Number(
      (
        unitPrice *
        itemQuantity +
        GST -
        discount
      ).toFixed(2)
    );

    const [orderResult] =
      await connection.query(
        `INSERT INTO orders
        (
          customer_id,
          product_id,
          quantity,
          unit_price,
          GST,
          discount,
          total_amount,
          order_date,
          delivery_status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
        [
          customer_id,
          product_id,
          itemQuantity,
          unitPrice,
          GST,
          discount,
          totalAmount,
          "Pending"
        ]
      );

    await connection.query
      
    await connection.commit();

    res.status(201).json({

      success: true,

      message: "Order created successfully",

      order: {
        order_id: orderResult.insertId,
        customer_id: customer_id,
        product_id: product_id,
        quantity: itemQuantity,
        unit_price: unitPrice,
        GST: GST,
        discount: discount,
        total_amount: totalAmount,
        delivery_status: "Pending"
      }

    });

  } catch (error) {

    await connection.rollback();

    console.error("Create order error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message
    });

  } finally {

    connection.release();

  }
});


// ==================================================
// CUSTOMER - VIEW ALL MY ORDERS
// ==================================================

app.get(
  "/api/orders/customer/:customerId",
  async (req, res) => {

    try {

      const { customerId } = req.params;

      const [rows] = await db.query(
        `SELECT
          o.order_id,
          o.customer_id,
          o.product_id,
          p.product_name,
          p.brand,
          p.category,
          o.quantity,
          o.unit_price,
          o.GST,
          o.discount,
          o.total_amount,
          o.order_date,
          o.delivery_status
         FROM orders o
         INNER JOIN products p
           ON o.product_id = p.product_id
         WHERE o.customer_id = ?
         ORDER BY o.order_date DESC`,
        [customerId]
      );

      res.json({
        success: true,
        orders: rows
      });

    } catch (error) {

      console.error(
        "Fetch customer orders error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Failed to fetch customer orders",
        error: error.message
      });
    }
  }
);


// ==================================================
// CUSTOMER - VIEW SINGLE ORDER
// ==================================================

app.get(
  "/api/orders/:orderId",
  async (req, res) => {

    try {

      const { orderId } = req.params;

      const [rows] = await db.query(
        `SELECT
          o.order_id,
          o.customer_id,
          o.product_id,
          p.product_name,
          p.brand,
          p.category,
          o.quantity,
          o.unit_price,
          o.GST,
        o.discount,
        o.total_amount,
        o.order_date,
        o.delivery_status
       FROM orders o
       INNER JOIN products p
         ON o.product_id = p.product_id
       ORDER BY o.order_date DESC`
    );

    res.json({
      success: true,
      orders: rows
    });

  } catch (error) {

    console.error(
      "Fetch all orders error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message
    });
  }
});


// ==================================================
// ADMIN - UPDATE ORDER STATUS
// ==================================================

app.put(
  "/api/orders/:orderId/status",
  async (req, res) => {

    try {

      const { orderId } = req.params;
      const { delivery_status } = req.body;

      if (!delivery_status) {

        return res.status(400).json({
          success: false,
          message: "delivery_status is required"
        });
      }

      const [result] = await db.query(
        `UPDATE orders
         SET delivery_status = ?
         WHERE order_id = ?`,
        [
          delivery_status,
          orderId
        ]
      );

      if (result.affectedRows === 0) {

        return res.status(404).json({
          success: false,
          message: "Order not found"
        });
      }

      res.json({
        success: true,
        message: "Order status updated successfully"
      });

    } catch (error) {

      console.error(
        "Update order status error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Failed to update order status",
        error: error.message
      });
    }
  }
);

// ==================================================
// PAYMENT - CREATE PAYMENT
// ==================================================

app.post("/api/payment", async (req, res) => {
  console.log("PAYMENT ROUTE CALLED");
  const { order_id, customer_id, payment_method } = req.body;

  if (!order_id || !customer_id || !payment_method) {
    return res.status(400).json({
      success: false,
      message: "Missing payment details"
    });
  }

  let connection;

  try {
    connection = await db.getConnection();

    await connection.beginTransaction();

    // Get order details
    const [orders] = await connection.query(
      `SELECT 
          order_id,
          customer_id,
          product_id,
          quantity,
          total_amount,
          delivery_status
       FROM Orders
       WHERE order_id = ? AND customer_id = ?`,
      [order_id, customer_id]
    );

    if (orders.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const order = orders[0];

    // Check whether this order is already paid
    const [existingPayments] = await connection.query(
      `SELECT payment_id
       FROM Payment
       WHERE order_id = ?
       AND payment_status = 'Paid'`,
      [order_id]
    );

    if (existingPayments.length > 0) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "This order has already been paid"
      });
    }

    // Get current product stock
    const [products] = await connection.query(
      `SELECT product_id, product_name, stock_quantity
       FROM Products
       WHERE product_id = ?
       FOR UPDATE`,
      [order.product_id]
    );

    if (products.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const product = products[0];

    // Check stock before successful payment
    if (Number(product.stock_quantity) < Number(order.quantity)) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available stock: ${product.stock_quantity}`
      });
    }

    const amount = Number(order.total_amount);
    const payment_status = "Paid";

    // Record payment
    const [paymentResult] = await connection.query(
      `INSERT INTO Payment
       (order_id, customer_id, amount, payment_method, payment_status)
       VALUES (?, ?, ?, ?, ?)`,
      [
        order_id,
        customer_id,
        amount,
        payment_method,
        payment_status
      ]
    );

    // Reduce stock ONLY after payment is successfully recorded
    await connection.query(
      `UPDATE Products
       SET stock_quantity = stock_quantity - ?,
           last_updated = CURRENT_TIMESTAMP
       WHERE product_id = ?`,
      [order.quantity, order.product_id]
    );

    // Mark order as confirmed
    await connection.query(
      `UPDATE Orders
       SET delivery_status = 'Confirmed'
       WHERE order_id = ?`,
      [order_id]
    );

    // Save everything
    await connection.commit();

    return res.status(201).json({
      success: true,
      message: "Payment successful and stock updated",
      payment: {
        payment_id: paymentResult.insertId,
        order_id: order_id,
        customer_id: customer_id,
        amount: amount,
        payment_method: payment_method,
        payment_status: payment_status
      }
    });

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error("Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Payment failed",
      error: error.message
    });

  } finally {
    if (connection) {
      connection.release();
    }
  }
});


// ==================================================
// START SERVER
// ==================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Backend server running on http://localhost:${PORT}`
  );

});

// ==================================================
// ADMIN - VIEW ALL ORDERS
// ==================================================

app.get("/api/orders", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        o.order_id,
        o.customer_id,
        o.product_id,
        p.product_name,
        p.brand,
        p.category,
        o.quantity,
        o.unit_price,
        o.GST,
        o.discount,
        o.total_amount,
        o.order_date,
        o.delivery_status
      FROM orders o
      JOIN products p
        ON o.product_id = p.product_id
      ORDER BY o.order_date DESC
    `);

    res.json({
      success: true,
      orders: rows
>>>>>>> Stashed changes
    });
  } catch (error) {
    console.error("Fetch all orders error:", error);

    res.status(500).json({
      success: false,
<<<<<<< Updated upstream
      message: "Registration failed",
      error: error.message,
=======
      message: "Failed to fetch orders",
      error: error.message
>>>>>>> Stashed changes
    });
  }
});

<<<<<<< Updated upstream

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
=======
// ==================================================
// ADMIN - UPDATE ORDER STATUS
// ==================================================

app.put("/api/orders/:orderId/status", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { delivery_status } = req.body;

    if (!delivery_status) {
      return res.status(400).json({
        success: false,
        message: "Delivery status is required"
      });
    }

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Processing",
      "Delivered",
      "Cancelled"
    ];

    if (!allowedStatuses.includes(delivery_status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery status"
      });
    }

    const [result] = await db.query(
      `UPDATE orders
       SET delivery_status = ?
       WHERE order_id = ?`,
      [delivery_status, orderId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.json({
      success: true,
      message: "Order status updated successfully"
    });

  } catch (error) {
    console.error("Update order status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message
    });
  }
});

>>>>>>> Stashed changes
