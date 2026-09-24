import { useDispatch, useSelector } from "react-redux";

import { fetchDashboardMetrics } from "./action.js";

export function useDashboardState() {
  const dispatch = useDispatch();
  const dashboard = useSelector((state) => state.dashboard);

  return {
    ...dashboard,
    fetchDashboardMetrics: () => dispatch(fetchDashboardMetrics()),
  };
}
