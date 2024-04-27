export const getShopInfo = async (shopRef) => {
  try {
    const response = await fetch(
      `https://sa-east-1.aws.data.mongodb-api.com/app/data-lqpho/endpoint/data/v1/action/findOne?ms=${new Date().getTime()}`,
      {
        method: "POST",
        headers: {
          apiKey:
            "jUlBvV4q0boUTjyw4bCWXKEVnzPg0YnHdFM8xeqtJQO0pGjLFewwWpu3gpOKBKbj",
          contentType: "application/json",
          cache: "no-cache",
        },
        body: JSON.stringify({
          dataSource: "Impretion",
          database: "shops",
          collection: "shops-info",
          filter: {
            shopId: shopRef,
          },
        }),
      }
    );

    const { document } = await response.json();
    return document;
  } catch (error) {
    console.log(error);
  }
};
