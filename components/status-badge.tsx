import { enumLabel } from "@/lib/format";

export function StatusBadge({ value }: { value: string }) {
  const normalized = value.toLowerCase();
  const tone =
    normalized.includes("published") || normalized.includes("active") || normalized.includes("fixed")
      ? "success"
      : normalized.includes("draft") || normalized.includes("testing") || normalized.includes("need")
        ? "warning"
        : normalized.includes("invalid") || normalized.includes("closed") || normalized.includes("deprecated")
          ? "danger"
          : "";

  return <span className={`pill ${tone}`}>{enumLabel(value)}</span>;
}
