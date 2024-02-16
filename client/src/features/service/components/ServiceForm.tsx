import { useEffect } from "react";
import CreateServiceContainer from "./CreateServiceContainer";
import CreateServiceSteps from "./CreateServiceSteps";
import CreateServiceActions from "./CreateServiceActions";
import { serviceFormAction } from "../redux/serviceForm";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import Loading from "../../../components/Loading";
import useSingleServiceQuery from "../hooks/useSingleServiceQuery";

type ServiceFormProps = {
    title: string;
    formType: "create" | "update";
}

const ServiceForm = (props: React.PropsWithoutRef<ServiceFormProps>) => {
    console.log(props.formType);

    const signleServiceQuery = useSingleServiceQuery({
        isForm: true,
        formType: props.formType
    });

    const dispatch = useAppDispatch();
    const { currentStep, numOfSteps } = useAppSelector(state => state.serviceFormReducer);
    const { userInfo } = useAppSelector(state => state.authReducer);

    useEffect(() => {
        dispatch(serviceFormAction.resetState());

        if (props.formType === "update" && signleServiceQuery!.isSuccess) {
            const serviceInfo = signleServiceQuery!.data;

            if (userInfo?.userId !== serviceInfo.user || userInfo.profileId !== serviceInfo.profile._id) {
                console.log("Unauthorized");
                throw new Error("Unauthorized action");
            }

            dispatch(serviceFormAction.setInitialData(serviceInfo));
        }
    }, [signleServiceQuery?.isSuccess]);

    return (
        <main className="p-4 bg-purple-100/30 flex flex-col gap-4">
            <h1 className="text-3xl font-semibold text-purple-800 leading-relaxed">Service creation</h1>
            <CreateServiceSteps currentStep={currentStep} numOfSteps={numOfSteps} />
            {props.formType === "update" ?
                signleServiceQuery!.isLoading ?
                    <Loading />
                    : <CreateServiceContainer formType={props.formType} />
                : <CreateServiceContainer formType={props.formType} />

            }
            <CreateServiceActions currentStep={currentStep} numOfSteps={numOfSteps} formType={props.formType} />
        </main>
    )
}

export default ServiceForm