import { api } from "../../api/client.js";

export const initialDashboardState = {
  metrics: null,
  loading: false,
  error: null,
};

export async function fetchDashboardMetricsApi() {
  const res = await api.get("/dashboard/metrics");
  const data = res.data ?? {};
  return {
    ...data,
    recent_activity: Array.isArray(data.recent_activity) ? data.recent_activity : [],
  };
}
