import { useDispatch, useSelector } from "react-redux";

import { fetchAuditLogs } from "./action.js";
import { setActionFilter, setPage } from "./reducer.js";

export function useAuditLogsState() {
  const dispatch = useDispatch();
  const auditLogs = useSelector((state) => state.auditLogs);

  return {
    ...auditLogs,
    fetchAuditLogs: () => dispatch(fetchAuditLogs()),
    setPage: (page) => dispatch(setPage(page)),
    setActionFilter: (action) => dispatch(setActionFilter(action)),
  };
}
