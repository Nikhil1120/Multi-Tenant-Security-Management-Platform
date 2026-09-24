import { useDispatch, useSelector } from "react-redux";

import {
  assignUserToCampaign,
  createCampaign,
  deleteCampaign,
  fetchAssignableUsers,
  fetchCampaigns,
  updateCampaignStatus,
} from "./action.js";
import { setForm, setPage, setSearch, setStatusFilter } from "./reducer.js";

export function useCampaignsState() {
  const dispatch = useDispatch();
  const campaigns = useSelector((state) => state.campaigns);

  return {
    ...campaigns,
    fetchCampaigns: () => dispatch(fetchCampaigns()),
    fetchAssignableUsers: () => dispatch(fetchAssignableUsers()),
    createCampaign: () => dispatch(createCampaign()),
    updateCampaignStatus: (id, status) => dispatch(updateCampaignStatus({ id, status })),
    deleteCampaign: (id) => dispatch(deleteCampaign(id)),
    assignUserToCampaign: (campaignId, userId) => dispatch(assignUserToCampaign({ campaignId, userId })),
    setPage: (page) => dispatch(setPage(page)),
    setSearch: (search) => dispatch(setSearch(search)),
    setStatusFilter: (status) => dispatch(setStatusFilter(status)),
    setForm: (form) => dispatch(setForm(form)),
  };
}
