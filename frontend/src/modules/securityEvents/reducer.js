import { createSlice } from "@reduxjs/toolkit";

import { createSecurityEvent, fetchSecurityEvents } from "./action.js";
import { initialSecurityEventsState } from "./state.js";

const securityEventsSlice = createSlice({
  name: "securityEvents",
  initialState: initialSecurityEventsState,
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    setSeverity(state, action) {
      state.severity = action.payload;
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
      state.form = {
        event_type: "",
        severity: "MEDIUM",
        status: "OPEN",
        description: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSecurityEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSecurityEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.pages = action.payload.pages;
      })
      .addCase(fetchSecurityEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createSecurityEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSecurityEvent.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createSecurityEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setSeverity, setStatusFilter, setForm } = securityEventsSlice.actions;
export default securityEventsSlice.reducer;
