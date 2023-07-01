import { configureStore } from "@reduxjs/toolkit";
import { registerReducer, loginReducer } from "../features/auth";

const store = configureStore({
    reducer: {
        registerReducer,
        loginReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;