import { GeminiMonitor } from "./index.js";

const ai = new GeminiMonitor({

    apiKey: process.env.GEMINI_API_KEY,

    dashboardURL: "http://localhost:5000"

});

const response = await ai.generate("Explain Java OOP.");

console.log(response.text);