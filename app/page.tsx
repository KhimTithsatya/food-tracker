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

  // Fetch foods
  useEffect(() => {
    fetch("/api/food")
      .then((res) => res.json())
      .then(setFoods);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Validation
    if (!name.trim() || !calories) {
      alert("Please enter food name and calories");
      return;
    }

    const calorieNumber = Number(calories);

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

      const updated = await res.json();
      setFoods((prev) =>
        prev.map((f) => (f.id === editingId ? updated : f))
      );
      setEditingId(null);
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

      const newFood = await res.json();
      setFoods((prev) => [newFood, ...prev]);
    }

    setName("");
    setCalories("");
  };

  const deleteFood = async (id: number) => {
    await fetch("/api/food", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    setFoods((prev) => prev.filter((f) => f.id !== id));
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
        />
        <input
          className="border p-2 w-24"
          type="number"
          placeholder="Calories"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4"
        >
          {editingId !== null ? "Update" : "Add"}
        </button>
      </form>

      <ul className="space-y-2">
        {foods.map((food) => (
          <li
            key={food.id}
            className="flex justify-between items-center border p-2"
          >
            <span>
              {food.name} ({food.calories})
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(food)}
                className="text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => deleteFood(food.id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
