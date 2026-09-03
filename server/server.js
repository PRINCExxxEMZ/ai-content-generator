import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();
console.log(
  "Gemini API Key loaded:",
  process.env.GEMINI_API_KEY ? "YES" : "NO"
);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "AI Content Generator API is running!",
  });
});

// Generate AI content
app.post("/api/generate", async (req, res) => {
  try {
    const { platform, topic, tone } = req.body;

    // Validate request
    if (!platform || !topic || !tone) {
      return res.status(400).json({
        message: "Platform, topic and tone are required.",
      });
    }

    const prompt = `
You are an expert social media content writer.

Create content for the following platform:

Platform: ${platform}

Topic:
${topic}

Tone:
${tone}

Instructions:
- Write content specifically for ${platform}.
- Use a ${tone.toLowerCase()} tone.
- Make it engaging and easy to read.
- Keep it natural and human-sounding.
- Use appropriate hashtags when suitable.
- Do not explain the process.
- Return only the final content.
`;

    const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
    });

    res.json({
      content: response.text,
    });

  } catch (error) {
    console.error("Gemini Error:", error);

    res.status(500).json({
      message: "Failed to generate content.",
      error: error.message,
    });
  }
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});