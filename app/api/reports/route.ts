import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const codename = String(body.codename || "").trim();
  const title = String(body.title || "").trim();
  const description = String(body.description || "").trim();
  const steps = String(body.steps || "").trim();

  if (!codename || !title || !description || !steps) {
    return NextResponse.json({ error: "codename, title, description, and steps are required" }, { status: 400 });
  }

  const device = await prisma.device.findUnique({ where: { codename } });
  if (!device) {
    return NextResponse.json({ error: "device not found" }, { status: 404 });
  }

  const report = await prisma.testerReport.create({
    data: {
      deviceId: device.id,
      issueType: body.issueType || "OTHER",
      title,
      description,
      steps,
      logsUrl: body.logsUrl || null,
      screenshotsUrl: body.screenshotsUrl || null,
      reporterName: body.reporterName || null
    }
  });

  return NextResponse.json({ report }, { status: 201 });
}
