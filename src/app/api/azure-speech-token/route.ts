import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION;

  if (!key || !region) {
    return NextResponse.json(
      { error: "Azure Speech environment variables are missing." },
      { status: 500 },
    );
  }

  const response = await fetch(
    `https://${region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
    {
      method: "POST",
      headers: {
        "Content-length": "0",
        "Content-type": "application/x-www-form-urlencoded",
        "Ocp-Apim-Subscription-Key": key,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const details = await response.text();

    return NextResponse.json(
      { error: "Failed to fetch Azure Speech token.", details },
      { status: 500 },
    );
  }

  const token = await response.text();

  return NextResponse.json(
    { token, region },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
