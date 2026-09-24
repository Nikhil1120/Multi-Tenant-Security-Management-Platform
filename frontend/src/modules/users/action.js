import { createAsyncThunk } from "@reduxjs/toolkit";

import { createUserApi, fetchUsersApi } from "./state.js";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async (_, { getState, rejectWithValue }) => {
  const { page, search } = getState().users;
  try {
    return await fetchUsersApi({
      page,
      page_size: 10,
      search: search || undefined,
    });
  } catch {
    return rejectWithValue("Failed to load users");
  }
});

export const createUser = createAsyncThunk("users/createUser", async (_, { getState, dispatch, rejectWithValue }) => {
  try {
    await createUserApi(getState().users.form);
    dispatch({ type: "users/resetForm" });
    await dispatch(fetchUsers());
  } catch {
    return rejectWithValue("Failed to create user");
  }
});
