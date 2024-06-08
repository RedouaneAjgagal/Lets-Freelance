import { TbArrowBigRightLines, TbArrowBigRightLinesFilled } from "react-icons/tb";
import useCustomSearchParams from "../../../hooks/useCustomSearchParams";
import { useQueryClient } from "@tanstack/react-query";


type EventReportsFilterByPageProps = {
    numOfpagesLeft: number;
    isLoading: boolean;
}

const EventReportsFilterByPage = (props: React.PropsWithoutRef<EventReportsFilterByPageProps>) => {
    const queryClient = useQueryClient();

    const customSearchParams = useCustomSearchParams();

    const pageQuery = customSearchParams.getSearchParams({
        key: "page"
    });

    const isInvalidNumber = pageQuery
        ? Number.isNaN(Number(pageQuery))
        : true;

    const page = isInvalidNumber ? 1 : Number.parseInt(pageQuery!);

    const isLastpage = (props.numOfpagesLeft - 1) <= 0;

    const nextPageHandler = () => {
        if (isLastpage || props.isLoading) return;

        customSearchParams.setSearchParams({
            key: "page",
            value: (page + 1).toString()
        });
        queryClient.removeQueries({ queryKey: ["eventReports"] });
    }

    const prevPageHandler = () => {
        if (page === 1 || props.isLoading) return;

        customSearchParams.setSearchParams({
            key: "page",
            value: (page - 1).toString()
        });

        queryClient.removeQueries({ queryKey: ["eventReports"] });
    }

    return (
        <div className="flex items-center justify-between">
            <button onClick={prevPageHandler} disabled={page === 1 || props.isLoading} className={`border-2 rounded-lg p-1 ${page === 1 ? "border-slate-400 text-slate-400" : "border-slate-700 bg-transparent text-slate-700"}`}>
                {page === 1
                    ? <TbArrowBigRightLines size={24} className="rotate-180" />
                    : <TbArrowBigRightLinesFilled size={24} className="rotate-180" />
                }
            </button>
            <button onClick={nextPageHandler} disabled={isLastpage || props.isLoading} className={`border-2 rounded-lg p-1 ${isLastpage ? "border-slate-400 text-slate-400" : "border-slate-700 bg-transparent text-slate-700"}`}>
                {isLastpage
                    ? <TbArrowBigRightLines size={24} className="rotate-0" />
                    : <TbArrowBigRightLinesFilled size={24} className="rotate-0" />
                }
            </button>
        </div>
    )
}

export default EventReportsFilterByPage