import { createSlice } from "@reduxjs/toolkit";

import { createCampaign, fetchAssignableUsers, fetchCampaigns } from "./action.js";
import { initialCampaignsState } from "./state.js";

const campaignsSlice = createSlice({
  name: "campaigns",
  initialState: initialCampaignsState,
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    setSearch(state, action) {
      state.search = action.payload;
      state.page = 1;
    },
    setStatusFilter(state, action) {
      state.status = action.payload;
      state.page = 1;
    },
    setForm(state, action) {
      state.form = { ...state.form, ...action.payload };
    },
    resetForm(state) {
      state.form = { name: "", description: "", status: "DRAFT" };
    },
    setMessage(state, action) {
      state.message = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCampaigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.pages = action.payload.pages;
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAssignableUsers.fulfilled, (state, action) => {
        state.assignableUsers = action.payload;
      })
      .addCase(createCampaign.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCampaign.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setSearch, setStatusFilter, setForm, resetForm, setMessage } = campaignsSlice.actions;
export default campaignsSlice.reducer;
