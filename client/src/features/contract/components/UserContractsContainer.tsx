import { ContractResponseType } from "../services/getUserContracts"
import UserContractsTable from "./UserContractsTable";

type UserContractsContainerProps = {
    contracts: ContractResponseType[];
}

const UserContractsContainer = (props: React.PropsWithoutRef<UserContractsContainerProps>) => {
    return (
        <div>
            {props.contracts.length ?
                <UserContractsTable contracts={props.contracts} />
                : <h2 className="text-xl font-medium">Empty..</h2>
            }
        </div>
    )
}

export default UserContractsContainer