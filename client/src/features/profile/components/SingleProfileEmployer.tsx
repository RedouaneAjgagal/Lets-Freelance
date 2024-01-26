import ProfileHeader from './ProfileHeader'
import AboutProfile from './AboutProfile'
import OpenJobs from './OpenJobs';
import ProfileHistory from './ProfileHistory';
import ContactSection from './ContactSection';
import { EmployerGeneralProfile } from '../services/getSingleProfileInfo';
import useProfileId from '../hooks/useProfileId';
import { useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '../../../hooks/redux';
import useProfileReviewsQuery from '../hooks/useProfileReviewsQuery';
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

const SingleProfileEmployer = () => {
    const queryCLient = useQueryClient();
    const profileId = useProfileId();
    const profile = queryCLient.getQueryData(["singleProfile", profileId]) as EmployerGeneralProfile

    const { userInfo } = useAppSelector(state => state.authReducer);

    const employerDetail = {
        location: profile.country || "Unknown",
        category: profile.category,
        companyName: profile.roles.employer!.companyName,
        employees: profile.roles.employer!.employees,
        website: profile.roles.employer!.website,
    }

    const employerHeaderInfo = {
        name: profile.name,
        avatar: profile.avatar,
        rating: profile.rating.avgRate,
        reviews: profile.rating.numOfReviews,
        location: profile.country || "Unknown",
    }


    const isCurrentUser = userInfo?.profileId === profile._id;

    const profileHistory = useProfileReviewsQuery();

    return (
        <>
            <header>
                <SingleActivityNavbar activity="profile" hideReport={isCurrentUser} hideSave={isCurrentUser} />
                <ProfileHeader profile='employer' userInfo={employerHeaderInfo} isCurrentUser={isCurrentUser} />
            </header>
            <AboutProfile profile='employer' content={profile.description || "Employer with no description"} />
            <div className='px-4'>
                <hr />
            </div>
            <OpenJobs jobs={profile.openJobs} />
            <aside>
                <ContactSection contactType='employer' details={employerDetail} />
            </aside>
            {
                profileHistory.isLoading ?
                    <Loading />
                    :
                    <ProfileHistory historyType='contract' completedJobs={profileHistory.data!.completedReviews} inProgressJobs={profileHistory.data!.inProgressReviews} />
            }
        </>
    )
}

export default SingleProfileEmployer