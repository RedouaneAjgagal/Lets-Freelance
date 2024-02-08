import { createSlice } from "@reduxjs/toolkit";

type FilterSearchedServicesInitialState = {
    search?: string;
    category?: "all-categories" | "programming-tech" | "design-creative" | "digital-marketing" | "writing-translation" | "video-animation" | "finance-accounting" | "music-audio";
    delivery_time?: number;
    price_range?: string;
    rating?: number;
    english_level?: "Any level" | "professional" | "native" | "fluent" | "conversational" | "basic";
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
                delete state.delivery_time;
                return state;
            };

            state.delivery_time = action.payload;
            return state;
        },

        filterByPriceRange(state, action: { payload: FilterSearchedServicesInitialState["price_range"], type: string }) {
            if (action.payload === "") {
                delete state.price_range;
                return state;
            };

            state.price_range = action.payload;
            return state;
        },

        filterByRating(state, action: { payload: FilterSearchedServicesInitialState["rating"]; type: string }) {
            if (action.payload === 0) {
                delete state.rating;
                return state;
            }

            state.rating = action.payload;
            return state;
        },

        filterByEnglishLevel(state, action: { payload: FilterSearchedServicesInitialState["english_level"]; type: string }) {
            if (action.payload === "Any level") {
                delete state.english_level;
                return state;
            }

            state.english_level = action.payload;
            return state;
        }
    }
});

export const filterSearchedServicesAction = filterSearchedServicesSlice.actions;
export default filterSearchedServicesSlice.reducer;