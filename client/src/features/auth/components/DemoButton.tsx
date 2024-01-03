// import { useAppDispatch } from "../../../hooks/redux";
// import { loginAction } from "../redux/login";
import useLoginMutation from "../hooks/useLoginMutation";

interface Props {
    value: "Owner Demo" | "Admin Demo" | "Employer Demo" | "Freelancer Demo"
}

const DemoButton = (props: React.PropsWithoutRef<Props>) => {
    // const dispatch = useAppDispatch();
    const getValue = props.value.split(" ").join("-").toLowerCase();
    const getEmail = `${getValue}@letsfreelance.io`;
    const getPassword = `${getValue}-quick-access`;

    // owner-demo@letsfreelance.io
    // owner-demo-quick-access

    const loginMutation = useLoginMutation();

    const demoHandler = () => {
        const demoInfo = {
            email: getEmail,
            password: getPassword
        }
        loginMutation.mutate(demoInfo);
    }

    return (
        <button onClick={demoHandler} type='button' className='text-slate-700 bg-purple-100/50 py-1 px-2 rounded border'>{props.value}</button>
    )
}

export default DemoButton