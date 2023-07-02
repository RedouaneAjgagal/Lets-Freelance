import { configureStore } from "@reduxjs/toolkit";
import { resetPasswordReducer } from "../features/auth";

const store = configureStore({
    reducer: {
        resetPasswordReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;