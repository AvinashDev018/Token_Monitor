import express from "express";

const router = express.Router();

router.post("/log", (req, res) => {
    console.log(req.body);

    res.json({
        success: true,
        message: "SDK Log Received"
    });
});

export default router;