import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  assignUserToCampaignApi,
  createCampaignApi,
  deleteCampaignApi,
  fetchAssignableUsersApi,
  fetchCampaignsApi,
  updateCampaignApi,
} from "./state.js";

export const fetchCampaigns = createAsyncThunk("campaigns/fetchCampaigns", async (_, { getState, rejectWithValue }) => {
  const { page, search, status } = getState().campaigns;
  try {
    return await fetchCampaignsApi({
      page,
      page_size: 8,
      search: search || undefined,
      status: status || undefined,
    });
  } catch {
    return rejectWithValue("Failed to load campaigns");
  }
});

export const fetchAssignableUsers = createAsyncThunk("campaigns/fetchAssignableUsers", async (_, { rejectWithValue }) => {
  try {
    return await fetchAssignableUsersApi();
  } catch {
    return rejectWithValue("Failed to load users for assignment");
  }
});

export const createCampaign = createAsyncThunk("campaigns/createCampaign", async (_, { getState, dispatch, rejectWithValue }) => {
  try {
    await createCampaignApi(getState().campaigns.form);
    dispatch({ type: "campaigns/resetForm" });
    dispatch({ type: "campaigns/setMessage", payload: "Campaign created" });
    await dispatch(fetchCampaigns());
  } catch {
    return rejectWithValue("Failed to create campaign");
  }
});

export const updateCampaignStatus = createAsyncThunk(
  "campaigns/updateCampaignStatus",
  async ({ id, status }, { dispatch, rejectWithValue }) => {
    try {
      await updateCampaignApi(id, { status });
      await dispatch(fetchCampaigns());
    } catch {
      return rejectWithValue("Failed to update campaign");
    }
  },
);

export const deleteCampaign = createAsyncThunk("campaigns/deleteCampaign", async (id, { dispatch, rejectWithValue }) => {
  try {
    await deleteCampaignApi(id);
    await dispatch(fetchCampaigns());
  } catch {
    return rejectWithValue("Failed to delete campaign");
  }
});

export const assignUserToCampaign = createAsyncThunk(
  "campaigns/assignUserToCampaign",
  async ({ campaignId, userId }, { dispatch, rejectWithValue }) => {
    try {
      await assignUserToCampaignApi(campaignId, userId);
      await dispatch(fetchCampaigns());
    } catch {
      return rejectWithValue("Failed to assign user");
    }
  },
);
