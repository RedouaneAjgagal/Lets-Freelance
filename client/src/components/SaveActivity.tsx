import { TbHeart, TbLoader2 } from "react-icons/tb";
import { useFavoritesMutation } from "../features/favorites";
import { useAppSelector } from "../hooks/redux";
import toast from "react-hot-toast";

type SaveActivityProps = {
    activity: "profile" | "job" | "service";
    targetId: string;
}

const SaveActivity = (props: React.PropsWithoutRef<SaveActivityProps>) => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    const favoritesMutation = useFavoritesMutation(props.activity);

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
        <div className="group">
            <button onClick={saveActivityHandler} className="flex items-center gap-2 font-medium duration-200 group-hover:text-purple-600">
                <span className="p-2 rounded-full border shadow-sm group-hover:text-white group-hover:bg-purple-600 group-hover:border-purple-600 duration-200">
                    {favoritesMutation.isLoading ?
                        <TbLoader2 className="animate-spin" />
                        : <TbHeart />
                    }
                </span>
                Save
            </button>
        </div>
    )
}

export default SaveActivity