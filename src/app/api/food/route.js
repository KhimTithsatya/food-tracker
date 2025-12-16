import { prisma } from "@/lib/prisma";
import { NextRequest } from 'next/server'; // Import NextRequest for type safety

// --- GET (Read all foods) ---
export async function GET() {
  const foods = await prisma.food.findMany({
    orderBy: { createdAt: "desc" }
  });
  return Response.json(foods);
}

// --- POST (Create a new food) ---
export async function POST(req) {
  const data = await req.json();
  // Note: Prisma expects 'calories' to be a number, ensure your schema matches.
  const food = await prisma.food.create({ data });
  return Response.json(food);
}

// --- PUT (Update an existing food) ---
export async function PUT(req) {
  const body = await req.json();

  // Basic check for ID
  if (!body.id) {
    return new Response(JSON.stringify({ error: "Missing food ID" }), { status: 400 });
  }

  const updatedFood = await prisma.food.update({
    where: { id: body.id },
    data: {
      name: body.name,
      // Ensure data types are consistent (calories should be a number)
      calories: body.calories, 
    },
  });

  return Response.json(updatedFood);
}

// 🛑 MISSING HANDLER: DELETE (Delete a food item) 🛑
export async function DELETE(req) {
  const body = await req.json();

  // Basic validation that an ID was provided
  if (!body.id) {
    return new Response(JSON.stringify({ error: "Missing food ID" }), { status: 400 });
  }

  try {
    await prisma.food.delete({
      where: { id: body.id },
    });
    
    // Return a 204 No Content response for successful deletion
    return new Response(null, { status: 204 });

  } catch (error) {
    console.error("Error deleting food:", error);
    // Handle case where the ID might not exist
    return new Response(JSON.stringify({ error: "Food item not found or deletion failed." }), { status: 404 });
  }
}