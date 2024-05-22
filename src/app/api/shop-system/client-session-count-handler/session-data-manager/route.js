import { NextResponse } from "next/server";
export const runtime = "edge";
export async function POST(req, res) {
  try {
    const body = await req.json();
    const { currentSession, shopRef, orderData, orderType } = body;

    // deletes the session record from DB
    await fetch(
      "https://sa-east-1.aws.data.mongodb-api.com/app/data-lqpho/endpoint/data/v1/action/deleteOne",
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
          filter: {
            sessionId: currentSession,
          },
        }),
      }
    );

    // inserts a new order
    await fetch(
      "https://sa-east-1.aws.data.mongodb-api.com/app/data-lqpho/endpoint/data/v1/action/insertOne",
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
          collection: "orders",
          document: {
            userInfo: orderData.userData,
            petData: orderData.petData,
            linkedShop: shopRef,
            orderType,
            orderStatus: {
              isProcessed: false,
              isCanceledByUser: false,
              unattainable: false, // far away user (out of Colombia)
              isDelivered: false,
            },
          },
        }),
      }
    );

    // updates the linked shop
    await fetch(
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
          collection: "affiliated-shops",
          filter: {
            shopId: shopRef,
          },
          update: {
            $inc: {
              "shopSalesStatisticsData.daily.todayRequests": +1,
              "shopSalesData.totalRequests": +1,
            },
          },
        }),
      }
    );

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({}, { status: 404 });
  }
}
