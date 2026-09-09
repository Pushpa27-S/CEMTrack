import express from "express";
import db from "../db.js";

const router = express.Router();

// =====================================================
// RECORD PAYMENT
// =====================================================
router.post("/", async (req, res) => {
  let connection;

  try {
    const {
      order_id,
      customer_id,
      payment_method
    } = req.body;

    // -------------------------------------------------
    // 1. Check required fields
    // -------------------------------------------------
    if (!order_id || !customer_id || !payment_method) {
      return res.status(400).json({
        success: false,
        message:
          "order_id, customer_id and payment_method are required"
      });
    }

    // -------------------------------------------------
    // 2. Get database connection
    // -------------------------------------------------
    connection = await db.getConnection();

    // Start transaction
    await connection.beginTransaction();

    // -------------------------------------------------
    // 3. Get order details
    // -------------------------------------------------
    const [orders] = await connection.query(
      `SELECT
        order_id,
        customer_id,
        total_amount,
        delivery_status
       FROM orders
       WHERE order_id = ?
       AND customer_id = ?
       FOR UPDATE`,
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

    // -------------------------------------------------
    // 4. Check whether payment already exists
    // -------------------------------------------------
    const [existingPayments] = await connection.query(
      `SELECT
        payment_id,
        payment_status
       FROM payment
       WHERE order_id = ?
       LIMIT 1
       FOR UPDATE`,
      [order_id]
    );

    if (existingPayments.length > 0) {
      await connection.rollback();

      return res.status(409).json({
        success: false,
        message: "Payment already recorded for this order",
        payment_id: existingPayments[0].payment_id,
        payment_status: existingPayments[0].payment_status
      });
    }

    // -------------------------------------------------
    // 5. Payment status
    // -------------------------------------------------
    // Currently simulating successful payment
    const payment_status = "Paid";

    // -------------------------------------------------
    // 6. Insert payment
    // -------------------------------------------------
    const [result] = await connection.query(
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
        Number(order.total_amount),
        payment_method,
        payment_status
      ]
    );

    // -------------------------------------------------
    // 7. AUTOMATICALLY CONFIRM ORDER
    // -------------------------------------------------
    // Successful payment:
    //
    // Pending → Confirmed
    //
    // This is the important part.
    // -------------------------------------------------

    if (payment_status === "Paid") {
      const [updateResult] = await connection.query(
        `UPDATE orders
         SET delivery_status = 'Confirmed'
         WHERE order_id = ?
         AND customer_id = ?`,
        [order_id, customer_id]
      );

      // Make sure the order was actually updated
      if (updateResult.affectedRows === 0) {
        await connection.rollback();

        return res.status(500).json({
          success: false,
          message: "Payment could not confirm the order"
        });
      }
    }

    // -------------------------------------------------
    // IMPORTANT:
    // DO NOT UPDATE STOCK HERE
    //
    // Stock is already reduced inside:
    // POST /api/orders
    //
    // Updating stock here would reduce it twice.
    // -------------------------------------------------

    // -------------------------------------------------
    // 8. Commit everything
    // -------------------------------------------------
    await connection.commit();

    // -------------------------------------------------
    // 9. Send successful response
    // -------------------------------------------------
    return res.status(201).json({
      success: true,
      message: "Payment recorded and order confirmed successfully",

      payment: {
        payment_id: result.insertId,
        order_id: order.order_id,
        customer_id: order.customer_id,
        amount: Number(order.total_amount),
        payment_method,
        payment_status
      },

      order: {
        order_id: order.order_id,
        delivery_status: "Confirmed"
      }
    });

  } catch (error) {

    // Rollback if something fails
    if (connection) {
      await connection.rollback();
    }

    console.error("Payment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to record payment",
      error: error.message
    });

  } finally {

    // Release connection
    if (connection) {
      connection.release();
    }
  }
});


// =====================================================
// GET ALL PAYMENTS
// =====================================================
router.get("/", async (req, res) => {
  try {

    const [rows] = await db.query(
      `SELECT
        payment_id,
        order_id,
        customer_id,
        amount,
        payment_date,
        payment_method,
        payment_status
       FROM payment
       ORDER BY payment_id DESC`
    );

    return res.json({
      success: true,
      payments: rows
    });

  } catch (error) {

    console.error("Get payments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
      error: error.message
    });
  }
});


// =====================================================
// GET PAYMENT BY ORDER ID
// =====================================================
router.get("/order/:orderId", async (req, res) => {
  try {

    const { orderId } = req.params;

    const [rows] = await db.query(
      `SELECT
        payment_id,
        order_id,
        customer_id,
        amount,
        payment_date,
        payment_method,
        payment_status
       FROM payment
       WHERE order_id = ?`,
      [orderId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Payment not found for this order"
      });
    }

    return res.json({
      success: true,
      payment: rows[0]
    });

  } catch (error) {

    console.error("Get payment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch payment",
      error: error.message
    });
  }
});


export default router;