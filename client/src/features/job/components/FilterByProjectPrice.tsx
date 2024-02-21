import { useSearchParams } from "react-router-dom"
import getOnlyValidJobSearchedQueries from "../utils/getOnlyValidJobSearchedQueries"
import useCustomSearchParams from "../../../hooks/useCustomSearchParams";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";


const FilterByProjectPrice = () => {
    const [isFetch, setIsFetch] = useState(false);

    const customSearchParams = useCustomSearchParams();

    const queryClient = useQueryClient();

    const [URLSearchParams] = useSearchParams();
    const { project_price } = getOnlyValidJobSearchedQueries(URLSearchParams);
    const projectPrice = project_price?.split("-");

    const jobPriceTypes = ["min", "max"] as const;

    const jobPriceInputs = jobPriceTypes.map(jobPrice => {
        const setValueHanlder = (e: React.ChangeEvent<HTMLInputElement>) => {
            const currentValue = e.currentTarget.value;
            const otherValue = projectPrice ? projectPrice[jobPrice === "min" ? 1 : 0] : "0";

            if (+currentValue === 0 && +otherValue === 0) {
                customSearchParams.setSearchParams({
                    key: "project_price",
                    value: ""
                });
                return;
            }

            customSearchParams.setSearchParams({
                key: "project_price",
                value: jobPrice === "min" ?
                    `${currentValue === "" ? "0" : currentValue}-${otherValue}`
                    : `${otherValue}-${currentValue === "" ? "0" : currentValue}`
            });

            if (!isFetch) {
                setIsFetch(true);
            }
        }

        const getCurrentValue = projectPrice ? projectPrice[jobPrice === "min" ? 0 : 1] === "0" ? "" : projectPrice[jobPrice === "min" ? 0 : 1] : ""

        return (
            <label key={jobPrice} htmlFor={`job_price_${jobPrice}`} className="relative">
                <input id={`job_price_${jobPrice}`} type="number" className="border-2 px-2 py-1 rounded flex items-center gap-1 justify-between w-full border-slate-300 outline-slate-400 pl-7" placeholder={jobPrice} onChange={setValueHanlder} value={getCurrentValue} />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold pointer-events-none">$</span>
            </label>
        )
    });

    useEffect(() => {
        if (isFetch) {
            const setProjectPricetimeout = setTimeout(() => {
                console.log(true);
                queryClient.fetchQuery({ queryKey: ["jobs"] });
            }, 1500);

            return () => clearTimeout(setProjectPricetimeout);
        }
    }, [project_price, isFetch]);

    return (
        <div className="flex flex-col gap-3">
            <h4 className="text-black text-xl">Job Price</h4>
            <div className="flex items-center gap-2">
                {jobPriceInputs}
            </div>
        </div>
    )
}

export default FilterByProjectPrice