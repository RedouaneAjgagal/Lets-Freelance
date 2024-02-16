import React, { useState } from 'react'
import { BiArrowBack } from 'react-icons/bi';
import { useDispatch } from 'react-redux';
import { serviceFormAction } from '../redux/serviceForm';
import { useAppSelector } from '../../../hooks/redux';
import CreateServicePreviewModal from './CreateServicePreviewModal';
import useOverflow from '../../../hooks/useOverflow';

type CreateServiceActionsProps = {
    currentStep: number;
    numOfSteps: number;
    formType: "create" | "update";
}

const CreateServiceActions = (props: React.PropsWithoutRef<CreateServiceActionsProps>) => {
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

    const closePreviewModal = () => {
        setIsPreviewModalOpen(false);
    }

    const createServiceInfo = useAppSelector(state => state.serviceFormReducer);
    const dispatch = useDispatch();

    const backHandler = () => {
        dispatch(serviceFormAction.onStep("prev"));
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
                keywords: props.formType === "create" ? createServiceInfo.keywords.error : {
                    isError: false,
                    msg: ""
                }
            }
        }
    ]

    const nextHandler = () => {
        if (props.currentStep === props.numOfSteps) {
            dispatch(serviceFormAction.submitStep({
                currentStep: props.currentStep,
                isTierStep: true
            }));

            let isError = false;

            const tiers = ["starter", "standard", "advanced"] as const;

            for (const tier of tiers) {
                const generatTierRequired = ["deliveryTime", "price"] as const;
                for (const key of generatTierRequired) {
                    const tierInput = createServiceInfo.tier[tier][key];
                    if (tierInput.error.isError) {
                        isError = true;
                    }
                }

                createServiceInfo.tier[tier].includedIn.value.forEach(includedIn => {
                    const includedInRequired = ["description", "result"] as const;
                    for (const key of includedInRequired) {
                        const tierInput = includedIn[key];
                        if (tierInput.error.isError) {
                            isError = true;
                        }
                    }
                })
            }

            if (isError) {
                return;
            }

            setIsPreviewModalOpen(true);
            return;
        }

        dispatch(serviceFormAction.submitStep({
            currentStep: props.currentStep,
            isTierStep: false
        }));

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

        dispatch(serviceFormAction.onStep("next"));
    }

    useOverflow(isPreviewModalOpen);

    return (
        <footer className="relative py-5">
            {isPreviewModalOpen ?
                <CreateServicePreviewModal onCloseModal={closePreviewModal} formType={props.formType} />
                : null
            }

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