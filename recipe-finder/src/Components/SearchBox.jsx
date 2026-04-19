import { useState } from "react";

function SearchBox({ onSearch }) {
  const [input, setInput] = useState("");

  const handleSearch = () => {
    if (!input) return;
    onSearch(input);
  };

  return (
    <div className="flex gap-2 justify-center mt-5">
      <input
        type="text"
        placeholder="Enter ingredients (chicken, rice, curd)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border p-2 w-80"
      />
      <button onClick={handleSearch} className="bg-blue-500 text-white px-4">
        Search
      </button>
    </div>
  );
}

export default SearchBox;
