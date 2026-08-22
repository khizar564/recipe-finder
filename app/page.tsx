"use client";

import { useEffect, useState } from "react";
import AIChatbot from "@/components/AIChatbot";

type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

type MealDetails = Meal & {
  strCategory: string;
  strArea: string;
  strInstructions: string;
  [key: string]: string | null;
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<MealDetails | null>(null);

  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [language, setLanguage] = useState<"en" | "ur">("en");

  const [translatedMeal, setTranslatedMeal] =
    useState<MealDetails | null>(null);

  const [translationLoading, setTranslationLoading] = useState(false);

  // ================= FAVORITES =================

  const [favorites, setFavorites] = useState<Meal[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("recipeFavorites");

    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error("Failed to load favorites:", error);
      }
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem(
      "recipeFavorites",
      JSON.stringify(favorites),
    );
  }, [favorites]);

  // Check favorite
  function isFavorite(id: string) {
    return favorites.some(
      (meal) => meal.idMeal === id,
    );
  }

  // Add / remove favorite
  function toggleFavorite(meal: Meal) {
    setFavorites((currentFavorites) => {
      const exists = currentFavorites.some(
        (item) => item.idMeal === meal.idMeal,
      );

      if (exists) {
        return currentFavorites.filter(
          (item) => item.idMeal !== meal.idMeal,
        );
      }

      return [...currentFavorites, meal];
    });
  }

  // ================= SEARCH =================

  async function handleSearch() {
    const search = searchTerm.trim();

    if (!search) {
      return;
    }

    setLoading(true);
    setSelectedMeal(null);
    setTranslatedMeal(null);
    setShowFavorites(false);

    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
          search,
        )}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }

      const data = await response.json();

      setMeals(data.meals || []);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setMeals([]);
    } finally {
      setLoading(false);
    }
  }

  // ================= VIEW RECIPE =================

  async function viewRecipe(id: string) {
    setDetailsLoading(true);
    setTranslatedMeal(null);
    setShowFavorites(false);

    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch recipe details");
      }

      const data = await response.json();

      const recipe: MealDetails | null =
        data.meals?.[0] || null;

      setSelectedMeal(recipe);

      if (recipe && language === "ur") {
        await translateRecipe(recipe);
      }
    } catch (error) {
      console.error(
        "Error fetching recipe details:",
        error,
      );

      setSelectedMeal(null);
    } finally {
      setDetailsLoading(false);
    }
  }

  // ================= TRANSLATION =================

  async function translateRecipe(recipe: MealDetails) {
    setTranslationLoading(true);

    try {
      const texts: string[] = [];

      texts.push(recipe.strMeal || "");
      texts.push(recipe.strCategory || "");
      texts.push(recipe.strArea || "");
      texts.push(recipe.strInstructions || "");

      for (let i = 1; i <= 20; i++) {
        const ingredient =
          recipe[`strIngredient${i}`];

        if (
          ingredient &&
          ingredient.trim()
        ) {
          texts.push(ingredient);
        }
      }

      const response = await fetch(
        "/api/translate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            texts,
            target: "ur",
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          "Translation request failed",
        );
      }

      const data = await response.json();

      const translations: string[] =
        data.translations || [];

      let index = 0;

      const translated: MealDetails = {
        ...recipe,

        strMeal:
          translations[index++] ||
          recipe.strMeal,

        strCategory:
          translations[index++] ||
          recipe.strCategory,

        strArea:
          translations[index++] ||
          recipe.strArea,

        strInstructions:
          translations[index++] ||
          recipe.strInstructions,
      };

      for (let i = 1; i <= 20; i++) {
        const ingredient =
          recipe[`strIngredient${i}`];

        if (
          ingredient &&
          ingredient.trim()
        ) {
          translated[
            `strIngredient${i}`
          ] =
            translations[index++] ||
            ingredient;
        }
      }

      setTranslatedMeal(translated);
    } catch (error) {
      console.error(
        "Translation error:",
        error,
      );

      setTranslatedMeal(null);
    } finally {
      setTranslationLoading(false);
    }
  }

  // ================= LANGUAGE =================

  async function changeLanguage(
    lang: "en" | "ur",
  ) {
    setLanguage(lang);

    if (lang === "en") {
      setTranslatedMeal(null);
      return;
    }

    if (selectedMeal) {
      await translateRecipe(selectedMeal);
    }
  }

  // ================= HOME =================

  function goHome() {
    setSelectedMeal(null);
    setTranslatedMeal(null);
    setShowFavorites(false);
  }

  // ================= FAVORITES PAGE =================

  function toggleFavoritesPage() {
    setShowFavorites(!showFavorites);
    setSelectedMeal(null);
    setTranslatedMeal(null);
  }

  // ================= DISPLAYED RECIPE =================

  const displayedMeal =
    language === "ur" &&
    translatedMeal
      ? translatedMeal
      : selectedMeal;

  // ================= UI =================

  return (
    <main
      dir={
        language === "ur"
          ? "rtl"
          : "ltr"
      }
      className="min-h-screen bg-gray-50"
    >
      {/* ================= HEADER ================= */}

      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          {/* LOGO */}

          <button
            onClick={goHome}
            className="text-left text-2xl font-bold text-gray-900"
          >
            🇵🇰{" "}
            {language === "ur"
              ? "پاکستانی ریسپی فائنڈر"
              : "Pakistani Recipe Finder"}
          </button>

          {/* HEADER CONTROLS */}

          <div className="flex flex-wrap items-center justify-end gap-2">
            {/* FAVORITES */}

            <button
              onClick={
                toggleFavoritesPage
              }
              className={`rounded-lg px-4 py-2 font-medium transition ${
                showFavorites
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ❤️{" "}
              {language === "ur"
                ? "پسندیدہ"
                : "Favorites"}{" "}
              ({favorites.length})
            </button>

            {/* ENGLISH */}

            <button
              onClick={() =>
                changeLanguage("en")
              }
              className={`rounded-lg px-4 py-2 transition ${
                language === "en"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🇬🇧 English
            </button>

            {/* URDU */}

            <button
              onClick={() =>
                changeLanguage("ur")
              }
              className={`rounded-lg px-4 py-2 transition ${
                language === "ur"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🇵🇰 اردو
            </button>
          </div>
        </div>
      </header>

      {/* ================= SEARCH AREA ================= */}

      {!showFavorites &&
        !selectedMeal && (
          <section className="mx-auto max-w-6xl px-6 py-16 text-center">
            <h2 className="text-4xl font-bold text-gray-900 md:text-5xl">
              {language === "ur"
                ? "اپنی پسندیدہ ریسپی تلاش کریں"
                : "Find Your Favorite Recipe"}
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              {language === "ur"
                ? "مزیدار کھانے تلاش کریں اور آج کچھ نیا پکائیں۔"
                : "Search recipes and discover something amazing to cook today."}
            </p>

            {/* SEARCH BOX */}

            <div className="mx-auto mt-8 flex max-w-2xl gap-3">
              <input
                type="text"
                placeholder={
                  language === "ur"
                    ? "بریانی، چکن، کڑاہی تلاش کریں..."
                    : "Search Biryani, Chicken, Karahi..."
                }
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value,
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="flex-1 rounded-xl border border-gray-300 bg-white px-5 py-3 outline-none focus:border-gray-500"
              />

              <button
                onClick={handleSearch}
                className="rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
              >
                🔍{" "}
                {language === "ur"
                  ? "تلاش"
                  : "Search"}
              </button>
            </div>

            {/* LOADING */}

            {loading && (
              <p className="mt-4 text-gray-600">
                {language === "ur"
                  ? "🔄 ریسپیز تلاش کی جا رہی ہیں..."
                  : "🔄 Finding recipes..."}
              </p>
            )}

            {/* RESULT COUNT */}

            {!loading &&
              searchTerm && (
                <p className="mt-4 text-gray-600">
                  {language === "ur"
                    ? `ملنے والی ریسپیز: ${meals.length}`
                    : `Recipes found: ${meals.length}`}
                </p>
              )}
          </section>
        )}

      {/* ================= FAVORITES PAGE ================= */}

      {showFavorites && (
        <section className="mx-auto max-w-6xl px-6 py-12">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">
              ❤️{" "}
              {language === "ur"
                ? "میری پسندیدہ ریسپیز"
                : "My Favorite Recipes"}
            </h2>

            <button
              onClick={() =>
                setShowFavorites(false)
              }
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              ←{" "}
              {language === "ur"
                ? "واپس"
                : "Back"}
            </button>
          </div>

          {favorites.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <div className="text-5xl">
                🤍
              </div>

              <p className="mt-4 text-lg text-gray-500">
                {language === "ur"
                  ? "ابھی کوئی پسندیدہ ریسپی نہیں ہے۔"
                  : "You haven't added any favorite recipes yet."}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {favorites.map(
                (meal) => (
                  <div
                    key={meal.idMeal}
                    className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <img
                      src={
                        meal.strMealThumb
                      }
                      alt={meal.strMeal}
                      className="h-52 w-full object-cover"
                    />

                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {meal.strMeal}
                      </h3>

                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() =>
                            viewRecipe(
                              meal.idMeal,
                            )
                          }
                          className="flex-1 rounded-lg bg-black py-2 text-white hover:bg-gray-800"
                        >
                          {language ===
                          "ur"
                            ? "ریسپی دیکھیں"
                            : "View Recipe"}
                        </button>

                        <button
                          onClick={() =>
                            toggleFavorite(
                              meal,
                            )
                          }
                          className="rounded-lg border border-red-200 px-4 py-2 text-red-500 hover:bg-red-50"
                        >
                          ❤️
                        </button>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </section>
      )}

      {/* ================= DETAILS LOADING ================= */}

      {detailsLoading && (
        <section className="mx-auto max-w-6xl px-6 py-16 text-center">
          <p className="text-lg text-gray-600">
            {language === "ur"
              ? "🔄 ریسپی کی تفصیلات لوڈ ہو رہی ہیں..."
              : "🔄 Loading recipe details..."}
          </p>
        </section>
      )}

      {/* ================= RECIPE DETAILS ================= */}

      {displayedMeal &&
        !detailsLoading &&
        !showFavorites && (
          <section className="mx-auto max-w-4xl px-6 pb-16">
            {/* BACK */}

            <button
              onClick={() => {
                setSelectedMeal(null);
                setTranslatedMeal(null);
              }}
              className="mb-6 rounded-lg border border-gray-300 bg-white px-5 py-2 text-gray-700 hover:bg-gray-100"
            >
              ←{" "}
              {language === "ur"
                ? "نتائج پر واپس جائیں"
                : "Back to Results"}
            </button>

            {/* TRANSLATION LOADING */}

            {translationLoading && (
              <div className="mb-6 rounded-xl bg-white p-4 text-center shadow-sm">
                🔄{" "}
                {language === "ur"
                  ? "ریسپی کا اردو میں ترجمہ کیا جا رہا ہے..."
                  : "Translating recipe..."}
              </div>
            )}

            <div className="overflow-hidden rounded-2xl bg-white shadow-md">
              {/* IMAGE */}

              <img
                src={
                  displayedMeal.strMealThumb
                }
                alt={
                  displayedMeal.strMeal
                }
                className="h-80 w-full object-cover"
              />

              <div className="p-8">
                {/* TITLE + FAVORITE */}

                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {
                      displayedMeal.strMeal
                    }
                  </h2>

                  <button
                    onClick={() =>
                      toggleFavorite({
                        idMeal:
                          displayedMeal.idMeal,
                        strMeal:
                          selectedMeal?.strMeal ||
                          displayedMeal.strMeal,
                        strMealThumb:
                          displayedMeal.strMealThumb,
                      })
                    }
                    className={`shrink-0 rounded-xl px-4 py-2 font-medium transition ${
                      isFavorite(
                        displayedMeal.idMeal,
                      )
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {isFavorite(
                      displayedMeal.idMeal,
                    )
                      ? "❤️"
                      : "🤍"}{" "}
                    {language === "ur"
                      ? "پسندیدہ"
                      : "Favorite"}
                  </button>
                </div>

                {/* CATEGORY + CUISINE */}

                <div className="mt-4 flex flex-wrap gap-3">
                  <span className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700">
                    🍽️{" "}
                    {language === "ur"
                      ? `قسم: ${displayedMeal.strCategory}`
                      : `Category: ${displayedMeal.strCategory}`}
                  </span>

                  <span className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700">
                    🌍{" "}
                    {language === "ur"
                      ? `ملک: ${displayedMeal.strArea}`
                      : `Cuisine: ${displayedMeal.strArea}`}
                  </span>
                </div>

                {/* INGREDIENTS */}

                <h3 className="mt-8 text-2xl font-bold text-gray-900">
                  🥘{" "}
                  {language === "ur"
                    ? "اجزاء"
                    : "Ingredients"}
                </h3>

                <ul className="mt-4 space-y-2">
                  {Array.from({
                    length: 20,
                  }).map(
                    (_, index) => {
                      const ingredient =
                        displayedMeal[
                          `strIngredient${
                            index + 1
                          }`
                        ];

                      const measure =
                        displayedMeal[
                          `strMeasure${
                            index + 1
                          }`
                        ];

                      if (
                        !ingredient ||
                        ingredient.trim() ===
                          ""
                      ) {
                        return null;
                      }

                      return (
                        <li
                          key={index}
                          className="rounded-lg bg-gray-50 px-4 py-3 text-gray-700"
                        >
                          <span className="font-medium">
                            {measure}
                          </span>{" "}
                          {ingredient}
                        </li>
                      );
                    },
                  )}
                </ul>

                {/* INSTRUCTIONS */}

                <h3 className="mt-10 text-2xl font-bold text-gray-900">
                  👨‍🍳{" "}
                  {language === "ur"
                    ? "پکانے کا طریقہ"
                    : "Cooking Instructions"}
                </h3>

                <p className="mt-4 whitespace-pre-line leading-8 text-gray-700">
                  {
                    displayedMeal.strInstructions
                  }
                </p>
              </div>
            </div>
          </section>
        )}

      {/* ================= SEARCH RESULTS ================= */}

      {!selectedMeal &&
        !detailsLoading &&
        !showFavorites && (
          <section className="mx-auto max-w-6xl px-6 pb-16">
            <h3 className="mb-6 text-2xl font-semibold text-gray-900">
              {language === "ur"
                ? "تلاش کے نتائج"
                : "Search Results"}
            </h3>

            {/* NO RESULTS */}

            {!loading &&
              meals.length === 0 &&
              searchTerm && (
                <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                  <p className="text-gray-500">
                    {language === "ur"
                      ? `"${searchTerm}" کے لیے کوئی ریسپی نہیں ملی۔`
                      : `No recipe found for "${searchTerm}".`}
                  </p>
                </div>
              )}

            {/* RECIPE CARDS */}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {meals.map(
                (meal) => (
                  <div
                    key={meal.idMeal}
                    className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <img
                      src={
                        meal.strMealThumb
                      }
                      alt={meal.strMeal}
                      className="h-52 w-full object-cover"
                    />

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {meal.strMeal}
                        </h4>

                        {/* FAVORITE */}

                        <button
                          onClick={() =>
                            toggleFavorite(
                              meal,
                            )
                          }
                          className="shrink-0 text-2xl transition hover:scale-110"
                          title={
                            isFavorite(
                              meal.idMeal,
                            )
                              ? "Remove from favorites"
                              : "Add to favorites"
                          }
                        >
                          {isFavorite(
                            meal.idMeal,
                          )
                            ? "❤️"
                            : "🤍"}
                        </button>
                      </div>

                      {/* VIEW RECIPE */}

                      <button
                        onClick={() =>
                          viewRecipe(
                            meal.idMeal,
                          )
                        }
                        className="mt-4 w-full rounded-lg bg-black py-2 text-white transition hover:bg-gray-800"
                      >
                        {language ===
                        "ur"
                          ? "ریسپی دیکھیں"
                          : "View Recipe"}
                      </button>
                    </div>
                  </div>
                ),
              )}
            </div>
          </section>
        )}

      {/* ================= AI CHATBOT ================= */}

      <AIChatbot />
    </main>
  );
}