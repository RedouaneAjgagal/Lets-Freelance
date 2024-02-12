import React from 'react'
import { BiArrowBack } from 'react-icons/bi';
import { useDispatch } from 'react-redux';
import { createServiceAction } from '../redux/createService';
import { useAppSelector } from '../../../hooks/redux';

type CreateServiceActionsProps = {
    currentStep: number;
    numOfSteps: number;
}

const CreateServiceActions = (props: React.PropsWithoutRef<CreateServiceActionsProps>) => {
    const createServiceInfo = useAppSelector(state => state.createServiceReducer);
    const dispatch = useDispatch();

    const backHandler = () => {
        dispatch(createServiceAction.onStep("prev"));
    }

    const stepsRequirements = [
        {
            step: 1,
            requirements: {
                title: createServiceInfo.title.error,
                category: createServiceInfo.category.error,
                featuredImage: createServiceInfo.featuredImage.error
            }
        },
        {
            step: 2,
            requirements: {
                description: createServiceInfo.description.error,
                keywords: createServiceInfo.keywords.error
            }
        }
    ]

    const nextHandler = () => {
        dispatch(createServiceAction.submitStep({ currentStep: props.currentStep }));

        if (props.currentStep === props.numOfSteps) {
            console.log("Open preview service modal");
            return;
        }

        for (let i = 0; i < stepsRequirements.length; i++) {
            const stepRequirements = stepsRequirements[i];
            if (stepRequirements.step === props.currentStep) {
                const hasErrors = Object.values(stepRequirements.requirements).some(error => error.isError);

                

                if (hasErrors) return;
            }
        }

        if (createServiceInfo.title.error.isError || createServiceInfo.category.error.isError || createServiceInfo.featuredImage.error.isError) {
            return;
        }

        dispatch(createServiceAction.onStep("next"));
    }

    return (
        <footer className="relative py-5">
            {props.currentStep !== 1 ?
                <button onClick={backHandler} className="absolute left-0 bottom-0 flex items-center gap-2 text-slate-600 pr-3 py-1 font-semibold tracking-wide border-2 border-transparent">
                    <BiArrowBack />
                    Back
                </button>
                : null
            }

            <button onClick={nextHandler} className={`absolute right-0 bottom-0 flex items-center gap-2 w-32 justify-center py-1 font-semibold tracking-wide ${props.currentStep === props.numOfSteps ? "bg-purple-600 text-white" : "bg-white text-purple-600"} border-2 border-purple-600 rounded`}>
                {props.currentStep === props.numOfSteps ?
                    "Preview"
                    : "Next"
                }
                <BiArrowBack className={`${props.currentStep === props.numOfSteps ? "rotate-[135deg]" : "rotate-[180deg]"}`} />
            </button>

        </footer>
    )
}

export default CreateServiceActions