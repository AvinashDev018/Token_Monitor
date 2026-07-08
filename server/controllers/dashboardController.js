import db from "../config/db.js";

export const getDashboard = async (req, res) => {
    try {

        const [rows] = await db.execute(`
            SELECT
                COUNT(*) AS totalRequests,
                SUM(input_tokens) AS totalInputTokens,
                SUM(output_tokens) AS totalOutputTokens,
                SUM(total_tokens) AS totalTokens
            FROM request_logs
        `);

        res.json(rows[0]);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }
};