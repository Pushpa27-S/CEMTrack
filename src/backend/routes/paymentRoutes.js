const express = require("express");
const router = express.Router();
const db = require("../db");

// Add payment + update stock
router.post("/", (req, res) => {
    const {
        order_id,
        customer_id,
        amount,
        payment_method,
        payment_status
    } = req.body;

    // 1. Get the order details
    const orderSql = `
        SELECT product_name, quantity
        FROM orders
        WHERE order_id = ?
    `;

    db.query(orderSql, [order_id], (err, orders) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Failed to find order",
                error: err.message
            });
        }

        if (orders.length === 0) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        const productName = orders[0].product_name;
        const quantity = Number(orders[0].quantity);

        // 2. Insert payment
        const paymentSql = `
            INSERT INTO payment
            (order_id, customer_id, amount, payment_method, payment_status)
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(
            paymentSql,
            [
                order_id,
                customer_id,
                amount,
                payment_method,
                payment_status
            ],
            (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        message: "Payment failed",
                        error: err.message
                    });
                }

                // 3. Update stock only when payment is successful
                if (payment_status === "Paid") {

                    const stockSql = `
                        UPDATE products
                        SET stock_quantity = stock_quantity - ?
                        WHERE product_name = ?
                        AND stock_quantity >= ?
                    `;

                    db.query(
                        stockSql,
                        [quantity, productName, quantity],
                        (err, stockResult) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).json({
                                    message: "Payment saved but stock update failed",
                                    error: err.message
                                });
                            }

                            if (stockResult.affectedRows === 0) {
                                return res.status(400).json({
                                    message: "Insufficient stock or product not found"
                                });
                            }

                            return res.status(201).json({
                                message: "Payment recorded and stock updated successfully",
                                payment_id: result.insertId
                            });
                        }
                    );

                } else {
                    // Payment not marked Paid, so don't reduce stock
                    return res.status(201).json({
                        message: "Payment recorded successfully",
                        payment_id: result.insertId
                    });
                }
            }
        );
    });
});


// Get payments
router.get("/", (req, res) => {
    const sql = "SELECT * FROM payment";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to fetch payments",
                error: err.message
            });
        }

        res.json(results);
    });
});

module.exports = router;