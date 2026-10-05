import express from "express";
import { getDashboardOverview } from "../controller/dashboard.controller.js";
import { protect } from "../../utils/protect.js";

const router = express.Router();

router.get("/overview", protect, getDashboardOverview);

export default router;