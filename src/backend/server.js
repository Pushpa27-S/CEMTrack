import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();


// ==================================================
// MIDDLEWARE
// ==================================================

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);


// ==================================================
// ENVIRONMENT CHECK
// ==================================================

console.log("=================================");
console.log("CEMTrack server starting...");
console.log(
  "JWT_SECRET loaded:",
  !!process.env.JWT_SECRET
);
console.log("=================================");


// ==================================================
// HOME / SERVER TEST
// ==================================================

app.get("/", (req, res) => {

  return res.json({
    success: true,
    message: "CEMTrack backend is running"
  });

});


// ==================================================
// DATABASE CONNECTION TEST
// ==================================================

app.get("/api/test-db", async (req, res) => {

  console.log("=================================");
  console.log("DATABASE TEST REQUEST");

  try {

    console.log("Testing MySQL connection...");

    const [rows] = await db.query(
      "SELECT 1 AS connected"
    );

    console.log("MySQL test successful");

    return res.json({
      success: true,
      message: "Database connected successfully",
      result: rows
    });

  } catch (error) {

    console.error(
      "DATABASE CONNECTION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message
    });

  }

});


// ==================================================
// CUSTOMER LOGIN
// ==================================================

app.post("/api/login", async (req, res) => {

  console.log("=================================");
  console.log("CUSTOMER LOGIN REQUEST");

  try {

    const {
      email,
      password
    } = req.body;

    console.log(
      "Customer email:",
      email
    );

    console.log(
      "Customer password received:",
      !!password
    );


    // ------------------------------------------------
    // VALIDATE
    // ------------------------------------------------

    if (!email || !password) {

      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });

    }


    // ------------------------------------------------
    // FIND CUSTOMER
    // ------------------------------------------------

    console.log(
      "Checking customer table..."
    );

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


    console.log(
      "Customer query completed"
    );

    console.log(
      "Customers found:",
      rows.length
    );


    // ------------------------------------------------
    // CUSTOMER NOT FOUND
    // ------------------------------------------------

    if (rows.length === 0) {

      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });

    }


    const customer = rows[0];


    // ------------------------------------------------
    // PASSWORD CHECK
    // ------------------------------------------------

    if (customer.password !== password) {

      console.log(
        "Customer password mismatch"
      );

      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });

    }


    console.log(
      "Customer password correct"
    );


    // ------------------------------------------------
    // JWT CHECK
    // ------------------------------------------------

    if (!process.env.JWT_SECRET) {

      console.error(
        "JWT_SECRET is missing"
      );

      return res.status(500).json({
        success: false,
        message: "JWT_SECRET is not configured"
      });

    }


    // ------------------------------------------------
    // CREATE CUSTOMER TOKEN
    // ------------------------------------------------

    const token = jwt.sign(

      {
        customer_id:
          customer.customer_id,

        role:
          "customer"
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "2h"
      }

    );


    console.log(
      "Customer JWT created"
    );


    // ------------------------------------------------
    // RESPONSE
    // ------------------------------------------------

    return res.json({

      success: true,

      message:
        "Login successful",

      token:
        token,

      customer: {

        customer_id:
          customer.customer_id,

        customer_name:
          customer.customer_name,

        email:
          customer.email

      }

    });

  } catch (error) {

    console.error(
      "CUSTOMER LOGIN ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Server error",

      error:
        error.message

    });

  }

});


// ==================================================
// ADMIN LOGIN
// ==================================================

