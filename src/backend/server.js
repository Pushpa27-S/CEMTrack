import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import db from "./db.js";

import jwt from "jsonwebtoken";

import customerRoutes from "./routes/customerRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


// ==================================================
// MIDDLEWARE
// ==================================================

app.use(cors());
app.use(express.json());


// ==================================================
// STATIC IMAGES
// ==================================================

app.use(
  "/images",
  express.static(
    path.join(__dirname, "public/images")
  )
);


// ==================================================
// ADMIN MANAGEMENT ROUTES
// YOUR WORK
// ==================================================

app.use(
  "/api/admin/customers",
  customerRoutes
);

app.use(
  "/api/admin/products",
  productRoutes
);

app.use(
  "/api/admin/inventory",
  inventoryRoutes
);


// ==================================================
// SERVER STARTING MESSAGE
// TEAMMATE WORK
// ==================================================

console.log("CEMTrack server starting...");
console.log(
  "JWT_SECRET loaded:",
  !!process.env.JWT_SECRET
);


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

app.get(
  "/api/test-db",
  async (req, res) => {

    try {

      const [rows] =
        await db.query(
          "SELECT 1 AS connected"
        );

      res.json({
        success: true,
        message:
          "Database connected successfully",
        result: rows
      });

    } catch (error) {

      console.error(
        "Database connection error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Database connection failed",
        error: error.message
      });

    }

  }
);


// ==================================================
// CUSTOMER LOGIN
// YOUR WORK + TEAMMATE JWT
// ==================================================

app.post(
  "/api/login",
  async (req, res) => {

    try {

      const {
        email,
        password
      } = req.body;


      // Check required fields

      if (!email || !password) {

        return res.status(400).json({
          success: false,
          message:
            "Email and password are required"
        });

      }


      // Find customer

      const [rows] =
        await db.query(

          `SELECT
            customer_id,
            customer_name,
            email,
            password
           FROM customer
           WHERE email = ?`,

          [email]

        );


      // Customer not found

      if (rows.length === 0) {

        return res.status(401).json({
          success: false,
          message:
            "Invalid email or password"
        });

      }


      const customer = rows[0];


      // Check password

      if (customer.password !== password) {

        return res.status(401).json({
          success: false,
          message:
            "Invalid email or password"
        });

      }


      // Create JWT token

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


      // Login successful

      res.json({

        success: true,

        message:
          "Login successful",

        token: token,

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
        "Customer login error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Server error",

        error:
          error.message

      });

    }

  }
);


// ==================================================
// ADMIN / OWNER LOGIN
// YOUR WORK + TEAMMATE JWT
// ==================================================

app.post(
  "/api/admin/login",
  async (req, res) => {

    try {

      const {
        email,
        password
      } = req.body;


      // Check required fields

      if (!email || !password) {

        return res.status(400).json({

          success: false,

          message:
            "Email and password are required"

        });

      }


      // Find owner

      const [rows] =
        await db.query(

          `SELECT
            owner_id,
            owner_name,
            email,
            password
           FROM owner
           WHERE email = ?`,

          [email]

        );


      // Owner not found

      if (rows.length === 0) {

        return res.status(401).json({

          success: false,

          message:
            "Invalid email or password"

        });

      }


      const owner = rows[0];


      // Check password

      if (owner.password !== password) {

        return res.status(401).json({

          success: false,

          message:
            "Invalid email or password"

        });

      }


      // Create JWT token

      const token = jwt.sign(

        {

          owner_id:
            owner.owner_id,

          role:
            "admin"

        },

        process.env.JWT_SECRET,

        {

          expiresIn: "2h"

        }

      );


      // Admin login successful

      res.json({

        success: true,

        message:
          "Admin login successful",

        token: token,

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
        "Admin login error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Server error",

        error:
          error.message

      });

    }

  }
);


// ==================================================
// CUSTOMER REGISTRATION
// ==================================================

