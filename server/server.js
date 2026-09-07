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

    // Validate input
    if (!platform || !topic || !tone || !contentLength) {
      return res.status(400).json({
        message:
          "Platform, topic, tone and content length are required.",
      });
    }

    const prompt = `
You are an expert social media content writer.

Create high-quality content for the following platform.

Platform:
${platform}

Topic:
${topic}

Tone:
${tone}

Content Length:
${contentLength}

PLATFORM GUIDELINES:

LinkedIn:
- Use a professional but human tone.
- Start with a strong hook.
- Use short, readable paragraphs.
- Provide useful insights or practical value.
- Encourage discussion where appropriate.

Instagram:
- Create an engaging caption.
- Start with an attention-grabbing hook.
- Use short paragraphs.
- Use emojis sparingly when appropriate.
- Add relevant hashtags when useful.

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

CONTENT LENGTH GUIDELINES:

Short:
Keep the content concise and punchy. Focus on the most important idea.

Medium:
Provide a balanced amount of detail while keeping the content easy to read.

Long:
Provide detailed and comprehensive content with deeper explanations and examples where appropriate.

GENERAL RULES:

- Write original content specifically for the selected platform.
- Make the content natural, authentic, conversational, and human-sounding.
- Provide genuine value rather than generic statements.
- Avoid clichés, repetition, filler, and unnecessary jargon.
- Do not invent statistics, quotes, studies, or facts.
- Use emojis only when they naturally fit the platform and tone.
- Use relevant hashtags only when appropriate.
- Do not mention AI or the content-generation process.
- Do not explain your reasoning.
- Return ONLY the final content ready to copy and publish.
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

    // Safely extract generated text
    const content = response?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("")
      .trim();

    if (!content) {
      console.error("No generated content:", response);

      return res.status(500).json({
        message: "Gemini did not return any content.",
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

