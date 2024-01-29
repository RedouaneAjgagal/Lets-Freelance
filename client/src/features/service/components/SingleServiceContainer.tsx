import SingleActivityNavbar from "../../../components/SingleActivityNavbar";
import { useAppSelector } from "../../../hooks/redux";
import { SingleServiceType } from "../services/getSingleService"
import SelectServiceTierContainer from "./SelectServiceTierContainer";
import ServiceDetails from "./ServiceDetails";
import ServiceFAQs from "./ServiceFAQs";
import ServiceReviews from "./ServiceReviews";
import SingleServiceGallery from "./SingleServiceGallery";
import SingleServiceHeader from "./SingleServiceHeader";

type SingleServiceContainerProps = {
    serviceInfo: SingleServiceType;
}

const SingleServiceContainer = (props: React.PropsWithoutRef<SingleServiceContainerProps>) => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    const isBelongToCurrentUser = props.serviceInfo.profile._id === userInfo?.profileId;

    return (
        <main className="p-4 flex flex-col gap-8">
            <SingleActivityNavbar activity="service" hideReport={isBelongToCurrentUser} hideSave={isBelongToCurrentUser} />
            <div className="-mt-2">
                <SingleServiceHeader title={props.serviceInfo.title} profile={{
                    _id: props.serviceInfo.profile._id,
                    name: props.serviceInfo.profile.name,
                    avatar: props.serviceInfo.profile.avatar,
                    rating: props.serviceInfo.profile.rating,
                    badge: props.serviceInfo.profile.roles.freelancer.badge
                }} />
                <div className="mt-4">
                    <SingleServiceGallery featuredImage={props.serviceInfo.featuredImage} gallery={props.serviceInfo.gallery} />
                </div>
            </div>
            <SelectServiceTierContainer tier={props.serviceInfo.tier} profileName={props.serviceInfo.profile.name} serviceId={props.serviceInfo._id} profileId={props.serviceInfo.profile._id} />
            <ServiceDetails description={props.serviceInfo.description} />
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