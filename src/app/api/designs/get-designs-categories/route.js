import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request) {
  try {
    const response = await fetch(
      `https://sa-east-1.aws.data.mongodb-api.com/app/data-lqpho/endpoint/getDesignsCategories?ms=${Date.now()}`,
      {
        method: "GET",
        headers: {
          "api-key":
            "s5lWj1OL7r578NX3d8dcJ6TOfNrTPjQp3gfzWdF0trpmQEOX1z7DStx8eCwk7SfG",
          "cache-control": "no-cache",
          pragma: "no-cache",
          "cache-control": "no-store",
        },
      }
    );
    if (response.status === 200) {
      const data = await response.json();
      return NextResponse.json(data, { status: 200 });
    } else {
      return NextResponse.json({}, { status: 404 });
    }
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json({}, { status: 404 });
  }
}
