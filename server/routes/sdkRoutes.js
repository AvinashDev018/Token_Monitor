import express from "express";
import { saveSdkLog } from "../controllers/sdkController.js";

const router = express.Router();

// SDK Telemetry Log
router.post(
  "/log",
  saveSdkLog
);

export default router;