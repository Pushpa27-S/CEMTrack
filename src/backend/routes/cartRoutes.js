const express = require("express");
const router = express.Router();
const db = require("../db");

// ==========================================
// ADD PRODUCT TO CART
// POST /api/cart
// ==========================================
router.post("/", (req, res) => {
  const { customer_id, product_id, quantity } = req.body;

  if (!customer_id || !product_id) {
    return res.status(400).json({
      message: "customer_id and product_id are required"
    });
  }

  const qty = Number(quantity) || 1;

  if (qty < 1) {
    return res.status(400).json({
      message: "Quantity must be at least 1"
    });
  }

  // Check product and stock
  db.query(
    "SELECT product_id, product_name, price, stock_quantity FROM products WHERE product_id = ?",
    [product_id],
    (err, products) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Database error"
        });
      }

      if (products.length === 0) {
        return res.status(404).json({
          message: "Product not found"
        });
      }

      const product = products[0];

      // Check whether product already exists in cart
      db.query(
        `SELECT * FROM cart
         WHERE customer_id = ? AND product_id = ?`,
        [customer_id, product_id],
        (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).json({
              message: "Database error"
            });
          }

          // Existing cart item
          if (results.length > 0) {
            const newQuantity = results[0].quantity + qty;

            if (newQuantity > product.stock_quantity) {
              return res.status(400).json({
                message: `Only ${product.stock_quantity} items available in stock`
              });
            }

            db.query(
              "UPDATE cart SET quantity = ? WHERE cart_id = ?",
              [newQuantity, results[0].cart_id],
              (err) => {
                if (err) {
                  console.error(err);
                  return res.status(500).json({
                    message: "Failed to update cart"
                  });
                }

                res.json({
                  message: "Product quantity updated",
                  cart_id: results[0].cart_id,
                  quantity: newQuantity
                });
              }
            );
          }

          // New cart item
          else {
            if (qty > product.stock_quantity) {
              return res.status(400).json({
                message: `Only ${product.stock_quantity} items available in stock`
              });
            }

            db.query(
              `INSERT INTO cart
               (customer_id, product_id, quantity)
               VALUES (?, ?, ?)`,
              [customer_id, product_id, qty],
              (err, result) => {
                if (err) {
                  console.error(err);
                  return res.status(500).json({
                    message: "Failed to add product"
                  });
                }

                res.status(201).json({
                  message: "Product added to cart",
                  cart_id: result.insertId,
                  quantity: qty
                });
              }
            );
          }
        }
      );
    }
  );
});


// ==========================================
// VIEW CUSTOMER CART
// GET /api/cart/:customer_id
// ==========================================
router.get("/:customer_id", (req, res) => {
  const { customer_id } = req.params;

  const sql = `
    SELECT
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
    JOIN products p
      ON c.product_id = p.product_id
    WHERE c.customer_id = ?
  `;

  db.query(sql, [customer_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Database error"
      });
    }

    const total = results.reduce(
      (sum, item) => sum + Number(item.item_total),
      0
    );

    res.json({
      customer_id: Number(customer_id),
      cart: results,
      total: total.toFixed(2)
    });
  });
});


// ==========================================
// CHANGE QUANTITY
// PUT /api/cart/:id
// ==========================================
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  const qty = Number(quantity);

  if (!Number.isInteger(qty) || qty < 1) {
    return res.status(400).json({
      message: "Quantity must be at least 1"
    });
  }

  // Check stock before updating
  const sql = `
    SELECT
      c.cart_id,
      p.stock_quantity
    FROM cart c
    JOIN products p
      ON c.product_id = p.product_id
    WHERE c.cart_id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Database error"
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Cart item not found"
      });
    }

    if (qty > results[0].stock_quantity) {
      return res.status(400).json({
        message: `Only ${results[0].stock_quantity} items available in stock`
      });
    }

    db.query(
      "UPDATE cart SET quantity = ? WHERE cart_id = ?",
      [qty, id],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            message: "Database error"
          });
        }

        res.json({
          message: "Quantity updated successfully",
          quantity: qty
        });
      }
    );
  });
});


// ==========================================
// REMOVE PRODUCT FROM CART
// DELETE /api/cart/:id
// ==========================================
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM cart WHERE cart_id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Database error"
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Cart item not found"
        });
      }

      res.json({
        message: "Product removed from cart"
      });
    }
  );
});


module.exports = router;