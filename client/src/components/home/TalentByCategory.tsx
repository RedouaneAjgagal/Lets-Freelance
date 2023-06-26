import { useNavigate } from "react-router-dom";

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

    const services = props.categoryInfo.services === 1 ? `${props.categoryInfo.services} Service` : `${props.categoryInfo.services} Services`

    const onCategory = () => {
        navigate("/");
    }

    return (
        <div className='pb-10 select-none'>
            <button onClick={onCategory} className='border p-3 flex flex-col gap-8 relative rounded text-left w-full'>
                <div className='before:w-11 before:h-11 before:bg-purple-100/60 before:absolute before:top-6 before:left-8 before:rounded-full before:-z-10'>
                    <img src={props.categoryInfo.img} alt={props.categoryInfo.category} className='w-12 h-12' />
                </div>
                <div className='w-full flex flex-col gap-2'>
                    <span className='text-slate-600 text-sm'>{services}</span>
                    <h3 className='text-black font-semibold w-36 max-w-full'>{props.categoryInfo.category}</h3>
                </div>
            </button>
        </div>
    )
}

export default TalentByCategory