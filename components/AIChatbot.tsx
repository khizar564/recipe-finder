"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  text: string;
};

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hi! 👋 I'm Kitchen AI. Tell me what ingredients you have, and I'll help you decide what to cook.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    const text = message.trim();

    if (!text || loading) {
      return;
    }

    setMessage("");

    setMessages((current) => [
      ...current,
      {
        role: "user",
        text,
      },
    ]);

    setLoading(true);

    try {
      const response = await fetch("/api/kitchen-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: data.reply,
        },
      ]);
    } catch (error) {
      console.error("Kitchen AI error:", error);

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: "Sorry 😕 Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating Button */}

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-black px-5 py-4 text-lg text-white shadow-lg transition hover:scale-105"
      >
        {open ? "✕" : "👨‍🍳 Kitchen AI"}
      </button>

      {/* Chat Window */}

      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[600px] w-[380px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200">
          {/* Header */}

          <div className="bg-black px-5 py-4 text-white">
            <h2 className="text-lg font-bold">
              👨‍🍳 Kitchen AI
            </h2>

            <p className="text-sm text-gray-300">
              Your personal cooking assistant
            </p>
          </div>

          {/* Messages */}

          <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4">
            {messages.map((item, index) => (
              <div
                key={index}
                className={`flex ${
                  item.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm ${
                    item.role === "user"
                      ? "bg-black text-white"
                      : "bg-white text-gray-800 shadow-sm"
                  }`}
                >
                  {item.text}
                </div>
              </div>
            ))}

            {/* Loading */}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white px-4 py-3 text-sm text-gray-500 shadow-sm">
                  👨‍🍳 Kitchen AI is thinking...
                </div>
              </div>
            )}
          </div>

          {/* Quick Suggestions */}

          <div className="flex gap-2 overflow-x-auto border-t bg-white px-3 py-2">
            <button
              onClick={() =>
                setMessage(
                  "I have chicken, potatoes and tomatoes. What can I cook?"
                )
              }
              className="whitespace-nowrap rounded-full bg-gray-100 px-3 py-2 text-xs hover:bg-gray-200"
            >
              🍗 Chicken
            </button>

            <button
              onClick={() =>
                setMessage(
                  "I have rice, eggs and vegetables. Suggest a quick meal."
                )
              }
              className="whitespace-nowrap rounded-full bg-gray-100 px-3 py-2 text-xs hover:bg-gray-200"
            >
              🍚 Quick Meal
            </button>

            <button
              onClick={() =>
                setMessage(
                  "I want to cook something Pakistani. Give me an easy recipe."
                )
              }
              className="whitespace-nowrap rounded-full bg-gray-100 px-3 py-2 text-xs hover:bg-gray-200"
            >
              🇵🇰 Pakistani
            </button>
          </div>

          {/* Input */}

          <div className="flex gap-2 border-t bg-white p-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder="e.g. I have chicken & potatoes..."
              className="min-w-0 flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
            />

            <button
              onClick={sendMessage}
              disabled={loading || !message.trim()}
              className="rounded-xl bg-black px-4 py-3 text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}