import { configureStore } from "@reduxjs/toolkit";
import { registerReducer, forgetPasswordReducer, resetPasswordReducer } from "../features/auth";

const store = configureStore({
    reducer: {
        registerReducer,
        forgetPasswordReducer,
        resetPasswordReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;