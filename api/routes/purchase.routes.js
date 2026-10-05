import express from "express";
import {
  createPurchase,
  getPurchasesByBudget,
  deletePurchase,
} from "../controller/purchase.controller.js";
import { protect } from "../../utils/protect.js";

const router = express.Router();

router.post("/create", protect, createPurchase);
router.get("/get/:budgetId", protect, getPurchasesByBudget);
router.delete("/delete/:id", protect, deletePurchase);

export default router;