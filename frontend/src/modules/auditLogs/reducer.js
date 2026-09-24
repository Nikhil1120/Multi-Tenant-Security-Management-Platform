import { createSlice } from "@reduxjs/toolkit";

import { fetchAuditLogs } from "./action.js";
import { initialAuditLogsState } from "./state.js";

const auditLogsSlice = createSlice({
  name: "auditLogs",
  initialState: initialAuditLogsState,
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    setActionFilter(state, action) {
      state.action = action.payload;
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.pages = action.payload.pages;
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setActionFilter } = auditLogsSlice.actions;
export default auditLogsSlice.reducer;
