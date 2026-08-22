import { NextResponse } from "next/server";
import { getPublishedLatestRelease } from "@/lib/data";
import { buildOtaResponse } from "@/lib/ota";

export async function GET(_request: Request, { params }: { params: Promise<{ codename: string }> }) {
  const { codename } = await params;
  const release = await getPublishedLatestRelease(codename);
  return NextResponse.json(buildOtaResponse(release), {
    headers: {
      "Cache-Control": "public, max-age=60, s-maxage=300"
    }
  });
}
