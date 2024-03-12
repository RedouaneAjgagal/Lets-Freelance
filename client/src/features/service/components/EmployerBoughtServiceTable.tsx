import { Link, useNavigate } from "react-router-dom";
import formatProfileName from "../../../utils/formatProfileName";
import { BoughtServiceType } from "../services/getEmployerBoughtServices"
import { TbCalendar, TbLocation } from 'react-icons/tb'
import ContractStatus from "../../../components/ContractStatus";
import ActionButton from "../../../layouts/brand/ActionButton";
import { LuFileSignature } from "react-icons/lu";

type EmployerBoughtServiceTableProps = {
    service: BoughtServiceType;
}

const EmployerBoughtServiceTable = (props: React.PropsWithoutRef<EmployerBoughtServiceTableProps>) => {
    const navigate = useNavigate();
    const freelancerName = formatProfileName(props.service.freelancer.profile.name);

    const createdAt = new Date(props.service.freelancer.profile.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit"
    });

    const orderPrice = `$${props.service.payments[0].amount.toFixed(2)}`;

    const contractNavigation = () => {
        navigate(`/profile/contracts/${props.service._id}`);
    }

    const boughtAt = new Date(props.service.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit"
    });

    return (
        <tr className="border-t">
            <td className="p-2 py-4">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <img src={props.service.freelancer.profile.avatar} alt="Freelancer avatar" className="w-12 h-12 rounded-full object-cover" />
                        <Link to={`/profiles/${props.service.freelancer.profile._id}`}>{freelancerName}</Link>
                    </div>
                    <div>
                        <Link to={`/services/${props.service.service.serviceInfo}`} className="font-medium text-[1.1rem]">{props.service.service.title}</Link>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-sm text-slate-600 flex items-center gap-1">
                            <TbCalendar size={18} />
                            {createdAt}
                        </span>
                        <span className="text-sm text-slate-600 flex items-center gap-1">
                            <TbLocation size={18} />
                            {props.service.freelancer.profile.country || "Unknown"}
                        </span>
                    </div>
                </div>
            </td>
            <td className="ml-4 p-2 py-4 font-medium text-lg">
                {orderPrice}
            </td>
            <td className="p-2 py-4">
                <div className="flex">
                    <ContractStatus status={props.service.freelancer.status} />
                </div>
            </td>
            <td className="p-2 py-4 text-slate-600">
                {boughtAt}
            </td>
            <td className="p-2 py-4">
                <div className="flex gap-2">
                    <ActionButton onClick={contractNavigation} type="customized" bgColor="bg-stone-600" icon={LuFileSignature} value="Contract" />
                </div>
            </td>
        </tr>
    )
}

export default EmployerBoughtServiceTable