import { NavLink, Outlet } from "react-router-dom";

import { useAuthState } from "../modules/auth/contextState.js";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/campaigns", label: "Campaigns" },
  { to: "/security-events", label: "Security Events" },
  { to: "/users", label: "Users" },
  { to: "/audit-logs", label: "Audit Logs", roles: ["ADMIN", "MANAGER"] },
];

export default function AppLayout() {
  const { user, logout } = useAuthState();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <h1>Deep Trace</h1>
          <p>Security Platform</p>
        </div>
        <nav>
          {links
            .filter((link) => !link.roles || link.roles.includes(user.role))
            .map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === "/"}>
                {link.label}
              </NavLink>
            ))}
        </nav>
        <div className="sidebar-footer">
          <p>{user.full_name}</p>
          <small>{user.role} · {user.tenant_name}</small>
          <button type="button" onClick={logout}>Logout</button>
        </div>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
