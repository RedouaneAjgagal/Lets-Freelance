import React from 'react'

type CreateServiceStepsProps = {
    currentStep: number;
    numOfSteps: number;
}

const CreateServiceSteps = (props: React.PropsWithoutRef<CreateServiceStepsProps>) => {
    const WIDTH_PER_STEP = 4;
    const widthInRem = props.numOfSteps * WIDTH_PER_STEP;

    const steps = Array.from({ length: props.numOfSteps }, (_, index) => {
        const getStep = index + 1;

        const isHighlightStep = props.currentStep >= getStep;

        return (
            <div key={index} className={`w-8 h-8 rounded-full border-2 border-purple-600 flex justify-center items-center font-semibold ${isHighlightStep ? "bg-purple-600 text-white" : "bg-white text-purple-600"}`}>
                <span className="select-none">
                    {getStep}
                </span>
            </div>
        );
    });

    return (
        <nav className="relative w-full" style={{ maxWidth: `${widthInRem}rem` }}>
            <hr className="-z-10 absolute top-1/2 left-0 w-full border border-purple-600" />
            <div className="flex items-center justify-between">
                {steps}
            </div>
        </nav>
    )
}

export default CreateServiceSteps