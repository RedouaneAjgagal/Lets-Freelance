import { useEffect } from "react";
import { useAppSelector } from "../../../hooks/redux"
import CreateServiceStepOne from "./CreateServiceStepOne"
import CreateServiceStepTwo from "./CreateServiceStepTwo";
import CreateServiceStepThree from "./CreateServiceStepThree";


const CreateServiceContainer = () => {
    const { currentStep } = useAppSelector(state => state.createServiceReducer);

    const steps: { [key: number]: React.JSX.Element } = {
        1: <CreateServiceStepOne />,
        2: <CreateServiceStepTwo />,
        3: <CreateServiceStepThree />
    } as const;

    const currentStepComponent = steps[currentStep];

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, [currentStep]);

    return (
        <div>
            {currentStepComponent}
        </div>
    )
}

export default CreateServiceContainer