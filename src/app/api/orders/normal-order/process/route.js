import { updateUser } from "@/app/_lib/userProfiles";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request) {
  try {
    const orderDetails = await request.json();

    // Insert order details into unprocessed-orders collection
    const orderResponse = await fetch(
      "https://sa-east-1.aws.data.mongodb-api.com/app/data-lqpho/endpoint/data/v1/action/insertOne",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key":
            "hfK5LsRQypj3FrNYsxov6bQ4b8bako1iW9AC7hNCUCntjkklUejVzV9SAZndWSD2",
        },
        body: JSON.stringify({
          dataSource: "Impretion",
          database: "orders",
          collection: "orders",
          document: orderDetails,
        }),
      }
    );

    if (orderResponse.status === 201) {
      return NextResponse.json({}, { status: 200 });
    } else {
      return NextResponse.json({}, { status: orderResponse.status });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({}, { status: 500 });
  }
}
