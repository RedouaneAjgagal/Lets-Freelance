import { createSlice } from "@reduxjs/toolkit";


type ServiceIncludedInTier = {
    description: string;
    result: string | number | boolean;
}

type ServiceTier = {
    deliveryTime: number;
    price: number;
    includedIn: ServiceIncludedInTier[];
}

type ServiceTiersTypes = {
    starter: ServiceTier;
    standard: ServiceTier;
    advanced: ServiceTier;
}

type CreateServiceInitialState = {
    numOfSteps: number;
    currentStep: number;
    title: string;
    description: string;
    category: "" | "digital marketing" | "design & creative" | "programming & tech" | "writing & translation" | "video & animation" | "finance & accounting" | "music & audio";
    featuredImage: string;
    gallery: string[];
    keywords: string[];
    tier: ServiceTiersTypes;
}

const initialTierValue = {
    deliveryTime: 0,
    price: 0,
    includedIn: []
}

const initialState: CreateServiceInitialState = {
    numOfSteps: 3,
    currentStep: 1,
    title: "",
    category: "",
    featuredImage: "",
    gallery: [],
    description: "",
    keywords: [],
    tier: {
        starter: initialTierValue,
        standard: initialTierValue,
        advanced: initialTierValue
    }
};

const createServiceSlice = createSlice({
    name: "createService",
    initialState,
    reducers: {
        onStep(state, action: { payload: "prev" | "next", type: string }) {
            const actions = {
                prev: state.currentStep - 1,
                next: state.currentStep + 1
            };

            const newStepValue = actions[action.payload];

            if (newStepValue < 1 || newStepValue > state.numOfSteps) {
                return;
            }

            state.currentStep = newStepValue;
            return state;
        },

    }
});

export const createServiceAction = createServiceSlice.actions;
export default createServiceSlice.reducer;