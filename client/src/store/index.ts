import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../features/auth";
import { profileSkillsReducer } from "../features/profile";
import { filterByStatusReducer, filterSearchedServicesReducer } from "../features/service";

const store = configureStore({
    reducer: {
        authReducer,
        profileSkillsReducer,
        filterByStatusReducer,
        filterSearchedServicesReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;