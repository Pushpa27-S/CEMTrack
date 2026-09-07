import express from "express";
import multer from "multer";

import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

const router = express.Router();


// ======================================================
// MULTER
// ======================================================

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024
  }
});


// ======================================================
// GET ALL PRODUCTS
// ======================================================

router.get("/", getProducts);


// ======================================================
// GET PRODUCT BY ID
// ======================================================

router.get("/:id", getProductById);


// ======================================================
// ADD PRODUCT + IMAGE
// ======================================================

router.post(
  "/",
  upload.single("image"),
  addProduct
);


// ======================================================
// UPDATE PRODUCT
// ======================================================

router.put(
  "/:id",
  updateProduct
);


// ======================================================
// DELETE PRODUCT
// ======================================================

router.delete(
  "/:id",
  deleteProduct
);


export default router;