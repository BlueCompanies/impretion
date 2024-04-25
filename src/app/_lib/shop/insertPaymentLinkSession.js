export const insertPaymentLinkSession = async (id) => {
  try {
    const response = await fetch(
      "https://sa-east-1.aws.data.mongodb-api.com/app/data-lqpho/endpoint/insertPaymentLinkSession",
      {
        method: "POST",
        headers: {
          apiKey:
            "jUlBvV4q0boUTjyw4bCWXKEVnzPg0YnHdFM8xeqtJQO0pGjLFewwWpu3gpOKBKbj",
          contentType: "application/json",
        },
        body: JSON.stringify({ linkSessionId: id }),
      }
    );
    //console.log(response);

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
