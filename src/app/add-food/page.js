"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useFood } from "@/context/FoodContext";

export default function AddFood() {
  const { addFood } = useFood();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  return (
    <main className="p-6">
      <Navbar />
      <div className="bg-white p-6 rounded shadow max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Food</h2>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Food name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <select
          className="border p-2 w-full mb-3"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="">Select category</option>
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
          <option>Snack</option>
        </select>

        <button
          onClick={() => addFood({ name, category })}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>
    </main>
  );
}
