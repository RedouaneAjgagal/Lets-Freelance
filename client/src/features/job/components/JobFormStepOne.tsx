import { useState } from "react";
import Input from "../../../components/Input"
import SelectOptions from "../../../components/SelectOptions"
import toUpperCase from "../../../utils/toUpperCase";
import { useAppSelector } from "../../../hooks/redux";

const JobFormStepOne = () => {
    const jobFormReducer = useAppSelector(state => state.jobFormReducer);

    const categories = ["programming & tech", "design & creative", "digital marketing", "writing & translation", "video & animation", "finance & accounting", "music & audio"] as const;

    const [category, setCategory] = useState(jobFormReducer.category.value);

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

    const experienceLevelOptions = ["entryLevel", "intermediate", "expert"] as const;
    const experienceLevelInputs = experienceLevelOptions.map(experienceLevel => {
        const labelContent = experienceLevel === "entryLevel" ? "Entry level" : toUpperCase({ value: experienceLevel });

        const id = `job_experienceLevel_${experienceLevel}`;
        return (
            <div key={id} className="flex gap-2">
                <input className="accent-purple-600" type="radio" name="job_experienceLevel" id={id} value={experienceLevel} defaultChecked={jobFormReducer.experienceLevel.value === experienceLevel} />
                <label className="font-medium" htmlFor={id}>{labelContent}</label>
            </div>
        )
    });

    return (
        <section>
            <Input name="job_title" type="text" id="job_title" errorMsg="" isError={jobFormReducer.title.error.message !== ""} includeLabel={true} labelContent="Job post title" defaultValue={jobFormReducer.title.value} />
            <div className="relative pb-6 flex flex-col gap-1">
                <label htmlFor="job_category" className="text-lg font-medium">Job category</label>
                <SelectOptions options={options} onSelect={onSelectOption} selectTitle={category} isError={jobFormReducer.category.error.message !== ""} />
                <input type="text" id="job_category" name="job_category" className="sr-only" hidden value={category} readOnly />
            </div>
            <div className="relative pb-6 flex flex-col gap-1">
                <label htmlFor="job_category" className="text-lg font-medium">Freelancer experience level</label>
                {experienceLevelInputs}
            </div>
        </section>
    )
}

export default JobFormStepOne