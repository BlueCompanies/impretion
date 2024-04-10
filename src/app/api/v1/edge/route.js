import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "../../auth/[...nextauth]/auth.config";
//import { NextApiRequest, NextApiResponse } from "next";

// set runtime to Edge
export const runtime = "edge";

export async function GET(req, res) {
  const { auth } = NextAuth(authConfig); // use config without database adapter

  const session = auth(req, res);
  console.log(session);
  if (!session) {
    return NextResponse.json({ error: "not signed in" }, { status: 401 });
  }

  return NextResponse.json({ data: "you got it" }, { status: 200 });
}
