import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.device.upsert({
    where: { codename: "sweet" },
    update: {
      name: "Redmi Note 10 Pro / Pro Max",
      brand: "Xiaomi",
      romName: "Custom Android",
      androidVersion: "Android 15+",
      maintainerName: "Manish Kishore",
      maintainerGithub: "manishkishore92",
      description:
        "Maintainer profile for Redmi Note 10 Pro / Pro Max. Use this device entry to publish builds, manage release notes, generate OTA metadata, and track tester reports.",
      deviceTreeUrl: "https://github.com/manishkishore92",
      kernelUrl: "https://github.com/manishkishore92",
      vendorUrl: "https://github.com/manishkishore92",
      supportUrl: "https://github.com/manishkishore92/rom-harbor/issues"
    },
    create: {
      codename: "sweet",
      name: "Redmi Note 10 Pro / Pro Max",
      brand: "Xiaomi",
      romName: "Custom Android",
      androidVersion: "Android 15+",
      maintainerName: "Manish Kishore",
      maintainerGithub: "manishkishore92",
      description:
        "Maintainer profile for Redmi Note 10 Pro / Pro Max. Use this device entry to publish builds, manage release notes, generate OTA metadata, and track tester reports.",
      deviceTreeUrl: "https://github.com/manishkishore92",
      kernelUrl: "https://github.com/manishkishore92",
      vendorUrl: "https://github.com/manishkishore92",
      supportUrl: "https://github.com/manishkishore92/rom-harbor/issues"
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
