import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request) {
  const { designId, keyword } = await request.json();
  try {
    const response = await fetch(
      `https://sa-east-1.aws.data.mongodb-api.com/app/data-lqpho/endpoint/getDesignsByCategory`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Request-Headers": "*",
          "api-key":
            "lVUsfwLvFxQjkat3L5Gvd6lDM00WV1Q0j43FW57WCuXJcpZ622DYXYenNPePsmCS",
        },
        body: JSON.stringify({
          designId,
          keyword,
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
