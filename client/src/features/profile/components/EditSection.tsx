interface Props {
    title: string;
    titleColor: "blue" | "red" | "purple" | "green" | "black";
    withoutPadding?: boolean;
    bgTransparent?: boolean;
}

const EditSection = (props: React.PropsWithChildren<Props>) => {

    const colorVariants = {
        blue: 'text-blue-600',
        red: 'text-red-600',
        purple: 'text-purple-600',
        green: 'text-green-600',
        black: 'text-slate-900',
    }

    return (
        <section className={`${props.bgTransparent ? "bg-transparent" : "bg-white shadow-sm"} ${props.withoutPadding ? "p-0 lg:p-0" : "p-4 lg:p-6"} rounded grid gap-6`}>
            <h2 className={`${colorVariants[props.titleColor]} pb-2 border-b border-slate-300 font-semibold text-lg`}>{props.title}</h2>
            {props.children}
        </section>
    )
}

export default EditSection