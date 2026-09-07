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
    const {
      platform,
      topic,
      tone,
      contentLength,
    } = req.body;

    // Validate request
    if (!platform || !topic || !tone || !contentLength) {
      return res.status(400).json({
        message:
          "Platform, topic, tone and content length are required.",
      });
    }

    const prompt = `
You are an expert social media content writer.

Create content for:

Platform: ${platform}
Topic: ${topic}
Tone: ${tone}
Content Length: ${contentLength}

PLATFORM GUIDELINES:

LinkedIn:
- Professional but human.
- Start with a strong hook.
- Use short readable paragraphs.
- Provide useful insights.
- Encourage discussion where appropriate.

Instagram:
- Create an engaging caption.
- Start with an attention-grabbing hook.
- Use short paragraphs.
- Use emojis sparingly.
- Add relevant hashtags when appropriate.

X/Twitter:
- Be concise and sharp.
- Focus on one clear idea.
- Start with a strong opening.
- Avoid unnecessary words.

Thread:
- Create a connected multi-post thread.
- Make the first post compelling.
- Each post should develop one clear idea.
- Number the posts appropriately.
- End with a strong conclusion or call to action.

Facebook:
- Use a conversational and relatable tone.
- Write for a broad audience.
- Encourage interaction.
- Use stories, perspectives, or examples where appropriate.
- Avoid sounding overly corporate.

Blog:
- Create informative long-form content.
- Use a compelling introduction.
- Organize the content with clear sections.
- Explain ideas clearly.
- Include examples where useful.
- End with a useful conclusion or call to action.

CONTENT LENGTH:

Short:
Keep the content concise and punchy.

Medium:
Provide a balanced amount of detail while remaining easy to read.

Long:
Provide detailed and comprehensive content with deeper explanations and examples.

GENERAL RULES:

- Write original content specifically for the selected platform.
- Make it natural, authentic and human-sounding.
- Provide genuine value.
- Avoid clichés, repetition and filler.
- Do not invent statistics, quotes or studies.
- Use emojis only when appropriate.
- Use hashtags only when appropriate.
- Do not mention AI.
- Do not explain your reasoning.
- Return ONLY the final content.
`;

    console.log("Generating content...");
    console.log({
      platform,
      topic,
      tone,
      contentLength,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
    });

    console.log("Gemini response received.");

    // Safely extract the generated text
    const parts = response?.candidates?.[0]?.content?.parts;

    if (!parts || !Array.isArray(parts)) {
      console.error(
        "Unexpected Gemini response:",
        JSON.stringify(response, null, 2)
      );

      return res.status(500).json({
        message: "Gemini returned an unexpected response.",
      });
    }

    const content = parts
      .filter((part) => part.text)
      .map((part) => part.text)
      .join("")
      .trim();

    if (!content) {
      console.error(
        "Gemini returned no text:",
        JSON.stringify(response, null, 2)
      );

      return res.status(500).json({
        message: "Gemini did not return any text.",
      });
    }

    res.json({
      content,
    });

  } catch (error) {
    console.error("Gemini Error:", error);

    res.status(500).json({
      message: "Failed to generate content.",
      error: error.message,
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

