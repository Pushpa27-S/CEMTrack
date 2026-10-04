import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import db from "./db.js";
import customerRoutes from "./routes/customerRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import authenicateToken from "./middleware/authMiddleware.js";
import jwt from "jsonwebtoken";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
// ADMIN MANAGEMENT ROUTES
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

app.use(
  "/api/admin/reports",
  reportRoutes
);

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
// ORDER STATUS
// ==================================================
//
// New orders are created as Confirmed.
//
// Further status changes are handled manually
// by Admin Orders.
//
// ==================================================


// ==================================================
// HOME / SERVER TEST
// ==================================================

app.get("/", (req, res) => {

  return res.json({

    success: true,

    message:
      "CEMTrack backend is running"

  });

});


// ==================================================
// DATABASE CONNECTION TEST
// ==================================================

app.get("/api/test-db", async (req, res) => {

  try {

    const [rows] =
      await db.query(
        "SELECT 1 AS connected"
      );

    return res.json({

      success: true,

      message:
        "Database connected successfully",

      result:
        rows

    });

  } catch (error) {

    console.error(
      "DATABASE CONNECTION ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Database connection failed",

      error:
        error.message

    });

  }

});


// ==================================================
// CUSTOMER LOGIN
// ==================================================

app.post(
  "/api/login",
  async (req, res) => {

    try {

      const {
        email,
        password
      } = req.body;


      if (!email || !password) {

        return res.status(400).json({

          success: false,

          message:
            "Email and password are required"

        });

      }


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


      if (rows.length === 0) {

        return res.status(401).json({

          success: false,

          message:
            "Invalid email or password"

        });

      }


      const customer =
        rows[0];

        console.log("LOGIN EMAIL:", email);
        console.log("CUSTOMER FOUND:", customer);


      if (
        customer.password !==
        password
      ) {

        return res.status(401).json({

          success: false,

          message:
            "Invalid email or password"

        });

      }


      if (!process.env.JWT_SECRET) {

        return res.status(500).json({

          success: false,

          message:
            "JWT_SECRET is not configured"

        });

      }


      const token =
        jwt.sign(

          {

            customer_id:
              customer.customer_id,

            role:
              "customer"

          },

          process.env.JWT_SECRET,

          {
            expiresIn:
              "2h"
          }

        );


      return res.json({

        success: true,

        message:
          "Login successful",

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
        "Customer login error:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Login failed",

        error:
          error.message

      });

    }

  }
);
// ================================
// CUSTOMER REGISTRATION
// ================================

app.post("/api/register", async (req, res) => {
  try {
    const {
      customer_name,
      email,
      password,
      phone_no,
      address
    } = req.body;

    if (!customer_name || !email || !password || !phone_no || !address) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const hashedPassword = password;

    const [existingCustomer] = await db.query(
      "SELECT customer_id FROM customer WHERE email = ?",
      [email]
    );

    if (existingCustomer.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      });
    }

    await db.query(
      `INSERT INTO customer
       (customer_name, email, password, phone_no, address)
       VALUES (?, ?, ?, ?, ?)`,
      [
        customer_name,
        email,
        hashedPassword,
        phone_no,
        address
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Registration successful"
    });

  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message
    });
  }
});


// ==================================================
// ADMIN LOGIN
// ==================================================

app.post(
  "/api/admin/login",
  async (req, res) => {

    try {

      const {
        email,
        password
      } = req.body;


      if (!email || !password) {

        return res.status(400).json({

          success: false,

          message:
            "Email and password are required"

        });

      }


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


      if (rows.length === 0) {

        return res.status(401).json({

          success: false,

          message:
            "Invalid owner email or password"

        });

      }


      const owner =
        rows[0];


      if (
        owner.password !==
        password
      ) {

        return res.status(401).json({

          success: false,

          message:
            "Invalid owner email or password"

        });

      }


      if (!process.env.JWT_SECRET) {

        return res.status(500).json({

          success: false,

          message:
            "JWT_SECRET is not configured"

        });

      }


      const token =
        jwt.sign(

          {

            owner_id:
              owner.owner_id,

            role:
              "owner"

          },

          process.env.JWT_SECRET,

          {
            expiresIn:
              "2h"
          }

        );


      return res.json({

        success: true,

        message:
          "owner login successful",

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
        "owner login error:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "owner login failed",

        error:
          error.message

      });

    }

  }
);


// ==================================================
// GET ALL PRODUCTS
// ==================================================

