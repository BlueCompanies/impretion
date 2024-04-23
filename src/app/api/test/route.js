import { updateUser } from "@/app/_lib/userProfiles";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  try {
    console.log("Trigerensin funcionando jiji jip!!!");
    return NextResponse.json(
      { trigger: "Trigger funcionando chavlin tin tin!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({}, { status: 500 });
  }
}
