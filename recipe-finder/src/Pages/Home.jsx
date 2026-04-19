import { useState } from "react";
import axios from "axios";
import SearchBox from "../Components/SearchBox";
import RecipeCard from "../Components/RecipeCard";
import RecipeModel from "../Components/RecipeModel";

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const searchRecipes = async (input) => {
    try {
      if (!input || input.trim() === "") return;

      setLoading(true);

      const cleaned = input.toLowerCase().trim();

      // 👉 CASE 1: Dish name search
      if (!cleaned.includes(",")) {
        const res = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${cleaned}`,
        );

        if (!res.data.meals) {
          setRecipes([]);
          setLoading(false);
          return;
        }

        const highProtein = ["chicken", "egg", "fish", "beef"];

        const filtered = res.data.meals.filter((meal) =>
          highProtein.some((key) => meal.strMeal.toLowerCase().includes(key)),
        );

        setRecipes(filtered);
        setLoading(false);
        return;
      }

      // 👉 CASE 2: Ingredient search
      const ingredients = cleaned
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i !== "");

      const responses = await Promise.all(
        ingredients.map((ing) =>
          axios.get(
            `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ing}`,
          ),
        ),
      );

      let map = new Map();

      responses.forEach((res) => {
        if (res.data.meals) {
          res.data.meals.forEach((meal) => {
            map.set(meal.idMeal, meal);
          });
        }
      });

      const uniqueMeals = Array.from(map.values());

      if (uniqueMeals.length === 0) {
        setRecipes([]);
        setLoading(false);
        return;
      }

      const detailedMeals = await Promise.all(
        uniqueMeals.map((meal) =>
          axios
            .get(
              `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`,
            )
            .then((res) => res.data.meals[0]),
        ),
      );

      // 👉 Ingredient matching
      const matchedMeals = detailedMeals.filter((meal) => {
        let mealIngredients = [];

        for (let i = 1; i <= 20; i++) {
          const ing = meal[`strIngredient${i}`];
          if (ing && ing.trim() !== "") {
            mealIngredients.push(ing.toLowerCase());
          }
        }

        let matchCount = ingredients.filter((userIng) =>
          mealIngredients.some((mealIng) => mealIng.includes(userIng)),
        ).length;

        return matchCount >= 1;
      });

      // 👉 High protein filter
      const highProtein = ["chicken", "egg", "fish", "beef"];

      const finalMeals = matchedMeals.filter((meal) =>
        highProtein.some((key) => meal.strMeal.toLowerCase().includes(key)),
      );

      setRecipes(finalMeals);
      setLoading(false);
    } catch (err) {
      console.log("Error:", err);
      setRecipes([]);
      setLoading(false);
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold text-center">Smart Recipe Finder 🍗</h1>

      {/* 🔍 Search */}
      <SearchBox onSearch={searchRecipes} />

      {/* 🔄 Loading */}
      {loading ? (
        <h2 className="text-center mt-10 text-xl font-semibold">
          Loading recipes... 🍳
        </h2>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-5 justify-items-center">
          {recipes.map((meal) => (
            <RecipeCard
              key={meal.idMeal}
              meal={meal}
              setSelected={setSelected}
            />
          ))}
        </div>
      )}

      {/* 📄 Modal */}
      {selected && <RecipeModel meal={selected} setSelected={setSelected} />}
    </div>
  );
}

export default Home;
