import SingleActivityNavbar from "../../../components/SingleActivityNavbar";
import { useAppSelector } from "../../../hooks/redux";
import { SingleServiceType } from "../services/getSingleService"
import SingleServiceHeader from "./SingleServiceHeader";

type SingleServiceContainerProps = {
    serviceInfo: SingleServiceType;
}

const SingleServiceContainer = (props: React.PropsWithoutRef<SingleServiceContainerProps>) => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    const isBelongToCurrentUser = props.serviceInfo.profile._id === userInfo?.profileId;

    return (
        <main>
            <SingleActivityNavbar activity="service" hideReport={isBelongToCurrentUser} hideSave={isBelongToCurrentUser} />
            <SingleServiceHeader title={props.serviceInfo.title} profile={{
                _id: props.serviceInfo.profile._id,
                name: props.serviceInfo.profile.name,
                avatar: props.serviceInfo.profile.avatar,
                rating: props.serviceInfo.profile.rating,
                badge: props.serviceInfo.profile.roles.freelancer.badge
            }} />
        </main>
    )
}

export default SingleServiceContainer;