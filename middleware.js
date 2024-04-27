import { NextResponse } from "next/server";

export function middleware(req) {
  let response = NextResponse.next();
  response.cookies.set("test", "alloha");

  return response;
}

export const runtime = "edge";
