# 🍳 Pakistani Recipe Finder + Kitchen AI

A modern and responsive recipe discovery web application built with **Next.js and TypeScript**.

Search recipes, view detailed cooking instructions, save favorites, translate recipes into Urdu, and get AI-powered cooking assistance through **Kitchen AI**.

---

## 🚀 Live Demo

https://recipe-finder-flame-tau.vercel.app/

---

## ✨ Features

### 🔎 Recipe Search

Search for recipes using ingredients or dish names such as:

- Biryani
- Chicken
- Karahi
- Pasta
- Pizza

Recipe data is fetched from **TheMealDB API**.

### 🍽️ Recipe Details

Each recipe includes:

- Recipe image
- Category
- Cuisine
- Ingredients
- Measurements
- Cooking instructions

### ❤️ Favorites

Users can save their favorite recipes.

Favorites are stored using browser **LocalStorage**.

### 🇬🇧 English & 🇵🇰 Urdu

The application supports English and Urdu.

Recipes can be translated into Urdu using the application's AI translation functionality.

### 🤖 Kitchen AI

Kitchen AI can help with:

- Creating recipes from available ingredients
- Ingredient substitutions
- Cooking questions
- Recipe adjustments
- Cooking problems
- General cooking guidance

### 📱 Responsive Design

The application works across:

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
- Google Gemini AI

### Browser Storage

- LocalStorage

### Deployment

- Vercel

---

## 📸 Screenshots

### 🏠 Home Page

<img width="2256" height="1304" alt="home-page png (2)" src="https://github.com/user-attachments/assets/0023d2ce-9c3e-4181-bc65-8ac02115bdbf" />



### 🔎 Search Results

<img width="2256" height="1314" alt="search-results png1" src="https://github.com/user-attachments/assets/62865126-c45d-4cc8-8408-4aead9a08e7c" />


### 🍽️ Recipe Details

<img width="2255" height="1307" alt="recipe-details png1" src="https://github.com/user-attachments/assets/f9edd423-e6df-4726-a774-9d0e42d08cfc" />
<img width="2256" height="1325" alt="recipe-details png2" src="https://github.com/user-attachments/assets/6e579427-7f1b-465b-90e8-c345572fc893" />
<img width="2256" height="1318" alt="recipe-details png3" src="https://github.com/user-attachments/assets/a5edc249-9b69-4600-a2bc-22b990cee090" />


### 🇵🇰 Urdu Translation

<img width="2256" height="1319" alt="urdu-translation png" src="https://github.com/user-attachments/assets/e4823d55-bd84-4717-9a8f-cb6e882575c8" />
<img width="2256" height="1303" alt="urdu-translation png2" src="https://github.com/user-attachments/assets/6642ab74-d2cd-4562-8d87-576cca568d11" />


### 🤖 Kitchen AI
<img width="2256" height="1324" alt="kitchen-ai png" src="https://github.com/user-attachments/assets/917a8d18-3fb2-46b0-a863-965076e1ac50" />


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
