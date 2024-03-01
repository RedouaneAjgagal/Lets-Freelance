import { createSlice } from "@reduxjs/toolkit";
import { createJobValidationStepFour, createJobValidationStepOne, createJobValidationStepThree, createJobValidationStepTwo } from "../validators/createJobValidation";

type StepOnePayload = {
    title: string | undefined;
    category: string | undefined;
    experienceLevel: string | undefined;
};

type StepTwoPayload = {
    description: string | undefined;
    plainDescription: string | undefined;
    locationType: string | undefined;
    tags: string[] | undefined;
}

type StepThreePayload = {
    priceType: string | undefined;
    price: {
        min: string | undefined;
        max: string | undefined;
    };
}

type StepFourPayload = {
    weeklyHours: {
        min: string | undefined;
        max: string | undefined;
    };
    duration: {
        dateType: string | undefined;
        dateValue: string | undefined;
    };
}

type Error = {
    isError: boolean;
    message: string;
};

type InitialJobFormStateType = {
    title: {
        value: string;
        error: Error;
    };
    category: {
        value: "Select category" | "digital marketing" | "design & creative" | "programming & tech" | "writing & translation" | "video & animation" | "finance & accounting" | "music & audio";
        error: Error;
    };
    experienceLevel: {
        value: "entryLevel" | "intermediate" | "expert";
        error: Error;
    }
    description: {
        value: string;
        error: Error;
    };
    locationType: {
        value: "remote" | "onsite";
        error: Error;
    };
    tags: {
        value: [];
        error: Error;
    };
    priceType: {
        value: "hourly" | "fixed";
        error: Error;
    }
    price: {
        value: {
            min: string;
            max: string;
        }
        error: Error;
    };
    weeklyHours: {
        value: {
            min: string;
            max: string;
        }
        error: Error;
    };
    duration: {
        value: {
            dateType: "hours" | "days" | "months";
            dateValue: string;
        }
        error: Error;
    };
};

const initialError: Error = {
    isError: true,
    message: ""
}

const withoutError = { isError: false, message: "" };

const initialJobFormState: InitialJobFormStateType = {
    title: {
        value: "",
        error: initialError
    },
    category: {
        value: "Select category",
        error: initialError
    },
    experienceLevel: {
        value: "entryLevel",
        error: withoutError
    },
    description: {
        value: "",
        error: initialError
    },
    locationType: {
        value: "remote",
        error: withoutError
    },
    tags: {
        value: [],
        error: withoutError
    },
    priceType: {
        value: "hourly",
        error: withoutError
    },
    price: {
        value: {
            min: "",
            max: ""
        },
        error: initialError
    },
    weeklyHours: {
        value: {
            min: "",
            max: ""
        },
        error: initialError
    },
    duration: {
        value: {
            dateType: "days",
            dateValue: ""
        },
        error: initialError
    }
}

const isInvalidInputs = (payload: { state: InitialJobFormStateType; invalidInputs: { [key: string]: string; } }) => {
    const hasErrors = Object.entries(payload.invalidInputs).filter(([_, value]) => value !== "");
    if (hasErrors.length) {
        for (const error of hasErrors) {

            const [errorKey, errorMessage] = error;
            payload.state[errorKey as keyof InitialJobFormStateType].error = {
                isError: true,
                message: errorMessage
            }
        }
    }

    return hasErrors.length !== 0;
}

const jobFormSlice = createSlice({
    name: "jobForm",
    initialState: initialJobFormState,
    reducers: {
        setStepOneData(state, action: { payload: StepOnePayload; type: string }) {
            state.title.error = withoutError;
            state.category.error = withoutError;
            state.experienceLevel.error = withoutError;

            const invalidInputs = createJobValidationStepOne(action.payload);
            const hasErrors = isInvalidInputs({
                invalidInputs,
                state
            });
            if (hasErrors) return state;

            state.title.value = action.payload.title!;
            state.category.value = action.payload.category! as InitialJobFormStateType["category"]["value"];
            state.experienceLevel.value = action.payload.experienceLevel as InitialJobFormStateType["experienceLevel"]["value"];

            return state;
        },

        setStepTwoData(state, action: { payload: StepTwoPayload; type: string }) {
            state.description.error = withoutError;
            state.locationType.error = withoutError;
            state.tags.error = withoutError;

            const invalidInputs = createJobValidationStepTwo(action.payload);
            const hasErrors = isInvalidInputs({
                invalidInputs,
                state
            });
            if (hasErrors) return state;

            state.description.value = action.payload.description!
            state.locationType.value = action.payload.locationType! as InitialJobFormStateType["locationType"]["value"];
            state.tags.value = action.payload.tags! as InitialJobFormStateType["tags"]["value"];

            return state;
        },

        setStepThreeData(state, action: { payload: StepThreePayload; type: string }) {
            state.priceType.error = withoutError;
            state.price.error = withoutError;

            const invalidInputs = createJobValidationStepThree(action.payload);
            const hasErrors = isInvalidInputs({
                invalidInputs,
                state
            });
            if (hasErrors) return state;

            state.priceType.value = action.payload.priceType! as InitialJobFormStateType["priceType"]["value"];
            state.price.value = action.payload.price! as InitialJobFormStateType["price"]["value"];

            return state;
        },

        setStepFourData(state, action: { payload: StepFourPayload; type: string }) {
            state.weeklyHours.error = withoutError;
            state.duration.error = withoutError;

            const invalidInputs = createJobValidationStepFour(action.payload);
            const hasErrors = isInvalidInputs({
                invalidInputs,
                state
            });
            if (hasErrors) return state;

            state.weeklyHours.value = action.payload.weeklyHours! as InitialJobFormStateType["weeklyHours"]["value"];
            state.duration.value = action.payload.duration! as InitialJobFormStateType["duration"]["value"];

            return state;
        }
    }
});

export const jobFormAction = jobFormSlice.actions;
export default jobFormSlice.reducer;