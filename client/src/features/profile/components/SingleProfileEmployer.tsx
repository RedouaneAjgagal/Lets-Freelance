import ProfileHeader from './ProfileHeader'
import AboutProfile from './AboutProfile'
import OpenJobs from './OpenJobs';
import ProfileHistory from './ProfileHistory';
import ContactSection from './ContactSection';
import { EmployerProfileType } from '../services/getSingleProfileInfo';
import { useAppSelector } from '../../../hooks/redux';
import { useProfileReviewsQuery } from '../../reviews';
import Loading from '../../../components/Loading';
import SingleActivityNavbar from '../../../components/SingleActivityNavbar';

export type OpenJob = {
    _id: string;
    title: string;
    location: string;
    category: string;
    price: { start: number; end: number } | number;
    jobType: string;
    employer: {
        name: string;
    }
}

type SingleProfileEmployerProps = {
    profileId: string;
    employerDetails: EmployerProfileType;
}

const SingleProfileEmployer = (props: React.PropsWithoutRef<SingleProfileEmployerProps>) => {
    const { userInfo } = useAppSelector(state => state.authReducer);

    const employerDetail = {
        location: props.employerDetails.country || "Unknown",
        category: props.employerDetails.category,
        companyName: props.employerDetails.roles.employer!.companyName,
        employees: props.employerDetails.roles.employer!.employees,
        website: props.employerDetails.roles.employer!.website,
    }

    const employerHeaderInfo = {
        name: props.employerDetails.name,
        avatar: props.employerDetails.avatar,
        rating: props.employerDetails.rating.avgRate,
        reviews: props.employerDetails.rating.numOfReviews,
        location: props.employerDetails.country || "Unknown",
    }

    const profileDetails = {
        _id: props.employerDetails._id,
        name: props.employerDetails.name,
        country: props.employerDetails.country
    }

    const isCurrentUser = userInfo?.profileId === props.employerDetails._id;

    const profileHistory = useProfileReviewsQuery({
        profileId: props.profileId
    });

    return (
        <>
            <header>
                <div className="p-4">
                    <SingleActivityNavbar target={props.employerDetails._id} activity="profile" hideReport={isCurrentUser} hideSave={isCurrentUser} isFavorited={props.employerDetails.isFavorited} />
                </div>
                <ProfileHeader profile='employer' userInfo={employerHeaderInfo} isCurrentUser={isCurrentUser} />
            </header>
            <AboutProfile profile='employer' content={props.employerDetails.description || "Employer with no description"} />
            <div className='px-4'>
                <hr />
            </div>
            <OpenJobs jobs={props.employerDetails.openJobs} profileDetails={profileDetails} />
            <aside>
                <ContactSection contactType='employer' details={employerDetail} />
            </aside>
            {
                profileHistory.isLoading ?
                    <Loading />
                    : <div className="px-4">
                        <ProfileHistory completedJobs={profileHistory.data!.completedReviews} inProgressJobs={profileHistory.data!.inProgressReviews} />
                    </div>
            }
        </>
    )
}

export default SingleProfileEmployer