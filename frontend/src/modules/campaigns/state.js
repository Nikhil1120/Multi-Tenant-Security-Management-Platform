import { api } from "../../api/client.js";

export const initialCampaignsState = {
  items: [],
  assignableUsers: [],
  page: 1,
  pages: 1,
  search: "",
  status: "",
  form: { name: "", description: "", status: "DRAFT" },
  loading: false,
  error: null,
  message: null,
};

export async function fetchCampaignsApi(params) {
  const res = await api.get("/campaigns", { params });
  return res.data;
}

export async function createCampaignApi(payload) {
  const res = await api.post("/campaigns", payload);
  return res.data;
}

export async function updateCampaignApi(id, payload) {
  const res = await api.patch(`/campaigns/${id}`, payload);
  return res.data;
}

export async function deleteCampaignApi(id) {
  await api.delete(`/campaigns/${id}`);
  return id;
}

export async function assignUserToCampaignApi(campaignId, userId) {
  const res = await api.post(`/campaigns/${campaignId}/assign`, { user_id: Number(userId) });
  return res.data;
}

export async function fetchAssignableUsersApi() {
  const res = await api.get("/users", { params: { page: 1, page_size: 50 } });
  return res.data.items;
}
