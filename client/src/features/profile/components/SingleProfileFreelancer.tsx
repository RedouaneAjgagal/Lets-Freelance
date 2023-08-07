import SingleProfileNav from './SingleProfileNav'
import ProfileHeader from './ProfileHeader'
import ServiceDetail from './ServiceDetail'
import AboutFreelancer from './AboutFreelancer'
import ProfileEducation from './ProfileEducation'
import ProfileExperience from './ProfileExperience'

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

const educations = [
    {
        title: "Computer Science",
        academy: "Harvard",
        year: "2016-2020",
        description: "orem ipsum, dolor sit amet consectetur adipisicing elit. Repellat officia in libero"
    },
    {
        title: "Full-Stack",
        academy: "Emma",
        year: "2021-2022",
        description: "adipisicing elit. Cupiditate, illo inventore mollitia tempore, pariatur vel doloribus maiores, accusamus commodi magnam dolore consequuntur aut? Sed commodi hic, laudantium distinctio debitis in."
    }
];

const experiences = [
    {
        title: "Frontend Role",
        company: "Pinterest",
        startDate: "2022/08",
        endDate: "2023/03",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium dolores, nemo possimus rem saepe sapiente illo dolor libero distinctio aut necessitatibus? Atque impedit corrupti ab, quod soluta consectetur placeat omnis."
    },
    {
        title: "Backend Role",
        company: "X (Twitter)",
        startDate: "2023/01",
        endDate: "2023/08",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium dolores, nemo possimus rem saepe sapiente illo dolor libero distinctio aut necessitatibus? Atque impedit corrupti ab, quod soluta consectetur placeat omnis."
    }
]

const SingleProfileFreelancer = () => {
    return (
        <>
            <header>
                <SingleProfileNav isCurrentUser={false} />
                <ProfileHeader userInfo={freelancerInfo} />
            </header>
            <ServiceDetail freelancerServiceDetail={freelancerServiceDetail} />
            <AboutFreelancer content={aboutFreelancerContent} />
            <ProfileEducation educations={educations} />
            <ProfileExperience experiences={experiences} />
        </>
    )
}

export default SingleProfileFreelancer