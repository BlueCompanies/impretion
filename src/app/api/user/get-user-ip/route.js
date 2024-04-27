import requestIp from "request-ip";
import { NextResponse } from "next/server";

// set runtime to Edge
export const runtime = "edge";

export async function GET(req, res) {
  //console.log("mrd: ", requestIp.getClientIp());
  console.log(req);
  return NextResponse.json(
    {
      data: "El ID generado ya existe, porfavor vuelve a generar otro.",
    },
    { status: 409 }
  );
}
