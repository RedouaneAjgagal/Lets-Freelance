import { Link } from "react-router-dom";
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
    const category = getFormatedCategory(props.categoryInfo.category);

    return (
        <div className='pb-10'>
            <Link to={`/profiles?category=${category}`} className='border p-3 flex flex-col gap-8 rounded text-left w-full select-none'>
                <CustomIcon iconSrc={props.categoryInfo.img} iconAlt={props.categoryInfo.category} iconSize={12} highlightPosition="br" />
                <div className='w-full'>
                    <span className='flex text-black font-semibold w-28 max-w-full capitalize md:text-lg'>
                        {props.categoryInfo.category}
                    </span>
                </div>
            </Link>
        </div>
    )
}

export default TalentByCategory