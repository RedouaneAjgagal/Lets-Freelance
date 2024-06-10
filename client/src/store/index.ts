import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../features/auth";
import { profileSkillsReducer } from "../features/profile";
import { filterByStatusReducer, filterSearchedServicesReducer, serviceFormReducer } from "../features/service";

import { jobFormReducer } from "../features/job";

import { campaignFormReducer, serviceAdClickTrackerReducer, serviceAdOrderTrackerReducer } from "../features/advertisement";

import { websocketMessageReducer, websocketMiddleware } from "../features/message";

const store = configureStore({
    reducer: {
        authReducer,
        profileSkillsReducer,
        filterByStatusReducer,
        filterSearchedServicesReducer,
        serviceFormReducer,
        jobFormReducer,
        campaignFormReducer,
        serviceAdClickTrackerReducer,
        serviceAdOrderTrackerReducer,
        websocketMessageReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(websocketMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;