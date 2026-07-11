import { useEffect, useState } from "react";
import {
  getDashboardSummary,
  getModels,
} from "../api/dashboardApi";
import "./DashboardCards.css";

export default function DashboardCards() {
  const today = new Date().toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("ALL");

  const [dashboard, setDashboard] = useState({
    totalRequests: 0,
    inputTokens: 0,
    outputTokens: 0,
    billableTokens: 0,
    estimatedCost: 0,
    successRequests: 0,
    failedRequests: 0,
  });

  const USD_TO_INR = 95.45;

  const estimatedCostInr =
    Number(dashboard.estimatedCost) * USD_TO_INR;

  // -----------------------------------
  // Load Models based on Date Range
  // -----------------------------------
  const loadModels = async () => {
    try {
      const res = await getModels(startDate, endDate);

      console.log("Models:", res.data);

      const modelList = res.data.models || [];

      setModels(modelList);

      if (modelList.length === 1) {
        setSelectedModel(modelList[0]);
      } else {
        setSelectedModel("ALL");
      }

    } catch (err) {
      console.error(err);
    }
  };

  // -----------------------------------
  // Load Dashboard
  // -----------------------------------
  const loadDashboard = async () => {
    try {
      const res = await getDashboardSummary(
        startDate,
        endDate,
        selectedModel
      );

      console.log("Dashboard:", res.data);

      setDashboard(res.data.data);

    } catch (err) {
      console.error(err);
    }
  };

  // -----------------------------------
  // Reload Models when Date Changes
  // -----------------------------------
  useEffect(() => {
    loadModels();
  }, [startDate, endDate]);

  // -----------------------------------
  // Reload Dashboard
  // -----------------------------------
  useEffect(() => {

    loadDashboard();

    const interval = setInterval(() => {
      loadDashboard();
    }, 5000);

    return () => clearInterval(interval);

  }, [startDate, endDate, selectedModel]);

  return (
    <>
      <div className="dashboard-toolbar">

        {/* Date Filter */}

        <div className="date-filter">

          <label>From:</label>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <label>To:</label>

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

        </div>

        {/* Model Filter */}

        <div className="model-filter">

          <label>Select Model:</label>

          <select
            value={selectedModel}
            onChange={(e) =>
              setSelectedModel(e.target.value)
            }
          >

            {models.length > 1 && (
              <option value="ALL">
                All Models
              </option>
            )}

            {models.map((model) => (
              <option
                key={model}
                value={model}
              >
                {model}
              </option>
            ))}

          </select>

        </div>

      </div>

      <div className="cards">

        <div className="card">
          <h3>Total Requests</h3>
          <h1>{dashboard.totalRequests}</h1>
        </div>

        <div className="card">
          <h3>Input Tokens</h3>
          <h1>{dashboard.inputTokens}</h1>
        </div>

        <div className="card">
          <h3>Output Tokens</h3>
          <h1>{dashboard.outputTokens}</h1>
        </div>

        <div className="card">
          <h3>Billable Tokens</h3>
          <h1>{dashboard.billableTokens}</h1>
        </div>

        <div className="card">
          <h3>Estimated Cost (INR)</h3>
          <h1>₹{estimatedCostInr.toFixed(4)}</h1>
        </div>

        <div className="card">
          <h3>Success</h3>
          <h1>{dashboard.successRequests}</h1>
        </div>

        <div className="card">
          <h3>Failed</h3>
          <h1>{dashboard.failedRequests}</h1>
        </div>

      </div>
    </>
  );
}