import { prisma } from "@/lib/prisma";



export async function GET() {
  const foods = await prisma.food.findMany({
    orderBy: { createdAt: "desc" }
  });
  return Response.json(foods);
}

export async function POST(req) {
  const data = await req.json();
  const food = await prisma.food.create({ data });
  return Response.json(food);
}

export async function PUT(req) {
  const body = await req.json();

  const updatedFood = await prisma.food.update({
    where: { id: body.id },
    data: {
      name: body.name,
      calories: body.calories,
    },
  });

  return Response.json(updatedFood);
}

