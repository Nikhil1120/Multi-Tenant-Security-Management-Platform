import { useEffect } from "react";

import { useDashboardState } from "../modules/dashboard/contextState.js";

export default function DashboardPage() {
  const { metrics, loading, error, fetchDashboardMetrics } = useDashboardState();
  console.log(metrics);
  useEffect(() => {
    fetchDashboardMetrics();
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (loading || !metrics) return <p>Loading dashboard...</p>;

  return (
    <section>
      <header className="page-header">
        <h2>Dashboard</h2>
        <p>Tenant: {metrics.tenant_name}</p>
      </header>
      <div className="metric-grid">
        <article className="metric-card"><h3>Users</h3><p>{metrics.user_count}</p></article>
        <article className="metric-card"><h3>Campaigns</h3><p>{metrics.campaign_count}</p></article>
        <article className="metric-card"><h3>Open Events</h3><p>{metrics.open_events}</p></article>
        <article className="metric-card critical"><h3>Critical Events</h3><p>{metrics.critical_events}</p></article>
      </div>
      <section className="panel">
        <h3>Recent Activity</h3>
        <table>
          <thead>
            <tr>
              <th>Action</th>
              <th>Resource</th>
              <th>Details</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {(metrics.recent_activity ?? []).map((item) => (
              <tr key={item.id}>
                <td>{item.action}</td>
                <td>{item.resource_type} #{item.resource_id || "-"}</td>
                <td>{item.details}</td>
                <td>{new Date(item.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </section>
  );
}
