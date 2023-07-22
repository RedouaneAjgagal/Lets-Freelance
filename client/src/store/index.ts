import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../features/auth";
import { profileSkillsReducer } from "../features/profile";

const store = configureStore({
    reducer: {
        authReducer,
        profileSkillsReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;