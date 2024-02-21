import connectDB from "@/app/_lib/connectDB";
import Product from "@/app/_models/Product";
import { NextResponse } from "next/server";

export const runtime = "edge";
export async function POST(request) {
  await connectDB();
  try {
    const { id } = await request.json();
    const productFound = await Product.findById(id);
    console.log("P FOUND: ", productFound);
    return NextResponse.json({ productFound }, { status: 200 });
  } catch (error) {
    return { error: `Failed to fetch product with id ${id}` };
  }
}
