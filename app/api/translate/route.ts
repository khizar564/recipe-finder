import { NextResponse } from "next/server";

async function translateText(text: string, target: string) {
  if (!text || !text.trim()) {
    return "";
  }

  // MyMemory has a query length limitation.
  // Split long text into chunks.
  const chunks: string[] = [];

  let remaining = text.trim();

  while (remaining.length > 0) {
    if (remaining.length <= 450) {
      chunks.push(remaining);
      break;
    }

    // Try to split at a sentence/space instead of cutting a word.
    let splitAt = remaining.lastIndexOf(".", 450);

    if (splitAt < 200) {
      splitAt = remaining.lastIndexOf(" ", 450);
    }

    if (splitAt < 1) {
      splitAt = 450;
    }

    chunks.push(remaining.slice(0, splitAt + 1).trim());
    remaining = remaining.slice(splitAt + 1).trim();
  }

  const translatedChunks: string[] = [];

  for (const chunk of chunks) {
    const url =
      `https://api.mymemory.translated.net/get` +
      `?q=${encodeURIComponent(chunk)}` +
      `&langpair=en|${target}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Translation API request failed");
    }

    const data = await response.json();

    translatedChunks.push(
      data.responseData?.translatedText || chunk
    );
  }

  return translatedChunks.join(" ");
}

export async function POST(request: Request) {
  try {
    const { texts, target } = await request.json();

    if (!texts || !Array.isArray(texts)) {
      return NextResponse.json(
        { error: "texts must be an array" },
        { status: 400 }
      );
    }

    const targetLanguage = target || "ur";

    const translations = [];

    for (const text of texts) {
      const translated = await translateText(
        String(text || ""),
        targetLanguage
      );

      translations.push(translated);
    }

    return NextResponse.json({
      translations,
    });
  } catch (error) {
    console.error("Translation error:", error);

    return NextResponse.json(
      {
        error: "Translation failed",
      },
      {
        status: 500,
      }
    );
  }
}