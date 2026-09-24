import { api } from "../../api/client.js";

export const initialAuditLogsState = {
  items: [],
  page: 1,
  pages: 1,
  action: "",
  loading: false,
  error: null,
};

export async function fetchAuditLogsApi(params) {
  const res = await api.get("/audit-logs", { params });
  return res.data;
}
