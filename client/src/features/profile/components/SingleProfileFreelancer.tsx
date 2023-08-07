import SingleProfileNav from './SingleProfileNav'
import ProfileHeader from './ProfileHeader'
import ServiceDetail from './ServiceDetail'

const freelancerInfo = {
    name: "user demo",
    avatar: "https://res.cloudinary.com/dqfrgtxde/image/upload/v1691242924/avatars_lets-freelance/avyqe1mnd4lzpjmbjlf7.webp",
    jobTitle: "Web developer",
    rating: 5,
    reviews: 3,
    location: "Log Angeles",
    dateOfBirth: "2000-09-01T00:00:00.000Z"
}

const freelancerServiceDetail = {
    projectSuccess: 2,
    totalService: 5,
    completedService: 1,
    inQueueService: 11
}

const SingleProfileFreelancer = () => {
    return (
        <>
            <header>
                <SingleProfileNav isCurrentUser={false} />
                <ProfileHeader userInfo={freelancerInfo} />
            </header>
            <ServiceDetail freelancerServiceDetail={freelancerServiceDetail} />
        </>
    )
}

export default SingleProfileFreelancer