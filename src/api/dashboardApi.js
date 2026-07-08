import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
});

export const getDashboardSummary = () =>
    API.get("/dashboard/summary");

export const getDailyUsage = () =>
    API.get("/dashboard/daily-usage");