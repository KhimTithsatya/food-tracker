"use client";

import { useEffect, useState } from "react";

interface FoodItem {
  id: number;
  name: string;
  calories: number;
}

export default function FoodTrackerPage() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false); // 1. NEW: Loading state

  // --- Utility Functions for Clearing State ---
  const clearForm = () => {
    setName("");
    setCalories("");
    setEditingId(null);
  };

  const cancelEdit = () => {
    clearForm();
  };

  // --- Fetch foods ---
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await fetch("/api/food");
        if (!res.ok) throw new Error("Failed to fetch food data");
        const data = await res.json();
        setFoods(data);
      } catch (error) {
        console.error("Error fetching foods:", error);
      }
    };
    fetchFoods();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !calories || isNaN(Number(calories))) {
      alert("Please enter a valid food name and calorie count.");
      return;
    }
    
    // 2. Prevent submission if already loading
    if (isLoading) return; 
    
    setIsLoading(true);

    const calorieNumber = Number(calories);

    try {
      if (editingId !== null) {
        // UPDATE
        const res = await fetch("/api/food", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId,
            name,
            calories: calorieNumber,
          }),
        });
        if (!res.ok) throw new Error("Update failed.");

        const updated = await res.json();
        setFoods((prev) =>
          prev.map((f) => (f.id === editingId ? updated : f))
        );
      } else {
        // CREATE
        const res = await fetch("/api/food", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            calories: calorieNumber,
          }),
        });
        if (!res.ok) throw new Error("Creation failed.");

        const newFood = await res.json();
        setFoods((prev) => [newFood, ...prev]);
      }
      clearForm();
    } catch (error) {
      console.error("API Submission Error:", error);
      alert(`Operation failed: ${error instanceof Error ? error.message : "Network error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFood = async (id: number) => {
    // Basic confirmation before deleting
    if (!window.confirm("Are you sure you want to delete this food item?")) return;
    
    try {
        await fetch("/api/food", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });

        setFoods((prev) => prev.filter((f) => f.id !== id));
    } catch (error) {
        console.error("Deletion failed:", error);
        alert("Failed to delete the food item.");
    }
  };

  const startEdit = (food: FoodItem) => {
    setEditingId(food.id);
    setName(food.name);
    setCalories(String(food.calories));
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Food Tracker</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1"
          placeholder="Food name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
        />
        <input
          className="border p-2 w-24"
          type="number"
          placeholder="Cals"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 hover:bg-blue-700 transition duration-150"
          disabled={isLoading} // 3. Disable while loading
        >
          {isLoading
            ? "Saving..."
            : editingId !== null
            ? "Update"
            : "Add"}
        </button>
        
        {/* 4. NEW: Cancel Button */}
        {editingId !== null && (
          <button
            type="button" // Important: Prevents accidental form submission
            onClick={cancelEdit}
            className="bg-gray-500 text-white px-4 hover:bg-gray-600 transition duration-150"
            disabled={isLoading}
          >
            Cancel
          </button>
        )}
      </form>
      
      {/* List Display */}
      <ul className="space-y-2">
        {foods.length === 0 ? (
            <li className="text-gray-500">No food items tracked yet. Add one!</li>
        ) : (
            foods.map((food) => (
              <li
                key={food.id}
                className="flex justify-between items-center border p-2 rounded bg-gray-50"
              >
                <span>
                  <strong>{food.name}</strong> ({food.calories} calories)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(food)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteFood(food.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
        )}
      </ul>
    </main>
  );
}