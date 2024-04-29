import { updateUser } from "@/app/_lib/userProfiles";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const jsonData = Object.fromEntries(formData);
    const orderReference = jsonData.extra1;

    // Send order confirmation request
    /*
    const response = await fetch(
      `https://sa-east-1.aws.data.mongodb-api.com/app/data-lqpho/endpoint/normalOrderConfirmation?secret=A3337ZI7WNMMGHL6YUBCY1D2JKL1ZZZAB824WDD&ms=${Date.now()}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key":
            "thsmZ3xh3TEfRbiuBrw1rjcsnQnMp5rCIbM6Phz0BOcVPz8ML0ILEBhxKNaDrR47",
          "cache-control": "no-cache",
          pragma: "no-cache",
        },
        body: JSON.stringify({
          jsonData,
          orderReference,
        }),
      }
    );
     */

    const response = await fetch(
      "https://sa-east-1.aws.data.mongodb-api.com/app/data-lqpho/endpoint/data/v1/action/updateOne",
      {
        method: "POST",
        headers: {
          apiKey:
            "thsmZ3xh3TEfRbiuBrw1rjcsnQnMp5rCIbM6Phz0BOcVPz8ML0ILEBhxKNaDrR47",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          dataSource: "Impretion",
          database: "orders",
          collection: "orders",
          filter: { orderReference },
          update: {
            $set: {
              orderStatus: "PROCESSED",
              processedDetails: jsonData,
            },
          },
        }),
      }
    );

    if (response.status === 200) {
      console.log("extra2: ", jsonData.extra2);
      // Update user's wallet if extra2 is not null
      if (jsonData.extra2) {
        const userUpdateResponse = await updateUser(
          { "affiliateData.affiliateId.id": jsonData.extra2 },
          { $inc: { "affiliateData.wallet": Number(jsonData.value) } }
        );
        if (userUpdateResponse.status === 200) {
          return NextResponse.json({}, { status: 200 });
        } else {
          return NextResponse.json({}, { status: 400 });
        }
      }

      return NextResponse.json({}, { status: 200 });
    } else {
      return NextResponse.json({}, { status: 404 });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({}, { status: 500 });
  }
}
