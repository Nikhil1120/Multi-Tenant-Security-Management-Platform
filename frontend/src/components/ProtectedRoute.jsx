import { Navigate } from "react-router-dom";

import { useAuthState } from "../modules/auth/contextState.js";

export default function ProtectedRoute({ children }) {
  const { user } = useAuthState();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
