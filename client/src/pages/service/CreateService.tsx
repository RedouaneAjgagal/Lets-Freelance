import { useEffect } from "react";
import { CreateServiceContainer, CreateServiceActions, CreateServiceSteps } from "../../features/service";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { createServiceAction } from "../../features/service/redux/createService";

const CreateService = () => {
    const dispatch = useAppDispatch();
    const { currentStep, numOfSteps } = useAppSelector(state => state.createServiceReducer);

    useEffect(() => {
        dispatch(createServiceAction.resetState());
    }, [])

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