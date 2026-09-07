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
    const { platform, topic, tone, contentLength } = req.body;

    // Validate request
   if (!platform || !topic || !tone || !contentLength) {
  return res.status(400).json({
    message: "Platform, topic, tone and content length are required.",
  });
}

   const prompt = `
You are an expert content strategist, copywriter, and social media specialist.

Your task is to create publication-ready content based on the user's topic.

Platform: ${platform}
Topic: ${topic}
Tone: ${tone}
Content Length: ${contentLength}

PLATFORM GUIDELINES:

LinkedIn:
- Focus on professional value, insights, lessons, opinions, or practical knowledge.
- Start with a strong hook that encourages the reader to continue.
- Use short paragraphs with plenty of whitespace.
- Encourage thoughtful engagement when appropriate.
- Avoid sounding corporate, robotic, or overly promotional.
- End with a natural question or call to action when appropriate.

Instagram:
- Create engaging, visually scannable caption-style content.
- Start with an attention-grabbing hook.
- Use short paragraphs and natural line breaks.
- Emojis may be used sparingly when appropriate.
- Encourage interaction or engagement when relevant.
- Include a small set of relevant hashtags at the end.

Thread:
- Structure the content as a connected multi-post thread.
- Start with a compelling first post that creates curiosity.
- Develop the topic logically from one post to the next.
- Each post should communicate one clear idea.
- Maintain continuity between posts.
- Use numbering such as "1/7", "2/7", etc. when appropriate.
- Make every post valuable enough to encourage the reader to continue.
- End with a strong conclusion, takeaway, or call to action.
- Keep each individual post concise and readable.

Facebook:
- Write conversational, engaging content suitable for a broad audience.
- Start with an interesting hook.
- Use natural paragraphs and easy-to-understand language.
- Encourage comments, reactions, or discussion when appropriate.
- Stories, personal perspectives, practical advice, and relatable examples can be used when relevant.
- Avoid overly corporate or promotional language.
- Use emojis and hashtags sparingly and only when they add value.

X/Twitter:
- Be concise, sharp, and highly engaging.
- Get to the main point quickly.
- Use a strong hook.
- Prioritize one clear idea rather than trying to cover everything.
- Avoid unnecessary filler.
- If the topic requires more detail, structure it as a concise thread with numbered posts.

Blog:
- Create well-structured, informative long-form content.
- Use a compelling introduction.
- Organize ideas logically.
- Use headings and subheadings where appropriate.
- Explain concepts clearly and provide useful examples.
- Maintain a consistent tone throughout.
- End with a meaningful conclusion or call to action.

CONTENT LENGTH GUIDELINES:

- Short: Keep the content concise and punchy. Focus only on the most important idea. Aim for approximately 50–100 words for social posts.
- Medium: Provide a balanced amount of detail, enough to explain the idea while remaining easy to read. Aim for approximately 100–250 words.
- Long: Provide detailed and comprehensive content with deeper explanations, examples, or supporting points where appropriate. Aim for approximately 250–500 words.
- Adjust these ranges when necessary based on the selected platform. For example, X/Twitter and individual thread posts should remain concise regardless of the selected length.

CONTENT QUALITY RULES:

- Write original content specifically for the selected platform.
- Use a ${tone.toLowerCase()} tone.
- Make the content natural, authentic, conversational, and human-sounding.
- Provide genuine value rather than generic statements.
- Avoid clichés, repetition, filler, and unnecessary jargon.
- Do not invent statistics, quotes, studies, or facts.
- Use emojis only when they naturally fit the platform and tone.
- Use relevant hashtags only when appropriate.
- Do not mention AI or the content-generation process.
- Do not explain your reasoning.
- Do not include unnecessary labels such as "Title:", "Caption:", or "Post:".
- Return ONLY the final content, ready to copy and publish.
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

  return res.status(500).json({
    message: "Failed to generate content.",
    error: error.message || String(error),
  });
}
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

