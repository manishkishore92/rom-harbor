import { requireMaintainer } from "@/lib/authz";
import { getReports } from "@/lib/data";
import { updateReportStatus } from "@/app/admin/actions";
import { formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";

const statuses = ["OPEN", "CONFIRMED", "NEED_LOGS", "FIXED", "INVALID", "CLOSED"];

export default async function AdminReportsPage() {
  await requireMaintainer();
  const reports = await getReports();

  return (
    <>
      <div className="page-title">
        <div><div className="pill">Admin</div><h1>Report triage</h1></div>
      </div>
      <div className="list">
        {reports.map((report) => (
          <article className="card" key={report.id}>
            <div className="meta"><StatusBadge value={report.status} /><span className="pill">{report.device.codename}</span><span className="pill">{report.issueType}</span></div>
            <h2>{report.title}</h2>
            <p>{report.description}</p>
            <div className="markdown-box">{report.steps}</div>
            <p className="muted">Submitted {formatDate(report.createdAt)}</p>
            <form action={updateReportStatus} className="actions">
              <input type="hidden" name="id" value={report.id} />
              <select name="status" defaultValue={report.status}>{statuses.map((status) => <option key={status}>{status}</option>)}</select>
              <button className="button" type="submit">Update status</button>
            </form>
          </article>
        ))}
      </div>
    </>
  );
}
