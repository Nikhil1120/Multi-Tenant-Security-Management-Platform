import { useEffect } from "react";

import { useAuthState } from "../modules/auth/contextState.js";
import { useSecurityEventsState } from "../modules/securityEvents/contextState.js";

const SEVERITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const STATUSES = ["OPEN", "INVESTIGATING", "RESOLVED", "CLOSED"];

export default function SecurityEventsPage() {
  const { user } = useAuthState();
  const canManage = ["ADMIN", "MANAGER"].includes(user.role);
  const {
    items,
    page,
    pages,
    severity,
    status,
    form,
    fetchSecurityEvents,
    createSecurityEvent,
    setPage,
    setSeverity,
    setStatusFilter,
    setForm,
  } = useSecurityEventsState();

  useEffect(() => {
    fetchSecurityEvents();
  }, [page, severity, status]);

  const onCreate = (event) => {
    event.preventDefault();
    createSecurityEvent();
  };

  return (
    <section>
      <header className="page-header">
        <h2>Security Events</h2>
        <div className="filters">
          <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
            <option value="">All severities</option>
            {SEVERITIES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </header>

      {canManage && (
        <form className="panel inline-form" onSubmit={onCreate}>
          <input required placeholder="Event type" value={form.event_type} onChange={(e) => setForm({ event_type: e.target.value })} />
          <select value={form.severity} onChange={(e) => setForm({ severity: e.target.value })}>
            {SEVERITIES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <input required placeholder="Description" value={form.description} onChange={(e) => setForm({ description: e.target.value })} />
          <button type="submit">Log Event</button>
        </form>
      )}

      <div className="panel">
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Description</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {items.map((event) => (
              <tr key={event.id}>
                <td>{event.event_type}</td>
                <td><span className={`pill ${event.severity.toLowerCase()}`}>{event.severity}</span></td>
                <td>{event.status}</td>
                <td>{event.description}</td>
                <td>{new Date(event.created_at).toLocaleString()}</td>
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
