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
import { FreelancerGeneralProfile } from '../services/getSingleProfileInfo'
import { useAppSelector } from '../../../hooks/redux'
import { useProfileReviewsQuery } from '../../reviews'
import Loading from '../../../components/Loading'
import SingleActivityNavbar from '../../../components/SingleActivityNavbar'

const SingleProfileFreelancer = () => {
    const queryCLient = useQueryClient();
    const profileId = useProfileId()!;
    const profile = queryCLient.getQueryData(["singleProfile", profileId]) as FreelancerGeneralProfile;
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
        rating: profile.rating.avgRate,
        reviews: profile.rating.numOfReviews,
        location: profile.country || "Unknown",
        dateOfBirth: profile.roles.freelancer!.dateOfBirth?.toString()
    }

    const serviceDetail = {
        projectSuccess: profile.projectSuccess,
        totalService: profile.totalService,
        completedService: profile.completedService,
        inQueueService: profile.inQueueService
    }

    const isCurrentUser = userInfo?.profileId === profile._id;

    const profileHistory = useProfileReviewsQuery({
        profileId
    });

    return (
        <>
            <header>
                <div className="p-4">
                    <SingleActivityNavbar activity="profile" hideReport={isCurrentUser} hideSave={isCurrentUser} />
                </div>
                <ProfileHeader profile='freelancer' userInfo={freelancerHeaderInfo} isCurrentUser={isCurrentUser} />
            </header>
            <ServiceDetail freelancerServiceDetail={serviceDetail} />
            <AboutProfile profile='freelancer' content={profile.description || "Freelancer with no description"} />
            <ProfileEducation educations={profile.roles.freelancer!.education} />
            <ProfileExperience experiences={profile.roles.freelancer!.experience} />
            <ProfileServices services={profile.services} />
            <aside className='-mt-10'>
                <ContactSection contactType="freelancer" details={freelancerDetail} />
                <ProfileSkills skills={profile.roles.freelancer!.skills} />
            </aside>
            {
                profileHistory.isLoading ?
                    <Loading />
                    :
                    <div className="p-4">
                        <ProfileHistory completedJobs={profileHistory.data!.completedReviews} inProgressJobs={profileHistory.data!.inProgressReviews} />
                    </div>
            }
        </>
    )
}

export default SingleProfileFreelancer