import React from 'react'
import { BiArrowBack } from 'react-icons/bi';
import { useDispatch } from 'react-redux';
import { createServiceAction } from '../redux/createService';

type CreateServiceActionsProps = {
    currentStep: number;
    numOfSteps: number;
}

const CreateServiceActions = (props: React.PropsWithoutRef<CreateServiceActionsProps>) => {
    const dispatch = useDispatch();

    const backHandler = () => {
        dispatch(createServiceAction.onStep("prev"));
    }

    const nextHandler = () => {
        if (props.currentStep === props.numOfSteps) {
            console.log("Open preview service modal");
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