import { createSlice } from "@reduxjs/toolkit";
import isValidGeneralTierInput from "../validators/isValidGeneralTierInput";
import IncludedInValidator from "../validators/IncludedInValidator";

type addIncludedInType = {
    type: "add";
    tier: keyof ServiceTiersTypes;
};

type removeIncludedInType = {
    type: "remove";
    tier: keyof ServiceTiersTypes;
    id: string;
}

type GeneralTierDeliveryTimeType = {
    type: "deliveryTime";
    tier: keyof ServiceTiersTypes;
    value: string;
};

type GeneralTierPriceType = {
    type: "price";
    tier: keyof ServiceTiersTypes;
    value: string;
}

type StepRequirements = {
    step: number;
    requirements: {
        [key: string]: {
            value: string | {}[] | string[];
            error: {
                isError: boolean;
                msg: string;
            }
        }
    }
}[];

export type ServiceIncludedInTier = {
    id: string;
    description: {
        value: string;
        error: Error;
    };
    result: {
        value: string | number | boolean;
        error: Error;
    };
}

export type ServiceTier = {
    deliveryTime: {
        value: number,
        error: Error
    };
    price: {
        value: number,
        error: Error
    };
    includedIn: {
        value: ServiceIncludedInTier[];
        error: Error;
    };
}

export type ServiceTiersTypes = {
    starter: ServiceTier;
    standard: ServiceTier;
    advanced: ServiceTier;
}

type Error = {
    isError: boolean;
    msg: string;
};

type CreateServiceInitialState = {
    numOfSteps: number;
    currentStep: number;
    title: {
        value: string;
        error: Error;
    };
    description: {
        value: string;
        error: Error;
    };
    category: {
        value: "Digital Marketing" | "Design & Creative" | "Programming & Tech" | "Writing & Translation" | "Video & Animation" | "Finance & Accounting" | "Music & Audio";
        error: Error;
    }
    featuredImage: {
        value: string;
        error: Error
    };
    gallery: {
        value: string[];
        error: Error;
    };
    keywords: {
        value: { id: string; keyword: string }[];
        error: Error;
    };
    tier: ServiceTiersTypes;
}

type FirstStepRequirementsType = {
    title: CreateServiceInitialState["title"];
    category: CreateServiceInitialState["category"];
    featuredImage: CreateServiceInitialState["featuredImage"];
};

type SecondStepRequirementsType = {
    description: CreateServiceInitialState["description"];
    keywords: CreateServiceInitialState["keywords"];
};

type StepRequirementsType = FirstStepRequirementsType & SecondStepRequirementsType;

const initialTierValue = {
    deliveryTime: {
        value: 0,
        error: {
            isError: true,
            msg: ""
        }
    },
    price: {
        value: 0,
        error: {
            isError: true,
            msg: ""
        }
    },
    includedIn: {
        value: [],
        error: {
            isError: false,
            msg: ""
        }
    }
}

