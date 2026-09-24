import { createAsyncThunk } from "@reduxjs/toolkit";

import { fetchAuditLogsApi } from "./state.js";

export const fetchAuditLogs = createAsyncThunk("auditLogs/fetchAuditLogs", async (_, { getState, rejectWithValue }) => {
  const { page, action } = getState().auditLogs;
  try {
    return await fetchAuditLogsApi({
      page,
      page_size: 12,
      action: action || undefined,
    });
  } catch {
    return rejectWithValue("Failed to load audit logs");
  }
});
