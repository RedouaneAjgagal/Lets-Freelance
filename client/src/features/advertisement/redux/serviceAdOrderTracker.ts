import { createSlice } from "@reduxjs/toolkit";


type ReducerAction<T extends string | {}> = { payload: T; type: string };

type ServiceAdClickTracker = {
    ad_id: string;
    track_id: string;
    order_id?: string;
}

const initialState: ServiceAdClickTracker = {};

const serviceAdOrderTrackerSlice = createSlice({
    name: "serviceAdOrderTracker",
    initialState,
    reducers: {
        addNewOrderTracker(state, action: ReducerAction<{ ad_id: string; track_id: string }>) {
            state = {
                ...action.payload
            };
            return state;
        }
    }
});

export const serviceAdOrderTrackerAction = serviceAdOrderTrackerSlice.actions;
export default serviceAdOrderTrackerSlice.reducer;