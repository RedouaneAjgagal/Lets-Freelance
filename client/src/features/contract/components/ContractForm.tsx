import { BiArrowBack } from "react-icons/bi";
import { Link, useParams } from "react-router-dom";
import { PrimaryButton } from "../../../layouts/brand";
import { useState } from "react";
import { UseMutationResult } from "@tanstack/react-query";
import { CancelContractPayload, CancelContractResponse } from "../services/cancelContract";
import { AxiosError } from "axios";
import { RefundContractPaymentPayload, RefundContractPaymentResponse } from "../services/refundContractPayment";
import Input from "../../../components/Input";


type CancelContractFormType = {
    type: "cancel_contract";
    contractMutation: (UseMutationResult<CancelContractResponse, AxiosError<{
        msg: string;
    }, any>, CancelContractPayload, unknown>);
}

type RefundContractPaymentType = {
    type: "refund_payment";
    paymentId: string;
    contractMutation: (UseMutationResult<RefundContractPaymentResponse, AxiosError<{
        msg: string;
    }, any>, RefundContractPaymentPayload, unknown>);
}

type ContractFormProps = (CancelContractFormType | RefundContractPaymentType);


const ContractForm = (props: React.PropsWithoutRef<ContractFormProps>) => {
    const { contractId } = useParams();

    const [errors, setErrors] = useState({
        subject: "",
        reason: ""
    });

    const submitContractHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const errors = {
            subject: "",
            reason: ""
        };

        const formData = new FormData(e.currentTarget);
        const subject = formData.get("_subject")?.toString();
        const reason = formData.get("_reason")?.toString();

        if (!subject || subject.trim() === "") {
            errors.subject = "Required, can't be empty";
        }

        if (!reason || reason.trim() === "") {
            errors.reason = "Required, can't be empty";
        }

        if (reason && reason.length > 5000) {
            errors.reason = "Limited to 5000 characters";
        }

        setErrors(errors);

        const isError = Object.values(errors).filter(error => error !== "").length !== 0;
        if (isError) {
            return;
        }

        if (props.type === "cancel_contract") {
            props.contractMutation.mutate({
                contractId: contractId!,
                reason: reason!,
                subject: subject!
            });
        } else {
            props.contractMutation.mutate({
                contractId: contractId!,
                reason: reason!,
                subject: subject!,
                paymentId: props.paymentId
            });
        }
    }

    return (
        <>
            {!props.contractMutation.isLoading && props.contractMutation.isSuccess ?
                <div className="p-4 bg-green-100 rounded flex flex-col gap-2">
                    <h2 className="text-green-700 font-medium text-lg">Success</h2>
                    <p className="text-green-700">{props.contractMutation.data.msg}</p>
                    <Link to={`/profile/contracts/${contractId!}`} className="flex items-center gap-1 text-green-800 self-start">
                        <BiArrowBack />
                        Back
                    </Link>
                </div>
                : <form onSubmit={submitContractHandler} className="p-3 bg-slate-100 rounded">
                    <Input errorMsg={errors.subject} id="_subject" includeLabel isError={errors.subject !== ""} labelContent="Subject" name="_subject" type="text" defaultValue="" />
                    <div className="flex flex-col gap-1 relative pb-6">
                        <label htmlFor="_reason" className="text-lg font-medium">Reason</label>
                        <textarea name="_reason" id="_reason" className={`border-2 text-slate-600 rounded py-2 px-3 outline-none focus:border-slate-400 w-full resize-none min-h-[14rem] ${errors.reason !== "" ? "border-red-300" : "border-slate-300"}`}></textarea>
                        {errors.reason !== "" ?
                            <span className="absolute right-0 bottom-1 text-red-600 text-sm">{errors.reason}</span>
                            : null
                        }
                    </div>
                    <div className="flex items-center justify-between mt-1">
                        <Link to={`/profile/contracts/${contractId!}`} className="underline">Cancel</Link>
                        <PrimaryButton disabled={props.contractMutation.isLoading} fullWith={false} justifyConent="center" style="solid" type="submit" x="lg" y="md" isLoading={props.contractMutation.isLoading}>Submit</PrimaryButton>
                    </div>
                </form>
            }
        </>
    )

}

export default ContractForm