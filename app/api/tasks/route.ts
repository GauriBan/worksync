import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Task } from '@/lib/Task';
import { GoogleGenAI } from '@google/genai';

// 🤖 AI Setup: Try-catch ke sath taaki agar key galat ho to server crash na ho
const getAIClient = () => {
  const key = process.env.GEMINI_API_KEY || "";
  if (!key) return null;
  try {
    return new GoogleGenAI({ apiKey: key });
  } catch (e) {
    console.error("AI Initialization Error:", e);
    return null;
  }
};

export async function GET() {
  try {
    await connectDB();
    const allTasks = await Task.find({}).sort({ createdAt: -1 });
    return NextResponse.json(allTasks);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { title, category, budget } = body;

    if (!title || !budget) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    let aiGeneratedText = "AI Scope currently unavailable.";
    
    // AI execution loop safely packed
    const aiClient = getAIClient();
    if (aiClient) {
      try {
        const aiResponse = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Write a short 2-sentence professional developer scope or summary for a project titled: "${title}" under the category: "${category}".`,
        });
        aiGeneratedText = aiResponse.text || "No response text from AI.";
      } catch (aiErr) {
        console.error("❌ Gemini API Fetch Call Failed:", aiErr);
        aiGeneratedText = "AI processing error occurred.";
      }
    } else {
      console.log("⚠️ No valid GEMINI_API_KEY found in environment variables.");
    }

    // Task collection insertion
    const newTask = await Task.create({
      title,
      category,
      budget: budget.startsWith("\$") ? budget : `$${budget}`,
      aiDescription: aiGeneratedText
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("❌ Asli Backend Crash Error:", error);
    return NextResponse.json({ error: "Failed to create task inside database" }, { status: 500 });
  }
}
