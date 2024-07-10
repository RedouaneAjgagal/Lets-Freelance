
type JobFormReviewWrapperProps = {
    step: number;
    stepTitle: string;
    navigateToStep: (step: number) => void;
}

const JobFormReviewWrapper = (props: React.PropsWithChildren<JobFormReviewWrapperProps>) => {
    const step = `${props.step} / 4`;

    const navigateToStepHandler = () => {
        props.navigateToStep(props.step);
    }

    return (
        <article className="flex flex-col gap-4 bg-white p-3 border rounded shadow-sm md:px-5 md:py-4">
            <nav className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <small>{step}</small>
                    <span className="text-slate-600">{props.stepTitle}</span>
                </div>
                <button onClick={navigateToStepHandler} type="button" className="underline">Change</button>
            </nav>
            <main className="flex flex-col gap-3">
                {props.children}
            </main>
        </article>
    )
}

export default JobFormReviewWrapper