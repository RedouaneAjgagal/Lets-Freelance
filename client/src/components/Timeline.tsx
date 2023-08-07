
interface Props {
    isLastItem: boolean;
    firstLetter: string;
}

const Timeline = (props: React.PropsWithChildren<Props>) => {
    return (
        <li className="flex gap-4">
            <div className="flex flex-col items-center gap-2">
                <span className="flex justify-center items-center w-8 min-h-[2rem] rounded-full bg-purple-100 text-purple-600 font-medium ">{props.firstLetter}</span>
                {!props.isLastItem ? <div className="h-full border-l-2 border-dashed border-purple-600"></div> : null}
            </div>
            <div className="flex flex-col gap-4">
                {props.children}
            </div>
        </li>
    )
}

export default Timeline