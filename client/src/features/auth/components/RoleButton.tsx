import { BiBriefcase } from "react-icons/bi";
import { MdOutlinePerson4 } from "react-icons/md";

interface Props {
    value: "Freelancer" | "Employee";
    role: "Freelancer" | "Employee";
    onSelectRole: (role: "Freelancer" | "Employee") => void;
}

const RoleButton = (props: React.PropsWithoutRef<Props>) => {
    const selectRoleHandler = () => {
        props.onSelectRole(props.value);
    }

    return (
        <button onClick={selectRoleHandler} type="button" className={`${props.value === props.role ? "text-purple-700 border border-purple-700 rounded shadow-lg shadow-purple-200/30" : "text-slate-800 border border-transparent"} flex items-center gap-2 font-medium p-2`}>
            {props.value === "Freelancer" ?
                <MdOutlinePerson4 fontSize="1.5rem" />
                :
                <BiBriefcase fontSize="1.5rem" />
            }
            {props.value}
        </button>
    )
}

export default RoleButton