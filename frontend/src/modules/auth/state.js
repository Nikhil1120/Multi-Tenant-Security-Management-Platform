import { api } from "../../api/client.js";

export const initialAuthState = {
  user: null,
  loading: true,
  error: null,
  actionLoading: false,
};

export async function loginApi(email, password) {
  const body = new URLSearchParams();
  body.append("username", email);
  body.append("password", password);
  const tokenRes = await api.post("/auth/login", body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  localStorage.setItem("access_token", tokenRes.data.access_token);
  const meRes = await api.get("/auth/me");
  return meRes.data;
}

export async function fetchMeApi() {
  const meRes = await api.get("/auth/me");
  return meRes.data;
}

export function logoutApi() {
  localStorage.removeItem("access_token");
}
