import { useEffect } from "react";

import { useAuthState } from "../modules/auth/contextState.js";

export default function AppBootstrap({ children }) {
  const { loadSession } = useAuthState();

  useEffect(() => {
    loadSession();
  }, []);

  return children;
}
