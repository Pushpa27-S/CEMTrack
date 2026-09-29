import express from "express";

import {
  getReports
} from "../controllers/reportController.js";


const router = express.Router();


// ======================================================
// GET SALES REPORT
// ======================================================

router.get(
  "/",
  getReports
);


export default router;