app.post("/api/admin/login", async (req, res) => {

  console.log("=================================");
  console.log("ADMIN LOGIN REQUEST RECEIVED");

  try {

    const {
      email,
      password
    } = req.body;


    console.log(
      "Admin email:",
      email
    );

    console.log(
      "Admin password received:",
      !!password
    );


    // ------------------------------------------------
    // VALIDATE
    // ------------------------------------------------

    if (!email || !password) {

      return res.status(400).json({

        success: false,

        message:
          "Email and password are required"

      });

    }


    // ------------------------------------------------
    // CHECK JWT SECRET
    // ------------------------------------------------

    if (!process.env.JWT_SECRET) {

      console.error(
        "JWT_SECRET is missing from .env"
      );

      return res.status(500).json({

        success: false,

        message:
          "JWT_SECRET is not configured"

      });

    }


    // ------------------------------------------------
    // TEST MYSQL
    // ------------------------------------------------

    console.log(
      "STEP 1 - Testing MySQL..."
    );

    const [test] = await db.query(
      "SELECT 1 AS test"
    );

    console.log(
      "STEP 2 - MySQL works:",
      test
    );


    // ------------------------------------------------
    // CHECK OWNER TABLE
    // ------------------------------------------------

    console.log(
      "STEP 3 - Checking owner table..."
    );

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


    console.log(
      "STEP 4 - Owner query completed"
    );

    console.log(
      "ROWS FOUND:",
      rows.length
    );


    // ------------------------------------------------
    // OWNER NOT FOUND
    // ------------------------------------------------

    if (rows.length === 0) {

      return res.status(401).json({

        success: false,

        message:
          "Invalid email or password"

      });

    }


    const owner = rows[0];


    // ------------------------------------------------
    // PASSWORD CHECK
    // ------------------------------------------------

    if (owner.password !== password) {

      console.log(
        "STEP 6 - Admin password mismatch"
      );

      return res.status(401).json({

        success: false,

        message:
          "Invalid email or password"

      });

    }


    console.log(
      "STEP 7 - Admin password correct"
    );


    // ------------------------------------------------
    // CREATE ADMIN JWT
    // ------------------------------------------------

    const token = jwt.sign(

      {

        owner_id:
          owner.owner_id,

        role:
          "admin"

      },

      process.env.JWT_SECRET,

      {

        expiresIn:
          "2h"

      }

    );


    console.log(
      "STEP 9 - Admin JWT created"
    );


    // ------------------------------------------------
    // RESPONSE
    // ------------------------------------------------

    return res.json({

      success: true,

      message:
        "Admin login successful",

      token:
        token,

      owner: {

        owner_id:
          owner.owner_id,

        owner_name:
          owner.owner_name,

        email:
          owner.email

      }

    });

  } catch (error) {

    console.error(
      "ADMIN LOGIN ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Server error",

      error:
        error.message

    });

  }

});


// ==================================================
// GET ALL PRODUCTS
// ==================================================

app.get("/api/products", async (req, res) => {

  try {

    const [rows] = await db.query(

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


    return res.json({

      success: true,

      products:
        rows

    });

  } catch (error) {

    console.error(
      "Get products error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch products",

      error:
        error.message

    });

  }

});


// ==================================================
// GET SINGLE PRODUCT
// ==================================================

app.get(
  "/api/products/:productId",
  async (req, res) => {

    try {

      const {
        productId
      } = req.params;


      const [rows] = await db.query(

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

          message:
            "Product not found"

        });

      }


      return res.json({

        success: true,

        product:
          rows[0]

      });

    } catch (error) {

      console.error(
        "Get product error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch product",

        error:
          error.message

      });

    }

  }
);


// ==================================================
// CHECK PRODUCT STOCK
// ==================================================

app.get(
  "/api/products/:productId/stock",
  async (req, res) => {

    try {

      const {
        productId
      } = req.params;


      const [rows] = await db.query(

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

          message:
            "Product not found"

        });

      }


      return res.json({

        success: true,

        product:
          rows[0]

      });

    } catch (error) {

      console.error(
        "Stock check error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to check stock",

        error:
          error.message

      });

    }

  }
);


// ==================================================
// CART - ADD PRODUCT
// ==================================================

app.post(
  "/api/cart",
  async (req, res) => {

    try {

      const {
        customer_id,
        product_id,
        quantity
      } = req.body;


      if (
        !customer_id ||
        !product_id
      ) {

        return res.status(400).json({

          success: false,

          message:
            "customer_id and product_id are required"

        });

      }


      const qty =
        Number(quantity) || 1;


      if (
        !Number.isInteger(qty) ||
        qty < 1
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Quantity must be at least 1"

        });

      }


      // ------------------------------------------------
      // CHECK PRODUCT
      // ------------------------------------------------

      const [products] =
        await db.query(

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

          message:
            "Product not found"

        });

      }


      const product =
        products[0];


      // ------------------------------------------------
      // CHECK STOCK
      // ------------------------------------------------

      if (
        qty >
        Number(product.stock_quantity)
      ) {

        return res.status(400).json({

          success: false,

          message:
            `Only ${product.stock_quantity} bags are available`

        });

      }


      // ------------------------------------------------
      // CHECK EXISTING CART ITEM
      // ------------------------------------------------

      const [existing] =
        await db.query(

          `SELECT *
           FROM cart
           WHERE customer_id = ?
           AND product_id = ?`,

          [
            customer_id,
            product_id
          ]

        );


      // ------------------------------------------------
      // UPDATE EXISTING ITEM
      // ------------------------------------------------

      if (existing.length > 0) {

        const newQuantity =
          Number(existing[0].quantity) +
          qty;


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

          message:
            "Cart quantity updated",

          cart_id:
            existing[0].cart_id,

          quantity:
            newQuantity

        });

      }


      // ------------------------------------------------
      // INSERT NEW CART ITEM
      // ------------------------------------------------

      const [result] =
        await db.query(

          `INSERT INTO cart
           (
             customer_id,
             product_id,
             quantity
           )
           VALUES (?, ?, ?)`,

          [
            customer_id,
            product_id,
            qty
          ]

        );


      return res.status(201).json({

        success: true,

        message:
          "Product added to cart",

        cart_id:
          result.insertId,

        quantity:
          qty

      });

    } catch (error) {

      console.error(
        "Add to cart error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to add product to cart",

        error:
          error.message

      });

    }

  }
);


