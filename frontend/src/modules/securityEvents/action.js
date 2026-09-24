import { createAsyncThunk } from "@reduxjs/toolkit";

import { createSecurityEventApi, fetchSecurityEventsApi } from "./state.js";

export const fetchSecurityEvents = createAsyncThunk(
  "securityEvents/fetchSecurityEvents",
  async (_, { getState, rejectWithValue }) => {
    const { page, severity, status } = getState().securityEvents;
    try {
      return await fetchSecurityEventsApi({
        page,
        page_size: 8,
        severity: severity || undefined,
        status: status || undefined,
      });
    } catch {
      return rejectWithValue("Failed to load security events");
    }
  },
);

export const createSecurityEvent = createAsyncThunk(
  "securityEvents/createSecurityEvent",
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      await createSecurityEventApi(getState().securityEvents.form);
      dispatch({ type: "securityEvents/resetForm" });
      await dispatch(fetchSecurityEvents());
    } catch {
      return rejectWithValue("Failed to create security event");
    }
  },
);
