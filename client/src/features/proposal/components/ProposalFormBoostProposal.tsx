import { useState } from "react";
import QuestionModal from "../../../layouts/brand/QuestionModal";
import SelectOptions from "../../../components/SelectOptions";
import Input from "../../../components/Input";

type ProposalFormBoostProposalProps = {
    errorMsg: string;
}

const ProposalFormBoostProposal = (props: React.PropsWithoutRef<ProposalFormBoostProposalProps>) => {
    const [isBoostProposal, setIsBoostProposal] = useState(false);

    const boostConnectsAmountOptions = [
        {
            name: "2 connects",
            value: "2"
        },
        {
            name: "5 connects",
            value: "5"
        },
        {
            name: "10 connects",
            value: "10"
        },
        {
            name: "Custom",
            value: ""
        }
    ];

    const [connectsAmount, setConnectsAmount] = useState({ name: "Please select..", value: "" });

    const [customConnectsAmount, setCustomConnectsAmount] = useState("");

    const boostProposalToggleHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsBoostProposal(e.currentTarget.checked);
    }

    const selectConnectsAmountHander = ({ name, value }: { name: string; value: string }) => {
        setConnectsAmount({
            name,
            value
        });
    }

    const customConnectsAmountHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        setCustomConnectsAmount(value);
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-1">
                <input onChange={boostProposalToggleHandler} className="appearance-none checked:before:w-3 checked:before:h-3 checked:before:bg-slate-500 checked:before:rounded-sm border-2 rounded checked:rounded w-full max-w-[1.25rem] h-5 flex items-center justify-center border-slate-300 checked:border-slate-500" type="checkbox" name="isBoostProposal" id="isBoostProposal" />
                <label htmlFor="isBoostProposal" className="text-sm text-slate-600 font-medium">Do you want to boost your proposal?</label>
            </div>
            {isBoostProposal ?
                <div className="flex flex-col gap-2">
                    <label className="text-lg font-medium flex items-start gap-1" htmlFor="submitProposal_boostProposal">
                        Boost proposal
                        <QuestionModal content="Enhance your proposals with connects, boosting your proposals increases their visibility and enhances their chances of selection." />
                    </label>
                    <div className={`grid ${connectsAmount.name === "Custom" ? "grid-cols-6 gap-2" : ""}`}>
                        <div className="w-full col-span-4">
                            <SelectOptions onSelect={selectConnectsAmountHander} options={boostConnectsAmountOptions} selectTitle={connectsAmount.name} isError={false} withoutDash />
                        </div>
                        <div className={`col-span-2 ${connectsAmount.name === "Custom" ? "" : "sr-only"}`}>
                            <Input errorMsg="" id="submitProposal_boostProposal" includeLabel={false} isError={props.errorMsg !== ""} name="submitProposal_boostProposal" type="number" placeHolder="Connects" value={connectsAmount.name === "Custom" ? customConnectsAmount : connectsAmount.value} onChange={customConnectsAmountHandler} readonly={connectsAmount.name === "Custom" ? false : true} />
                        </div>
                    </div>
                </div>
                : null
            }
        </div>
    )
}

export default ProposalFormBoostProposal