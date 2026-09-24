import { useEffect } from "react";

import { useAuditLogsState } from "../modules/auditLogs/contextState.js";

export default function AuditLogsPage() {
  const { items, page, pages, action, fetchAuditLogs, setPage, setActionFilter } = useAuditLogsState();

  useEffect(() => {
    fetchAuditLogs();
  }, [page, action]);

  return (
    <section>
      <header className="page-header">
        <h2>Audit Logs</h2>
        <input placeholder="Filter by action" value={action} onChange={(e) => setActionFilter(e.target.value)} />
      </header>
      <div className="panel">
        <table>
          <thead>
            <tr>
              <th>Action</th>
              <th>Resource</th>
              <th>Details</th>
              <th>Actor</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {items.map((log) => (
              <tr key={log.id}>
                <td>{log.action}</td>
                <td>{log.resource_type} #{log.resource_id || "-"}</td>
                <td>{log.details}</td>
                <td>{log.actor_user_id || "system"}</td>
                <td>{new Date(log.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
          <span>Page {page} of {pages}</span>
          <button type="button" disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      </div>
    </section>
  );
}
