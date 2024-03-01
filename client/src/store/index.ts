import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../features/auth";
import { profileSkillsReducer } from "../features/profile";
import { filterByStatusReducer, filterSearchedServicesReducer, serviceFormReducer } from "../features/service";

import { jobFormReducer } from "../features/job";

const store = configureStore({
    reducer: {
        authReducer,
        profileSkillsReducer,
        filterByStatusReducer,
        filterSearchedServicesReducer,
        serviceFormReducer,
        jobFormReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;