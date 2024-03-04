import { TbQuestionCircle } from 'react-icons/tb'

type QuestionModalProps = {
    content: string;
}

const QuestionModal = (props: React.PropsWithoutRef<QuestionModalProps>) => {
    return (
        <div className="relative group font-normal">
            <TbQuestionCircle className="text-purple-600" />
            <div className="group-hover:grid hidden gap-2 text-sm text-slate-700 absolute bottom-6 bg-white border-2 shadow-lg rounded w-60 text-center left-1/2 -translate-x-1/2 p-2 z-10">
                <p>{props.content}</p>
            </div>
        </div>
    )
}

export default QuestionModal