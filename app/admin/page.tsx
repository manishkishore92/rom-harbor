import Link from "next/link";
import { requireMaintainer } from "@/lib/authz";
import { getAdminData } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";

export default async function AdminPage() {
  await requireMaintainer();
  const data = await getAdminData();

  return (
    <>
      {!data.ready && <div className="notice">Database is not ready. Set DATABASE_URL and run Prisma commands from the README.</div>}
      <div className="page-title">
        <div>
          <div className="pill">Maintainer dashboard</div>
          <h1>Control panel</h1>
          <p className="lead">Create devices, publish releases, review tester reports, and generate OTA metadata.</p>
        </div>
      </div>

      <section className="grid">
        <Link className="card" href="/admin/devices"><h2>Devices</h2><p>Create and manage device profiles, source links, support links, firmware notes, and recovery notes.</p></Link>
        <Link className="card" href="/admin/releases"><h2>Releases</h2><p>Create ROM releases with changelog sections, checksums, requirements, and download links.</p></Link>
        <Link className="card" href="/admin/reports"><h2>Reports</h2><p>Review tester reports and move them through open, confirmed, need logs, fixed, and closed states.</p></Link>
      </section>

      <section className="two-grid" style={{ marginTop: 18 }}>
        <div className="card">
          <h2>Recent releases</h2>
          <div className="list">
            {data.releases.map((release) => (
              <Link className="list-item" href={`/releases/${release.slug}`} key={release.id}>
                <div><strong>{release.title}</strong><span className="muted">{release.device.codename} · {formatDate(release.releaseDate)}</span></div>
                <StatusBadge value={release.status} />
              </Link>
            ))}
          </div>
        </div>
        <div className="card">
          <h2>Recent reports</h2>
          <div className="list">
            {data.reports.map((report) => (
              <Link className="list-item" href="/admin/reports" key={report.id}>
                <div><strong>{report.title}</strong><span className="muted">{report.device.codename} · {formatDate(report.createdAt)}</span></div>
                <StatusBadge value={report.status} />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
