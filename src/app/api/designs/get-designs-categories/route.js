import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request) {
  console.log("ptm");
  try {
    const response = await fetch(
      `https://sa-east-1.aws.data.mongodb-api.com/app/data-lqpho/endpoint/getDesignsCategories`,
      {
        method: "GET",
        headers: {
          "api-key":
            "lVUsfwLvFxQjkat3L5Gvd6lDM00WV1Q0j43FW57WCuXJcpZ622DYXYenNPePsmCS",
        },
      }
    );
    if (response.status === 200) {
      const data = await response.json();
      console.log(data);
      return NextResponse.json(data, { status: 200 });
    } else {
      return NextResponse.json({}, { status: 404 });
    }
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json({}, { status: 404 });
  }
}
