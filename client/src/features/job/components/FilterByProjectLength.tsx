import { useEffect, useState } from "react";
import SelectOptions from "../../../components/SelectOptions"
import useCustomSearchParams from "../../../hooks/useCustomSearchParams";
import getOnlyValidJobSearchedQueries from "../utils/getOnlyValidJobSearchedQueries";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

type ProjectLengthType = {
    comparison: "Less" | "More";
    duration: "hours" | "days" | "months";
    value: number;
    isTouched: boolean;
}

const FilterByProjectLength = () => {
    const customSearchParams = useCustomSearchParams();

    const queryClient = useQueryClient();

    const [URLSearchParams] = useSearchParams();
    const { project_length } = getOnlyValidJobSearchedQueries(URLSearchParams);

    const getProjectLength: Partial<ProjectLengthType> = {};

    if (project_length) {
        const comparison = project_length.includes(">") ? ">" : "<";
        const [duration, value] = project_length.split(comparison);

        getProjectLength.comparison = comparison === "<" ? "Less" : "More";
        getProjectLength.duration = duration as "hours" | "days" | "months";
        getProjectLength.value = Number(value);
    }

    const [projectLength, setProjectLength] = useState<Partial<ProjectLengthType>>(getProjectLength);

    const comparisonOptions = [
        {
            name: "Less",
            value: "<"
        },
        {
            name: "More",
            value: ">"
        }
    ];

    const durationOptions = [
        {
            name: "Hours",
            value: "hours"
        },
        {
            name: "Days",
            value: "days"
        },
        {
            name: "Months",
            value: "months"
        }
    ];

    const selectComparisonOptionsHandler = ({ name }: { name: string; value: string }) => {
        const validComparisionOptions = ["More", "Less"];

        if (!validComparisionOptions.includes(name)) return;

        setProjectLength((prev) => {
            return { ...prev, isTouched: true, comparison: name as "More" || "Less" }
        });
    }

    const selectDurationOptionsHandler = ({ value }: { name: string; value: string }) => {
        const validDurationKeys = ["hours", "days", "months"];

        if (!validDurationKeys.includes(value)) return;

        setProjectLength((prev) => {
            return { ...prev, isTouched: true, duration: value as "hours" | "days" | "months" };
        });
    }

    const durationValueHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;

        setProjectLength((prev) => {
            return { ...prev, isTouched: true, value: Number(value) }
        });
    }

    useEffect(() => {
        if (projectLength.comparison && projectLength.duration && projectLength.value) {
            const comparisons = {
                More: ">",
                Less: "<"
            } as const;

            const project_length_value = `${projectLength.duration}${comparisons[projectLength.comparison!]}${projectLength.value}`;

            const projectLengthTimeout = setTimeout(() => {
                customSearchParams.setSearchParams({
                    key: "project_length",
                    value: project_length_value
                });
            }, 1000);

            return () => clearTimeout(projectLengthTimeout);
        }
    }, [projectLength.comparison, projectLength.duration, projectLength.value]);


    useEffect(() => {
        if (project_length && projectLength.isTouched) {
            queryClient.removeQueries({ queryKey: ["jobs"] });
        }

        if (!project_length && projectLength.isTouched) {
            setProjectLength({ isTouched: true });
        }
    }, [project_length]);

    return (
        <div className="flex flex-col gap-3">
            <h4 className="text-black text-xl">Project Length</h4>
            <SelectOptions options={comparisonOptions} onSelect={selectComparisonOptionsHandler} selectTitle={projectLength.comparison || "less - or - more"} />
            <div className="flex items-center gap-2">
                <input type="number" className="border-2 px-2 py-1 rounded flex items-center gap-1 justify-between w-full border-slate-300 outline-slate-400" placeholder="Duration value" onChange={durationValueHandler} value={projectLength.value || ""} min={1} />
                <SelectOptions options={durationOptions} onSelect={selectDurationOptionsHandler} selectTitle={projectLength.duration || "Durations"} />
            </div>
        </div>
    )
}

export default FilterByProjectLength