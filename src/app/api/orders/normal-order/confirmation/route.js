import { NextResponse } from "next/server";

export const runtime = "edge";
export async function POST(request) {
  try {
    const formData = await request.formData();

    // Data to be sent
    const jsonData = JSON.stringify(Object.fromEntries(formData));

    // ID to target the desired order
    const parsedData = await JSON.parse(jsonData);
    const orderReference = parsedData.extra1;
    //secret: A3337ZI7WNMMGHL6YUBCY1D2JKL1ZZZAB824WDD
    //api-key: thsmZ3xh3TEfRbiuBrw1rjcsnQnMp5rCIbM6Phz0BOcVPz8ML0ILEBhxKNaDrR47
    try {
      const response = await fetch(
        `https://sa-east-1.aws.data.mongodb-api.com/app/data-lqpho/endpoint/normalOrderConfirmation?secret=A3337ZI7WNMMGHL6YUBCY1D2JKL1ZZZAB824WDD&ms=${Date.now()}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Request-Headers": "*",
            "api-key":
              "thsmZ3xh3TEfRbiuBrw1rjcsnQnMp5rCIbM6Phz0BOcVPz8ML0ILEBhxKNaDrR47",
            "cache-control": "no-cache",
            pragma: "no-cache",
            "cache-control": "no-store",
          },
          body: JSON.stringify({
            jsonData,
            orderReference,
          }),
        }
      );
      if (response.status === 200) {
        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
      } else {
        return NextResponse.json({}, { status: 404 });
      }
    } catch (error) {
      return NextResponse.json({}, { status: 404 });
    }
    /*
     */
    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return { error: "Failed to process the request" };
  }
}
