import express from "express";

import {
  getCustomers,
  getCustomerById,
  addCustomer,
  updateCustomer,
  deleteCustomer
} from "../controllers/customerController.js";

const router = express.Router();


// GET all customers
router.get("/", getCustomers);


// GET customer by ID
router.get("/:id", getCustomerById);


// ADD customer
router.post("/", addCustomer);


// UPDATE customer
router.put("/:id", updateCustomer);


// DELETE customer
router.delete("/:id", deleteCustomer);


export default router;