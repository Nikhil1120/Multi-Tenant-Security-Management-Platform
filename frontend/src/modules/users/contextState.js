import { useDispatch, useSelector } from "react-redux";

import { createUser, fetchUsers } from "./action.js";
import { setForm, setPage, setSearch } from "./reducer.js";

export function useUsersState() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);

  return {
    ...users,
    fetchUsers: () => dispatch(fetchUsers()),
    createUser: () => dispatch(createUser()),
    setPage: (page) => dispatch(setPage(page)),
    setSearch: (search) => dispatch(setSearch(search)),
    setForm: (form) => dispatch(setForm(form)),
  };
}
