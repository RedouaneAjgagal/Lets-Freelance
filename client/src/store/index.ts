import { configureStore } from "@reduxjs/toolkit";
import { registerReducer } from "../features/auth";

const store = configureStore({
    reducer: {
        registerReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;