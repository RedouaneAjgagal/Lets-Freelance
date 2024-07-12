import { TbPlus, TbMinus } from "react-icons/tb";


type FAQProps = {
    question: string;
    answer: string;
    isOpen: boolean;
    onClick: (faq: string) => void;
}

const FAQ = (props: React.PropsWithoutRef<FAQProps>) => {
    const openFaqHandler = () => {
        props.onClick(props.question);
    }

    return (
        <div className={`${props.isOpen ? "bg-purple-100/60" : ""} rounded`}>
            <button onClick={openFaqHandler} className="grid grid-cols-6 justify-between items-center w-full text-left p-3 font-medium sm:flex sm:p-5">
                <span className="col-span-5">{props.question}</span>
                <span className="col-span-1 flex justify-center">
                    {props.isOpen ?
                        <TbMinus size={18} />
                        :
                        <TbPlus size={18} />
                    }
                </span>
            </button>
            {props.isOpen ?
                <p className="px-3 pb-3 text-slate-600 text-[.93rem] leading-relaxed sm:px-5 sm:pb-5">{props.answer}</p>
                :
                null
            }
        </div>
    )
}

export default FAQ