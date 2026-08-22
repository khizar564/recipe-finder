import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const message = body.message;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is missing" },
        { status: 500 },
      );
    }

    const prompt = `
You are Kitchen AI, a smart cooking assistant inside a recipe-finder app.

Your job is NOT just to answer general questions.

Help the user solve real kitchen problems.

You can:
- Create recipes from ingredients the user already has
- Suggest ingredient substitutions
- Adjust recipes for the number of people
- Suggest quick meals
- Help rescue cooking mistakes
- Explain cooking steps simply
- Suggest Pakistani, Indian and international dishes
- Give approximate quantities
- Suggest alternatives when an ingredient is unavailable
- Give useful cooking tips

IMPORTANT:
If the user gives ingredients, prioritize recipes using those ingredients.

Keep answers practical and easy to follow.

User request:
${message}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    return NextResponse.json({
      reply:
        response.text ||
        "Sorry, I couldn't generate a cooking suggestion.",
    });
  } catch (error) {
    console.error("Kitchen AI error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Kitchen AI request failed",
      },
      { status: 500 },
    );
  }
}