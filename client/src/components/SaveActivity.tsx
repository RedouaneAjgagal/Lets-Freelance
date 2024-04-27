import { TbHeart, TbLoader2 } from "react-icons/tb";
import { useFavoritesMutation } from "../features/favorites";
import { useAppSelector } from "../hooks/redux";
import toast from "react-hot-toast";

type SaveActivityProps = {
    activity: "profile" | "job" | "service";
    targetId: string;
    isFavorited: boolean;
}

const SaveActivity = (props: React.PropsWithoutRef<SaveActivityProps>) => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    const favoritesMutation = useFavoritesMutation({
        event: props.activity,
        target: props.targetId
    });

    const saveActivityHandler = () => {
        if (favoritesMutation.isLoading) return;
        if (!userInfo) {
            toast.error(`You must login first to start saving ${props.activity}s`, {
                id: "error_saveActivity"
            });
            return;
        }

        favoritesMutation.mutate({
            event: props.activity,
            target: props.targetId
        });
    }

    return (
        <button onClick={saveActivityHandler} className={`flex items-center gap-2 font-medium duration-200`}>
            <span className={`p-2 rounded-full border shadow-sm duration-200 ${props.isFavorited ? "bg-purple-600 border-purple-600 text-white" : "bg-transparent text-slate-800"}`}>
                {favoritesMutation.isLoading ?
                    <TbLoader2 className="animate-spin" />
                    : <TbHeart />
                }
            </span>
            Save
        </button>
    )
}

export default SaveActivity