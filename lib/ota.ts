import type { Device, DownloadMirror, Release } from "@prisma/client";

type ReleaseWithDevice = Release & {
  device: Device;
  mirrors: DownloadMirror[];
};

export type OtaResponse = {
  response: Array<{
    datetime: number;
    filename: string;
    id: string;
    romtype: string;
    size: number;
    url: string;
    version: string;
  }>;
};

export function buildOtaResponse(release: ReleaseWithDevice | null): OtaResponse {
  if (!release) return { response: [] };

  const primaryMirror = release.mirrors.sort((a, b) => a.priority - b.priority)[0];
  const url = primaryMirror?.url || release.downloadUrl;

  return {
    response: [
      {
        datetime: Math.floor(new Date(release.releaseDate).getTime() / 1000),
        filename: release.fileName,
        id: release.sha256,
        romtype: release.buildType,
        size: Number(release.fileSizeBytes),
        url,
        version: release.version
      }
    ]
  };
}
