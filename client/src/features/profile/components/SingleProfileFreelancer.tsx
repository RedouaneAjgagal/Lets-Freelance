import SingleProfileNav from './SingleProfileNav'
import ProfileHeader from './ProfileHeader'

const userInfo = {
    name: "user demo",
    avatar: "https://res.cloudinary.com/dqfrgtxde/image/upload/v1691242924/avatars_lets-freelance/avyqe1mnd4lzpjmbjlf7.webp",
    jobTitle: "Web developer",
    rating: 5,
    reviews: 3,
    location: "Log Angeles",
    dateOfBirth: "2000-09-01T00:00:00.000Z"
}

const SingleProfileFreelancer = () => {
    return (
        <>
            <header>
                <SingleProfileNav isCurrentUser={false} />
                <ProfileHeader userInfo={userInfo} />
            </header>
        </>
    )
}

export default SingleProfileFreelancer