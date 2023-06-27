import LatestJob from "./LatestJob"

const latestJobsData = [
    {
        id: "1",
        title: "Food delivery mobile app on IOS and Android",
        location: "New York",
        postedAt: "2 weeks",
        porposals: ["user1", "user2", "user3"],
        employer: {
            logo: "https://demoapus1.com/freeio/wp-content/uploads/2022/10/employer5.jpg",
            name: "DesignBlue"
        }
    },
    {
        id: "2",
        title: "English content writer for college",
        location: "Los Angeles",
        postedAt: "1 month",
        porposals: ["user1"],
        employer: {
            logo: "https://demoapus1.com/freeio/wp-content/uploads/2022/10/employer1.jpg",
            name: "MediaAZ"
        }
    },
    {
        id: "3",
        title: "Developer to framework for web agency",
        location: "New York",
        postedAt: "1 month",
        porposals: [],
        employer: {
            logo: "https://demoapus1.com/freeio/wp-content/uploads/2022/10/employer8.png",
            name: "Redesign"
        }
    },
    {
        id: "4",
        title: "Video animator to bring some illustrations to life",
        location: "Los Angeles",
        postedAt: "3 months",
        porposals: ["user1", "user2", "user3", "user4", "user5", "user6", "user7", "user8", "user9",],
        employer: {
            logo: "https://demoapus1.com/freeio/wp-content/uploads/2022/10/employer3.jpg",
            name: "ABConsult"
        }
    },
]

const LatestJobsList = () => {
    return (
        <ul className="mt-4 grid gap-5">
            {latestJobsData.map((latestJob) => <LatestJob key={latestJob.id} latestJobInfo={latestJob} />)}
        </ul>
    )
}

export default LatestJobsList