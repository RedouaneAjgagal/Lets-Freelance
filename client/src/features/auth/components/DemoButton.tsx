
interface Props {
    value: "Owner Demo" | "Admin Demo" | "Employee Demo" | "Freelancer Demo"
}

const DemoButton = (props: React.PropsWithoutRef<Props>) => {
    const getValue = props.value.split(" ").join("-").toLowerCase();
    const getEmail = `${getValue}@letsfreelance.io`;
    const getPassword = "quick-access";
    const demoHandler = () => {
        const demoInfo = {
            email: getEmail,
            password: getPassword
        }
        console.log(demoInfo);
    }

    return (
        <button onClick={demoHandler} type='button' className='text-slate-700 bg-purple-100/50 py-1 px-2 rounded border'>{props.value}</button>
    )
}

export default DemoButton