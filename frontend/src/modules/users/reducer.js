import { createSlice } from "@reduxjs/toolkit";

import { createUser, fetchUsers } from "./action.js";
import { initialUsersState } from "./state.js";

const usersSlice = createSlice({
  name: "users",
  initialState: initialUsersState,
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    setSearch(state, action) {
      state.search = action.payload;
      state.page = 1;
    },
    setForm(state, action) {
      state.form = { ...state.form, ...action.payload };
    },
    resetForm(state) {
      state.form = { email: "", full_name: "", password: "", role: "USER" };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.pages = action.payload.pages;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setSearch, setForm } = usersSlice.actions;
export default usersSlice.reducer;