const initialState: CreateServiceInitialState = {
    numOfSteps: 3,
    currentStep: 1,
    title: {
        value: "",
        error: {
            isError: true,
            msg: ""
        }
    },
    category: {
        value: "Digital Marketing",
        error: {
            isError: false,
            msg: ""
        }
    },
    featuredImage: {
        value: "",
        error: {
            isError: true,
            msg: ""
        }
    },
    gallery: {
        value: [],
        error: {
            isError: false,
            msg: ""
        }
    },
    description: {
        value: "",
        error: {
            isError: true,
            msg: ""
        }
    },
    keywords: {
        value: [],
        error: {
            isError: true,
            msg: ""
        }
    },
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

        submitStep(state, action: { payload: { currentStep: number; isTierStep: boolean }; type: string }) {
            if (action.payload.isTierStep) {
                const ERROR_MSG = "Required, can't be empty";

                const tiers = ["starter", "standard", "advanced"] as const;

                for (const tier of tiers) {
                    const generatTierRequired = ["deliveryTime", "price"] as const;
                    for (const key of generatTierRequired) {
                        const tierInput = state.tier[tier][key];
                        if (tierInput.error.isError && tierInput.error.msg === "") {
                            tierInput.error.msg = ERROR_MSG;
                        }
                    }

                    state.tier[tier].includedIn.value.forEach(includedIn => {
                        const includedInRequired = ["description", "result"] as const;
                        for (const key of includedInRequired) {
                            const tierInput = includedIn[key];
                            if (tierInput.error.isError && tierInput.error.msg === "") {
                                tierInput.error.msg = ERROR_MSG;
                            }
                        }
                    })
                }

                if (state.tier.starter.deliveryTime.error.isError && state.tier.starter.deliveryTime.error.msg === "") {
                    state.tier.starter.deliveryTime.error.msg = "Required, can't be empty";
                }

                return state;
            } else {
                const firstStepRequirements: FirstStepRequirementsType = {
                    title: state.title,
                    category: state.category,
                    featuredImage: state.featuredImage,
                };

                const secondStepRequirements: SecondStepRequirementsType = {
                    description: state.description,
                    keywords: state.keywords
                };

                const stepsRequirements: StepRequirements = [
                    {
                        step: 1,
                        requirements: firstStepRequirements
                    },
                    {
                        step: 2,
                        requirements: secondStepRequirements
                    }
                ];

                for (let i = 0; i < stepsRequirements.length; i++) {
                    const { step, requirements } = stepsRequirements[i];

                    if (action.payload.currentStep === step) {
                        Object.entries(requirements).map(([key, value]) => {
                            if (value.value === "" || !value.value.length) {
                                state[key as keyof StepRequirementsType].error = {
                                    isError: true,
                                    msg: "Required, can't be empty"
                                }
                            }
                        });
                    }
                }

                return state;
            }
        },

        setTitle(state, action: { payload: CreateServiceInitialState["title"]["value"], type: string }) {
            if (!action.payload || action.payload === "" || action.payload.trim() === "") {
                state.title.error = {
                    isError: true,
                    msg: "Can't be empty"
                };
                state.title.value = "";
                return state;
            }

            if (action.payload.length > 50) {
                state.title.error = {
                    isError: true,
                    msg: "Can't be more than 50 characters"
                }
                return state;
            }

            state.title = {
                value: action.payload,
                error: {
                    isError: false,
                    msg: ""
                }
            };
            return state;
        },

        setCategory(state, action: { payload: CreateServiceInitialState["category"]["value"]; type: string }) {
            const categories = ["Digital Marketing", "Design & Creative", "Programming & Tech", "Writing & Translation", "Video & Animation", "Finance & Accounting", "Music & Audio"];

            if (!categories.includes(action.payload)) {
                state.category.error = {
                    isError: true,
                    msg: "Invalid category"
                }
                return state;
            }

            state.category = {
                value: action.payload,
                error: {
                    isError: false,
                    msg: ""
                }
            };
            return state;
        },

        setImageError(state, action: { payload: { type: "featuredImage" | "gallery"; msg: string }; type: string }) {
            state[action.payload.type].error = {
                isError: action.payload.type === "featuredImage" ? true : false,
                msg: action.payload.msg
            };

            return state;
        },

        setFeaturedImage(state, action: { payload: { featuredImgURL: string }; type: string }) {
            state.featuredImage = {
                value: action.payload.featuredImgURL,
                error: {
                    isError: action.payload.featuredImgURL === "" ? true : false,
                    msg: ""
                }
            };
            return state;
        },

        setGalleryImage(state, action: { payload: { type: "add" | "delete"; galleryURL: string }; type: string }) {

            switch (action.payload.type) {
                case "add":
                    state.gallery = {
                        value: [...state.gallery.value, action.payload.galleryURL],
                        error: {
                            isError: false,
                            msg: ""
                        }
                    };
                    return state;

                case "delete":
                    state.gallery.value = state.gallery.value.filter(galleryUrl => galleryUrl !== action.payload.galleryURL);

                    state.gallery.error = {
                        isError: false,
                        msg: ""
                    }
                    return state;

                default:
                    return state;
            }
        },

        setDescription(state, action: { payload: { value: string; plainText: string }; type: string }) {
            if (!action.payload.plainText || action.payload.plainText.trim() === "") {
                state.description = {
                    value: "",
                    error: {
                        isError: true,
                        msg: "Required, can't be empty"
                    }
                };

                return state;
            }

            const MAX_LENGTH = 6000;
            if (action.payload.value.length > MAX_LENGTH) {
                state.description.error = {
                    isError: true,
                    msg: `You have reached the limit`
                };

                return state;
            }

            state.description = {
                value: action.payload.value,
                error: {
                    isError: false,
                    msg: ""
                }
            }
            return state;
        },

        setKeywords(state, action: { payload: { keyword: { id: string; keyword: string } }; type: string }) {
            const MIN_KEYWORDS = 3;
            const MAX_KEYWORDS = 5;

            if (state.keywords.value.length >= MAX_KEYWORDS) {
                state.keywords.error = {
                    isError: false,
                    msg: `${MAX_KEYWORDS} keywords is the maximum`
                };

                return state;
            }

            const newKeywords = [...state.keywords.value, action.payload.keyword];
            state.keywords = {
                value: newKeywords,
                error: {
                    isError: newKeywords.length >= MIN_KEYWORDS ? false : true,
                    msg: newKeywords.length >= MIN_KEYWORDS ? "" : `${MIN_KEYWORDS} keywords is the minimum`
                }
            };

            return state;
        },

        removeKeyword(state, action: { payload: { keywordId: string }; type: string }) {
            const MIN_KEYWORDS = 3;

            state.keywords.value = state.keywords.value.filter(({ id }) => id !== action.payload.keywordId);

            if (state.keywords.value.length < MIN_KEYWORDS) {
                state.keywords.error = {
                    isError: true,
                    msg: `${MIN_KEYWORDS} keywords is the minimum`
                }
            } else {
                state.keywords.error = {
                    isError: false,
                    msg: ""
                }
            }

            return state;
        },


        includedInAcions(state, action: { payload: addIncludedInType | removeIncludedInType; type: string }) {

            switch (action.payload.type) {
                case "add":

                    // throw error to the invalid existing includedIn
                    const validates = ["description", "result"] as const;
                    state.tier[action.payload.tier].includedIn.value = state.tier[action.payload.tier].includedIn.value.map(includedIn => {

                        const includedInResponse: {
                            description: ServiceIncludedInTier["description"];
                            result: ServiceIncludedInTier["result"];
                        } = {
                            description: includedIn.description,
                            result: includedIn.result
                        };

                        for (const validate of validates) {
                            const target = includedIn[validate];

                            const errorResult = IncludedInValidator({
                                type: validate,
                                value: target.value.toString()
                            });

                            includedInResponse[validate].error = errorResult;
                        }

                        return { ...includedIn, ...includedInResponse }
                    });


                    // create new includedIn
                    const initialState = {
                        value: "",
                        error: {
                            isError: true,
                            msg: ""
                        }
                    };

                    const newId = `${action.payload.tier}_${crypto.randomUUID()}`;
                    state.tier[action.payload.tier].includedIn.value.push({
                        id: newId,
                        description: initialState,
                        result: initialState
                    });
                    break;

                case "remove":
                    const id = action.payload.id;
                    state.tier[action.payload.tier].includedIn.value = state.tier[action.payload.tier].includedIn.value.filter(includedIn => includedIn.id !== id);
                    break;

                default:
                    break;
            }

            return state;
        },

        setGeneralTierInfo(state, action: { payload: GeneralTierDeliveryTimeType | GeneralTierPriceType; type: string }) {

            const result = isValidGeneralTierInput(action.payload.value);
            state.tier[action.payload.tier][action.payload.type] = {
                value: +action.payload.value,
                error: result
            }

            return state;
        },

        setIncludedIn(state, action: { payload: { tier: keyof ServiceTiersTypes, type: "description" | "result"; id: string; value: string }; type: string }) {

            const target = state.tier[action.payload.tier].includedIn.value.find(includedIn => includedIn.id === action.payload.id);

            if (!target) {
                return;
            }

            const result = IncludedInValidator({
                type: action.payload.type,
                value: action.payload.value
            });

            let value: string | number | boolean = action.payload.value;

            if (!result.isError && action.payload.type === "result") {
                const isNumber = !Number.isNaN(Number(value));
                if (isNumber) {
                    value = parseFloat(value);
                } else {
                    value = value === "true";
                }
            }

            const includedIn = target[action.payload.type];
            includedIn.error = result;
            includedIn.value = value;
            return state;
        },

        resetState() {
            return initialState;
        }
    }
});

export const createServiceAction = createServiceSlice.actions;
export default createServiceSlice.reducer;