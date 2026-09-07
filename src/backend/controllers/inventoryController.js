import db from "../db.js";

/*
========================================
GET ALL INVENTORY / STOCK
========================================
*/

export const getInventory = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        si.stock_in_id,
        si.product_id,
        p.product_name,
        p.brand,
        p.category,
        p.stock_quantity,
        p.minimum_stock,
        si.supplier_id,
        s.supplier_name,
        si.quantity_added,
        si.purchase_price,
        si.stock_in_date
      FROM stock_in si
      INNER JOIN products p
        ON si.product_id = p.product_id
      INNER JOIN supplier s
        ON si.supplier_id = s.supplier_id
      ORDER BY si.stock_in_id DESC
    `);

    res.status(200).json({
      success: true,
      inventory: rows
    });

  } catch (error) {
    console.error("Get inventory error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch inventory",
      error: error.message
    });
  }
};


/*
========================================
GET CURRENT STOCK OF ALL PRODUCTS
========================================
*/

export const getStock = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        product_id,
        product_name,
        brand,
        category,
        stock_quantity,
        minimum_stock,
        price,
        last_updated
      FROM products
      ORDER BY product_id ASC
    `);

    res.status(200).json({
      success: true,
      products: rows
    });

  } catch (error) {
    console.error("Get stock error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch stock",
      error: error.message
    });
  }
};


/*
========================================
ADD STOCK
========================================

This does TWO things:

1. Adds a record to stock_in
2. Increases products.stock_quantity
*/

export const addStock = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const {
      product_id,
      supplier_id,
      quantity_added,
      purchase_price,
      stock_in_date
    } = req.body;

    if (
      !product_id ||
      !supplier_id ||
      !quantity_added ||
      !purchase_price ||
      !stock_in_date
    ) {
      return res.status(400).json({
        success: false,
        message: "All stock details are required"
      });
    }

    await connection.beginTransaction();

    /*
    Add stock-in record
    */

    await connection.query(
      `
      INSERT INTO stock_in
      (
        product_id,
        supplier_id,
        quantity_added,
        purchase_price,
        stock_in_date
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        product_id,
        supplier_id,
        quantity_added,
        purchase_price,
        stock_in_date
      ]
    );

    /*
    Increase current product stock
    */

    await connection.query(
      `
      UPDATE products
      SET
        stock_quantity = stock_quantity + ?,
        last_updated = ?
      WHERE product_id = ?
      `,
      [
        quantity_added,
        stock_in_date,
        product_id
      ]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Stock added successfully"
    });

  } catch (error) {

    await connection.rollback();

    console.error("Add stock error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add stock",
      error: error.message
    });

  } finally {
    connection.release();
  }
};


/*
========================================
UPDATE CURRENT STOCK
========================================

This is useful for your current Stock page.

It directly changes the stock_quantity
of a product.
*/

export const updateStock = async (req, res) => {
  try {

    const { product_id } = req.params;
    const { stock_quantity } = req.body;

    if (
      stock_quantity === undefined ||
      stock_quantity === null ||
      stock_quantity < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid stock quantity is required"
      });
    }

    const [result] = await db.query(
      `
      UPDATE products
      SET
        stock_quantity = ?,
        last_updated = CURDATE()
      WHERE product_id = ?
      `,
      [
        stock_quantity,
        product_id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Stock updated successfully"
    });

  } catch (error) {

    console.error("Update stock error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update stock",
      error: error.message
    });

  }
};


/*
========================================
DELETE STOCK-IN RECORD
========================================

When a stock-in record is deleted,
the quantity added by that record is
also removed from current stock.
*/

export const deleteStock = async (req, res) => {

  const connection = await db.getConnection();

  try {

    const { stock_in_id } = req.params;

    /*
    First find the stock record
    */

    const [records] = await connection.query(
      `
      SELECT
        product_id,
        quantity_added
      FROM stock_in
      WHERE stock_in_id = ?
      `,
      [stock_in_id]
    );

    if (records.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Stock record not found"
      });

    }

    const productId = records[0].product_id;
    const quantityAdded = records[0].quantity_added;

    await connection.beginTransaction();

    /*
    Remove quantity from current stock
    */

    await connection.query(
      `
      UPDATE products
      SET
        stock_quantity = stock_quantity - ?,
        last_updated = CURDATE()
      WHERE product_id = ?
      `,
      [
        quantityAdded,
        productId
      ]
    );

    /*
    Delete stock-in record
    */

    await connection.query(
      `
      DELETE FROM stock_in
      WHERE stock_in_id = ?
      `,
      [stock_in_id]
    );

    await connection.commit();

    res.status(200).json({
      success: true,
      message: "Stock record deleted successfully"
    });

  } catch (error) {

    await connection.rollback();

    console.error("Delete stock error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete stock record",
      error: error.message
    });

  } finally {

    connection.release();

  }

};