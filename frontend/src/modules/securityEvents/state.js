import { api } from "../../api/client.js";

export const initialSecurityEventsState = {
  items: [],
  page: 1,
  pages: 1,
  severity: "",
  status: "",
  form: {
    event_type: "",
    severity: "MEDIUM",
    status: "OPEN",
    description: "",
  },
  loading: false,
  error: null,
};

export async function fetchSecurityEventsApi(params) {
  const res = await api.get("/security-events", { params });
  return res.data;
}

export async function createSecurityEventApi(payload) {
  const res = await api.post("/security-events", payload);
  return res.data;
}
