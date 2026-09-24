import { createAsyncThunk } from "@reduxjs/toolkit";

import { fetchDashboardMetricsApi } from "./state.js";

export const fetchDashboardMetrics = createAsyncThunk(
  "dashboard/fetchMetrics",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchDashboardMetricsApi();
    } catch {
      return rejectWithValue("Failed to load dashboard metrics");
    }
  },
);
