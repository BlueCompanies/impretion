/*
import { NextResponse } from "next/server";
import sharp from "sharp"; // Import sharp library

export const runtime = "edge";

export async function POST(request) {
  try {
    console.log("dick");
    const formData = await request.formData(); // this is the formData from the client
    const file = formData.get("file"); // Get the file from the form data

    if (!file) {
      // Handle case where file is not found in formData
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }

    // Now you can access the file data
    console.log("File:", file);

    // Convert the file Blob into a buffer
    const buffer = await file.arrayBuffer();

    // Use sharp to process the image buffer
    const resizedImageBuffer = await sharp(buffer)
      .resize({ width: 200 }) // Example: resize the image to a width of 200 pixels
      .toBuffer();

    // Now you can send the resizedImageBuffer to wherever you need it

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
 */
