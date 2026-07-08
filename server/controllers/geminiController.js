import { analyzeImageWithGemini } from "../services/geminiService.js";
import db from "../config/db.js"; // <-- Add this import

export const analyzeImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    // Call Gemini
    const response = await analyzeImageWithGemini(
      req.file.path,
      req.file.mimetype
    );

    // Get token usage
    const usage = response.usageMetadata;

    const inputTokens = usage.promptTokenCount;
    const outputTokens = usage.candidatesTokenCount;
    const totalTokens = usage.totalTokenCount;

    // Placeholder cost
    const estimatedCost = 0;

    // Save to MySQL
    await db.execute(
      `INSERT INTO request_logs
      (provider, model, input_tokens, output_tokens, total_tokens,
      estimated_cost, latency_ms, status, image_name)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        "Gemini",
        response.modelVersion,
        inputTokens,
        outputTokens,
        totalTokens,
        estimatedCost,
        0, // We'll calculate latency later
        "SUCCESS",
        req.file.filename,
      ]
    );

    // Send response to frontend
    res.json({
      success: true,
      description: response.text,
      usage,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};