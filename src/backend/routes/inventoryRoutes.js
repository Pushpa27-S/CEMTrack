import express from "express";

import {
  getInventory,
  getStock,
  addStock,
  updateStock,
  deleteStock
} from "../controllers/inventoryController.js";

const router = express.Router();


/*
========================================
GET ALL STOCK-IN RECORDS
========================================

GET
/api/admin/inventory
*/

router.get("/", getInventory);


/*
========================================
GET CURRENT STOCK
========================================

GET
/api/admin/inventory/stock
*/

router.get("/stock", getStock);


/*
========================================
ADD STOCK
========================================

POST
/api/admin/inventory
*/

router.post("/", addStock);


/*
========================================
UPDATE CURRENT STOCK
========================================

PUT
/api/admin/inventory/stock/:product_id
*/

router.put("/stock/:product_id", updateStock);


/*
========================================
DELETE STOCK-IN RECORD
========================================

DELETE
/api/admin/inventory/:stock_in_id
*/

router.delete("/:stock_in_id", deleteStock);


export default router;