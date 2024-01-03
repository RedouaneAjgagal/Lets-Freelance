import DemoButton from "./DemoButton"

const QuickAccess = () => {
    const demos = ["Owner Demo", "Admin Demo", "Employer Demo", "Freelancer Demo"] as const;
    return (
        <div className='flex items-center gap-3 flex-wrap'>
            {demos.map((demo, index) => <DemoButton key={index} value={demo} />)}
        </div>
    )
}

export default QuickAccess