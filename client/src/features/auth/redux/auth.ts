import { createSlice } from "@reduxjs/toolkit";
import { User } from "../services/getCurrentUser";

type InitialAuthState = {
    userInfo: User | null
}

const initialAuthState: InitialAuthState = {
    userInfo: null
}

const authSlice = createSlice({
    name: "auth",
    initialState: initialAuthState,
    reducers: {
        userInfo(state) {
            return state;
        },
        setUser(_, action: { payload: User | null, type: string }) {
            return { userInfo: action.payload }
        }
    }
});

export const authAction = authSlice.actions;
export default authSlice.reducer;