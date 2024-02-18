import { useQueryClient } from "@tanstack/react-query";
import SearchInput from "../../../components/SearchInput"
import useCustomSearchParams from "../../../hooks/useCustomSearchParams";

const JobsHeader = () => {
    const customSearchParams = useCustomSearchParams();

    const queryClient = useQueryClient();

    const searchJobsHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const searchValue = formData.get("search")?.toString();

        customSearchParams.setSearchParams({
            key: "search",
            value: searchValue?.trim() || ""
        });

        queryClient.removeQueries({ queryKey: ["jobs"] });
    }

    const searchValue = customSearchParams.getSearchParams({
        key: "search"
    });

    return (
        <header className="px-4 pt-7">
            <SearchInput onSubmit={searchJobsHandler} searchValue={searchValue || ""} />
        </header>
    )
}

export default JobsHeader