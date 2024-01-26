import { TbHeart } from "react-icons/tb";

type SaveActivityProps = {
    activity: "profile" | "job" | "service";
}

const SaveActivity = (props: React.PropsWithoutRef<SaveActivityProps>) => {
    const saveActivityHandler = () => {
        console.log(`Save ${props.activity}`);
    }

    return (
        <div className="group">
            <button onClick={saveActivityHandler} className="flex items-center gap-2 font-medium duration-200 group-hover:text-purple-600">
                <span className="p-2 rounded-full border shadow-sm group-hover:text-white group-hover:bg-purple-600 group-hover:border-purple-600 duration-200"><TbHeart /></span>
                Save
            </button>
        </div>
    )
}

export default SaveActivity