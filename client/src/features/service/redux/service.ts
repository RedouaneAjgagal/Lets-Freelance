import { createSlice } from "@reduxjs/toolkit";

type InitialFilterByStatusState = {
    filterBy: "inprogress" | "completed" | "canceled" | "all";
}

const initialFilterByStatusState: InitialFilterByStatusState = {
    filterBy: "all"
};

const filterByStatusSlice = createSlice({
    name: "filterByStatus",
    initialState: initialFilterByStatusState,
    reducers: {
        filterByStatus(_, action: { payload: "inprogress" | "completed" | "canceled" | "all"; type: string }) {
            return { filterBy: action.payload };
        }
    }
});

export const filterByStatusAction = filterByStatusSlice.actions;
export default filterByStatusSlice.reducer;

