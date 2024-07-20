
interface Props {
    profile: "freelancer" | "employer";
    content: string;
}

const AboutProfile = (props: React.PropsWithoutRef<Props>) => {
    const title = `About ${props.profile === "freelancer" ? "Freelancer" : "Employer"}`;

    const description = props.content.replace(/\n/g, "<br />");

    return (
        <article className="p-4 flex flex-col gap-4">
            <h2 className="font-medium text-2xl">{title}</h2>
            <p className="text-slate-500 leading-relaxed" dangerouslySetInnerHTML={{ __html: description }}></p>
        </article>
    )
}

export default AboutProfile