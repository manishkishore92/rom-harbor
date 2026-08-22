import { NextResponse } from "next/server";
import { getReleases } from "@/lib/data";

export async function GET() {
  const releases = await getReleases();
  return NextResponse.json({ releases });
}
