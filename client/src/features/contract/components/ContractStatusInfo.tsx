import { Link } from "react-router-dom";
import ContractStatus from "../../../components/ContractStatus";
import { useAppSelector } from "../../../hooks/redux";
import { GetUserContractsReponse } from "../services/getUserSingleContract"

type ContractStatusInfoProps = {
    freelancer: GetUserContractsReponse["freelancer"];
    employer: GetUserContractsReponse["employer"];
}

const ContractStatusInfo = (props: React.PropsWithoutRef<ContractStatusInfoProps>) => {
    const { userInfo } = useAppSelector(state => state.authReducer);

    const otherUser = props[userInfo!.userAs === "employer" ? "freelancer" : "employer"];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col items-start gap-1">
                <h3 className="font-medium text-lg">Your status</h3>
                <ContractStatus status={props[userInfo!.userAs].status} />
            </div>
            <div className="flex flex-col items-start gap-1">
                <h3 className="font-medium text-lg">{userInfo!.userAs === "employer" ? "Freelancer status" : "Client status"} <Link to={`/profiles/${otherUser.profile}`} className="underline text-sm">(Profile)</Link></h3>
                <ContractStatus status={otherUser.status} />
            </div>
        </div>
    )
}

export default ContractStatusInfo