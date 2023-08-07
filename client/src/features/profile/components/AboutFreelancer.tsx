
interface Props {
    content: string;
}

const AboutFreelancer = (props: React.PropsWithoutRef<Props>) => {
    return (
        <article className="p-4 flex flex-col gap-4">
            <h2 className="font-medium text-2xl">About Freelancer</h2>
            <p className="text-slate-500 leading-relaxed">{props.content}</p>
        </article>
    )
}

export default AboutFreelancer