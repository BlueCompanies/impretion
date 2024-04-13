import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request) {
  const { generatedPhoneCode, nequiPhone } = await request.json();
  console.log(generatedPhoneCode, nequiPhone);

  try {
    const response = await fetch("https://api.labsmobile.com/json/send", {
      method: "POST",
      headers: {
        "Cache-Control": "no-cache",
        Authorization:
          "Basic " +
          btoa("admin@impretion.com:CeTAMuMHtYfLX5rsNMIDbSjuKWJXjhnM"),
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        message: `Tú codigo de verificación de Impretion es ${generatedPhoneCode}.`,
        tpoa: "Sender",
        recipient: [
          {
            msisdn: `57${nequiPhone}`,
          },
        ],
      }),
    });

    const data = await response.json();
    console.log("RESPONSE: ", response);
    console.log("DATA: ", data);
    const authorization = `Basic ${Buffer.from(
      `rbeqru5cpvvrp7gpsejj385bh:lbjpfrk3jbetpf9u0q2o4g75h2jr16h46qp2m246u9d9m4nfjjv`
    ).toString("base64")}`;

    console.log(authorization);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
  return NextResponse.json({}, { status: 200 });
}