// ==================================================
// CART - VIEW CUSTOMER CART
// ==================================================

app.get(
  "/api/cart/:customerId",
  async (req, res) => {

    try {

      const {
        customerId
      } = req.params;


      const [rows] =
        await db.query(

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


      const total =
        rows.reduce(

          (sum, item) =>
            sum +
            Number(item.item_total),

          0

        );


      return res.json({

        success: true,

        cart:
          rows,

        total:
          total.toFixed(2)

      });

    } catch (error) {

      console.error(
        "Get cart error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch cart",

        error:
          error.message

      });

    }

  }
);


// ==================================================
// CART - CHANGE QUANTITY
// ==================================================

app.put(
  "/api/cart/:cartId",
  async (req, res) => {

    try {

      const {
        cartId
      } = req.params;

      const {
        quantity
      } = req.body;


      const qty =
        Number(quantity);


      if (
        !Number.isInteger(qty) ||
        qty < 1
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Quantity must be at least 1"

        });

      }


      const [items] =
        await db.query(

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

          message:
            "Cart item not found"

        });

      }


      if (
        qty >
        Number(
          items[0].stock_quantity
        )
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

        [
          qty,
          cartId
        ]

      );


      return res.json({

        success: true,

        message:
          "Cart quantity updated",

        quantity:
          qty

      });

    } catch (error) {

      console.error(
        "Update cart error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to update cart",

        error:
          error.message

      });

    }

  }
);


// ==================================================
// CART - REMOVE PRODUCT
// ==================================================

app.delete(
  "/api/cart/:cartId",
  async (req, res) => {

    try {

      const {
        cartId
      } = req.params;


      const [result] =
        await db.query(

          `DELETE FROM cart
           WHERE cart_id = ?`,

          [cartId]

        );


      if (
        result.affectedRows === 0
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Cart item not found"

        });

      }


      return res.json({

        success: true,

        message:
          "Product removed from cart"

      });

    } catch (error) {

      console.error(
        "Remove cart error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to remove product from cart",

        error:
          error.message

      });

    }

  }
);


// ==================================================
// CREATE ORDER
// ==================================================

