import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "../../auth/[...nextauth]/auth.config";
import { auth } from "../../auth/[...nextauth]/auth";
//import { NextApiRequest, NextApiResponse } from "next";

// set runtime to Edge
export const runtime = "edge";

export async function POST(req, res) {
  const body = await req.json();
  const session = await auth();

  const response = await fetch(
    "https://sa-east-1.aws.data.mongodb-api.com/app/data-lqpho/endpoint/data/v1/action/findOne",
    {
      method: "POST",
      headers: {
        apiKey:
          "jUlBvV4q0boUTjyw4bCWXKEVnzPg0YnHdFM8xeqtJQO0pGjLFewwWpu3gpOKBKbj",
        contentType: "application/json",
      },
      body: JSON.stringify({
        dataSource: "Impretion",
        database: "users",
        collection: "profiles",
        filter: {
          affiliateId: body,
        },
      }),
    }
  );

  const data = await response.json();

  const { document } = data;

  // returns the affiliateId if document is null, it means the affiliateId is not repeated and can be proccessed.
  if (!document) {
    const insertedIDResponse = await fetch(
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
          database: "users",
          collection: "profiles",
          filter: {
            email: session.user.email,
          },
          update: {
            $set: {
              "affiliateData.affiliateId": { id: body, enabled: true },
            },
          },
        }),
      }
    );
    const insertedIDData = await insertedIDResponse.json();
    return NextResponse.json({ data: body }, { status: 200 });
  }

  return NextResponse.json(
    {
      data: "El ID generado ya existe, porfavor vuelve a generar otro.",
    },
    { status: 409 }
  );
}
