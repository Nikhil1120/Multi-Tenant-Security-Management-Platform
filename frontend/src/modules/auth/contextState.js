import { useDispatch, useSelector } from "react-redux";

import { login, loadSession, logout } from "./action.js";
import { clearAuthError } from "./reducer.js";

export function useAuthState() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  return {
    ...auth,
    loadSession: () => dispatch(loadSession()),
    login: async (email, password) => {
      const result = await dispatch(login({ email, password }));
      if (login.rejected.match(result)) {
        throw new Error(result.payload || "Login failed");
      }
      return result.payload;
    },
    logout: () => dispatch(logout()),
    clearAuthError: () => dispatch(clearAuthError()),
  };
}
