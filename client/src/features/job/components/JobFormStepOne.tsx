import { useState } from "react";
import Input from "../../../components/Input"
import SelectOptions from "../../../components/SelectOptions"
import toUpperCase from "../../../utils/toUpperCase";

const JobFormStepOne = () => {
    const categories = ["programming & tech", "design & creative", "digital marketing", "writing & translation", "video & animation", "finance & accounting", "music & audio"] as const;

    const [category, setCategory] = useState<(typeof categories[number]) | "Select category">("Select category");

    const options: { name: string; value: string }[] = categories.map(category => {
        if (category === "digital marketing") {
            return { name: category, value: "digital-marketing" }
        } else {
            const value = category.split(" & ").join("-");
            return { name: category, value }
        }
    });

    const onSelectOption = ({ name }: { name: string; value: string }) => {
        setCategory(name.toLowerCase() as typeof categories[number]);
    }

    const experienceLevelOptions = ["enteryLevel", "intermediate", "expert"] as const;
    const experienceLevelInputs = experienceLevelOptions.map(experienceLevel => {
        const labelContent = experienceLevel === "enteryLevel" ? "Entry level" : toUpperCase({ value: experienceLevel });

        const id = `job_experienceLevel_${experienceLevel}`;
        return (
            <div key={id} className="flex gap-2">
                <input className="accent-purple-600" type="radio" name="job_experienceLevel" id={id} value={experienceLevel} defaultChecked={experienceLevel === "enteryLevel"} />
                <label className="font-medium" htmlFor={id}>{labelContent}</label>
            </div>
        )
    });

    return (
        <section>
            <Input name="job_title" type="text" id="job_title" errorMsg="Something wrong" isError={false} includeLabel={true} labelContent="Job post title" />
            <div className="relative pb-6 flex flex-col gap-1">
                <label htmlFor="job_category" className="text-lg font-medium">Job category</label>
                <SelectOptions options={options} onSelect={onSelectOption} selectTitle={category} />
                <input type="text" id="job_category" name="job_category" className="sr-only" hidden value={category} readOnly />
            </div>
            <div className="relative pb-6 flex flex-col gap-1">
                <label htmlFor="job_category" className="text-lg font-medium">Job category</label>
                {experienceLevelInputs}
            </div>
        </section>
    )
}

export default JobFormStepOne