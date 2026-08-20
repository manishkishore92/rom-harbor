import { requireMaintainer } from "@/lib/authz";
import { getDevices, getReleases } from "@/lib/data";
import { createRelease } from "@/app/admin/actions";
import { formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";

export default async function AdminReleasesPage() {
  await requireMaintainer();
  const [devices, releases] = await Promise.all([getDevices(), getReleases()]);

  return (
    <>
      <div className="page-title">
        <div><div className="pill">Admin</div><h1>Release manager</h1></div>
      </div>
      <section className="two-grid">
        <form className="form-card card form-grid" action={createRelease}>
          <h2>Create release</h2>
          <label className="field"><span>Device</span><select name="deviceId" required>{devices.map((d) => <option value={d.id} key={d.id}>{d.codename} · {d.name}</option>)}</select></label>
          <label className="field"><span>Title</span><input name="title" required /></label>
          <label className="field"><span>ROM name</span><input name="romName" required /></label>
          <label className="field"><span>Version</span><input name="version" required /></label>
          <label className="field"><span>Android version</span><input name="androidVersion" required /></label>
          <label className="field"><span>Build type</span><select name="buildType"><option>UNOFFICIAL</option><option>OFFICIAL</option><option>COMMUNITY</option><option>EXPERIMENTAL</option></select></label>
          <label className="field"><span>Status</span><select name="status"><option>DRAFT</option><option>TESTING</option><option>PUBLISHED</option><option>ARCHIVED</option></select></label>
          <label className="field"><span>Release date</span><input name="releaseDate" type="date" required /></label>
          <label className="field"><span>Security patch</span><input name="securityPatch" required /></label>
          <label className="field"><span>File name</span><input name="fileName" required /></label>
          <label className="field"><span>File size in bytes</span><input name="fileSizeBytes" inputMode="numeric" required /></label>
          <label className="field"><span>SHA-256</span><input name="sha256" required minLength={64} maxLength={64} /></label>
          <label className="field"><span>Download URL</span><input name="downloadUrl" type="url" required /></label>
          <label className="field"><span>Firmware requirement</span><textarea name="firmwareRequirement" /></label>
          <label className="field"><span>Recovery requirement</span><textarea name="recoveryRequirement" /></label>
          <label className="field"><span>Flashing instructions</span><textarea name="flashingInstructions" required /></label>
          <label className="field"><span>ROM changelog</span><textarea name="changelogRom" required /></label>
          <label className="field"><span>Device changelog</span><textarea name="changelogDevice" required /></label>
          <label className="field"><span>Kernel changelog</span><textarea name="changelogKernel" required /></label>
          <label className="field"><span>Known bugs</span><textarea name="knownBugs" required /></label>
          <label className="field"><span>Notes</span><textarea name="notes" /></label>
          <button className="button" type="submit" disabled={devices.length === 0}>Create release</button>
        </form>

        <div className="card">
          <h2>Existing releases</h2>
          <div className="list">
            {releases.map((release) => (
              <div className="list-item" key={release.id}>
                <div><strong>{release.title}</strong><span className="muted">{release.device.codename} · {formatDate(release.releaseDate)}</span></div>
                <StatusBadge value={release.status} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
