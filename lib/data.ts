import { prisma } from "@/lib/prisma";

async function safe<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await operation();
  } catch {
    return fallback;
  }
}

export async function getDashboardData() {
  return safe(
    async () => {
      const [devices, releases, reports] = await Promise.all([
        prisma.device.count(),
        prisma.release.count({ where: { status: "PUBLISHED" } }),
        prisma.testerReport.count({ where: { status: { in: ["OPEN", "CONFIRMED", "NEED_LOGS"] } } })
      ]);

      const latestReleases = await prisma.release.findMany({
        where: { status: { in: ["PUBLISHED", "TESTING"] } },
        include: { device: true, mirrors: true },
        orderBy: { releaseDate: "desc" },
        take: 5
      });

      const activeReports = await prisma.testerReport.findMany({
        where: { status: { in: ["OPEN", "CONFIRMED", "NEED_LOGS"] } },
        include: { device: true, release: true },
        orderBy: { createdAt: "desc" },
        take: 5
      });

      return { ready: true, devices, releases, reports, latestReleases, activeReports };
    },
    { ready: false, devices: 0, releases: 0, reports: 0, latestReleases: [], activeReports: [] }
  );
}

export async function getDevices() {
  return safe(
    () =>
      prisma.device.findMany({
        include: { _count: { select: { releases: true, testerReports: true } } },
        orderBy: [{ status: "asc" }, { codename: "asc" }]
      }),
    []
  );
}

export async function getDevice(codename: string) {
  return safe(
    () =>
      prisma.device.findUnique({
        where: { codename },
        include: {
          releases: { include: { mirrors: true }, orderBy: { releaseDate: "desc" } },
          testerReports: { orderBy: { createdAt: "desc" }, take: 8 }
        }
      }),
    null
  );
}

export async function getReleases() {
  return safe(
    () =>
      prisma.release.findMany({
        include: { device: true, mirrors: true },
        orderBy: { releaseDate: "desc" }
      }),
    []
  );
}

export async function getRelease(slug: string) {
  return safe(
    () =>
      prisma.release.findUnique({
        where: { slug },
        include: { device: true, mirrors: true, reports: { orderBy: { createdAt: "desc" } } }
      }),
    null
  );
}

export async function getReports() {
  return safe(
    () =>
      prisma.testerReport.findMany({
        include: { device: true, release: true },
        orderBy: { createdAt: "desc" }
      }),
    []
  );
}

export async function getPublishedLatestRelease(codename: string) {
  return safe(
    () =>
      prisma.release.findFirst({
        where: { device: { codename }, status: "PUBLISHED" },
        include: { device: true, mirrors: true },
        orderBy: { releaseDate: "desc" }
      }),
    null
  );
}

export async function getAdminData() {
  return safe(
    async () => {
      const [devices, releases, reports] = await Promise.all([
        prisma.device.findMany({ orderBy: { codename: "asc" } }),
        prisma.release.findMany({ include: { device: true }, orderBy: { releaseDate: "desc" }, take: 10 }),
        prisma.testerReport.findMany({ include: { device: true, release: true }, orderBy: { createdAt: "desc" }, take: 10 })
      ]);
      return { ready: true, devices, releases, reports };
    },
    { ready: false, devices: [], releases: [], reports: [] }
  );
}
