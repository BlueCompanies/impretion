import { NextResponse } from "next/server";

export const runtime = "edge";
export async function POST(request) {
  try {
    // Log the received request to check its structure
    console.log("Received request:", request);

    // Check if the request body is valid JSON
    const requestBody = await request.json();
    console.log("Parsed request body:xx ", requestBody);

    // Assuming `id` is used in your error message, you need to define or retrieve it
    // const id = requestBody.id;

    // Assuming there's an `id` in the request body, you can use it in the error message
    // return { error: `Failed to fetch product with id ${id}` };

    // If everything is successful, you can return a response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing request:", error);
    return { error: "Failed to process the request" };
  }
}
