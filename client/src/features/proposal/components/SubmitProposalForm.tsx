import { Link } from "react-router-dom";
import { PrimaryButton } from "../../../layouts/brand";
import { SingleJobType } from "../../job";
import ProposalFormBudget from "./ProposalFormBudget";
import ProposalFormEstimatedDuration from "./ProposalFormEstimatedDuration";
import ProposalFormCoverLetter from "./ProposalFormCoverLetter";
import ProposalFormBoostProposal from "./ProposalFormBoostProposal";
import { useState } from "react";
import createProposalValidator from "../validators/createProposalValidator";
import toast from "react-hot-toast";
import useSubmitProposalMutation from "../hooks/useSubmitProposalMutation";
import { SubmitProposalPayload } from "../service/submitProposal";

type SubmitProposalFormProps = {
    jobId: string;
    priceType: SingleJobType["priceType"];
    price: SingleJobType["price"];
    duration: SingleJobType["duration"];
}

const SubmitProposalForm = (props: React.PropsWithoutRef<SubmitProposalFormProps>) => {
    const submitProposalMutation = useSubmitProposalMutation();

    const initialErrorFormState = {
        price: "",
        timeType: "",
        timeValue: "",
        coverLetter: "",
        spentConnects: ""
    };
    const [errorFormState, setErrorFormState] = useState(initialErrorFormState);

    const createProposalHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (submitProposalMutation.isLoading) return;

        const formData = new FormData(e.currentTarget);

        const proposalData = {
            coverLetter: formData.get("submitProposal_coverLetter")?.toString(),
            timeType: formData.get("submitProposal_durationType")?.toString(),
            timeValue: formData.get("submitProposal_estimatedTime")?.toString(),
            price: formData.get("submitProposal_price")?.toString(),
            spentConnects: formData.get("submitProposal_boostProposal")?.toString()
        }        

        const getErrorFormStates = createProposalValidator(proposalData);

        const hasErrors = Object.values(getErrorFormStates).filter(errorMsg => errorMsg !== "");
        if (hasErrors.length) {
            setErrorFormState(getErrorFormStates);
            toast.error(hasErrors[0], {
                id: "error_createProposalForm",
                duration: 3000
            });
            return;
        } else {
            setErrorFormState(initialErrorFormState);
        }

        const proposal: SubmitProposalPayload = {
            jobId: props.jobId,
            coverLetter: proposalData.coverLetter!,
            estimatedTime: {
                timeType: proposalData.timeType! as SubmitProposalPayload["estimatedTime"]["timeType"],
                timeValue: Number(proposalData.timeValue)
            },
            price: Number(proposalData.price),
            spentConnects: !proposalData.spentConnects ? 0 : Number(proposalData.spentConnects)
        };

        submitProposalMutation.mutate(proposal);
    }

    return (
        <section className="border rounded bg-white shadow-sm">
            <h2 className="p-4 border-b text-2xl font-semibold text-slate-900">Create your proposal</h2>
            <form noValidate onSubmit={createProposalHandler} className="px-3 py-4 flex flex-col gap-4">
                <ProposalFormBudget price={props.price} priceType={props.priceType} errorMsg={errorFormState.price} />
                <ProposalFormEstimatedDuration duration={props.duration} errorMsg={{
                    durationType: errorFormState.timeType,
                    durationValue: errorFormState.timeValue
                }} />
                <ProposalFormCoverLetter errorMsg={errorFormState.coverLetter} />
                <ProposalFormBoostProposal errorMsg={errorFormState.spentConnects} />
                <div className="flex items-center gap-4 absolute bottom-0 left-0">
                    <PrimaryButton disabled={submitProposalMutation.isLoading} isLoading={submitProposalMutation.isLoading} fullWith={false} justifyConent="center" style="solid" type="submit" x="lg" y="md">Submit proposal</PrimaryButton>
                    <Link to={`/jobs`} className="font-semibold text-purple-700 p-2">Cancel</Link>
                </div>
            </form>
        </section>
    )
}

export default SubmitProposalForm