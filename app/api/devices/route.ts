import { NextResponse } from "next/server";
import { getDevices } from "@/lib/data";

export async function GET() {
  const devices = await getDevices();
  return NextResponse.json({ devices });
}
