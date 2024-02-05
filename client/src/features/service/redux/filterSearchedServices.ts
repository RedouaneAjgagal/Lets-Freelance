import { createSlice } from "@reduxjs/toolkit";

type FilterSearchedServicesInitialState = {
    search?: string;
    category?: "all-categories" | "programming-tech" | "design-creative" | "digital-marketing" | "writing-translation" | "video-animation" | "finance-accounting" | "music-audio";
    delivery_time?: number;
}

const initialState: FilterSearchedServicesInitialState = {};

const filterSearchedServicesSlice = createSlice({
    name: "filterSearchedServices",
    initialState,
    reducers: {
        filterByCategory(state, action: { payload: FilterSearchedServicesInitialState["category"]; type: string }) {
            if (action.payload === "all-categories") {
                delete state.category;
                return state;
            }

            state.category = action.payload;
            return state;
        },
        filterBySearch(state, action: { payload: FilterSearchedServicesInitialState["search"]; type: string }) {
            if (action.payload === "") {
                delete state.search;
                return state;
            }

            state.search = action.payload;
            return state;
        },
        filterByDeliveryTime(state, action: { payload: FilterSearchedServicesInitialState["delivery_time"]; type: string }) {
            if (action.payload! <= 0) {
                console.log(action.payload);
                delete state.delivery_time;
                return state;
            };

            state.delivery_time = action.payload;
            return state;
        }
    }
});

export const filterSearchedServicesAction = filterSearchedServicesSlice.actions;
export default filterSearchedServicesSlice.reducer;