import { createSlice } from "@reduxjs/toolkit";
import { passwordValidation } from "../validators/inputValidations";

const initialState = {
    newPassword: {
        value: "",
        error: {
            isError: true,
            reason: "Please provide a password"
        }
    },
    repeatNewPassword: {
        value: "",
        error: {
            isError: true,
            reason: "Please provide a password"
        }
    }
}

const resetPasswordSlice = createSlice({
    name: "resetPassword",
    initialState,
    reducers: {
        newPassword(state, action) {
            const { isError, reason } = passwordValidation(action.payload);
            state.newPassword = {
                value: action.payload,
                error: { isError, reason }
            }
        },
        repeatNewPassword(state, action) {
            const { isError, reason } = passwordValidation(action.payload);
            state.repeatNewPassword = {
                value: action.payload,
                error: { isError, reason }
            }
        }
    }
});

export const resetPasswordAction = resetPasswordSlice.actions;
export default resetPasswordSlice.reducer;