app.post(
  "/api/orders",
  async (req, res) => {

    let connection;

    try {

      const {
        customer_id,
        product_id,
        quantity
      } = req.body;


      console.log(
        "ORDER DATA RECEIVED:",
        req.body
      );


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


      const itemQuantity =
        Number(quantity);


      if (
        !Number.isInteger(itemQuantity) ||
        itemQuantity <= 0
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Quantity must be greater than zero"

        });

      }


      // ------------------------------------------------
      // GET CONNECTION
      // ------------------------------------------------

      connection =
        await db.getConnection();


      await connection.beginTransaction();


      // ------------------------------------------------
      // LOCK PRODUCT
      // ------------------------------------------------

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

          message:
            "Product not found"

        });

      }


      const product =
        products[0];


      // ------------------------------------------------
      // CHECK STOCK
      // ------------------------------------------------

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


      // ------------------------------------------------
      // PRICE
      // ------------------------------------------------

      const unitPrice =
        Number(product.price);


      const GST =
        Number(

          (
            unitPrice *
            itemQuantity *
            0.18

          ).toFixed(2)

        );


      const discount =
        0;


      const totalAmount =
        Number(

          (

            unitPrice *
            itemQuantity +
            GST -
            discount

          ).toFixed(2)

        );


      // ------------------------------------------------
      // CREATE ORDER
      // ------------------------------------------------

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
            "Confirmed"
          ]

        );


      // ------------------------------------------------
      // REDUCE STOCK
      // ------------------------------------------------

      await connection.query(

        `UPDATE products
         SET stock_quantity =
           stock_quantity - ?
         WHERE product_id = ?`,

        [
          itemQuantity,
          product_id
        ]

      );


      // ------------------------------------------------
      // REMOVE FROM CART
      // ------------------------------------------------

      await connection.query(

        `DELETE FROM cart
         WHERE customer_id = ?
         AND product_id = ?`,

        [
          customer_id,
          product_id
        ]

      );


      // ------------------------------------------------
      // COMMIT
      // ------------------------------------------------

      await connection.commit();


      console.log(
        "Order created:",
        orderResult.insertId
      );


      return res.status(201).json({

        success: true,

        message:
          "Order created successfully",

        order: {

          order_id:
            orderResult.insertId,

          customer_id:
            customer_id,

          product_id:
            product_id,

          quantity:
            itemQuantity,

          unit_price:
            unitPrice,

          GST:
            GST,

          discount:
            discount,

          total_amount:
            totalAmount,

          delivery_status:
            "Confirmed"

        }

      });

    } catch (error) {

      if (connection) {

        try {

          await connection.rollback();

        } catch (rollbackError) {

          console.error(
            "Rollback error:",
            rollbackError
          );

        }

      }


      console.error(
        "Create order error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to create order",

        error:
          error.message

      });

    } finally {

      if (connection) {

        connection.release();

      }

    }

  }
);


// ==================================================
// PAYMENT - RECORD PAYMENT
// ==================================================

app.post(
  "/api/payment",
  async (req, res) => {

    console.log("=================================");
    console.log("PAYMENT REQUEST RECEIVED");

    try {

      const {
        order_id,
        customer_id,
        payment_method
      } = req.body;


      console.log(
        "Order ID:",
        order_id
      );

      console.log(
        "Customer ID:",
        customer_id
      );

      console.log(
        "Payment Method:",
        payment_method
      );


      // ------------------------------------------------
      // VALIDATE REQUEST
      // ------------------------------------------------

      if (
        !order_id ||
        !customer_id ||
        !payment_method
      ) {

        return res.status(400).json({

          success: false,

          message:
            "order_id, customer_id and payment_method are required"

        });

      }


      // ------------------------------------------------
      // GET ORDER
      // ------------------------------------------------

      const [orders] =
        await db.query(

          `SELECT
            order_id,
            customer_id,
            total_amount,
            delivery_status
           FROM orders
           WHERE order_id = ?
           AND customer_id = ?`,

          [
            order_id,
            customer_id
          ]

        );


      if (orders.length === 0) {

        return res.status(404).json({

          success: false,

          message:
            "Order not found"

        });

      }


      const order =
        orders[0];


      // ------------------------------------------------
      // GET PAYMENT AMOUNT
      // ------------------------------------------------

      const amount =
        Number(order.total_amount);


      if (!Number.isFinite(amount)) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid order amount"

        });

      }


      // ------------------------------------------------
      // CHECK EXISTING PAYMENT
      // ------------------------------------------------

      const [existingPayments] =
        await db.query(

          `SELECT
            payment_id,
            payment_status
           FROM payment
           WHERE order_id = ?
           AND customer_id = ?
           LIMIT 1`,

          [
            order_id,
            customer_id
          ]

        );


      if (existingPayments.length > 0) {

        return res.status(400).json({

          success: false,

          message:
            "Payment has already been recorded for this order",

          payment_id:
            existingPayments[0].payment_id,

          payment_status:
            existingPayments[0].payment_status

        });

      }


      // ------------------------------------------------
      // INSERT PAYMENT
      // ------------------------------------------------

      const [paymentResult] =
        await db.query(

          `INSERT INTO payment
          (
            order_id,
            customer_id,
            amount,
            payment_method,
            payment_status
          )
          VALUES (?, ?, ?, ?, ?)`,

          [
            order_id,
            customer_id,
            amount,
            payment_method,
            "Paid"
          ]

        );


      console.log(
        "Payment recorded successfully:",
        paymentResult.insertId
      );


      // ------------------------------------------------
      // RESPONSE
      // ------------------------------------------------

      return res.status(201).json({

        success: true,

        message:
          "Payment recorded successfully",

        payment: {

          payment_id:
            paymentResult.insertId,

          order_id:
            Number(order_id),

          customer_id:
            Number(customer_id),

          amount:
            amount,

          payment_method:
            payment_method,

          payment_status:
            "Paid"

        }

      });


    } catch (error) {

      console.error(
        "PAYMENT ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to record payment",

        error:
          error.message

      });

    }

  }
);


