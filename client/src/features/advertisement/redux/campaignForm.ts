import { createSlice } from "@reduxjs/toolkit";

type Categories = "digital marketing" | "design & creative" | "programming & tech" | "writing & translation" | "video & animation" | "finance & accounting" | "music & audio";


type InitialError = {
    isError: boolean,
    errorMsg: string;
}

type InitialValue<T extends string | number> = {
    value: T,
    error: InitialError;
}

type AdKeywordType = {
    value: {
        _id: string;
        content: string;
    };
    error: InitialError;
}

export type CampaignFormAdInitialState = {
    ad: string;
    service: {
        value: {
            _id: string;
            title: string;
        };
        error: InitialError;
    },
    bidAmount: InitialValue<number>;
    event: InitialValue<"cpc" | "cpm">;
    category: InitialValue<Categories | "Select a category">;
    keywords: AdKeywordType[];
}

type CampaignFormInitialState = {
    name: InitialValue<string>;
    budgetType: InitialValue<"daily" | "total">;
    budget: InitialValue<number>;
    startDate: InitialValue<string>;
    endDate: InitialValue<string>;
    ads: CampaignFormAdInitialState[];
}

const initialErrorInput: InitialError = {
    isError: true,
    errorMsg: ""
};

const initialValidInput: InitialError = {
    isError: true,
    errorMsg: ""
};

const initialAdSet: CampaignFormAdInitialState = {
    ad: crypto.randomUUID(),
    bidAmount: {
        value: 0,
        error: initialErrorInput
    },
    category: {
        value: "Select a category",
        error: initialErrorInput
    },
    event: {
        value: "cpc",
        error: initialValidInput
    },
    keywords: [],
    service: {
        value: {
            _id: crypto.randomUUID(),
            title: "Select a service"
        },
        error: initialErrorInput
    }
};

const initialState: CampaignFormInitialState = {
    name: {
        value: "",
        error: initialErrorInput
    },
    budgetType: {
        value: "daily",
        error: initialValidInput
    },
    budget: {
        value: 0,
        error: initialErrorInput
    },
    startDate: {
        value: "",
        error: initialErrorInput
    },
    endDate: {
        value: "",
        error: initialErrorInput
    },
    ads: [
        initialAdSet
    ]
};

type Action<T extends string | {}> = { payload: T; type: string };

const campaignSlice = createSlice({
    name: "campaignForm",
    initialState,
    reducers: {
        setCampaignName(state, action: Action<string>) {
            state.name.value = action.payload;
            return state;
        },
        setBudgetType(state, action: Action<string>) {
            state.budgetType.value = action.payload as "daily" | "total";
            return state;
        },
        setBudget(state, action: Action<string>) {
            state.budget.value = Number(action.payload);
            return state;
        },
        setStartingDate(state, action: Action<string>) {
            state.startDate.value = action.payload;
            return state;
        },
        setEndingDate(state, action: Action<string>) {
            state.endDate.value = action.payload;
            return state;
        },
        AddNewAdSet(state) {
            state.ads.push({
                ...initialAdSet,
                ad: crypto.randomUUID(),
                service: {
                    ...initialAdSet.service,
                    value: {
                        ...initialAdSet.service.value,
                        _id: crypto.randomUUID()
                    }
                }
            });

            return state;
        },
        removeAdSet(state, action: Action<{ ad: string }>) {
            const ads = state.ads.filter(adSet => adSet.ad !== action.payload.ad);
            state.ads = ads;
            return state;
        },
        AddKeyword(state, action: Action<{ keyword: string; ad: string }>) {
            const adSet = state.ads.find(adSet => adSet.ad === action.payload.ad);
            if (adSet) {
                const _id = crypto.randomUUID();
                adSet.keywords.push({
                    error: initialValidInput,
                    value: {
                        _id,
                        content: action.payload.keyword
                    }
                });
            }

            return state;
        },
        removeKeyword(state, action: Action<{ ad: string; keywordId: string }>) {
            const adSet = state.ads.find(adSet => adSet.ad === action.payload.ad);
            if (adSet) {
                const keywords = adSet.keywords.filter(keyword => keyword.value._id !== action.payload.keywordId);
                adSet.keywords = keywords;
            }
            return state;
        },
        setService(state, action: Action<{ ad: string; serviceId: string; serviceTitle: string }>) {
            const adSet = state.ads.find(adSet => adSet.ad === action.payload.ad);
            if (adSet) {
                adSet.service.value = {
                    _id: action.payload.serviceId,
                    title: action.payload.serviceTitle
                }
            }
            return state;
        },
        setEvent(state, action: Action<{ ad: string; event: string }>) {
            const adSet = state.ads.find(adSet => adSet.ad === action.payload.ad);
            if (adSet) {
                adSet.event.value = action.payload.event as CampaignFormAdInitialState["event"]["value"];
            }
            return state;
        },
        setBidAmount(state, action: Action<{ ad: string; bidAmount: string }>) {
            const adSet = state.ads.find(adSet => adSet.ad === action.payload.ad);
            if (adSet) {
                adSet.bidAmount.value = Number(action.payload.bidAmount);
            }
            return state;
        },
        setCategory(state, action: Action<{ ad: string; category: string }>) {
            const adSet = state.ads.find(adSet => adSet.ad === action.payload.ad);
            if (adSet) {
                adSet.category.value = action.payload.category as CampaignFormAdInitialState["category"]["value"];
            }
            return state;
        }
    }
});


export const campaignFormAction = campaignSlice.actions;
export default campaignSlice.reducer;
