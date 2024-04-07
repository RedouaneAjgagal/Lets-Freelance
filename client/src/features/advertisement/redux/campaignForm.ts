import { createSlice } from "@reduxjs/toolkit";
import campaignInputsValidations from "../validators/campaignInputsValidations";

type Categories = "digital marketing" | "design & creative" | "programming & tech" | "writing & translation" | "video & animation" | "finance & accounting" | "music & audio";


type InitialError = {
    isError: boolean,
    errorMsg: string;
}

type InitialValue<T extends string | number | {} | {}[]> = {
    value: T,
    error: InitialError;
}

type AdKeywordType = {
    _id: string;
    content: string;
}

export type CampaignFormAdInitialState = {
    ad: string;
    service: InitialValue<{
        _id: string;
        title: string;
    }>,
    bidAmount: InitialValue<number>;
    event: InitialValue<"cpc" | "cpm">;
    category: InitialValue<Categories | "Select a category">;
    keywords: InitialValue<AdKeywordType[]>;
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

export const initialValidInput: InitialError = {
    isError: false,
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
    keywords: {
        value: [],
        error: initialErrorInput
    },
    service: {
        value: {
            _id: "Select a service",
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
            const invalidCampaignName = campaignInputsValidations.isInvalidName(action.payload);
            state.name.error = {
                errorMsg: invalidCampaignName,
                isError: invalidCampaignName !== ""
            }

            state.name.value = action.payload;
            return state;
        },
        setBudgetType(state, action: Action<string>) {
            const invalidBudgetType = campaignInputsValidations.isInvalidBudgetType(action.payload);
            state.budgetType.error = {
                errorMsg: invalidBudgetType,
                isError: invalidBudgetType !== ""
            };

            state.budgetType.value = action.payload as CampaignFormInitialState["budgetType"]["value"];

            return state;
        },
        setBudget(state, action: Action<string>) {
            const invalidBudget = campaignInputsValidations.isInvalidBudget(action.payload);
            state.budget.error = {
                errorMsg: invalidBudget,
                isError: invalidBudget !== ""
            };

            state.budget.value = Number(action.payload);
            return state;
        },
        setStartingDate(state, action: Action<string>) {
            const invalidStartingDate = campaignInputsValidations.isInvalidStartDate(action.payload);
            state.startDate.error = {
                errorMsg: invalidStartingDate,
                isError: invalidStartingDate !== ""
            };

            state.startDate.value = action.payload;
            return state;
        },
        setEndingDate(state, action: Action<string>) {
            const invalidEndingDate = campaignInputsValidations.isInvalidEndDate(action.payload);
            state.endDate.error = {
                errorMsg: invalidEndingDate,
                isError: invalidEndingDate !== ""
            };

            state.endDate.value = action.payload;
            return state;
        },
        AddNewAdSet(state) {
            if (state.ads.length === 10) return;

            state.ads.push({
                ...initialAdSet,
                ad: crypto.randomUUID(),
                service: {
                    ...initialAdSet.service,
                    value: {
                        ...initialAdSet.service.value,
                        _id: "Select a service"
                    }
                }
            });

            return state;
        },
        removeAdSet(state, action: Action<{ ad: string }>) {
            if (state.ads.length === 1) return;

            const ads = state.ads.filter(adSet => adSet.ad !== action.payload.ad);
            state.ads = ads;
            return state;
        },
        AddKeyword(state, action: Action<{ keyword: string; ad: string }>) {
            const adSet = state.ads.find(adSet => adSet.ad === action.payload.ad);
            if (!adSet || adSet.keywords.value.length === 6) return;

            const invalidKeyword = campaignInputsValidations.isInvalidKeyword(action.payload.keyword);
            if (invalidKeyword) return;

            const _id = crypto.randomUUID();
            adSet.keywords.value.push({
                _id,
                content: action.payload.keyword
            });

            if (adSet.keywords.value.length >= 3) {
                adSet.keywords.error = initialValidInput
            }

            return state;
        },
        removeKeyword(state, action: Action<{ ad: string; keywordId: string }>) {
            const adSet = state.ads.find(adSet => adSet.ad === action.payload.ad);
            if (!adSet) return;

            const keywords = adSet.keywords.value.filter(keyword => keyword._id !== action.payload.keywordId);
            adSet.keywords.value = keywords;

            if (keywords.length < 3) {
                adSet.keywords.error = {
                    isError: true,
                    errorMsg: "Provide a minimum of 3 keywords"
                }
            }

            return state;
        },
        setService(state, action: Action<{ ad: string; serviceId: string; serviceTitle: string }>) {
            const adSet = state.ads.find(adSet => adSet.ad === action.payload.ad);
            if (!adSet) return;

            const invalidServiceId = campaignInputsValidations.isInvalidServiceId(action.payload.serviceId);

            adSet.service.error = {
                errorMsg: invalidServiceId,
                isError: invalidServiceId !== ""
            }

            adSet.service.value = {
                _id: action.payload.serviceId,
                title: action.payload.serviceTitle
            }

            return state;
        },
        setEvent(state, action: Action<{ ad: string; event: string }>) {
            const adSet = state.ads.find(adSet => adSet.ad === action.payload.ad);
            if (!adSet) return;

            const invalidEvent = campaignInputsValidations.isInvalidEvent(action.payload.event);
            adSet.event.error = {
                errorMsg: invalidEvent,
                isError: invalidEvent !== ""
            };

            adSet.event.value = action.payload.event as CampaignFormAdInitialState["event"]["value"];

            return state;
        },
        setBidAmount(state, action: Action<{ ad: string; bidAmount: string }>) {
            const adSet = state.ads.find(adSet => adSet.ad === action.payload.ad);
            if (!adSet) return;

            const invalidBidAmount = campaignInputsValidations.isInvalidBidAmount(action.payload.bidAmount);

            adSet.bidAmount.error = {
                errorMsg: invalidBidAmount,
                isError: invalidBidAmount !== ""
            };

            adSet.bidAmount.value = Number(action.payload.bidAmount);

            return state;
        },
        setCategory(state, action: Action<{ ad: string; category: string }>) {
            const adSet = state.ads.find(adSet => adSet.ad === action.payload.ad);
            if (!adSet) return

            const invalidCategory = campaignInputsValidations.isInvalidCategory(action.payload.category);

            adSet.category.error = {
                errorMsg: invalidCategory,
                isError: invalidCategory !== ""
            }

            adSet.category.value = action.payload.category as CampaignFormAdInitialState["category"]["value"];


            return state;
        },
        submit(state) {
            const invalidCampaignName = campaignInputsValidations.isInvalidName(state.name.value);
            const invalidBudgetType = campaignInputsValidations.isInvalidBudgetType(state.budgetType.value);
            const invalidBudget = campaignInputsValidations.isInvalidBudget(state.budget.value.toString());
            const invalidStartingDate = campaignInputsValidations.isInvalidStartDate(state.startDate.value);
            const invalidEndingDate = campaignInputsValidations.isInvalidEndDate(state.endDate.value);

            state = {
                ...state,
                name: {
                    ...state.name,
                    error: {
                        errorMsg: invalidCampaignName,
                        isError: invalidCampaignName !== ""
                    }
                },
                budgetType: {
                    ...state.budgetType,
                    error: {
                        errorMsg: invalidBudgetType,
                        isError: invalidBudgetType !== ""
                    }
                },
                budget: {
                    ...state.budget,
                    error: {
                        errorMsg: invalidBudget,
                        isError: invalidBudget !== ""
                    }
                },
                startDate: {
                    ...state.startDate,
                    error: {
                        errorMsg: invalidStartingDate,
                        isError: invalidStartingDate !== ""
                    }
                },
                endDate: {
                    ...state.endDate,
                    error: {
                        errorMsg: invalidEndingDate,
                        isError: invalidEndingDate !== ""
                    }
                }
            }

            state.ads = state.ads.map(ad => {
                const invalidKeywords = campaignInputsValidations.isInvalidKeywords(ad.keywords.value.map(keyword => keyword.content));
                const invalidServiceId = campaignInputsValidations.isInvalidServiceId(ad.service.value._id);
                const invalidEvent = campaignInputsValidations.isInvalidEvent(ad.event.value);
                const invalidBidAmount = campaignInputsValidations.isInvalidBidAmount(ad.bidAmount.value.toString());
                const invalidCategory = campaignInputsValidations.isInvalidCategory(ad.category.value);

                return {
                    ...ad,
                    keywords: {
                        ...ad.keywords,
                        error: {
                            errorMsg: invalidKeywords,
                            isError: invalidKeywords !== ""
                        }
                    },
                    service: {
                        ...ad.service,
                        error: {
                            errorMsg: invalidServiceId,
                            isError: invalidServiceId !== ""
                        }
                    },
                    event: {
                        ...ad.event,
                        error: {
                            errorMsg: invalidEvent,
                            isError: invalidEvent !== ""
                        }
                    },
                    bidAmount: {
                        ...ad.bidAmount,
                        error: {
                            errorMsg: invalidBidAmount,
                            isError: invalidBidAmount !== ""
                        }
                    },
                    category: {
                        ...ad.category,
                        error: {
                            errorMsg: invalidCategory,
                            isError: invalidCategory !== ""
                        }
                    }
                }
            });

            return state;
        },
        resetState() {
            return initialState;
        },
        setInitialData(state, action: Action<CampaignFormInitialState>) {
            state = action.payload;
            return state;
        }
    }
});


export const campaignFormAction = campaignSlice.actions;
export default campaignSlice.reducer;
