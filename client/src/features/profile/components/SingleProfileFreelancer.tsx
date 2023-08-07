import SingleProfileNav from './SingleProfileNav'
import ProfileHeader from './ProfileHeader'
import ServiceDetail from './ServiceDetail'
import AboutFreelancer from './AboutFreelancer'

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

const aboutFreelancerContent = "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellat officia in libero, praesentium dolor et dolores voluptatibus ipsam quam temporibus molestiae vero aperiam placeat exercitationem tempora, iusto id maiores corporis!";

const SingleProfileFreelancer = () => {
    return (
        <>
            <header>
                <SingleProfileNav isCurrentUser={false} />
                <ProfileHeader userInfo={freelancerInfo} />
            </header>
            <ServiceDetail freelancerServiceDetail={freelancerServiceDetail} />
            <AboutFreelancer content={aboutFreelancerContent} />
        </>
    )
}

export default SingleProfileFreelancer