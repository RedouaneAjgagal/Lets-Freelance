
interface Props {
    info: {
        img: string;
        title: string;
        desc: string;
    }
}

const WhyUs = (props: React.PropsWithoutRef<Props>) => {
    return (
        <div className="flex gap-4">
            <div className="mt-1">
                <img src={props.info.img} alt={props.info.title} className="max-w-full w-12" />
            </div>
            <div className="flex flex-col gap-2 col-span-4 w-full">
                <h5 className="text-lg font-medium">{props.info.title}</h5>
                <p className="text-slate-600 text-sm">{props.info.desc}</p>
            </div>
        </div>
    )
}

export default WhyUs