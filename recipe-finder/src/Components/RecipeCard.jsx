function RecipeCard({ meal, setSelected }) {
  return (
    <div
      onClick={() => setSelected(meal)}
      className="border p-3 cursor-pointer hover:shadow-lg rounded-lg w-full max-w-xs"
    >
      <img
        src={meal.strMealThumb}
        alt={meal.strMeal}
        className="w-full h-56 object-cover rounded"
      />

      <h2 className="font-semibold text-center mt-3 line-clamp-2">
        {meal.strMeal}
      </h2>
    </div>
  );
}

export default RecipeCard;
