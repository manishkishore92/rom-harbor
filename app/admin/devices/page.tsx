import { requireMaintainer } from "@/lib/authz";
import { getDevices } from "@/lib/data";
import { createDevice } from "@/app/admin/actions";
import { StatusBadge } from "@/components/status-badge";

export default async function AdminDevicesPage() {
  await requireMaintainer();
  const devices = await getDevices();

  return (
    <>
      <div className="page-title">
        <div><div className="pill">Admin</div><h1>Device manager</h1></div>
      </div>
      <section className="two-grid">
        <form className="form-card card form-grid" action={createDevice}>
          <h2>Create device</h2>
          <label className="field"><span>Codename</span><input name="codename" required /></label>
          <label className="field"><span>Device name</span><input name="name" required /></label>
          <label className="field"><span>Brand</span><input name="brand" required /></label>
          <label className="field"><span>Status</span><select name="status"><option>ACTIVE</option><option>TESTING</option><option>DEPRECATED</option></select></label>
          <label className="field"><span>ROM name</span><input name="romName" required /></label>
          <label className="field"><span>Android version</span><input name="androidVersion" required /></label>
          <label className="field"><span>Maintainer name</span><input name="maintainerName" required /></label>
          <label className="field"><span>Maintainer GitHub</span><input name="maintainerGithub" required /></label>
          <label className="field"><span>Description</span><textarea name="description" required /></label>
          <label className="field"><span>Support URL</span><input name="supportUrl" type="url" /></label>
          <label className="field"><span>Device tree URL</span><input name="deviceTreeUrl" type="url" /></label>
          <label className="field"><span>Kernel URL</span><input name="kernelUrl" type="url" /></label>
          <label className="field"><span>Vendor URL</span><input name="vendorUrl" type="url" /></label>
          <label className="field"><span>Firmware note</span><textarea name="firmwareNote" /></label>
          <label className="field"><span>Recovery note</span><textarea name="recoveryNote" /></label>
          <button className="button" type="submit">Create device</button>
        </form>

        <div className="card">
          <h2>Existing devices</h2>
          <div className="list">
            {devices.map((device) => (
              <div className="list-item" key={device.id}>
                <div><strong>{device.name}</strong><span className="muted">{device.codename} · {device.brand}</span></div>
                <StatusBadge value={device.status} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
