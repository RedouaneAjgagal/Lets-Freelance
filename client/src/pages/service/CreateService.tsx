import { CreateServiceContainer, CreateServiceActions, CreateServiceSteps } from "../../features/service";
import { useAppSelector } from "../../hooks/redux";

const CreateService = () => {
    const { currentStep, numOfSteps } = useAppSelector(state => state.createServiceReducer);

    return (
        <main className="p-4">
            <CreateServiceSteps currentStep={currentStep} numOfSteps={numOfSteps} />
            <CreateServiceContainer />
            <CreateServiceActions currentStep={currentStep} numOfSteps={numOfSteps} />
        </main>
    )
}

export default CreateService