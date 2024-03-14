import { TbCalendar, TbChecks, TbEye } from "react-icons/tb";
import PaymentsStatus from "../../../components/PaymentsStatus";
import { useAppSelector } from "../../../hooks/redux";
import formatDate from "../../../utils/formatDate";
import { ContractPayment } from "../services/getUserSingleContract"
import ActionButton from "../../../layouts/brand/ActionButton";
import { TbArrowBackUp } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ContractRequestModal from "../modals/ContractRequestModal";
import useOverflow from "../../../hooks/useOverflow";
import usePayHourlyContractMutation from "../hooks/usePayHourlyContractMutation";

type ContractPaymentTableBodyProps = {
    payment: ContractPayment;
    priceType: "hourly" | "fixed";
    contractId: string
}

const ContractPaymentTableBody = (props: React.PropsWithoutRef<ContractPaymentTableBodyProps>) => {
    const payHourlyContractMutation = usePayHourlyContractMutation();

    const [isRefundRequestOpen, setIsRefundRequestOpen] = useState(false);
    const navigate = useNavigate();

    const { userInfo } = useAppSelector(state => state.authReducer);

    const userPayment = props.payment[userInfo!.userAs];
    const otherUserPayment = props.payment[userInfo!.userAs === "freelancer" ? "employer" : "freelancer"];

    const userStatusTime = formatDate(userPayment.at);
    const otherUserStatusTime = formatDate(otherUserPayment.at);

    const refundRequestHandler = () => {
        if (props.payment.employer.refundRequest) {
            setIsRefundRequestOpen(true);
            return;
        }

        console.log(props.payment._id);

        navigate("/");
    }

    const payWorkedHoursHandler = () => {
        if (
            props.payment.employer.status !== "pending"
            || props.priceType !== "hourly"
            || payHourlyContractMutation.isLoading
        ) return;

        payHourlyContractMutation.mutate({
            contractId: props.contractId,
            paymentId: props.payment._id
        });
    }

    useOverflow(isRefundRequestOpen);

    return (
        <tr className="border-t h-28">
            <td className="px-2">
                <div className="flex flex-col gap-1">
                    <small>{props.priceType}</small>
                    <div>
                        <span className="font-medium text-lg">
                            ${props.payment.amount.toFixed(2)}
                        </span>
                        {props.payment.workedHours ?
                            <span className="ml-1 text-sm">
                                ({props.payment.workedHours}h)
                            </span>
                            : null
                        }
                    </div>
                </div>
            </td>
            <td className="px-2">
                {userPayment.net && userPayment.net !== 0 ?
                    <span className="font-medium text-lg">${userPayment.net.toFixed(2)}</span>
                    : <span>--</span>
                }
            </td>
            <td className="px-2">
                <div className="flex flex-col gap-2 items-start">
                    <PaymentsStatus type={userPayment.status} />
                    {userPayment.status !== "pending" ?
                        <span className="flex items-center gap-1 text-slate-600 text-sm">
                            <TbCalendar size={20} />
                            {userStatusTime}
                        </span>
                        : null
                    }
                </div>
            </td>
            <td className="px-2">
                <div className="flex flex-col gap-2 items-start">
                    <PaymentsStatus type={otherUserPayment.status} />
                    {otherUserPayment.status !== "pending" ?
                        <span className="flex items-center gap-1 text-slate-600 text-sm">
                            <TbCalendar size={20} />
                            {otherUserStatusTime}
                        </span>
                        : null
                    }
                </div>
            </td>
            {userInfo!.userAs === "employer" ?
                <td className="px-2">
                    {isRefundRequestOpen ?
                        <ContractRequestModal refundRequest={props.payment.employer.refundRequest!} onClose={() => setIsRefundRequestOpen(false)} />
                        : null
                    }
                    <div className="flex gap-1">
                        {
                            props.payment.employer.status === "pending" ?
                                props.priceType === "hourly" ?
                                    <ActionButton disabled={payHourlyContractMutation.isLoading} type="customized" bgColor="bg-green-500" icon={TbChecks} onClick={payWorkedHoursHandler} value="Pay" />
                                    : <span>--</span>
                                : <ActionButton bgColor={props.payment.employer.refundRequest ? "bg-purple-500" : "bg-stone-500"} icon={props.payment.employer.refundRequest ? TbEye : TbArrowBackUp} onClick={refundRequestHandler} type="customized" value={props.payment.employer.refundRequest ? "Track refund status" : "Request a refund"} />
                        }
                    </div>
                </td>
                : null
            }
        </tr>
    )
}

export default ContractPaymentTableBody