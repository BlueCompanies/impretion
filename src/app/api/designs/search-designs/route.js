import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request) {
  const { searchValue } = await request.json();
  console.log(searchValue);
  try {
    const response = await fetch(
      `https://sa-east-1.aws.data.mongodb-api.com/app/data-lqpho/endpoint/searchDesigns?ms=${Date.now()}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Request-Headers": "*",
          "api-key":
            "s5lWj1OL7r578NX3d8dcJ6TOfNrTPjQp3gfzWdF0trpmQEOX1z7DStx8eCwk7SfG",
          "cache-control": "no-cache",
          pragma: "no-cache",
          "cache-control": "no-store",
        },
        body: JSON.stringify({
          searchValue,
        }),
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
}
