import insertClientSession from "@/app/_lib/shop/insertClientSession";
import { NextResponse } from "next/server";

// set runtime to Edge
export const runtime = "edge";

export async function POST(req, res) {
  try {
    const body = await req.json();

    console.log("bary", body);
    const { sessionId } = body;
    console.log("ala:", sessionId);

    await insertClientSession(sessionId);

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({}, { status: 404 });
  }
}
