import { TbArrowBigLeftFilled } from "react-icons/tb";

import getOnlyValidJobSearchedQueries from "../utils/getOnlyValidJobSearchedQueries";
import { useSearchParams } from "react-router-dom";
import useCustomSearchParams from "../../../hooks/useCustomSearchParams";
import { useQueryClient } from "@tanstack/react-query";


type SearchedJobsPaginationProps = {
    numbOfPages: number;
}

const SearchedJobsPagination = (props: React.PropsWithoutRef<SearchedJobsPaginationProps>) => {
    const queryClient = useQueryClient();

    const [URLSearchParams] = useSearchParams();
    const { page } = getOnlyValidJobSearchedQueries(URLSearchParams);

    const customSearchParams = useCustomSearchParams();

    const currentPage = page || "1";

    const isNavigateToPrev = currentPage !== "1";

    const isNavigateToNext = Number(currentPage) !== props.numbOfPages;

    
    const navigateHandler = (to: "prev" | "next") => {
        const isNavigateTo = to === "prev" ? isNavigateToPrev : isNavigateToNext;

        if (!isNavigateTo) return;

        const page = to === "prev" ? Number(currentPage) - 1 : Number(currentPage) + 1;

        customSearchParams.setSearchParams({
            key: "page",
            value: page.toString()
        });

        queryClient.removeQueries({ queryKey: ["jobs"] });

        window.scrollTo({
            top: 0,
            behavior: "instant"
        });
    }

    return (
        <footer className="p-4 flex items-center justify-between">
            <button disabled={!isNavigateToPrev} onClick={() => navigateHandler("prev")} className={`p-[.4rem] border-2 rounded-full ${isNavigateToPrev ? "text-purple-500 border-purple-400" : "text-purple-400 border-purple-300"}`}>
                <TbArrowBigLeftFilled size={20} />
            </button>
            <div>
                <span className="font-semibold text-purple-500">
                    {`${currentPage} of ${props.numbOfPages}`}
                </span>
            </div>
            <button disabled={!isNavigateToNext} onClick={() => navigateHandler("next")} className={`p-[.4rem] border-2 rounded-full ${isNavigateToNext ? "text-purple-500 border-purple-400" : "text-purple-400 border-purple-300"}`}>
                <TbArrowBigLeftFilled size={20} className="rotate-180" />
            </button>
        </footer>
    )
}

export default SearchedJobsPagination