export default async function insertClientSession(generatedSessionId) {
  try {
    const x = await fetch(
      "https://sa-east-1.aws.data.mongodb-api.com/app/data-lqpho/endpoint/data/v1/action/insertOne",
      {
        method: "POST",
        headers: {
          apiKey:
            "n5cPXyDjcNm37mcCb4mrfVPebcMSurv1dB1vJcNcAv6kaqDeQq4W0ZGGHQJTAAi1",
          "content-type": "application/json", // Add content-type header
          "Access-Control-Request-Headers": "*",
        },
        body: JSON.stringify({
          dataSource: "Impretion",
          database: "impretion-shops",
          collection: "temporal-client-session",
          document: {
            sessionId: generatedSessionId,
            paymentTries: {
              cashPaymentTries: 3,
              onlinePaymentTries: 1,
            },
          },
        }),
      }
    );

    const data = await x.json();
  } catch (error) {
    console.log(error);
  }
}
