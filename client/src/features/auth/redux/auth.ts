import { createSlice } from "@reduxjs/toolkit";

type InitialAuthState = {
    userInfo: {
        name: string;
        avatar: string
    } | null
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
        setUser(_, action: { payload: { name: string; avatar: string } | null, type: string }) {
            return { userInfo: action.payload }
        }
    }
});

export const authAction = authSlice.actions;
export default authSlice.reducer;