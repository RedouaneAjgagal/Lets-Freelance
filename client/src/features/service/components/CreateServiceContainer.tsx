import { useEffect } from "react";
import { useAppSelector } from "../../../hooks/redux"
import CreateServiceStepOne from "./CreateServiceStepOne"
import CreateServiceStepTwo from "./CreateServiceStepTwo";
import CreateServiceStepThree from "./CreateServiceStepThree";

type CreateServiceContainerProps = {
    formType: "create" | "update";
}

const CreateServiceContainer = (props: React.PropsWithoutRef<CreateServiceContainerProps>) => {
    const { currentStep } = useAppSelector(state => state.serviceFormReducer);

    const steps: { [key: number]: React.JSX.Element } = {
        1: <CreateServiceStepOne />,
        2: <CreateServiceStepTwo formType={props.formType} />,
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