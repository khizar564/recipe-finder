# 🍳 Pakistani Recipe Finder + Kitchen AI

A modern and responsive recipe discovery web application built with Next.js and TypeScript.

The application allows users to search for recipes, view detailed cooking instructions, save favorite recipes, switch between English and Urdu, and get AI-powered cooking assistance through Kitchen AI.

---

## 🚀 Live Demo

https://recipe-finder-flame-tau.vercel.app/

---

## 📸 Features

### 🔎 Recipe Search

Search for recipes using ingredients or dish names such as:

- Biryani
- Chicken
- Karahi
- Pasta
- Pizza

Recipe data is fetched from TheMealDB API.

### 🍽️ Recipe Details

Each recipe provides:

- Recipe image
- Category
- Cuisine
- Ingredients
- Measurements
- Cooking instructions

### ❤️ Favorites

Users can save their favorite recipes.

Favorites are stored locally using browser LocalStorage, so they remain available after refreshing the page.

### 🇬🇧 English & 🇵🇰 Urdu

The application supports:

- English
- Urdu

Recipes can be translated into Urdu using the application's AI translation functionality.

### 🤖 Kitchen AI

The built-in Kitchen AI assistant can help users with:

- Creating recipes from available ingredients
- Ingredient substitutions
- Cooking questions
- Recipe adjustments
- Cooking problems
- General cooking guidance

### 📱 Responsive Design

The application is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile devices

---

## 🛠️ Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### APIs & AI

- TheMealDB API
- Gemini AI

### Browser Storage

- LocalStorage

### Deployment

- Vercel

---

## 📂 Project Structure

```text
recipe-finder/
│
├── app/
│   ├── api/
│   │   └── translate/
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   └── AIChatbot.tsx
│
├── public/
│
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
