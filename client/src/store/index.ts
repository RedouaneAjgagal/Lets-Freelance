import { configureStore } from "@reduxjs/toolkit";
import { forgetPasswordReducer, resetPasswordReducer } from "../features/auth";

const store = configureStore({
    reducer: {
        forgetPasswordReducer,
        resetPasswordReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;