import { useEffect, useState } from "react";
import axios from "axios";

function RecipeModel({ meal, setSelected }) {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`,
        );
        setDetails(res.data.meals[0]);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDetails();
  }, [meal]);

  if (!details) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      {/* Modal Box */}
      <div className="bg-white p-5 w-1/2 max-h-[80vh] overflow-y-auto relative rounded-lg shadow-lg">
        {/* ❌ Close Button (Top Right) */}
        <button
          onClick={() => setSelected(null)}
          className="absolute top-3 right-3 bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold leading-none hover:bg-red-500 hover:text-white"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center">{details.strMeal}</h2>

        {/* Image */}
        <img
          src={details.strMealThumb}
          alt={details.strMeal}
          className="w-full my-3 rounded"
        />

        {/* Ingredients */}
        <h3 className="font-bold text-lg mt-3">🥗 Ingredients:</h3>
        <ul className="grid grid-cols-2 gap-2 mt-2">
          {Array.from({ length: 20 }).map((_, i) => {
            const ing = details[`strIngredient${i + 1}`];
            const measure = details[`strMeasure${i + 1}`];

            if (ing && ing.trim() !== "") {
              return (
                <li key={i} className="text-sm">
                  ✅ {ing} - {measure}
                </li>
              );
            }
            return null;
          })}
        </ul>

        {/* Instructions */}
        <h3 className="font-bold text-lg mt-4">🍳 Instructions:</h3>
        <div className="mt-2">
          {details.strInstructions
            .split(".")
            .filter((step) => step.trim() !== "")
            .map((step, index) => (
              <p key={index} className="mb-2 text-sm">
                👉 {step.trim()}.
              </p>
            ))}
        </div>
      </div>
    </div>
  );
}

export default RecipeModel;
