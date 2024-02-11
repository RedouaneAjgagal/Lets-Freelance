import { createSlice } from "@reduxjs/toolkit";

type StepRequirements = {
    step: number;
    requirements: {
        [key: string]: {
            value: string | string[];
            error: {
                isError: boolean;
                msg: string;
            }
        }
    }
}[];

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
        value: string[];
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
    deliveryTime: 0,
    price: 0,
    includedIn: []
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

        submitStep(state, action: { payload: { currentStep: number; }; type: string }) {
            const firstStepRequirements: FirstStepRequirementsType = {
                title: state.title,
                category: state.category,
                featuredImage: state.featuredImage,
            };

            const stepsRequirements: StepRequirements = [
                {
                    step: 1,
                    requirements: firstStepRequirements
                }
            ];

            for (let i = 0; i < stepsRequirements.length; i++) {
                const { step, requirements } = stepsRequirements[i];

                if (action.payload.currentStep === step) {
                    Object.entries(requirements).map(([key, value]) => {
                        if (value.value === "") {
                            state[key as keyof StepRequirementsType].error = {
                                isError: true,
                                msg: "Required, can't be empty"
                            }
                        }
                    });
                }
            }

            return state;
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
        }
    }
});

export const createServiceAction = createServiceSlice.actions;
export default createServiceSlice.reducer;