import { useDispatch, useSelector } from "react-redux";

import { createSecurityEvent, fetchSecurityEvents } from "./action.js";
import { setForm, setPage, setSeverity, setStatusFilter } from "./reducer.js";

export function useSecurityEventsState() {
  const dispatch = useDispatch();
  const securityEvents = useSelector((state) => state.securityEvents);

  return {
    ...securityEvents,
    fetchSecurityEvents: () => dispatch(fetchSecurityEvents()),
    createSecurityEvent: () => dispatch(createSecurityEvent()),
    setPage: (page) => dispatch(setPage(page)),
    setSeverity: (severity) => dispatch(setSeverity(severity)),
    setStatusFilter: (status) => dispatch(setStatusFilter(status)),
    setForm: (form) => dispatch(setForm(form)),
  };
}
