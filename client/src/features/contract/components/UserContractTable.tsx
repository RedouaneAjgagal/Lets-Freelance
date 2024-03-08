import { Link } from "react-router-dom";
import toUpperCase from "../../../utils/toUpperCase";
import { ContractResponseType } from "../services/getUserContracts"
import ContractStatus from "../../../components/ContractStatus";
import formatDate from "../../../utils/formatDate";
import ActionButton from "../../../layouts/brand/ActionButton";

type UserContractTableProps = {
    contract: ContractResponseType;
}

const UserContractTable = (props: React.PropsWithoutRef<UserContractTableProps>) => {


    let activityTitle: string;
    let toUrl: string;

    let price: number;
    let priceType: "hr" | "fixed";

    if (props.contract.activityType === "job") {
        activityTitle = props.contract.job.title;
        toUrl = `/jobs/${props.contract.job._id}`;

        price = props.contract.job.price;
        priceType = props.contract.job.priceType === "hourly" ? "hr" : "fixed";
    } else {
        activityTitle = props.contract.service.title;
        toUrl = `/services/${props.contract.service._id}`;

        price = props.contract.service.tier.price;
        priceType = "fixed";
    }

    const createdAt = formatDate(props.contract.createdAt);

    const navigateToContractHanlder = () => {
        console.log(props.contract._id);
    }

    return (
        <tr className="border-t">
            <td className="pl-2 py-4 pr-4">
                <div className="flex flex-col">
                    <small>{toUpperCase({ value: props.contract.activityType })}</small>
                    <Link to={toUrl} className="font-medium text-[1.1rem]">{activityTitle}</Link>
                </div>
            </td>
            <td className="px-2 py-4">
                <div className="flex items-start gap-1 flex-wrap">
                    <span className="font-medium text-lg">${price.toFixed(2)}</span>
                    <small>{priceType}</small>
                </div>
            </td>
            <td className="px-2 py-4">
                <div className="flex">
                    <ContractStatus status={props.contract.status} />
                </div>
            </td>
            <td className="px-2 py-4">
                <span>{createdAt}</span>
            </td>
            <td className="px-2 py-4">
                <div className="flex gap-2">
                    <ActionButton type="view" onClick={navigateToContractHanlder}  />
                </div>
            </td>
        </tr>
    )
}

export default UserContractTable