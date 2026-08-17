import { mkdirSync, writeFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function buildOtaResponse(release) {
  if (!release) return { response: [] };
  const mirror = [...release.mirrors].sort((a, b) => a.priority - b.priority)[0];
  return {
    response: [
      {
        datetime: Math.floor(new Date(release.releaseDate).getTime() / 1000),
        filename: release.fileName,
        id: release.sha256,
        romtype: release.buildType,
        size: Number(release.fileSizeBytes),
        url: mirror?.url || release.downloadUrl,
        version: release.version
      }
    ]
  };
}

async function main() {
  mkdirSync("public/ota", { recursive: true });
  const devices = await prisma.device.findMany({ orderBy: { codename: "asc" } });

  for (const device of devices) {
    const release = await prisma.release.findFirst({
      where: { deviceId: device.id, status: "PUBLISHED" },
      include: { mirrors: true },
      orderBy: { releaseDate: "desc" }
    });
    writeFileSync(`public/ota/${device.codename}.json`, `${JSON.stringify(buildOtaResponse(release), null, 2)}\n`);
  }

  console.log(`Generated OTA metadata for ${devices.length} device(s).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
