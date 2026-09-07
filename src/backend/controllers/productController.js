import db from "../db.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imageDirectory = path.join(
  __dirname,
  "../public/images/products"
);

// Make sure image directory exists
await fs.mkdir(imageDirectory, { recursive: true });


// ======================================================
// FIND PRODUCT IMAGE
// ======================================================

const getProductImage = async (productId) => {

  try {

    const files = await fs.readdir(imageDirectory);

    const imageFile = files.find((file) => {

      const extension = path.extname(file).toLowerCase();

      return (
        file.startsWith(`${productId}.`) &&
        [".jpg", ".jpeg", ".png", ".webp"].includes(extension)
      );

    });

    if (!imageFile) {
      return null;
    }

    return `/images/products/${imageFile}`;

  } catch (error) {

    console.error("Image search error:", error);

    return null;
  }
};


// ======================================================
// GET ALL PRODUCTS
// ======================================================

export const getProducts = async (req, res) => {

  try {

    const [rows] = await db.query(`
      SELECT
        product_id,
        product_name,
        brand,
        category,
        price,
        stock_quantity,
        minimum_stock,
        last_updated
      FROM products
      ORDER BY product_id DESC
    `);

    const products = await Promise.all(

      rows.map(async (product) => {

        const image = await getProductImage(
          product.product_id
        );

        return {
          ...product,
          image
        };

      })

    );

    res.json({
      success: true,
      products
    });

  } catch (error) {

    console.error("Get products error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products"
    });

  }

};


// ======================================================
// GET PRODUCT BY ID
// ======================================================

export const getProductById = async (req, res) => {

  try {

    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT
        product_id,
        product_name,
        brand,
        category,
        price,
        stock_quantity,
        minimum_stock,
        last_updated
      FROM products
      WHERE product_id = ?
      `,
      [id]
    );

    if (rows.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Product not found"
      });

    }

    const image = await getProductImage(
      rows[0].product_id
    );

    const product = {
      ...rows[0],
      image
    };

    res.json({
      success: true,
      product
    });

  } catch (error) {

    console.error("Get product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch product"
    });

  }

};


// ======================================================
// ADD PRODUCT
// ======================================================

export const addProduct = async (req, res) => {

  try {

    const {
      product_name,
      brand,
      category,
      price,
      stock_quantity,
      minimum_stock
    } = req.body;


    // Validate fields

    if (
      !product_name ||
      !brand ||
      !category ||
      price === undefined ||
      stock_quantity === undefined ||
      minimum_stock === undefined
    ) {

      return res.status(400).json({
        success: false,
        message: "All product fields are required"
      });

    }


    // Validate numbers

    if (Number(price) < 0) {

      return res.status(400).json({
        success: false,
        message: "Price cannot be negative"
      });

    }

    if (Number(stock_quantity) < 0) {

      return res.status(400).json({
        success: false,
        message: "Stock quantity cannot be negative"
      });

    }

    if (Number(minimum_stock) < 0) {

      return res.status(400).json({
        success: false,
        message: "Minimum stock cannot be negative"
      });

    }


    // ==================================================
    // INSERT PRODUCT
    // ==================================================

    const [result] = await db.query(
      `
      INSERT INTO products
      (
        product_name,
        brand,
        category,
        price,
        stock_quantity,
        minimum_stock,
        last_updated
      )
      VALUES (?, ?, ?, ?, ?, ?, CURDATE())
      `,
      [
        product_name,
        brand,
        category,
        price,
        stock_quantity,
        minimum_stock
      ]
    );


    const productId = result.insertId;


    // ==================================================
    // SAVE IMAGE
    // ==================================================

    if (req.file) {

      const extension = path.extname(
        req.file.originalname
      ).toLowerCase();

      const allowedExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
      ];

      if (!allowedExtensions.includes(extension)) {

        await db.query(
          "DELETE FROM products WHERE product_id = ?",
          [productId]
        );

        return res.status(400).json({
          success: false,
          message:
            "Only JPG, JPEG, PNG and WEBP images are allowed"
        });

      }


      const imagePath = path.join(
        imageDirectory,
        `${productId}${extension}`
      );


      await fs.writeFile(
        imagePath,
        req.file.buffer
      );

    }


    // ==================================================
    // RESPONSE
    // ==================================================

    const image = req.file
      ? `/images/products/${productId}${path.extname(
          req.file.originalname
        ).toLowerCase()}`
      : null;


    res.status(201).json({

      success: true,

      message: "Product added successfully",

      product_id: productId,

      image

    });

  } catch (error) {

    console.error("Add product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add product"
    });

  }

};


// ======================================================
// UPDATE PRODUCT
// ======================================================

export const updateProduct = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      product_name,
      brand,
      category,
      price,
      minimum_stock
    } = req.body;


    const [result] = await db.query(
      `
      UPDATE products
      SET
        product_name = ?,
        brand = ?,
        category = ?,
        price = ?,
        minimum_stock = ?,
        last_updated = CURDATE()
      WHERE product_id = ?
      `,
      [
        product_name,
        brand,
        category,
        price,
        minimum_stock,
        id
      ]
    );


    if (result.affectedRows === 0) {

      return res.status(404).json({
        success: false,
        message: "Product not found"
      });

    }


    res.json({
      success: true,
      message: "Product updated successfully"
    });

  } catch (error) {

    console.error("Update product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update product"
    });

  }

};


// ======================================================
// DELETE PRODUCT
// ======================================================

export const deleteProduct = async (req, res) => {

  try {

    const { id } = req.params;


    const [result] = await db.query(
      `
      DELETE FROM products
      WHERE product_id = ?
      `,
      [id]
    );


    if (result.affectedRows === 0) {

      return res.status(404).json({
        success: false,
        message: "Product not found"
      });

    }


    // Delete associated image

    const files = await fs.readdir(
      imageDirectory
    );


    for (const file of files) {

      if (file.startsWith(`${id}.`)) {

        await fs.unlink(
          path.join(imageDirectory, file)
        );

      }

    }


    res.json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {

    console.error("Delete product error:", error);

    res.status(500).json({
      success: false,
      message:
        "Product cannot be deleted because it may be linked to orders or stock records"
    });

  }

};