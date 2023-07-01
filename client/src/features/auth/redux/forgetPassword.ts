import { createSlice } from "@reduxjs/toolkit";
import { emailValidation } from "../validators/inputValidations";

const initialState = {
    email: {
        value: "",
        error: {
            isError: true,
            reason: "Please provide an email"
        }
    }
}

const forgetPasswordSlice = createSlice({
    name: "forgetPassword",
    initialState,
    reducers: {
        email(state, action) {
            const { isError, reason } = emailValidation(action.payload);
            state.email = {
                value: action.payload,
                error: { isError, reason }
            }
        }
    }
});

export const forgetPasswordAction = forgetPasswordSlice.actions;
export default forgetPasswordSlice.reducer;