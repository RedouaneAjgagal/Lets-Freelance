import { TbHeart } from 'react-icons/tb'

const SaveProfile = () => {

    const saveProfileHanlder = () => {
        console.log("save profile");
    }

    return (
        <div className="group">
            <button onClick={saveProfileHanlder} className="flex items-center gap-2 font-medium duration-200 group-hover:text-purple-600">
                <span className="p-2 rounded-full border shadow-sm group-hover:text-white group-hover:bg-purple-600 group-hover:border-purple-600 duration-200"><TbHeart /></span>
                Save
            </button>
        </div>
    )
}

export default SaveProfile