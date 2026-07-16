import { useEffect, useState } from "react";
import { getDailyUsage } from "../api/dashboardApi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ---------------------
// Format Date
// ---------------------
const formatDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
};

// ---------------------
// Tooltip
// ---------------------
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const row = payload[0].payload;

  return (
    <div
      style={{
        background: "#fff",
        padding: "15px",
        borderRadius: "10px",
        border: "1px solid #ddd",
        boxShadow: "0 8px 18px rgba(0,0,0,.15)",
        minWidth: "220px",
      }}
    >
      <h4
        style={{
          margin: 0,
          marginBottom: 12,
        }}
      >
        📅 {formatDate(row.day)}
      </h4>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <span>Total Requests</span>

        <strong>{row.requests}</strong>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>Billable Tokens</span>

        <strong style={{ color: "#2563eb" }}>
          {Number(row.billableTokens).toLocaleString()}
        </strong>
      </div>
    </div>
  );
};

export default function DailyUsageChart({
  startDate,
  endDate,
  model,
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChart();
  }, [startDate, endDate, model]);

  const loadChart = async () => {
    try {
      setLoading(true);

      const res = await getDailyUsage(
        startDate,
        endDate,
        model
      );

      console.log("Chart Data:", res.data);

      setData(res.data.data || []);
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: 430,
        background: "#fff",
        marginTop: 30,
        padding: 25,
        borderRadius: 15,
        boxShadow: "0 5px 20px rgba(0,0,0,.1)",
      }}
    >
      <h2
        style={{
          marginBottom: 20,
          color: "#1f2937",
        }}
      >
        Daily Billable Tokens
      </h2>

      {loading ? (
        <div
          style={{
            height: 320,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 18,
          }}
        >
          Loading...
        </div>
      ) : data.length === 0 ? (
        <div
          style={{
            height: 320,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#777",
            fontSize: 18,
          }}
        >
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 20,
              left: 10,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="day"
              tickFormatter={formatDate}
            />

            <YAxis
              allowDecimals={false}
              tickFormatter={(value) =>
                Number(value).toLocaleString()
              }
            />

            <Tooltip content={<CustomTooltip />} />

            <Bar
              dataKey="billableTokens"
              fill="#2563eb"
              radius={[8, 8, 0, 0]}
              barSize={45}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}