import { api } from "../../api/client.js";

export const initialUsersState = {
  items: [],
  page: 1,
  pages: 1,
  search: "",
  form: { email: "", full_name: "", password: "", role: "USER" },
  loading: false,
  error: null,
};

export async function fetchUsersApi(params) {
  const res = await api.get("/users", { params });
  return res.data;
}

export async function createUserApi(payload) {
  const res = await api.post("/users", payload);
  return res.data;
}