// ==================================================
// CUSTOMER - VIEW ALL ORDERS
// ==================================================

app.get(
  "/api/orders/customer/:customerId",
  async (req, res) => {

    try {

      const {
        customerId
      } = req.params;


      const [rows] =
        await db.query(

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


      return res.json({

        success: true,

        orders:
          rows

      });

    } catch (error) {

      console.error(
        "Get customer orders error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch orders",

        error:
          error.message

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

      const {
        orderId
      } = req.params;


      const [rows] =
        await db.query(

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
           WHERE o.order_id = ?`,

          [orderId]

        );


      if (rows.length === 0) {

        return res.status(404).json({

          success: false,

          message:
            "Order not found"

        });

      }


      return res.json({

        success: true,

        order:
          rows[0]

      });

    } catch (error) {

      console.error(
        "Get order error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch order",

        error:
          error.message

      });

    }

  }
);


// ==================================================
// CUSTOMER - CANCEL ORDER
// ==================================================

app.put(
  "/api/orders/:orderId/cancel",
  async (req, res) => {

    let connection;

    try {

      const {
        orderId
      } = req.params;

      const {
        customer_id
      } = req.body;


      console.log("=================================");
      console.log("CUSTOMER CANCEL ORDER");
      console.log("Order ID:", orderId);
      console.log("Customer ID:", customer_id);


      // ------------------------------------------------
      // VALIDATE CUSTOMER ID
      // ------------------------------------------------

      if (!customer_id) {

        return res.status(400).json({

          success: false,

          message:
            "customer_id is required"

        });

      }


      // ------------------------------------------------
      // GET CONNECTION
      // ------------------------------------------------

      connection =
        await db.getConnection();

      await connection.beginTransaction();


      // ------------------------------------------------
      // GET ORDER AND LOCK IT
      // ------------------------------------------------

      const [orders] =
        await connection.query(

          `SELECT
            order_id,
            customer_id,
            product_id,
            quantity,
            delivery_status
           FROM orders
           WHERE order_id = ?
           AND customer_id = ?
           FOR UPDATE`,

          [
            orderId,
            customer_id
          ]

        );


      // ------------------------------------------------
      // ORDER NOT FOUND
      // ------------------------------------------------

      if (orders.length === 0) {

        await connection.rollback();

        return res.status(404).json({

          success: false,

          message:
            "Order not found"

        });

      }


      const order =
        orders[0];


      // ------------------------------------------------
      // CHECK CURRENT STATUS
      // ------------------------------------------------

      if (
        order.delivery_status ===
        "Cancelled"
      ) {

        await connection.rollback();

        return res.status(400).json({

          success: false,

          message:
            "This order is already cancelled"

        });

      }


      if (
        order.delivery_status ===
        "Delivered"
      ) {

        await connection.rollback();

        return res.status(400).json({

          success: false,

          message:
            "Delivered orders cannot be cancelled"

        });

      }


      // ------------------------------------------------
      // RESTORE STOCK
      // ------------------------------------------------

      await connection.query(

        `UPDATE products
         SET stock_quantity =
           stock_quantity + ?
         WHERE product_id = ?`,

        [
          order.quantity,
          order.product_id
        ]

      );


      // ------------------------------------------------
      // UPDATE ORDER STATUS
      // ------------------------------------------------

      await connection.query(

        `UPDATE orders
         SET delivery_status = 'Cancelled'
         WHERE order_id = ?
         AND customer_id = ?`,

        [
          orderId,
          customer_id
        ]

      );


      // ------------------------------------------------
      // COMMIT
      // ------------------------------------------------

      await connection.commit();


      console.log(
        "Order cancelled successfully"
      );


      return res.json({

        success: true,

        message:
          "Order cancelled successfully",

        order: {

          order_id:
            Number(orderId),

          delivery_status:
            "Cancelled"

        },

        stock_restored:
          Number(order.quantity)

      });

    } catch (error) {

      if (connection) {

        try {

          await connection.rollback();

        } catch (rollbackError) {

          console.error(
            "Rollback error:",
            rollbackError
          );

        }

      }


      console.error(
        "Cancel order error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to cancel order",

        error:
          error.message

      });

    } finally {

      if (connection) {

        connection.release();

      }

    }

  }
);


// ==================================================
// ADMIN - VIEW ALL ORDERS
// ==================================================

app.get(
  "/api/admin/orders",
  async (req, res) => {

    console.log(
      "ADMIN - GET ALL ORDERS"
    );

    try {

      const [rows] =
        await db.query(

          `SELECT
            o.order_id,
            o.customer_id,
            c.customer_name,
            c.email,
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
           INNER JOIN customer c
             ON o.customer_id = c.customer_id
           INNER JOIN products p
             ON o.product_id = p.product_id
           ORDER BY o.order_date DESC`

        );


      return res.json({

        success: true,

        orders:
          rows

      });

    } catch (error) {

      console.error(
        "Get all orders error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch all orders",

        error:
          error.message

      });

    }

  }
);


// ==================================================
// ADMIN - UPDATE ORDER STATUS
// ==================================================

const updateOrderStatus =
  async (req, res) => {

    try {

      const {
        orderId
      } = req.params;


      const {
        delivery_status
      } = req.body;


      console.log(
        "================================="
      );

      console.log(
        "ADMIN UPDATE ORDER STATUS"
      );

      console.log(
        "Order ID:",
        orderId
      );

      console.log(
        "New status:",
        delivery_status
      );


      // ------------------------------------------------
      // VALIDATE STATUS
      // ------------------------------------------------

      if (!delivery_status) {

        return res.status(400).json({

          success: false,

          message:
            "delivery_status is required"

        });

      }


      const allowedStatuses = [

        "Pending",

        "Confirmed",

        "Processing",

        "Shipped",

        "Out for Delivery",

        "Delivered",

        "Cancelled"

      ];


      if (
        !allowedStatuses.includes(
          delivery_status
        )
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid delivery status",

          allowed_statuses:
            allowedStatuses

        });

      }


      // ------------------------------------------------
      // CHECK ORDER
      // ------------------------------------------------

      const [orders] =
        await db.query(

          `SELECT
            order_id,
            delivery_status
           FROM orders
           WHERE order_id = ?`,

          [orderId]

        );


      if (orders.length === 0) {

        return res.status(404).json({

          success: false,

          message:
            "Order not found"

        });

      }


      // ------------------------------------------------
      // UPDATE STATUS
      // ------------------------------------------------

      await db.query(

        `UPDATE orders
         SET delivery_status = ?
         WHERE order_id = ?`,

        [
          delivery_status,
          orderId
        ]

      );


      console.log(
        "Order status updated successfully"
      );


      return res.json({

        success: true,

        message:
          "Order status updated successfully",

        order_id:
          Number(orderId),

        delivery_status:
          delivery_status

      });

    } catch (error) {

      console.error(
        "Update order status error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to update order status",

        error:
          error.message

      });

    }

  };


// ==================================================
// ADMIN UPDATE STATUS - PUT
// ==================================================

app.put(
  "/api/admin/orders/:orderId/status",
  updateOrderStatus
);


// ==================================================
// ADMIN UPDATE STATUS - POST
// ==================================================

app.post(
  "/api/admin/orders/:orderId/status",
  updateOrderStatus
);


// ==================================================
// 404 ROUTE HANDLER
// ==================================================

app.use(
  (req, res) => {

    console.log(
      "404 ROUTE NOT FOUND:",
      req.method,
      req.originalUrl
    );


    return res.status(404).json({

      success: false,

      message:
        `Cannot ${req.method} ${req.originalUrl}`

    });

  }
);


// ==================================================
// GLOBAL ERROR HANDLER
// ==================================================

app.use(
  (error, req, res, next) => {

    console.error(
      "GLOBAL SERVER ERROR:",
      error
    );


    if (res.headersSent) {

      return next(error);

    }


    return res.status(500).json({

      success: false,

      message:
        "Internal server error",

      error:
        error.message

    });

  }
);


// ==================================================
// SERVER START
// ==================================================

const PORT =
  process.env.PORT || 5000;


app.listen(
  PORT,
  () => {

    console.log(
      "================================="
    );

    console.log(
      `CEMTrack backend running on port ${PORT}`
    );

    console.log(
      `http://127.0.0.1:${PORT}`
    );

    console.log(
      "================================="
    );

  }
);