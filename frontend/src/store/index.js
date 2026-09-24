import { configureStore } from "@reduxjs/toolkit";

import auditLogsReducer from "../modules/auditLogs/reducer.js";
import authReducer from "../modules/auth/reducer.js";
import campaignsReducer from "../modules/campaigns/reducer.js";
import dashboardReducer from "../modules/dashboard/reducer.js";
import securityEventsReducer from "../modules/securityEvents/reducer.js";
import usersReducer from "../modules/users/reducer.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    campaigns: campaignsReducer,
    securityEvents: securityEventsReducer,
    users: usersReducer,
    auditLogs: auditLogsReducer,
  },
});
