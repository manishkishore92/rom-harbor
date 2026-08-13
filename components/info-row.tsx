export function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="kv">
      <span>{label}</span>
      <strong>{value || "Not set"}</strong>
    </div>
  );
}
