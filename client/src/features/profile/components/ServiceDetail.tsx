import CustomIcon from "../../../components/CustomIcon";

interface Props {
    freelancerServiceDetail: {
        projectSuccess: number;
        totalServices: number;
        completedService: number;
        inQueueService: number;
    }
}


const ServiceDetail = (props: React.PropsWithoutRef<Props>) => {

    const servicesDetails = [
        {
            title: `Project Success`,
            value: props.freelancerServiceDetail.projectSuccess,
            iconSrc: "https://cdn-icons-png.flaticon.com/512/3138/3138297.png",
            iconAlt: "Target Icon"
        },
        {
            title: `Total Services`,
            value: props.freelancerServiceDetail.totalServices,
            iconSrc: "https://cdn-icons-png.flaticon.com/128/5267/5267775.png",
            iconAlt: "Target Icon"
        },
        {
            title: `Completed Service`,
            value: props.freelancerServiceDetail.completedService,
            iconSrc: "https://cdn-icons-png.flaticon.com/128/709/709510.png",
            iconAlt: "Target Icon"
        },
        {
            title: `In Queue Service`,
            value: props.freelancerServiceDetail.inQueueService,
            iconSrc: "https://cdn-icons-png.flaticon.com/128/66/66163.png",
            iconAlt: "Target Icon"
        },
    ];

    return (
        <article className="p-4">
            <ul className="grid grid-cols-2 gap-x-2 gap-y-8">
                {servicesDetails.map((service, index) =>
                    <li key={index} className="flex items-center gap-6">
                        <div>
                            <CustomIcon iconSrc={service.iconSrc} iconAlt={service.iconAlt} iconSize={10} highlightPosition="br" />
                        </div>
                        <div>
                            <h3 className="font-medium">{service.title}</h3>
                            <span className="text-slate-600 font-medium">{service.value}</span>
                        </div>
                    </li>
                )}
            </ul>
        </article>
    )
}

export default ServiceDetail