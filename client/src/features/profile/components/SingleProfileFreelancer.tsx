import SingleProfileNav from './SingleProfileNav'
import ProfileHeader from './ProfileHeader'
import ServiceDetail from './ServiceDetail'
import AboutProfile from './AboutProfile'
import ProfileEducation from './ProfileEducation'
import ProfileExperience from './ProfileExperience'
import ProfileServices from './ProfileServices'
import ContactSection from './ContactSection'
import ProfileSkills from './ProfileSkills'
import ProfileHistory from './ProfileHistory'
import { useQueryClient } from '@tanstack/react-query'
import useProfileId from '../hooks/useProfileId'
import { Freelancer, GeneralProfile } from '../services/getSingleProfileInfo'
import { useAppSelector } from '../../../hooks/redux'

const SingleProfileFreelancer = () => {
    const queryCLient = useQueryClient();
    const profileId = useProfileId();
    const profile = queryCLient.getQueryData(["singleProfile", profileId]) as (GeneralProfile & Freelancer);
    const { userInfo } = useAppSelector(state => state.authReducer);

    const freelancerDetail = {
        hourlyRate: profile.roles.freelancer!.hourlyRate,
        location: profile.country,
        category: profile.category,
        type: profile.roles.freelancer!.types,
        englishLevel: profile.roles.freelancer!.englishLevel,
        gender: profile.roles.freelancer!.gender,
        portfolio: profile.roles.freelancer!.portfolio,
    }

    const freelancerHeaderInfo = {
        name: profile.name,
        avatar: profile.avatar,
        jobTitle: profile.roles.freelancer!.jobTitle,
        rating: profile.rating,
        reviews: profile.completedJobs.length,
        location: profile.country || "Unknown",
        dateOfBirth: profile.roles.freelancer!.dateOfBirth?.toString()
    }

    const isCurrentUser = userInfo?.profileId === profile._id;

    return (
        <>
            <header>
                <SingleProfileNav isCurrentUser={isCurrentUser} />
                <ProfileHeader profile='freelancer' userInfo={freelancerHeaderInfo} isCurrentUser={isCurrentUser} />
            </header>
            <ServiceDetail freelancerServiceDetail={profile.serviceDetail} />
            <AboutProfile profile='freelancer' content={profile.description || "Freelancer with no description"} />
            <ProfileEducation educations={profile.roles.freelancer!.education} />
            <ProfileExperience experiences={profile.roles.freelancer!.experience} />
            <ProfileServices services={profile.services} />
            <aside className='-mt-10'>
                <ContactSection contactType="freelancer" details={freelancerDetail} />
                <ProfileSkills skills={profile.roles.freelancer!.skills} />
            </aside>
            <ProfileHistory historyType='work' completedJobs={profile.completedJobs} inProgressJobs={profile.inProgressJobs} />
        </>
    )
}

export default SingleProfileFreelancer