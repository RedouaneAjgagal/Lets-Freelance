import { ConnectsType } from "../services/getProfileInfo"
import AddMoreConnects from "./AddMoreConnects";
import Card from "./Card";
import ConnectsPayments from "./ConnectsPayments";

type ConnectsContainerProps = {
    connects: ConnectsType;
}

const ConnectsContainer = (props: React.PropsWithoutRef<ConnectsContainerProps>) => {

    return (
        <div className="flex flex-col gap-3">
            <Card cardTitle="Available connects" value={props.connects.connectionsCount} iconUrl="https://cdn-icons-png.flaticon.com/512/8138/8138511.png" />
            <AddMoreConnects connects={props.connects.connectionsCount} />
            <ConnectsPayments payments={props.connects.payments} />
        </div>
    )
}

export default ConnectsContainer