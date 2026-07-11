import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Dashboard Summary
export const getDashboardSummary = (
  startDate,
  endDate,
  model
) =>
  API.get(
    `/dashboard/summary?startDate=${startDate}&endDate=${endDate}&model=${model}`
  );

// Daily Usage Chart
export const getDailyUsage = () =>
  API.get("/dashboard/daily-usage");

export const getModels = (startDate, endDate) =>
  axios.get(
    "http://localhost:5000/api/dashboard/models",
    {
      params: {
        startDate,
        endDate,
      },
    }
  );