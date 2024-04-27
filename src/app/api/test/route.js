import { updateUser } from "@/app/_lib/userProfiles";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  try {
    return NextResponse.json({ trigger: "" }, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({}, { status: 500 });
  }
}
