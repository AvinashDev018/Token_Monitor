import db from "../config/db.js";
import { getUsdToInrRate } from "../services/exchangeRateService.js";

export const saveSdkLog = async (req, res) => {
  console.log("========== SDK LOG ==========");
  console.log("JWT User:", req.user);
  console.log("SDK Key:", req.headers["x-sdk-key"]);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);

  try {
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing",
      });
    }

    const {
      provider,
      model,
      usage = {},
      latency,
      status,
      prompt = null,
      imageName = null,
      errorMessage = null,
      traceId = null,
      endUserId = null,
    } = req.body;

    const sdkKey = req.headers["x-sdk-key"];
    const sdkVersion = req.headers["x-sdk-version"];
    const environment = req.headers["x-environment"];

    if (!sdkKey) {
      return res.status(400).json({
        success: false,
        message: "SDK Key is missing",
      });
    }

    //----------------------------------------------------
    // Find Application
    //----------------------------------------------------
    const [applications] = await db.execute(
      `
      SELECT id, owner_id
      FROM applications
      WHERE sdk_key = ?
      LIMIT 1
      `,
      [sdkKey]
    );

    if (!applications.length) {
      return res.status(404).json({
        success: false,
        message: "Invalid SDK Key",
      });
    }

    const application = applications[0];

    //----------------------------------------------------
    // Determine request owner
    //----------------------------------------------------
    let userId = application.owner_id;
    let userName = null;
    let userEmail = null;

    const requestUserType = endUserId
      ? "END_USER"
      : "APPLICATION_OWNER";

    if (endUserId) {
      userId = endUserId;
    }

    console.log("Telemetry Request User", {
      requestUserType,
      applicationId: application.id,
      userId,
      traceId,
    });

    const [users] = await db.execute(
      `
      SELECT id, name, email
      FROM users
      WHERE id = ?
      LIMIT 1
      `,
      [userId]
    );

    if (users.length) {
      userId = users[0].id;
      userName = users[0].name;
      userEmail = users[0].email;
    }

    //----------------------------------------------------
    // Token Usage
    //----------------------------------------------------
    const inputTokens = usage?.promptTokenCount || 0;
    const outputTokens = usage?.candidatesTokenCount || 0;
    const apiTotalTokens = usage?.totalTokenCount || 0;
    const billableTokens = inputTokens + outputTokens;

    //----------------------------------------------------
    // Pricing
    //----------------------------------------------------
    const [prices] = await db.execute(
      `
      SELECT
        input_price_per_million,
        output_price_per_million
      FROM model_pricing
      WHERE model_name = ?
      ORDER BY effective_from DESC
      LIMIT 1
      `,
      [model]
    );

    let estimatedCost = 0;

    if (prices.length) {
      const inputCost =
        (inputTokens / 1_000_000) *
        Number(prices[0].input_price_per_million);

      const outputCost =
        (outputTokens / 1_000_000) *
        Number(prices[0].output_price_per_million);

      const usdToInr = await getUsdToInrRate();

      estimatedCost = Number(
        ((inputCost + outputCost) * usdToInr).toFixed(6)
      );
    }

    //----------------------------------------------------
    // Insert
    //----------------------------------------------------
    await db.execute(
      `
      INSERT INTO request_logs
      (
        user_id,
        user_name,
        user_email,
        application_id,
        provider,
        model,
        prompt,
        image_name,
        input_tokens,
        output_tokens,
        billable_tokens,
        api_total_tokens,
        estimated_cost,
        latency_ms,
        status,
        error_message,
        sdk_key,
        sdk_version,
        environment,
        trace_id
      )
      VALUES
      (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `,
      [
        userId,
        userName,
        userEmail,
        application.id,
        provider,
        model,
        prompt,
        imageName,
        inputTokens,
        outputTokens,
        billableTokens,
        apiTotalTokens,
        estimatedCost,
        latency,
        status,
        errorMessage,
        sdkKey,
        sdkVersion,
        environment,
        traceId,
      ]
    );

    const [lastRow] = await db.execute(`
      SELECT
        id,
        user_id,
        user_name,
        user_email,
        application_id,
        trace_id
      FROM request_logs
      ORDER BY id DESC
      LIMIT 1
    `);

    console.log("LAST INSERT");
    console.table(lastRow);

    return res.json({
      success: true,
      message: "Telemetry saved successfully",
    });

  } catch (err) {
    console.error("SDK LOG ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};