app.get(
  "/api/products",
  async (req, res) => {

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
            description,
            image
           FROM products
           ORDER BY product_id DESC`

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

  }
);


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


      const [rows] =
        await db.query(

          `SELECT
            product_id,
            product_name,
            brand,
            category,
            price,
            stock_quantity,
            description,
            image
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
          "Failed to check product stock",

        error:
          error.message

      });

    }

  }
);


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
// =================================================


     app.get(
  "/api/cart/:customerId",
  authenicateToken,
  async (req, res) => {
    

    try {

      const { customerId } = req.params;
      if (
  req.user.role !== "customer" ||
  Number(req.user.customer_id) !== Number(customerId)
) {
  return res.status(403).json({
    success: false,
    message: "You are not authorized to access this cart"
  });
}

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
        (sum, item) => sum + Number(item.item_total),
        0
      );

      return res.json({
        success: true,
        cart: rows,
        total: total.toFixed(2)
      });

    } catch (error) {

      console.error("Get cart error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch cart",
        error: error.message
      });

    }
  }
);

// ==================================================
// GET ALL PRODUCTS
// ==================================================

app.get(
  "/api/products",
  async (req, res) => {

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

  }
);


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
          "Failed to check product stock",

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
        await db.query(          `SELECT
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
// CREATE ORDER - MULTIPLE PRODUCTS IN ONE ORDER GROUP
// ==================================================

app.post(
  "/api/orders",
  async (req, res) => {

    let connection;

    try {

      const {
        customer_id,
        items
      } = req.body;

      console.log(
        "ORDER DATA RECEIVED:",
        req.body
      );

      if (
        !customer_id ||
        !Array.isArray(items) ||
        items.length === 0
      ) {

        return res.status(400).json({
          success: false,
          message:
            "customer_id and at least one product are required"
        });

      }

      connection =
        await db.getConnection();

      await connection.beginTransaction();

      let orderGroupId = null;
      const createdOrders = [];

      let grandTotal = 0;

      // ==================================================
      // PROCESS EVERY PRODUCT IN THE CART
      // ==================================================

      for (const item of items) {

        const productId =
          Number(
            item.product_id ||
            item.id
          );

        const quantity =
          Number(
            item.quantity
          ) || 1;

        if (
          !Number.isInteger(productId) ||
          productId <= 0
        ) {

          throw new Error(
            "Invalid product ID"
          );

        }

        if (
          !Number.isInteger(quantity) ||
          quantity <= 0
        ) {

          throw new Error(
            "Quantity must be greater than zero"
          );

        }

        // ==================================================
        // LOCK PRODUCT ROW
        // ==================================================

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
            [productId]
          );

        if (products.length === 0) {

          throw new Error(
            `Product ${productId} not found`
          );

        }

        const product =
          products[0];

        // ==================================================
        // CHECK STOCK
        // ==================================================

        if (
          Number(product.stock_quantity) <
          quantity
        ) {

          throw new Error(
            `${product.product_name} does not have enough stock`
          );

        }

        // ==================================================
        // CALCULATE AMOUNT
        // ==================================================

        const unitPrice =
          Number(product.price);

        const subtotal =
          Number(
            (
              unitPrice *
              quantity
            ).toFixed(2)
          );

        const GST =
          Number(
            (
              subtotal *
              0.18
            ).toFixed(2)
          );

        const discount = 20;

        const totalAmount =
          Number(
            (
              subtotal +
              GST -
              discount
            ).toFixed(2)
          );

        grandTotal += totalAmount;

        // ==================================================
        // CREATE ORDER ROW
        // ==================================================

        const [orderResult] =
          await connection.query(
            `INSERT INTO orders
            (
              order_group_id,
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
            VALUES
            (
              ?,
              ?,
              ?,
              ?,
              ?,
              ?,
              ?,
              ?,
              NOW(),
              ?
            )`,
            [
              orderGroupId,
              customer_id,
              productId,
              quantity,
              unitPrice,
              GST,
              discount,
              totalAmount,
              "Confirmed"
            ]
          );

        const orderId =
          orderResult.insertId;

        // ==================================================
        // FIRST ORDER BECOMES THE GROUP ID
        // ==================================================

        if (!orderGroupId) {

          orderGroupId =
            orderId;

          await connection.query(
            `UPDATE orders
             SET order_group_id = ?
             WHERE order_id = ?`,
            [
              orderGroupId,
              orderId
            ]
          );

        }

        // ==================================================
        // UPDATE STOCK
        // ==================================================

        await connection.query(
          `UPDATE products
           SET stock_quantity =
             stock_quantity - ?
           WHERE product_id = ?`,
          [
            quantity,
            productId
          ]
        );

        // ==================================================
        // REMOVE PRODUCT FROM CART
        // ==================================================

        await connection.query(
          `DELETE FROM cart
           WHERE customer_id = ?
           AND product_id = ?`,
          [
            customer_id,
            productId
          ]
        );

        createdOrders.push({
          order_id: orderId,
          order_group_id: orderGroupId,
          product_id: productId,
          quantity: quantity,
          unit_price: unitPrice,
          subtotal: subtotal,
          GST: GST,
          discount: discount,
          total_amount: totalAmount,
          delivery_status: "Confirmed"
        });

      }

      await connection.commit();

      console.log(
        "Order group created:",
        orderGroupId
      );

      console.log(
        "Orders created:",
        createdOrders
      );

      return res.status(201).json({

        success: true,

        message:
          "Order created successfully",

        order_group_id:
          orderGroupId,

        total_amount:
          Number(
            grandTotal.toFixed(2)
          ),

        orders:
          createdOrders

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
          error.message ||
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
// PAYMENT
// ==================================================

app.post(
  "/api/payment",
  async (req, res) => {

    try {

      const {
        order_id,
        order_group_id,
        customer_id,
        payment_method
      } = req.body;


      if (
        !order_id ||
        !order_group_id ||
        !customer_id ||
        !payment_method
      ) {

        return res.status(400).json({

          success: false,

          message:
            "order_id, order_group_id, customer_id and payment_method are required"

        });

      }


      // GET ALL ORDERS IN THIS ORDER GROUP
      const [orders] =
        await db.query(

          `SELECT
            order_id,
            order_group_id,
            customer_id,
            total_amount,
            delivery_status
           FROM orders
           WHERE order_group_id = ?
           AND customer_id = ?
           ORDER BY order_id ASC`,

          [
            order_group_id,
            customer_id
          ]

        );


      if (orders.length === 0) {

        return res.status(404).json({

          success: false,

          message:
            "Order group not found"

        });

      }


      // CALCULATE TOTAL FOR ALL PRODUCTS
      let amount = 0;

      for (const order of orders) {

        amount +=
          Number(order.total_amount);

      }


      amount =
        Number(
          amount.toFixed(2)
        );


      if (
        !Number.isFinite(amount)
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid order amount"

        });

      }


      // CHECK WHETHER THIS ORDER GROUP
      // HAS ALREADY BEEN PAID
      const [existingPayments] =
        await db.query(

          `SELECT
            payment_id,
            payment_status
           FROM payment
           WHERE order_group_id = ?
           AND customer_id = ?
           LIMIT 1`,

          [
            order_group_id,
            customer_id
          ]

        );


      if (
        existingPayments.length > 0
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Payment has already been recorded for this order group",

          payment_id:
            existingPayments[0].payment_id,

          payment_status:
            existingPayments[0].payment_status

        });

      }


      // RECORD ONE PAYMENT FOR
      // THE COMPLETE ORDER GROUP
      const [paymentResult] =
        await db.query(

          `INSERT INTO payment
          (
            order_id,
            order_group_id,
            customer_id,
            amount,
            payment_method,
            payment_status
          )
          VALUES (?, ?, ?, ?, ?, ?)`,

          [
            order_id,
            order_group_id,
            customer_id,
            amount,
            payment_method,
            "Paid"
          ]

        );


      return res.status(201).json({

        success: true,

        message:
          "Payment recorded successfully",

        payment: {

          payment_id:
            paymentResult.insertId,

          order_id:
            Number(order_id),

          order_group_id:
            Number(order_group_id),

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
  authenicateToken,
  async (req, res) => {
    const { customerId } = req.params;

if (
  req.user.role !== "customer" ||
  Number(req.user.customer_id) !== Number(customerId)
) {
  return res.status(403).json({
    success: false,
    message: "You are not authorized to access these orders"
  });
}

    try {

      const {
        customerId
      } = req.params;

if (
  req.user.role !== "customer" ||
  Number(req.user.customer_id) !== Number(customerId)
) {
  return res.status(403).json({
    success: false,
    message: "You are not authorized to access these orders"
  });
}

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
  authenicateToken,
  async (req, res) => {

    try {

      const {
        orderId
      } = req.params;

if (
  req.user.role !== "customer"
) {
  return res.status(403).json({
    success: false,
    message: "You are not authorized to access this order"
  });
}

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


      if (!customer_id) {

        return res.status(400).json({

          success: false,

          message:
            "customer_id is required"

        });

      }


      connection =
        await db.getConnection();


      await connection.beginTransaction();


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


      await connection.commit();


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
// ==================================================
// BILLING / BILL HISTORY
// ==================================================
// ==================================================
//
// IMPORTANT:
//
// Bills are NOT stored only in React state.
//
// The bill information is taken from:
//      orders table
//      payment table
//
// Therefore:
//      Refresh page -> bill still exists
//      Close browser -> bill still exists
//      Login again -> bill still exists
//
// ==================================================


// ==================================================
// CUSTOMER - GET BILLING HISTORY
// ==================================================

app.get(
  "/api/billing/customer/:customerId",
  async (req, res) => {

    try {

      const {
        customerId
      } = req.params;


      console.log(
        "Fetching billing history for customer:",
        customerId
      );


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

            (
              o.unit_price * o.quantity
            ) AS subtotal,

            o.GST,
            o.discount,
            o.total_amount,

            o.order_date,
            o.delivery_status,

            pay.payment_id,
            pay.payment_method,
            pay.payment_status,
            pay.amount AS paid_amount

           FROM orders o

           INNER JOIN customer c
             ON o.customer_id = c.customer_id

           INNER JOIN products p             ON o.product_id = p.product_id

           LEFT JOIN payment pay
             ON o.order_id = pay.order_id
             AND o.customer_id = pay.customer_id

           WHERE o.customer_id = ?

           ORDER BY o.order_date DESC`,

          [customerId]

        );


      const bills =
        rows.map((bill) => {

          const subtotal =
            Number(
              bill.subtotal || 0
            );

          const GST =
            Number(
              bill.GST || 0
            );

          const discount =
            Number(
              bill.discount || 0
            );

          const total =
            Number(
              bill.total_amount || 0
            );


          return {

            bill_id:
              bill.order_id,

            order_id:
              bill.order_id,

            customer_id:
              bill.customer_id,

            customer_name:
              bill.customer_name,

            email:
              bill.email,

            product_id:
              bill.product_id,

            product_name:
              bill.product_name,

            brand:
              bill.brand,

            category:
              bill.category,

            quantity:
              Number(bill.quantity),

            unit_price:
              Number(bill.unit_price),

            subtotal:
              Number(
                subtotal.toFixed(2)
              ),

            GST:
              Number(
                GST.toFixed(2)
              ),

            discount:
              Number(
                discount.toFixed(2)
              ),

            total_amount:
              Number(
                total.toFixed(2)
              ),

            order_date:
              bill.order_date,

            delivery_status:
              bill.delivery_status,

            payment_id:
              bill.payment_id,

            payment_method:
              bill.payment_method,

            payment_status:
              bill.payment_status,

            paid_amount:
              bill.paid_amount !== null
                ? Number(
                    Number(
                      bill.paid_amount
                    ).toFixed(2)
                  )
                : null

          };

        });


      return res.json({

        success: true,

        bills:

          bills

      });


    } catch (error) {

      console.error(
        "Get customer billing history error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch billing history",

        error:
          error.message

      });

    }

  }
);


