import { createSlice } from "@reduxjs/toolkit";

type ReducerAction<T extends string | {}> = { payload: T; type: string };

type ServiceAdClickTracker = {
    ad_id: string;
    track_id: string;
}

const initialState: ServiceAdClickTracker[] = [];


const serviceAdClickTrackerSlice = createSlice({
    name: "serviceAdClickTracker",
    initialState,
    reducers: {
        addNewTracker(state, action: ReducerAction<{ ad_id: string; track_id: string }>) {
            state.push(action.payload);
            return state;
        },
        removeTracker(state, action: ReducerAction<{ ad_id: string }>) {
            state = state.filter(serviceClick => serviceClick.ad_id !== action.payload.ad_id);
            return state;
        }
    }
});


export const serviceAdClickTrackerAction = serviceAdClickTrackerSlice.actions;
export default serviceAdClickTrackerSlice.reducer;