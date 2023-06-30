import DemoButton from "./DemoButton"

const QuickAccess = () => {
    const demos: ["Owner Demo", "Admin Demo", "Employee Demo", "Freelancer Demo"] = ["Owner Demo", "Admin Demo", "Employee Demo", "Freelancer Demo"]
    return (
        <div className='flex items-center gap-3 flex-wrap'>
            {demos.map((demo, index) => <DemoButton key={index} value={demo} />)}
        </div>
    )
}

export default QuickAccess