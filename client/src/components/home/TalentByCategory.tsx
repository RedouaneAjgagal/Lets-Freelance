import { useNavigate } from "react-router-dom";
import CustomIcon from "../CustomIcon";
import getFormatedCategory from "../../features/profile/helpers/getFormatedCategory";

interface Props {
    categoryInfo: {
        _id: string;
        img: string;
        category: "digital marketing" | "design & creative" | "programming & tech" | "writing & translation" | "video & animation" | "finance & accounting" | "music & audio";
    }
}

const TalentByCategory = (props: React.PropsWithoutRef<Props>) => {
    const navigate = useNavigate();

    const category = getFormatedCategory(props.categoryInfo.category);

    const onCategory = () => {
        navigate(`/profiles?category=${category}`);
    }

    return (
        <div className='pb-10 select-none'>
            <button onClick={onCategory} className='border p-3 flex flex-col gap-8 rounded text-left w-full overflow-hidden'>
                <CustomIcon iconSrc={props.categoryInfo.img} iconAlt={props.categoryInfo.category} iconSize={12} highlightPosition="br" />
                <div className='w-full flex flex-col gap-2'>
                    <h3 className='text-black font-semibold w-36 max-w-full capitalize'>{props.categoryInfo.category}</h3>
                </div>
            </button>
        </div>
    )
}

export default TalentByCategory