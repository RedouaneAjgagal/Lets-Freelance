import React from 'react'
import SingleServiceHeader from './SingleServiceHeader'
import SingleServiceGallery from './SingleServiceGallery'
import SelectServiceTierContainer from './SelectServiceTierContainer'
import ServiceDetails from './ServiceDetails'
import { SingleServiceType } from '../services/getSingleService'

type SingleServiceContentProps = {
    serviceInfo: SingleServiceType;
    isPreview?: boolean;
}

const SingleServiceContent = (props: React.PropsWithoutRef<SingleServiceContentProps>) => {
    return (
        <div className="flex flex-col gap-6">
            <div className="-mt-2">
                <SingleServiceHeader title={props.serviceInfo.title} profile={{
                    _id: props.serviceInfo.profile._id,
                    name: props.serviceInfo.profile.name,
                    avatar: props.serviceInfo.profile.avatar,
                    rating: props.serviceInfo.profile.rating,
                    badge: props.serviceInfo.profile.roles.freelancer.badge
                }} isPreview={props.isPreview} />
                <div className="mt-4">
                    <SingleServiceGallery featuredImage={props.serviceInfo.featuredImage} gallery={props.serviceInfo.gallery} />
                </div>
            </div>
            <SelectServiceTierContainer tier={props.serviceInfo.tier} profileName={props.serviceInfo.profile.name} serviceId={props.serviceInfo._id} userId={props.serviceInfo.user} isPreview={props.isPreview} />
            <ServiceDetails description={props.serviceInfo.description} />
        </div>
    )
}

export default SingleServiceContent