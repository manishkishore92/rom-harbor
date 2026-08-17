import { existsSync, readFileSync } from "node:fs";

const required = [
  "package.json",
  "app/page.tsx",
  "app/admin/page.tsx",
  "app/api/ota/[codename]/route.ts",
  "prisma/schema.prisma",
  "prisma/seed.ts",
  "README.md"
];

for (const file of required) {
  if (!existsSync(file)) {
    console.error(`Missing required file: ${file}`);
    process.exit(1);
  }
}

const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
for (const script of ["dev", "build", "db:migrate", "db:seed", "ota:generate"]) {
  if (!packageJson.scripts?.[script]) {
    console.error(`Missing package script: ${script}`);
    process.exit(1);
  }
}

const readme = readFileSync("README.md", "utf8");
if (!readme.includes("ROM Harbor")) {
  console.error("README.md does not describe ROM Harbor.");
  process.exit(1);
}

console.log("ROM Harbor project validation passed.");
