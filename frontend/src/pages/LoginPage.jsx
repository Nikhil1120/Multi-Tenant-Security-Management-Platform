import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthState } from "../modules/auth/contextState.js";

export default function LoginPage() {
  const { login, actionLoading, error, clearAuthError } = useAuthState();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@acme.test");
  const [password, setPassword] = useState("Admin@123");
  const [localError, setLocalError] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setLocalError("");
    clearAuthError();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setLocalError(err.message || "Login failed");
    }
  };

  const displayError = localError || error;

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={onSubmit}>
        <h2>Multi-Tenant Security Console</h2>
        <p>Sign in with your tenant credentials.</p>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </label>
        <label>
          Password
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </label>
        {displayError && <p className="error">{displayError}</p>}
        <button type="submit" disabled={actionLoading}>{actionLoading ? "Signing in..." : "Login"}</button>
        <small>Demo: admin@acme.test / Admin@123 (Tenant A)</small>
      </form>
    </div>
  );
}
