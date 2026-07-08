import express from "express";
import {
    getSummary,
    getHistory,
    getDailyUsage
} from "../controllers/dashboardController.js";

const router = express.Router();
router.get("/history", getHistory);
router.get("/summary", getSummary);
router.get("/daily-usage", getDailyUsage);

export default router;