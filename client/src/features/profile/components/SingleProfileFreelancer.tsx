import ProfileHeader from './ProfileHeader'
import ServiceDetail from './ServiceDetail'
import AboutProfile from './AboutProfile'
import ProfileEducation from './ProfileEducation'
import ProfileExperience from './ProfileExperience'
import ProfileServices from './ProfileServices'
import ContactSection from './ContactSection'
import ProfileSkills from './ProfileSkills'
import ProfileHistory from './ProfileHistory'
import { FreelancerProfileType } from '../services/getSingleProfileInfo'
import { useAppSelector } from '../../../hooks/redux'
import { useProfileReviewsQuery } from '../../reviews'
import Loading from '../../../components/Loading'
import SingleActivityNavbar from '../../../components/SingleActivityNavbar'

type SingleProfileFreelancerProps = {
    profileId: string;
    freelancerDetails: FreelancerProfileType;
}

const SingleProfileFreelancer = (props: React.PropsWithoutRef<SingleProfileFreelancerProps>) => {
    const { userInfo } = useAppSelector(state => state.authReducer);

    const freelancerDetail = {
        hourlyRate: props.freelancerDetails.roles.freelancer.hourlyRate,
        location: props.freelancerDetails.country,
        category: props.freelancerDetails.category,
        type: props.freelancerDetails.roles.freelancer.types,
        englishLevel: props.freelancerDetails.roles.freelancer.englishLevel,
        gender: props.freelancerDetails.roles.freelancer.gender,
        portfolio: props.freelancerDetails.roles.freelancer.portfolio
    }

    const freelancerHeaderInfo = {
        _id: props.freelancerDetails._id,
        user: props.freelancerDetails.user,
        name: props.freelancerDetails.name,
        avatar: props.freelancerDetails.avatar,
        jobTitle: props.freelancerDetails.roles.freelancer.jobTitle,
        rating: props.freelancerDetails.rating.avgRate,
        reviews: props.freelancerDetails.rating.numOfReviews,
        location: props.freelancerDetails.country || "Unknown",
        dateOfBirth: props.freelancerDetails.roles.freelancer.dateOfBirth?.toString()
    }

    const serviceDetail = {
        projectSuccess: props.freelancerDetails.projectSuccess,
        totalService: props.freelancerDetails.totalService,
        completedService: props.freelancerDetails.completedService,
        inQueueService: props.freelancerDetails.inQueueService
    }

    const profileDetails = {
        _id: props.freelancerDetails._id,
        name: props.freelancerDetails.name,
        avatar: props.freelancerDetails.avatar
    }

    const isCurrentUser = userInfo?.profileId === props.freelancerDetails._id;

    const profileHistory = useProfileReviewsQuery({
        profileId: props.profileId
    });

    return (
        <>
            <header>
                <div className="p-4">
                    <SingleActivityNavbar activity="profile" hideReport={isCurrentUser} hideSave={isCurrentUser} target={props.freelancerDetails._id} isFavorited={props.freelancerDetails.isFavorited} />
                </div>
                <ProfileHeader profile='freelancer' userInfo={freelancerHeaderInfo} isCurrentUser={isCurrentUser} />
            </header>
            <ServiceDetail freelancerServiceDetail={serviceDetail} />
            <AboutProfile profile='freelancer' content={props.freelancerDetails.description || "Freelancer with no description"} />
            <ProfileEducation educations={props.freelancerDetails.roles.freelancer!.education} />
            <ProfileExperience experiences={props.freelancerDetails.roles.freelancer!.experience} />
            <ProfileServices services={props.freelancerDetails.services} profile={profileDetails} />
            <aside className='-mt-10'>
                <ContactSection contactType="freelancer" details={freelancerDetail} userId={props.freelancerDetails.user} />
                <ProfileSkills skills={props.freelancerDetails.roles.freelancer!.skills} />
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