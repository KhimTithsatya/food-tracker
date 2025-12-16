"use client";
import { createContext, useContext, useEffect, useState } from "react";

const FoodContext = createContext();

export function FoodProvider({ children }) {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    fetch("/api/food")
      .then(res => res.json())
      .then(setFoods);
  }, []);

  const addFood = async (food) => {
    const res = await fetch("/api/food", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(food),
    });
    const newFood = await res.json();
    setFoods(prev => [newFood, ...prev]);
  };

  return (
    <FoodContext.Provider value={{ foods, addFood }}>
      {children}
    </FoodContext.Provider>
  );
}

export const useFood = () => useContext(FoodContext);
