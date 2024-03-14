import { Link, useParams } from "react-router-dom"
import Input from "../../../components/Input"
import { PrimaryButton } from "../../../layouts/brand"
import { useState } from "react"
import useCancelContractMutation from "../hooks/useCancelContractMutation"
import { BiArrowBack } from "react-icons/bi"


const CancelContractForm = () => {
    const { contractId } = useParams();
    const cancelContractMutation = useCancelContractMutation();

    const [errors, setErrors] = useState({
        subject: "",
        reason: ""
    });

    const cancelContractHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const errors = {
            subject: "",
            reason: ""
        };

        const formData = new FormData(e.currentTarget);
        const subject = formData.get("cancelContract_subject")?.toString();
        const reason = formData.get("cancelContract_reason")?.toString();

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

        console.log({
            subject,
            reason
        });

        cancelContractMutation.mutate({
            contractId: contractId!,
            reason: reason!,
            subject: subject!
        });
    }

    return (
        <>
            {!cancelContractMutation.isLoading && cancelContractMutation.isSuccess ?
                <div className="p-4 bg-green-100 rounded flex flex-col gap-2">
                    <h2 className="text-green-700 font-medium text-lg">Success</h2>
                    <p className="text-green-700">{cancelContractMutation.data.msg}</p>
                    <Link to="./.." className="flex items-center gap-1 text-green-800 self-start">
                        <BiArrowBack />
                        Back
                    </Link>
                </div>
                : <form onSubmit={cancelContractHandler} className="p-3 bg-slate-100 rounded">
                    <Input errorMsg={errors.subject} id="cancelContract_subject" includeLabel isError={errors.subject !== ""} labelContent="Subject" name="cancelContract_subject" type="text" defaultValue="" />
                    <div className="flex flex-col gap-1 relative pb-6">
                        <label htmlFor="cancelContract_reason" className="text-lg font-medium">Reason</label>
                        <textarea name="cancelContract_reason" id="cancelContract_reason" className={`border-2 text-slate-600 rounded py-2 px-3 outline-none focus:border-slate-400 w-full resize-none min-h-[14rem] ${errors.reason !== "" ? "border-red-300" : "border-slate-300"}`}></textarea>
                        {errors.reason !== "" ?
                            <span className="absolute right-0 bottom-1 text-red-600 text-sm">{errors.reason}</span>
                            : null
                        }
                    </div>
                    <div className="flex items-center justify-between mt-1">
                        <Link to="./.." className="underline">Cancel</Link>
                        <PrimaryButton disabled={cancelContractMutation.isLoading} fullWith={false} justifyConent="center" style="solid" type="submit" x="lg" y="md" isLoading={cancelContractMutation.isLoading}>Submit</PrimaryButton>
                    </div>
                </form>
            }
        </>
    )
}

export default CancelContractForm