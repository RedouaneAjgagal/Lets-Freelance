import { configureStore } from "@reduxjs/toolkit";
import { registerReducer, loginReducer, forgetPasswordReducer, resetPasswordReducer } from "../features/auth";

const store = configureStore({
    reducer: {
        registerReducer,
        loginReducer,
        forgetPasswordReducer,
        resetPasswordReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;