import SingleActivityNavbar from "../../../components/SingleActivityNavbar";
import { useAppSelector } from "../../../hooks/redux";
import { SingleServiceType } from "../services/getSingleService"
import ServiceFAQs from "./ServiceFAQs";
import ServiceReviews from "./ServiceReviews";
import SingleServiceContent from "./SingleServiceContent";

type SingleServiceContainerProps = {
    serviceInfo: SingleServiceType;
}

const SingleServiceContainer = (props: React.PropsWithoutRef<SingleServiceContainerProps>) => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    const isBelongToCurrentUser = props.serviceInfo.profile._id === userInfo?.profileId;

    return (
        <main className="p-4 flex flex-col gap-8">
            <SingleActivityNavbar activity="service" hideReport={isBelongToCurrentUser} hideSave={isBelongToCurrentUser} target={props.serviceInfo._id} />
            <SingleServiceContent serviceInfo={props.serviceInfo} />
            <ServiceFAQs />
            {
                props.serviceInfo.rating.avgRate ?
                    <>
                        <hr />
                        <ServiceReviews rating={props.serviceInfo.rating} numOfAllReviews={props.serviceInfo.profile.rating.numOfReviews} profileId={props.serviceInfo.profile._id} />
                    </>
                    :
                    null
            }
        </main>
    )
}

export default SingleServiceContainer;