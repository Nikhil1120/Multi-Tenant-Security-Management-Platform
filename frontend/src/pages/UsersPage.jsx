import { useEffect } from "react";

import { useAuthState } from "../modules/auth/contextState.js";
import { useUsersState } from "../modules/users/contextState.js";

const ROLES = ["ADMIN", "MANAGER", "USER"];

export default function UsersPage() {
  const { user } = useAuthState();
  const isAdmin = user.role === "ADMIN";
  const {
    items,
    page,
    pages,
    search,
    form,
    fetchUsers,
    createUser,
    setPage,
    setSearch,
    setForm,
  } = useUsersState();

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const onCreate = (event) => {
    event.preventDefault();
    createUser();
  };

  return (
    <section>
      <header className="page-header">
        <h2>Users</h2>
        <input placeholder="Search users" value={search} onChange={(e) => setSearch(e.target.value)} />
      </header>

      {isAdmin && (
        <form className="panel inline-form" onSubmit={onCreate}>
          <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ email: e.target.value })} />
          <input required placeholder="Full name" value={form.full_name} onChange={(e) => setForm({ full_name: e.target.value })} />
          <input required type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ password: e.target.value })} />
          <select value={form.role} onChange={(e) => setForm({ role: e.target.value })}>
            {ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
          </select>
          <button type="submit">Add User</button>
        </form>
      )}

      <div className="panel">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.full_name}</td>
                <td>{item.email}</td>
                <td><span className="pill">{item.role}</span></td>
                <td>{item.is_active ? "Active" : "Inactive"}</td>
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
