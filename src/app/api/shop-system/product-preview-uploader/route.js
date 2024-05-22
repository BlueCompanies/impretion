import awsS3 from "@/app/_lib/aws";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import ShortUniqueId from "short-unique-id";

// Set runtime to Edge
export const runtime = "edge";

export async function POST(req) {
  console.log("asdfasdfsaXXXXXXXXXXXX");
  // Set CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("image");
    const buffer = await file.arrayBuffer();

    const command = new PutObjectCommand({
      Bucket: "impretion",
      Key: `impretion-shops/user-temp-sessions-files/exxxxxrg.png`,
      Body: buffer,
    });

    await awsS3().send(command);

    return new Response(
      JSON.stringify({ message: "File uploaded successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to upload file" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
}
