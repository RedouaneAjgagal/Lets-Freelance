import { useState } from "react";
import SingleActivityNavbar from "../../../components/SingleActivityNavbar";
import { useAppSelector } from "../../../hooks/redux";
import { SingleServiceType } from "../services/getSingleService"
import SelectServiceTierContainer from "./SelectServiceTierContainer";
import ServiceFAQs from "./ServiceFAQs";
import ServiceReviews from "./ServiceReviews";
import SingleServiceContent from "./SingleServiceContent";

type SingleServiceContainerProps = {
    serviceInfo: SingleServiceType;
}

const SingleServiceContainer = (props: React.PropsWithoutRef<SingleServiceContainerProps>) => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    const isBelongToCurrentUser = props.serviceInfo.profile._id === userInfo?.profileId;

    const [selectedTier, setSelectedTier] = useState<"starter" | "standard" | "advanced">("starter");
    const changeTierHandler = (tier: "starter" | "standard" | "advanced") => {
        setSelectedTier(tier)
    }

    return (
        <main className="p-4 xl:max-w-[95rem] xl:m-auto px-4">
            {!isBelongToCurrentUser
                ? <SingleActivityNavbar activity="service" hideReport={isBelongToCurrentUser} hideSave={isBelongToCurrentUser} target={props.serviceInfo._id} isFavorited={props.serviceInfo.isFavorited} hideShare />
                : null
            }
            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-4 ">
                <div className="hidden lg:flex lg:order-1 lg:col-span-4">
                    <SelectServiceTierContainer key={1} tier={props.serviceInfo.tier} profileName={props.serviceInfo.profile.name} serviceId={props.serviceInfo._id} userId={props.serviceInfo.user} hideCta={userInfo?.userAs === "freelancer"} isDesktopSize onChangeTier={changeTierHandler} selectedTier={selectedTier} />
                </div>
                <div className="flex flex-col gap-8 lg:col-span-8">
                    <div>
                        <SingleServiceContent onChangeTier={changeTierHandler} selectedTier={selectedTier} serviceInfo={props.serviceInfo} hideCta={userInfo?.userAs === "freelancer"} />
                    </div>
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
                </div>
            </div>
        </main>
    )
}

export default SingleServiceContainer;