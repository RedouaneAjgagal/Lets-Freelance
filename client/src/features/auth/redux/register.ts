import { createSlice } from "@reduxjs/toolkit";
import { nameValidation, emailValidation, passwordValidation } from "../validators/inputValidations";

const initialState = {
    name: {
        value: "",
        error: {
            isError: true,
            reason: "Please provide a name"
        }
    },
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

const registerSlice = createSlice({
    name: "register",
    initialState,
    reducers: {
        name(state, action) {
            const { isError, reason } = nameValidation(action.payload);
            state.name = {
                value: action.payload,
                error: { isError, reason }
            }
        },
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

export const registerAction = registerSlice.actions;
export default registerSlice.reducer;