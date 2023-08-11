import SingleProfileNav from './SingleProfileNav'
import ProfileHeader from './ProfileHeader'
import AboutProfile from './AboutProfile'
import OpenJobs from './OpenJobs';
import ProfileHistory from './ProfileHistory';
import ContactSection from './ContactSection';

const userInfo = {
    name: "employer demo",
    avatar: "https://res.cloudinary.com/dqfrgtxde/image/upload/v1691411025/avatars_lets-freelance/rmd3yizvasptpc4pzqt9.webp",
    location: "New York",
    reviews: 6,
    rating: 5
}

const aboutEmployerContent = "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellat officia in libero, praesentium dolor et dolores voluptatibus ipsam quam temporibus molestiae vero aperiam placeat exercitationem tempora, iusto id maiores corporis! Repellat officia in libero, praesentium dolo.";

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

const openJobs: OpenJob[] = [
    {
        _id: "2",
        title: "English content writer for college",
        location: "Los Angeles",
        category: "writing & translation",
        price: 125,
        jobType: "part time",
        employer: {
            name: "employer demo"
        }
    },
    {
        _id: "1",
        title: "Food delivery mobile app on IOS and Android",
        location: "New York",
        category: "programming & tech",
        price: { start: 15, end: 25 },
        jobType: "full time",
        employer: {
            name: "employer demo"
        }
    }
]

const completedJobs = [
    {
        title: "Fix bugs in my website",
        rating: 3.6,
        startDate: "2023-08-01T00:00:00.000Z",
        endDate: "2023-08-08T00:00:00.000Z",
        content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi tempora voluptatem sunt dolorum vel voluptates harum excepturi unde atque a? Consectetur aperiam accusantium obcaecati praesentium quo! Necessitatibus accusantium nihil dolor."
    },
    {
        title: "Create an admin dashboard",
        rating: 5,
        startDate: "2023-02-03T00:00:00.000Z",
        endDate: "2023-05-16T00:00:00.000Z",
        content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi tempora voluptatem sunt dolorum vel voluptates harum excepturi unde atque a?"
    }
];

const employerDetails = {
    title: "About me",
    location: "New York",
    category: "programming & tech",
    companyName: "Kenavex",
    employees: 0,
    website: "https://github.com/RedouaneAjgagal"
}

const SingleProfileEmployer = () => {

    return (
        <>
            <header>
                <SingleProfileNav isCurrentUser={false} />
                <ProfileHeader userInfo={userInfo} profile="employer" />
            </header>
            <AboutProfile profile='employer' content={aboutEmployerContent} />
            <div className='px-4'>
                <hr />
            </div>
            <OpenJobs jobs={openJobs} />
            <aside>
                <ContactSection contactType='employer' details={employerDetails} />
            </aside>
            <ProfileHistory historyType='contract' completedJobs={completedJobs} inProgressJobs={[]} />
        </>
    )
}

export default SingleProfileEmployer