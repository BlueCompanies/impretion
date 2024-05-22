import { getClientSession } from "@/app/_lib/shop/getClientSession";
import { NextResponse } from "next/server";

// set runtime to Edge
export const runtime = "edge";

export async function GET(req, res) {
    try {
      console.log("JAJSAJHSAHJSAJ")
      const urlParts = req.url.split("?");
      console.log("???????", urlParts)
      const queryParams = new URLSearchParams(urlParts[1]);

      // Access individual query parameters
      const sessionId = queryParams.get('sessionId');
      console.log(sessionId)
      const data = await getClientSession(sessionId)

      return NextResponse.json(data, { status: 200 });
    } catch (error) {
      console.log(error);
      return NextResponse.json({}, { status: 404 });
    }
  }

export async function POST(req, res) {
  try {
    const body = await req.json()
    const {filter, update} = body


    const response = await fetch(
      "https://sa-east-1.aws.data.mongodb-api.com/app/data-lqpho/endpoint/data/v1/action/updateOne",
      {
        method: "POST",
        headers: {
          apiKey:
            "jUlBvV4q0boUTjyw4bCWXKEVnzPg0YnHdFM8xeqtJQO0pGjLFewwWpu3gpOKBKbj",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          dataSource: "Impretion",
          database: "impretion-shops",
          collection: "temporal-client-session",
          filter,
          update,
        }),
      }
    );
  
    const data = await response.json();

    return NextResponse.json(data , { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({}, { status: 404 });
  }
}
