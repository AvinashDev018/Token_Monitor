import express from "express";
import upload from "../middleware/upload.js";

import {
  analyzeImage,
  getAvailableModels,
} from "../controllers/imageController.js";

const router = express.Router();

// Upload & Analyze Image
router.post(
  "/upload",
  upload.single("image"),
  analyzeImage
);

// Get all available AI models
router.get(
  "/models",
  getAvailableModels
);

export default router;