// ==================================================
// CUSTOMER - GET SINGLE BILL
// ==================================================

app.get(
  "/api/billing/:orderId",
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

            c.customer_name,
            c.email,

            o.product_id,

            p.product_name,
            p.brand,
            p.category,

            o.quantity,
            o.unit_price,

            (
              o.unit_price * o.quantity
            ) AS subtotal,

            o.GST,
            o.discount,
            o.total_amount,

            o.order_date,
            o.delivery_status,

            pay.payment_id,
            pay.payment_method,
            pay.payment_status,
            pay.amount AS paid_amount

           FROM orders o

           INNER JOIN customer c
             ON o.customer_id = c.customer_id

           INNER JOIN products p
             ON o.product_id = p.product_id

           LEFT JOIN payment pay
             ON o.order_id = pay.order_id
             AND o.customer_id = pay.customer_id

           WHERE o.order_id = ?`,

          [orderId]

        );


      if (rows.length === 0) {

        return res.status(404).json({

          success: false,

          message:
            "Bill not found"

        });

      }


      const bill =
        rows[0];


      return res.json({

        success: true,

        bill: {

          bill_id:
            bill.order_id,

          order_id:
            bill.order_id,

          customer_id:
            bill.customer_id,

          customer_name:
            bill.customer_name,

          email:
            bill.email,

          product_id:
            bill.product_id,

          product_name:
            bill.product_name,

          brand:
            bill.brand,

          category:
            bill.category,

          quantity:
            Number(
              bill.quantity
            ),

          unit_price:
            Number(
              bill.unit_price
            ),

          subtotal:
            Number(
              Number(
                bill.subtotal || 0
              ).toFixed(2)
            ),

          GST:
            Number(
              Number(
                bill.GST || 0
              ).toFixed(2)
            ),

          discount:
            Number(
              Number(
                bill.discount || 0
              ).toFixed(2)
            ),

          total_amount:
            Number(
              Number(
                bill.total_amount || 0
              ).toFixed(2)
            ),

          order_date:
            bill.order_date,

          delivery_status:
            bill.delivery_status,

          payment_id:
            bill.payment_id,

          payment_method:
            bill.payment_method,

          payment_status:
            bill.payment_status,

          paid_amount:
            bill.paid_amount !== null
              ? Number(
                  Number(
                    bill.paid_amount
                  ).toFixed(2)
                )
              : null

        }

      });


    } catch (error) {

      console.error(
        "Get single bill error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch bill",

        error:
          error.message

      });

    }

  }
);


// ==================================================
// ADMIN - GET ALL BILLING HISTORY
// ==================================================

app.get(
  "/api/admin/billing",
  async (req, res) => {

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

            (

              o.unit_price * o.quantity

            ) AS subtotal,

            o.GST,

            o.discount,

            o.total_amount,

            o.order_date,

            o.delivery_status,

            pay.payment_id,

            pay.payment_method,

            pay.payment_status,

            pay.amount AS paid_amount

           FROM orders o

           INNER JOIN customer c

             ON o.customer_id = c.customer_id

           INNER JOIN products p

             ON o.product_id = p.product_id

           LEFT JOIN payment pay

             ON o.order_id = pay.order_id

             AND o.customer_id = pay.customer_id

           ORDER BY o.order_date DESC`

        );


      const bills =
        rows.map((bill) => {

          return {

            bill_id:
              bill.order_id,

            order_id:
              bill.order_id,

            customer_id:
              bill.customer_id,

            customer_name:
              bill.customer_name,

            email:
              bill.email,

            product_id:
              bill.product_id,

            product_name:
              bill.product_name,

            brand:
              bill.brand,

            category:
              bill.category,

            quantity:
              Number(
                bill.quantity
              ),

            unit_price:
              Number(
                bill.unit_price
              ),

            subtotal:
              Number(
                Number(
                  bill.subtotal || 0
                ).toFixed(2)
              ),

            GST:
              Number(
                Number(
                  bill.GST || 0
                ).toFixed(2)
              ),

            discount:
              Number(
                Number(
                  bill.discount || 0
                ).toFixed(2)
              ),

            total_amount:
              Number(
                Number(
                  bill.total_amount || 0
                ).toFixed(2)
              ),

            order_date:
              bill.order_date,

            delivery_status:
              bill.delivery_status,

            payment_id:
              bill.payment_id,

            payment_method:
              bill.payment_method,

            payment_status:
              bill.payment_status,

            paid_amount:
              bill.paid_amount !== null
                ? Number(
                    Number(
                      bill.paid_amount
                    ).toFixed(2)
                  )
                : null

          };

        });


      return res.json({

        success: true,

        bills:
          bills

      });


    } catch (error) {

      console.error(
        "Get admin billing history error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch billing history",

        error:
          error.message

      });

    }

  }
);


