import { createAsyncThunk } from "@reduxjs/toolkit";

import { fetchMeApi, loginApi, logoutApi } from "./state.js";

export const AUTH_ACTION_TYPES = {
  LOGOUT: "auth/logout",
};

export const loadSession = createAsyncThunk("auth/loadSession", async (_, { rejectWithValue }) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    return null;
  }
  try {
    return await fetchMeApi();
  } catch {
    logoutApi();
    return rejectWithValue("Session expired");
  }
});

export const login = createAsyncThunk("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    return await loginApi(email, password);
  } catch (err) {
    const detail = err.response?.data?.detail;
    return rejectWithValue(typeof detail === "string" ? detail : "Login failed");
  }
});

export const logout = () => {
  logoutApi();
  return { type: AUTH_ACTION_TYPES.LOGOUT };
};
