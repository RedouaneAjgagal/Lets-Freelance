import { SingleServiceType } from "../services/getSingleService";

type ServiceDetailsProps = {
    description: SingleServiceType["description"];
};


const ServiceDetails = (props: React.PropsWithoutRef<ServiceDetailsProps>) => {
    return (
        <article className="flex flex-col gap-2">
            <h2 className="text-xl font-medium">Service description</h2>
            <p className="text-slate-600 leading-relaxed text-[.95rem]">{props.description}</p>
        </article>
    )
}

export default ServiceDetails