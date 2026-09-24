import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AppLayout from "./layouts/AppLayout.jsx";
import { useAuthState } from "./modules/auth/contextState.js";
import AuditLogsPage from "./pages/AuditLogsPage.jsx";
import CampaignsPage from "./pages/CampaignsPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SecurityEventsPage from "./pages/SecurityEventsPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";

function App() {
  const { user, loading } = useAuthState();

  if (loading) {
    return <div className="center-screen">Loading session...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="campaigns" element={<CampaignsPage />} />
        <Route path="security-events" element={<SecurityEventsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="audit-logs" element={<AuditLogsPage />} />
      </Route>
      <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
    </Routes>
  );
}

export default App;