app.post(
  "/api/register",
  async (req, res) => {

    try {

      const {

        customer_name,
        email,
        password,
        phone_no,
        address

      } = req.body;


      // Check required fields

      if (

        !customer_name ||
        !email ||
        !password ||
        !phone_no ||
        !address

      ) {

        return res.status(400).json({

          success: false,

          message:
            "All fields are required"

        });

      }


      // Check existing customer

      const [existingCustomer] =
        await db.query(

          `SELECT customer_id
           FROM customer
           WHERE email = ?`,

          [email]

        );


      if (
        existingCustomer.length > 0
      ) {

        return res.status(409).json({

          success: false,

          message:
            "An account with this email already exists"

        });

      }


      // Insert customer

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

        message:
          "Customer registered successfully",

        customer_id:
          result.insertId

      });


    } catch (error) {

      console.error(
        "Registration error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Registration failed",

        error:
          error.message

      });

    }

  }
);
// ==================================================
// GET ALL PRODUCTS
// TEAMMATE WORK
// ==================================================

app.get(
  "/api/products",
  async (req, res) => {

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

      res.json({
        success: true,
        products: rows
      });

    } catch (error) {

      console.error(
        "Get products error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch products",
        error:
          error.message
      });

    }

  }
);


// ==================================================
// GET SINGLE PRODUCT
// ==================================================

app.get(
  "/api/products/:productId",
  async (req, res) => {

    try {

      const { productId } =
        req.params;

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

          message:
            "Product not found"

        });

      }


      res.json({

        success: true,

        product:
          rows[0]

      });


    } catch (error) {

      console.error(
        "Get product error:",
        error
      );

      res.status(500).json({

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

      const { productId } =
        req.params;

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

          message:
            "Product not found"

        });

      }
      res.json({

        success: true,

        product:
          rows[0]

      });


    } catch (error) {

      console.error(
        "Stock check error:",
        error
      );

      res.status(500).json({

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


      // Check product

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


      if (
        products.length === 0
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Product not found"

        });

      }


      const product =
        products[0];


      // Check stock

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


      // Check existing cart item

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


      // Update existing cart item

      if (
        existing.length > 0
      ) {

        const newQuantity =
          Number(
            existing[0].quantity
          ) + qty;


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


      // Add new product to cart

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


      res.status(201).json({

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

      res.status(500).json({

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

      const { customerId } =
        req.params;


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
            (p.price * c.quantity)
              AS item_total

           FROM cart c

           INNER JOIN products p
             ON c.product_id =
                p.product_id

           WHERE c.customer_id = ?`,

          [customerId]

        );


      // Calculate total

      const total =
        rows.reduce(

          (sum, item) =>
            sum +
            Number(item.item_total),

          0

        );


      res.json({

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

      res.status(500).json({

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

      const { cartId } = req.params;
      const { quantity } = req.body;

      const qty = Number(quantity);

      if (
        !Number.isInteger(qty) ||
        qty < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "Quantity must be at least 1"
        });
      }

      // Check cart item and available stock
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

      // Update quantity
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

      console.error(
        "Update cart error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Failed to update cart",
        error: error.message
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

      console.error(
        "Remove cart error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Failed to remove product from cart",
        error: error.message
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


      // Validate required fields
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


      // Get database connection
      connection =
        await db.getConnection();


      await connection.beginTransaction();


      // Lock product while creating order
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


      const product =
        products[0];


      // Check stock
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


      const unitPrice =
        Number(product.price);


      // Calculate 18% GST
      const GST = Number(
        (
          unitPrice *
          itemQuantity *
          0.18
        ).toFixed(2)
      );


      const discount = 0;


      // Calculate total
      const totalAmount = Number(
        (
          unitPrice *
          itemQuantity +
          GST -
          discount
        ).toFixed(2)
      );


      // Create order
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


      // Reduce stock
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


      // Remove product from cart
      await connection.query(
        `DELETE FROM cart
         WHERE customer_id = ?
         AND product_id = ?`,
        [
          customer_id,
          product_id
        ]
      );


      // Save transaction
      await connection.commit();


      res.status(201).json({

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
            "Pending"

        }

      });


    } catch (error) {

      if (connection) {
        await connection.rollback();
      }

      console.error(
        "Create order error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Failed to create order",
        error: error.message
      });


    } finally {

      if (connection) {
        connection.release();
      }

    }

  }
);


// ==================================================
// CUSTOMER - VIEW ALL MY ORDERS
// ==================================================

app.get(
  "/api/orders/customer/:customerId",
  async (req, res) => {

    try {

      const { customerId } =
        req.params;


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
             ON o.product_id =
                p.product_id
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
        "Get customer orders error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch orders",
        error:
          error.message
      });

    }

  }
);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`CEMTrack backend running on port ${PORT}`);
});