"use server";

export const getUser = async (email) => {
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
          email,
        },
      }),
    }
  );

  const data = await response.json();
  return data;
};

export const insertUser = async (email, name) => {
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
        database: "users",
        collection: "profiles",
        document: {
          email,
          name,
        },
      }),
    }
  );

  const data = await response.json();
  return data;
};
