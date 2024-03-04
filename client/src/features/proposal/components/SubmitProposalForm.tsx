import { Link } from "react-router-dom";
import { PrimaryButton } from "../../../layouts/brand";
import { SingleJobType } from "../../job";
import ProposalFormBudget from "./ProposalFormBudget";
import ProposalFormEstimatedDuration from "./ProposalFormEstimatedDuration";
import ProposalFormCoverLetter from "./ProposalFormCoverLetter";
import ProposalFormBoostProposal from "./ProposalFormBoostProposal";

type SubmitProposalFormProps = {
    jobId: string;
    priceType: SingleJobType["priceType"];
    price: SingleJobType["price"];
    duration: SingleJobType["duration"];
}

const SubmitProposalForm = (props: React.PropsWithoutRef<SubmitProposalFormProps>) => {
    const createProposalHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
    }

    return (
        <section className="border rounded bg-white shadow-sm">
            <h2 className="p-4 border-b text-2xl font-semibold text-slate-900">Create your proposal</h2>
            <form noValidate onSubmit={createProposalHandler} className="px-3 py-4 flex flex-col gap-4">
                <ProposalFormBudget price={props.price} priceType={props.priceType} />
                <ProposalFormEstimatedDuration duration={props.duration} />
                <ProposalFormCoverLetter />
                <ProposalFormBoostProposal />
                <div className="flex items-center gap-4 absolute bottom-0 left-0">
                    <PrimaryButton disabled={false} fullWith={false} justifyConent="center" style="solid" type="submit" x="lg" y="md">Submit proposal</PrimaryButton>
                    <Link to={`/jobs/${props.jobId}`} className="font-semibold text-purple-700 p-2">Cancel</Link>
                </div>
            </form>
        </section>
    )
}

export default SubmitProposalForm