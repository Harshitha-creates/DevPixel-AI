import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

app.post("/api/analyze-code", async (req, res) => {
  const { code, task, language } = req.body;

  try {
    const response = await client.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content: "You are an expert senior software engineer.",
        },
        {
          role: "user",
          content: `Action: ${task}\nProgramming Language: ${language}\n\nCode:\n${code}`,
        },
      ],
    });

    res.json({ result: response.choices[0].message.content });
  } catch (error) {
    console.error("Groq Error:", error.message);
    res
      .status(500)
      .json({ error: error.message || "Failed to process request." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
