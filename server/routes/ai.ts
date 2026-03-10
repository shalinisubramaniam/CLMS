import { RequestHandler } from "express";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({ apiKey }) : null;

export const handleAiChat: RequestHandler = async (req, res) => {
  const { prompt, context } = req.body;

  if (!openai) {
    return res.status(503).json({ 
      message: "AI service is not configured. Please add OPENAI_API_KEY in settings." 
    });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: `You are a helpful AI study assistant for an LMS. The current course context is: ${context || 'General'}` 
        },
        { role: "user", content: prompt }
      ],
    });

    res.json({ response: response.choices[0].message.content });
  } catch (error) {
    console.error("AI Chat error:", error);
    res.status(500).json({ message: "AI Assistant is temporarily unavailable" });
  }
};

export const handleAiSummarize: RequestHandler = async (req, res) => {
  const { text } = req.body;

  if (!openai) {
    return res.status(503).json({ 
      message: "AI service is not configured." 
    });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are an expert summarizer. Generate a concise, structured summary of the provided lecture notes or transcript." 
        },
        { role: "user", content: text }
      ],
    });

    res.json({ summary: response.choices[0].message.content });
  } catch (error) {
    console.error("AI Summarize error:", error);
    res.status(500).json({ message: "AI Summarizer is temporarily unavailable" });
  }
};

export const handleAiQuizGen: RequestHandler = async (req, res) => {
  const { text, numQuestions = 5 } = req.body;

  if (!openai) {
    return res.status(503).json({ message: "AI service is not configured." });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: `Generate ${numQuestions} multiple-choice questions based on the provided text. Return ONLY a JSON array of objects with the structure: [{ "question": string, "options": [string], "correctAnswer": number (index 0-3) }]` 
        },
        { role: "user", content: text }
      ],
    });

    const content = response.choices[0].message.content;
    const quiz = JSON.parse(content || "[]");
    res.json({ quiz });
  } catch (error) {
    console.error("AI Quiz Gen error:", error);
    res.status(500).json({ message: "AI Quiz Generator is temporarily unavailable" });
  }
};
