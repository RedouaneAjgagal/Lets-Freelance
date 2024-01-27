import SingleActivityNavbar from "../../../components/SingleActivityNavbar";
import { useAppSelector } from "../../../hooks/redux";
import { SingleServiceType } from "../services/getSingleService"
import SelectServiceTierContainer from "./SelectServiceTierContainer";
import SingleServiceGallery from "./SingleServiceGallery";
import SingleServiceHeader from "./SingleServiceHeader";

type SingleServiceContainerProps = {
    serviceInfo: SingleServiceType;
}

const SingleServiceContainer = (props: React.PropsWithoutRef<SingleServiceContainerProps>) => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    const isBelongToCurrentUser = props.serviceInfo.profile._id === userInfo?.profileId;

    return (
        <main className="p-4 flex flex-col gap-4">
            <SingleActivityNavbar activity="service" hideReport={isBelongToCurrentUser} hideSave={isBelongToCurrentUser} />
            <div>
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
        </main>
    )
}

export default SingleServiceContainer;