import { NextResponse } from "next/server";
import { fileTypeFromBuffer } from "file-type";

export async function POST(request) {
  try {
    const formDataFlag = await request.formData();
    const file = formDataFlag.get("file");
    const fileToBuffer = await file.arrayBuffer();
    const fileType = await fileTypeFromBuffer(fileToBuffer);

    // Check if the fileType.mime is not one of the allowed types
    if (
      fileType.mime !== "image/png" &&
      fileType.mime !== "image/jpg" &&
      fileType.mime !== "image/jpeg"
    ) {
      return NextResponse.json({}, { status: 400 });
    }

    // If the file type is allowed, return success
    return NextResponse.json({ extension: fileType.ext }, { status: 200 });
  } catch (error) {
    // Handle errors
    return NextResponse.json({}, { status: 500 });
  }
}
