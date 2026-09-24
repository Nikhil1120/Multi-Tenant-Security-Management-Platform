import { createSlice } from "@reduxjs/toolkit";

import { AUTH_ACTION_TYPES, loadSession, login } from "./action.js";
import { initialAuthState } from "./state.js";

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadSession.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loadSession.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload || null;
      })
      .addCase(login.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addMatcher(
        (action) => action.type === AUTH_ACTION_TYPES.LOGOUT,
        (state) => {
          state.user = null;
          state.error = null;
          state.actionLoading = false;
        },
      );
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
