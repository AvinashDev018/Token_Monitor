import { GoogleGenAI } from "@google/genai";
import axios from "axios";

class GeminiMonitor {

    constructor(options) {

        this.apiKey = options.apiKey;

        this.dashboardURL = options.dashboardURL;

        this.ai = new GoogleGenAI({
            apiKey: this.apiKey
        });

    }

    async generate(prompt) {

        const start = Date.now();

        const response = await this.ai.models.generateContent({

            model: "gemini-2.5-flash",

            contents: prompt

        });

        const latency = Date.now() - start;

        await axios.post(`${this.dashboardURL}/api/sdk/log`, {

            provider: "Gemini",

            model: response.modelVersion,

            usage: response.usageMetadata,

            latency

        });

        return response;

    }

}

export default GeminiMonitor;