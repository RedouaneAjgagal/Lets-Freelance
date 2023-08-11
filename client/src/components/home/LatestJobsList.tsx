import JobItem from "./JobItem"

const latestJobsData = [
    {
        _id: "1",
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
        _id: "2",
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
        _id: "3",
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
        _id: "4",
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
            {latestJobsData.map((latestJob) => {
                const tags = [
                    latestJob.location,
                    `Posted ${latestJob.postedAt} ago`,
                    `${latestJob.porposals.length} Porposals`
                ];
                const jobInfo = {
                    _id: latestJob._id,
                    employer: latestJob.employer,
                    title: latestJob.title
                };
                return <JobItem key={latestJob._id} jobInfo={jobInfo} tags={tags} />
            })}
        </ul>
    )
}

export default LatestJobsList