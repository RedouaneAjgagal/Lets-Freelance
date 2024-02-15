import { SingleServiceType } from "../services/getSingleService";

type ServiceDetailsProps = {
    description: SingleServiceType["description"];
};


const ServiceDetails = (props: React.PropsWithoutRef<ServiceDetailsProps>) => {
    return (
        <article className="flex flex-col gap-4">
            <h2 className="text-xl font-medium pb-4 border-b">Service description</h2>
            <div dangerouslySetInnerHTML={{ __html: props.description }} className="ql-editor p-0 [&_ul]:pl-0 [&_ol]:pl-0 [&_blockquote]:pl-2 [&_blockquote]:border-l-4 [&_blockquote]:mb-3" />
        </article>
    )
}

export default ServiceDetails