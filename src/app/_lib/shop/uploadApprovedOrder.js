export default async function uploadApprovedOrder() {
  try {
    const response = await fetch(
      "https://sa-east-1.aws.data.mongodb-api.com/app/data-lqpho/endpoint/data/v1/action/insertOne",
      {
        method: "POST",
        headers: {
          apiKey:
            "jUlBvV4q0boUTjyw4bCWXKEVnzPg0YnHdFM8xeqtJQO0pGjLFewwWpu3gpOKBKbj",
          "content-type": "application/json", // Add content-type header
        },
        body: JSON.stringify({
          dataSource: "Impretion",
          database: "orders",
          collection: "approved-orders",
          document: {},
        }),
      }
    );
    //console.log(response);

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
