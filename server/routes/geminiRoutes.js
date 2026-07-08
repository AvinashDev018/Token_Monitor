import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { analyzeImage } from "../controllers/geminiController.js";

const router = express.Router();

router.post("/analyze", upload.single("image"), analyzeImage);

export default router;