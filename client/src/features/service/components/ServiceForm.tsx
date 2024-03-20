import { useEffect } from "react";
import CreateServiceContainer from "./CreateServiceContainer";
import CreateServiceSteps from "./CreateServiceSteps";
import CreateServiceActions from "./CreateServiceActions";
import { serviceFormAction } from "../redux/serviceForm";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import Loading from "../../../components/Loading";
import useSingleServiceQuery from "../hooks/useSingleServiceQuery";
import { useUserBankAccountsQuery } from "../../auth";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";

type ServiceFormProps = {
    title: string;
    formType: "create" | "update";
}

const ServiceForm = (props: React.PropsWithoutRef<ServiceFormProps>) => {
    const signleServiceQuery = useSingleServiceQuery({
        isForm: true,
        formType: props.formType
    });

    const userBankAccountsQuery = useUserBankAccountsQuery({
        fetchBankAccounts: props.formType === "create"
    });

    const dispatch = useAppDispatch();
    const { currentStep, numOfSteps } = useAppSelector(state => state.serviceFormReducer);
    const { userInfo } = useAppSelector(state => state.authReducer);


    useEffect(() => {
        dispatch(serviceFormAction.resetState());

        if (props.formType === "update" && signleServiceQuery!.isSuccess) {
            const serviceInfo = signleServiceQuery!.data;

            if (userInfo?.userId !== serviceInfo.user || userInfo.profileId !== serviceInfo.profile._id) {
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
                : userBankAccountsQuery!.isLoading ?
                    <Loading />
                    : userBankAccountsQuery?.data?.bankAccounts.length ?
                        <CreateServiceContainer formType={props.formType} />
                        : <div className="flex flex-col gap-3">
                            <h3 className="text-xl font-medium">You are not allowed to create services</h3>
                            <p className="text-slate-600">You have to set your bank account details to be able to create services</p>
                            <Link to="/profile/settings" className="font-medium flex items-center gap-1 text-purple-600 pb-[.1rem] border-b-2 border-purple-500 self-start">
                                Go To Settings
                                <BiArrowBack className="rotate-[135deg]" />
                            </Link>
                        </div>

            }
            {props.formType === "update" ?
                <CreateServiceActions currentStep={currentStep} numOfSteps={numOfSteps} formType={props.formType} />
                :
                userBankAccountsQuery!.isLoading ?
                    null
                    : userBankAccountsQuery?.data?.bankAccounts.length ?
                        <CreateServiceActions currentStep={currentStep} numOfSteps={numOfSteps} formType={props.formType} />
                        : null
            }
        </main>
    )
}

export default ServiceForm