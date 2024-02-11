import { CreateServiceContainer, CreateServiceActions, CreateServiceSteps } from "../../features/service";
import { useAppSelector } from "../../hooks/redux";

const CreateService = () => {
    const { currentStep, numOfSteps } = useAppSelector(state => state.createServiceReducer);

    return (
        <main className="p-4 bg-purple-100/30 flex flex-col gap-4">
            <h1 className="text-3xl font-semibold text-purple-800 leading-relaxed">Service creation</h1>
            <CreateServiceSteps currentStep={currentStep} numOfSteps={numOfSteps} />
            <CreateServiceContainer />
            <CreateServiceActions currentStep={currentStep} numOfSteps={numOfSteps} />
        </main>
    )
}

export default CreateService