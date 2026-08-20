"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireMaintainer } from "@/lib/authz";
import { slugify } from "@/lib/format";

function required(formData: FormData, key: string): string {
  const value = String(formData.get(key) || "").trim();
  if (!value) throw new Error(`${key} is required`);
  return value;
}

function optional(formData: FormData, key: string): string | null {
  const value = String(formData.get(key) || "").trim();
  return value || null;
}

export async function createDevice(formData: FormData) {
  await requireMaintainer();

  await prisma.device.create({
    data: {
      codename: required(formData, "codename").toLowerCase(),
      name: required(formData, "name"),
      brand: required(formData, "brand"),
      status: (formData.get("status") as "ACTIVE" | "TESTING" | "DEPRECATED") || "ACTIVE",
      romName: required(formData, "romName"),
      androidVersion: required(formData, "androidVersion"),
      maintainerName: required(formData, "maintainerName"),
      maintainerGithub: required(formData, "maintainerGithub"),
      description: required(formData, "description"),
      supportUrl: optional(formData, "supportUrl"),
      deviceTreeUrl: optional(formData, "deviceTreeUrl"),
      kernelUrl: optional(formData, "kernelUrl"),
      vendorUrl: optional(formData, "vendorUrl"),
      firmwareNote: optional(formData, "firmwareNote"),
      recoveryNote: optional(formData, "recoveryNote")
    }
  });

  revalidatePath("/devices");
  revalidatePath("/admin");
  redirect("/admin/devices");
}

export async function createRelease(formData: FormData) {
  await requireMaintainer();

  const title = required(formData, "title");
  const deviceId = required(formData, "deviceId");
  const version = required(formData, "version");
  const releaseDate = new Date(required(formData, "releaseDate"));
  const fileSizeBytes = BigInt(required(formData, "fileSizeBytes"));
  const slug = slugify(`${title}-${version}-${releaseDate.toISOString().slice(0, 10)}`);

  await prisma.release.create({
    data: {
      deviceId,
      slug,
      title,
      romName: required(formData, "romName"),
      version,
      androidVersion: required(formData, "androidVersion"),
      buildType: (formData.get("buildType") as "OFFICIAL" | "UNOFFICIAL" | "COMMUNITY" | "EXPERIMENTAL") || "UNOFFICIAL",
      status: (formData.get("status") as "DRAFT" | "TESTING" | "PUBLISHED" | "ARCHIVED") || "DRAFT",
      releaseDate,
      securityPatch: required(formData, "securityPatch"),
      fileName: required(formData, "fileName"),
      fileSizeBytes,
      sha256: required(formData, "sha256"),
      downloadUrl: required(formData, "downloadUrl"),
      recoveryRequirement: optional(formData, "recoveryRequirement"),
      firmwareRequirement: optional(formData, "firmwareRequirement"),
      flashingInstructions: required(formData, "flashingInstructions"),
      changelogRom: required(formData, "changelogRom"),
      changelogDevice: required(formData, "changelogDevice"),
      changelogKernel: required(formData, "changelogKernel"),
      knownBugs: required(formData, "knownBugs"),
      notes: optional(formData, "notes")
    }
  });

  revalidatePath("/releases");
  revalidatePath("/admin");
  redirect("/admin/releases");
}

export async function updateReportStatus(formData: FormData) {
  await requireMaintainer();

  await prisma.testerReport.update({
    where: { id: required(formData, "id") },
    data: { status: formData.get("status") as "OPEN" | "CONFIRMED" | "NEED_LOGS" | "FIXED" | "INVALID" | "CLOSED" }
  });

  revalidatePath("/reports");
  revalidatePath("/admin/reports");
}
