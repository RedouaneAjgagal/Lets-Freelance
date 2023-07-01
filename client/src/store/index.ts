import { configureStore } from "@reduxjs/toolkit";
import { registerReducer, loginReducer, forgetPasswordReducer } from "../features/auth";

const store = configureStore({
    reducer: {
        registerReducer,
        loginReducer,
        forgetPasswordReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;