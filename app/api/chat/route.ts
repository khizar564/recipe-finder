import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
    })
  : null;

export async function POST(request: Request) {
  try {
    // Check API key
    if (!apiKey || !ai) {
      return NextResponse.json(
        {
          error: "GEMINI_API_KEY is missing",
        },
        {
          status: 500,
        },
      );
    }

    // Read request body
    const body = await request.json();

    const message = body?.message;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        {
          error: "Message is required",
        },
        {
          status: 400,
        },
      );
    }

    // Send message to Gemini
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: message.trim(),
    });

    // Get Gemini response
    const reply =
      response.text?.trim() ||
      "Sorry, I couldn't generate a response.";

    return NextResponse.json({
      reply,
    });
  } catch (error) {
    console.error("Gemini API error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Gemini API request failed",
      },
      {
        status: 500,
      },
    );
  }
}