// ==================================================
// ADMIN - VIEW ALL ORDERS
// ==================================================

app.get(
  "/api/admin/orders",
  async (req, res) => {

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
// ADMIN - MANUAL STATUS UPDATE
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


      await db.query(

        `UPDATE orders
         SET delivery_status = ?
         WHERE order_id = ?`,

        [
          delivery_status,
          orderId
        ]

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
// ADMIN - UPDATE ORDER STATUS
// ==================================================

app.put(
  "/api/admin/orders/:orderId/status",
  async (req, res) => {

    try {

      const {
        orderId
      } = req.params;

      const {
        delivery_status
      } = req.body;


      const allowedStatuses = [
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
            "Invalid order status"

        });

      }


      // FIND THE ORDER GROUP
      const [orders] =
        await db.query(

          `SELECT
            order_id,
            order_group_id,
            customer_id
           FROM orders
           WHERE order_id = ?`,

          [
            orderId
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


      // USE THE GROUP ID
      // SO ALL PRODUCTS CHANGE TOGETHER
      const orderGroupId =
        order.order_group_id ||
        order.order_id;


      // UPDATE ALL PRODUCTS
      // IN THE SAME ORDER GROUP
      const [result] =
        await db.query(

          `UPDATE orders
           SET delivery_status = ?
           WHERE order_group_id = ?`,

          [
            delivery_status,
            orderGroupId
          ]

        );


      return res.json({

        success: true,

        message:
          "Order status updated successfully for all products",

        order_group_id:
          Number(orderGroupId),

        delivery_status:
          delivery_status,

        updated_orders:
          result.affectedRows

      });

    } catch (error) {

      console.error(
        "ADMIN ORDER STATUS ERROR:",
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

  }
);


// ==================================================
// REPORT ROUTES
// ==================================================

app.use(
  "/api/admin/reports",
  reportRoutes
);


// ==================================================
// CONTACT MESSAGE
// ==================================================

app.post("/api/contact", async (req, res) => {

  try {

    const {
      customer_id,
      name,
      email,
      subject,
      message
    } = req.body;

    if (
      !name ||
      !email ||
      !subject ||
      !message
    ) {

      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });

    }

    await db.query(
  `INSERT INTO contact_messages
   (
     customer_id,
     name,
     email,
     subject,
     message,
     admin_reply,
     replied_at
   )
   VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
  [
    customer_id || null,
    name,
    email,
    subject,
    message,
    "Thank you for shopping with CEMTrack Cement. We have received your query and will assist you shortly."
  ]
);

    return res.status(201).json({
      success: true,
      message: "Your message has been sent successfully!"
    });

  } catch (error) {

    console.error(
      "CONTACT MESSAGE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to send message",
      error: error.message
    });

  }

});


// ==================================================
// ADMIN - GET CONTACT MESSAGES
// ==================================================

app.get("/api/admin/contact-messages", async (req, res) => {

  try {

    const [rows] = await db.query(
      `SELECT
        message_id,
        customer_id,
        name,
        email,
        subject,
        message,
        created_at,
        admin_reply,
        replied_at
       FROM contact_messages
       ORDER BY created_at DESC`
    );

    return res.json({
      success: true,
      messages: rows
    });

  } catch (error) {

    console.error(
      "GET CONTACT MESSAGES ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load contact messages",
      error: error.message
    });

  }

});


// ==================================================
// ADMIN - REPLY TO CONTACT MESSAGE
// ==================================================

app.put(
  "/api/admin/contact-messages/:messageId/reply",
  async (req, res) => {

    try {

      const { messageId } = req.params;
      const { admin_reply } = req.body;

      if (
        !admin_reply ||
        !admin_reply.trim()
      ) {

        return res.status(400).json({
          success: false,
          message: "Reply message is required"
        });

      }

      const [result] = await db.query(
        `UPDATE contact_messages
         SET
           admin_reply = ?,
           replied_at = CURRENT_TIMESTAMP
         WHERE message_id = ?`,
        [
          admin_reply.trim(),
          messageId
        ]
      );

      if (result.affectedRows === 0) {

        return res.status(404).json({
          success: false,
          message: "Contact message not found"
        });

      }

      return res.json({
        success: true,
        message: "Reply sent successfully"
      });

    } catch (error) {

      console.error(
        "ADMIN REPLY ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Unable to send reply",
        error: error.message
      });

    }

  }
);

// ==================================================
// CUSTOMER - GET MY CONTACT MESSAGES
// ==================================================

app.get(
  "/api/contact/customer/:customerId",
  async (req, res) => {

    try {

      const { customerId } = req.params;

      const [rows] = await db.query(
        `SELECT
          message_id,
          customer_id,
          name,
          email,
          subject,
          message,
          created_at,
          admin_reply,
          replied_at
         FROM contact_messages
         WHERE customer_id = ?
         ORDER BY created_at DESC`,
        [customerId]
      );

      return res.json({
        success: true,
        messages: rows
      });

    } catch (error) {

      console.error(
        "GET CUSTOMER CONTACT MESSAGES ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Unable to load your messages",
        error: error.message
      });

    }

  }
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