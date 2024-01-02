import { useNavigate } from "react-router-dom";
import CustomIcon from "../CustomIcon";

interface Props {
    categoryInfo: {
        _id: string;
        img: string;
        services: number;
        category: string;
    }
}

const TalentByCategory = (props: React.PropsWithoutRef<Props>) => {
    const navigate = useNavigate();

    const onCategory = () => {
        navigate("/");
    }

    return (
        <div className='pb-10 select-none'>
            <button onClick={onCategory} className='border p-3 flex flex-col gap-8 rounded text-left w-full overflow-hidden'>
                <CustomIcon iconSrc={props.categoryInfo.img} iconAlt={props.categoryInfo.category} iconSize={12} highlightPosition="br" />
                <div className='w-full flex flex-col gap-2'>
                    <h3 className='text-black font-semibold w-36 max-w-full'>{props.categoryInfo.category}</h3>
                </div>
            </button>
        </div>
    )
}

export default TalentByCategory