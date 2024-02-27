import { NextResponse } from "next/server";

export const runtime = "edge";
export async function POST(request) {
  try {
    // Log the received request to check its structure
    //console.log("Received request:", request);

    // Check if the request body is valid JSON
    const requestBody = await request.json();
    console.log(requestBody);

    // api-key: hfK5LsRQypj3FrNYsxov6bQ4b8bako1iW9AC7hNCUCntjkklUejVzV9SAZndWSD2
    // secret: 56GHTY1364781F281ZZ9E27W9B5F62M293X4

    try {
      const response = await fetch(
        `https://sa-east-1.aws.data.mongodb-api.com/app/data-lqpho/endpoint/newNormalOrderProcess?secret=56GHTY1364781F281ZZ9E27W9B5F62M293X4&ms=${Date.now()}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Request-Headers": "*",
            "api-key":
              "hfK5LsRQypj3FrNYsxov6bQ4b8bako1iW9AC7hNCUCntjkklUejVzV9SAZndWSD2",
            "cache-control": "no-cache",
            pragma: "no-cache",
            "cache-control": "no-store",
          },
          body: JSON.stringify(requestBody),
        }
      );
      if (response.status === 200) {
        const data = await response.json();

        return NextResponse.json(data, { status: 200 });
      } else {
        return NextResponse.json({}, { status: 404 });
      }
    } catch (error) {
      return NextResponse.json({}, { status: 404 });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return { error: "Failed to process the request" };
  }
}
