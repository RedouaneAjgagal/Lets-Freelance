import { createSlice } from "@reduxjs/toolkit";
import { emailValidation, passwordValidation } from "../validators/inputValidations";

const initialState = {
    email: {
        value: "",
        error: {
            isError: true,
            reason: "Please provide an email"
        }
    },
    password: {
        value: "",
        error: {
            isError: true,
            reason: "Please provide a password"
        }
    }
}

const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        email(state, action) {
            const { isError, reason } = emailValidation(action.payload);
            state.email = {
                value: action.payload,
                error: { isError, reason }
            }
        },
        password(state, action) {
            const { isError, reason } = passwordValidation(action.payload);
            state.password = {
                value: action.payload,
                error: { isError, reason }
            }
        }
    }
});

export const loginAction = loginSlice.actions;
export default loginSlice.reducer;