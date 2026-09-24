import { useEffect } from "react";

import { useAuthState } from "../modules/auth/contextState.js";
import { useCampaignsState } from "../modules/campaigns/contextState.js";

const STATUSES = ["DRAFT", "ACTIVE", "COMPLETED", "CANCELLED"];

export default function CampaignsPage() {
  const { user } = useAuthState();
  const canManage = ["ADMIN", "MANAGER"].includes(user.role);
  const {
    items,
    assignableUsers,
    page,
    pages,
    search,
    status,
    form,
    message,
    fetchCampaigns,
    fetchAssignableUsers,
    createCampaign,
    updateCampaignStatus,
    deleteCampaign,
    assignUserToCampaign,
    setPage,
    setSearch,
    setStatusFilter,
    setForm,
  } = useCampaignsState();

  useEffect(() => {
    fetchCampaigns();
  }, [page, search, status]);

  useEffect(() => {
    if (canManage) {
      fetchAssignableUsers();
    }
  }, [canManage]);

  const onCreate = (event) => {
    event.preventDefault();
    createCampaign();
  };

  return (
    <section>
      <header className="page-header">
        <h2>Campaign Management</h2>
        <div className="filters">
          <input placeholder="Search campaigns" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select value={status} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </header>

      {message && <p className="info">{message}</p>}

      {canManage && (
        <form className="panel inline-form" onSubmit={onCreate}>
          <input required placeholder="Campaign name" value={form.name} onChange={(e) => setForm({ name: e.target.value })} />
          <input placeholder="Description" value={form.description} onChange={(e) => setForm({ description: e.target.value })} />
          <select value={form.status} onChange={(e) => setForm({ status: e.target.value })}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button type="submit">Create</button>
        </form>
      )}

      <div className="panel">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Assigned Users</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((campaign) => (
              <tr key={campaign.id}>
                <td>
                  <strong>{campaign.name}</strong>
                  <div className="muted">{campaign.description}</div>
                </td>
                <td>{campaign.status}</td>
                <td>{campaign.assigned_users.map((u) => u.email).join(", ") || "-"}</td>
                <td className="actions">
                  {canManage && (
                    <>
                      <select defaultValue="" onChange={(e) => e.target.value && updateCampaignStatus(campaign.id, e.target.value)}>
                        <option value="">Change status</option>
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <select defaultValue="" onChange={(e) => e.target.value && assignUserToCampaign(campaign.id, e.target.value)}>
                        <option value="">Assign user</option>
                        {assignableUsers.map((u) => <option key={u.id} value={u.id}>{u.email}</option>)}
                      </select>
                      <button type="button" className="danger" onClick={() => deleteCampaign(campaign.id)}>Delete</button>
                    </>
                  )}
                </td>
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
