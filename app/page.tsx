import Link from "next/link";
import { getDashboardData } from "@/lib/data";
import { formatDate, formatBytes } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";

export default async function HomePage() {
  const data = await getDashboardData();

  return (
    <>
      {!data.ready && (
        <div className="notice">
          Database is not connected yet. Configure <strong>DATABASE_URL</strong>, run Prisma migration, and seed the maintainer profile to enable live data.
        </div>
      )}

      <section className="hero">
        <div className="panel">
          <div className="pill">Android ROM Release Platform</div>
          <h1>Manage builds, releases, OTA metadata, and tester reports.</h1>
          <p className="lead">
            ROM Harbor gives Android maintainers a public release hub and a private control panel for devices, releases, changelogs, mirrors, OTA JSON, and tester feedback.
          </p>
          <div className="actions">
            <Link className="button" href="/admin">Open Maintainer Dashboard</Link>
            <Link className="ghost-button" href="/releases">View Releases</Link>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat"><span>Devices</span><strong>{data.devices}</strong></div>
          <div className="stat"><span>Published releases</span><strong>{data.releases}</strong></div>
          <div className="stat"><span>Active reports</span><strong>{data.reports}</strong></div>
        </div>
      </section>

      <section className="two-grid">
        <div className="card">
          <h2>Latest releases</h2>
          <div className="list">
            {data.latestReleases.length === 0 ? (
              <EmptyState title="No releases published" text="Create a release from the admin dashboard and publish it when the build is ready." />
            ) : (
              data.latestReleases.map((release) => (
                <Link className="list-item" href={`/releases/${release.slug}`} key={release.id}>
                  <div>
                    <strong>{release.title}</strong>
                    <span className="muted">{release.device.codename} · {formatDate(release.releaseDate)} · {formatBytes(release.fileSizeBytes)}</span>
                  </div>
                  <StatusBadge value={release.status} />
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <h2>Tester reports</h2>
          <div className="list">
            {data.activeReports.length === 0 ? (
              <EmptyState title="No active reports" text="Tester reports will appear here after users submit issues for a device or build." />
            ) : (
              data.activeReports.map((report) => (
                <Link className="list-item" href="/reports" key={report.id}>
                  <div>
                    <strong>{report.title}</strong>
                    <span className="muted">{report.device.codename} · {formatDate(report.createdAt)}</span>
                  </div>
                  <StatusBadge value={report.status} />
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
