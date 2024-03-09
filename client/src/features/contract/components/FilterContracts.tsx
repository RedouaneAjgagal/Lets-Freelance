import { useQueryClient } from "@tanstack/react-query";
import useCustomSearchParams from "../../../hooks/useCustomSearchParams";
import { useAppSelector } from "../../../hooks/redux";
import { UserContractsQuery } from "../services/getUserContracts";
import { TbArrowLeft } from "react-icons/tb";

type FilterContractsProps = {
    contractQueries: UserContractsQuery;
    isSpecificContracts: boolean;
    activityTitle: string | undefined;
}


const FilterContracts = (props: React.PropsWithoutRef<FilterContractsProps>) => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    const { setSearchParams } = useCustomSearchParams();
    const queryClient = useQueryClient();

    const getStatus = props.contractQueries.status || "all";

    const statusOptions = [
        {
            name: "All",
            value: "all"
        },
        {
            name: "In Progress",
            value: "inProgress"
        },
        {
            name: "Completed",
            value: "completed"
        },
        {
            name: "Canceled",
            value: "canceled"
        }
    ];

    const filterStatus = statusOptions.map(status => {
        const filterStatusHandler = () => {
            setSearchParams({
                key: "status",
                value: status.value
            });

            queryClient.removeQueries({ queryKey: ["userContracts", userInfo!.profileId] });
        }

        return (
            <div key={status.value} className="flex items-center gap-1">
                <input className="sr-only appearance-none invisible" onChange={filterStatusHandler} type="radio" name="contractStatus" id={status.value} checked={status.value === getStatus} />
                <label htmlFor={status.value} className={`border-2 rounded py-1 px-2 min-w-[3rem] text-center text-sm font-medium ${status.value === getStatus ? "text-slate-900 border-slate-500" : "text-slate-600 border-slate-200"}`}>{status.name}</label>
            </div>
        )
    });

    const backToAllContractsHandler = () => {
        setSearchParams({
            key: "",
            value: "",
            removePrev: true
        });

        queryClient.removeQueries({ queryKey: ["userContracts", userInfo!.profileId] });
    }

    return (
        <nav className="flex flex-col gap-6">
            {props.isSpecificContracts ?
                <div className="flex flex-col gap-2">
                    <p className="font-medium">{props.contractQueries.job_id ? "Job" : "Service"} contracts
                        {props.activityTitle ?
                            <em className="text-[.95rem] font-normal text-slate-600"> "{props.activityTitle}"</em>
                            : null
                        }
                    </p>
                    <button onClick={backToAllContractsHandler} className="flex items-center gap-1 font-medium text-slate-700">
                        <TbArrowLeft size={20} />
                        Back to all contracts
                    </button>
                </div>
                : null
            }
            <div className="flex flex-col gap-1">
                <h3 className="font-medium">Filter contracts:</h3>
                <div className="flex items-center gap-1 flex-wrap">
                    {filterStatus}
                </div>
            </div>
        </nav>
    )
}

export default FilterContracts