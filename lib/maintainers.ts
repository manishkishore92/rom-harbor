export function allowedMaintainers(): string[] {
  return (process.env.ALLOWED_MAINTAINERS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}
