"use client";
import Navbar from "@/components/Navbar";
import { useFood } from "@/context/FoodContext";

export default function History() {
  const { foods } = useFood();

  return (
    <main className="p-6">
      <Navbar />
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Food History</h2>
        <ul>
          {foods.map(food => (
            <li key={food.id} className="border-b py-2">
              {food.name} — {food.category}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
