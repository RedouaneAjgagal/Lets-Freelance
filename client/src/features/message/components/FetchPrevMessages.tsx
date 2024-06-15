import { TbLoader2 } from "react-icons/tb";

type FetchPrevMessagesProps = {
    isFetchingNextPage: boolean;
    hasNextPage?: boolean;
    fetchNextPage: () => void;
}

const FetchPrevMessages = (props: React.PropsWithoutRef<FetchPrevMessagesProps>) => {
    const FetchPrevMessagesHandler = () => {
        if (props.isFetchingNextPage || !props.hasNextPage) return;

        props.fetchNextPage();
    }

    return (
        <div className="p-4 w-full">
            <button disabled={props.isFetchingNextPage || !props.hasNextPage} onClick={FetchPrevMessagesHandler} className={`p-2 rounded font-medium w-full flex items-center justify-center border border-slate-300 ${props.isFetchingNextPage ? "bg-blue-100/60" : "bg-blue-100/30"}`}>
                {props.isFetchingNextPage
                    ? <>
                        <span className="invisible flex">
                            Load old messages
                        </span>
                        <TbLoader2 className="animate-spin absolute" size={20} />
                    </>
                    : "Load old messages"
                }
            </button>
        </div>
    )
}

export default FetchPrevMessages