import { useEffect, useState } from "react";
import axios from "axios";

import DashboardCards from "../Components/DashboardCards";
import DailyUsageChart from "../Components/DailyUsageChart";

import "../App.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  // ----------------------------
  // Default Date
  // ----------------------------
  const today = new Date().toISOString().split("T")[0];

  // ----------------------------
  // Filters
  // ----------------------------
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("ALL");

  // ----------------------------
  // Load Models
  // ----------------------------
  useEffect(() => {
    loadModels();
  }, [startDate, endDate]);

  const loadModels = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/dashboard/models`,
        {
          params: {
            startDate,
            endDate,
          },
        }
      );

      const modelList = res.data.models || [];

      if (modelList.length === 1) {
        setModels(modelList);

        if (selectedModel !== modelList[0]) {
          setSelectedModel(modelList[0]);
        }
      } else {
        setModels(["ALL", ...modelList]);

        if (
          selectedModel !== "ALL" &&
          !modelList.includes(selectedModel)
        ) {
          setSelectedModel("ALL");
        }
      }
    } catch (err) {
      console.error("Failed to load models:", err);
    }
  };

  return (
    <div className="container">

      <h1>AI Token Monitor</h1>

      {/* Toolbar */}
      <div className="dashboard-toolbar">

        <label>From</label>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <label>To</label>

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <div style={{ marginLeft: "auto" }}>

          <label style={{ marginRight: 10 }}>
            AI Model
          </label>

          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {models.length > 1 && (
              <option value="ALL">
                All Models
              </option>
            )}

            {models.map(
              (model) =>
                model !== "ALL" && (
                  <option
                    key={model}
                    value={model}
                  >
                    {model}
                  </option>
                )
            )}
          </select>

        </div>

      </div>

      {/* Dashboard Cards */}
      <DashboardCards
        startDate={startDate}
        endDate={endDate}
        model={selectedModel}
      />

      {/* Daily Usage Chart */}
      <DailyUsageChart
        startDate={startDate}
        endDate={endDate}
        model={selectedModel}
      />

    </div>
  );
}