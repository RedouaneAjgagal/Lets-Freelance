import HighestRatedFreelancer from "./HighestRatedFreelancer"
import { SwiperSlide } from "swiper/react";
import Slider from "../Slider";

const highestRatedFreelancerData = [
    {
        _id: "1",
        name: "Samuel Smith",
        img: "https://demoapus1.com/freeio/wp-content/uploads/2022/10/team2-150x150.jpg",
        job: "UI/UX Designer",
        rate: 4,
        reviews: 0,
        tags: ["Design Writing", "Figma", "Illustration"],
        location: "New York",
        hourlyRate: {
            min: 65,
            max: 75
        }
    },
    {
        _id: "2",
        name: "Agent Pakulla",
        img: "https://demoapus1.com/freeio/wp-content/uploads/2022/10/12-150x150.jpg",
        job: "Full Stack Developer",
        rate: 4.3,
        reviews: 3,
        tags: ["React", "MongoDB"],
        location: "Los Angeles",
        hourlyRate: {
            min: 35,
            max: 50
        }
    },
    {
        _id: "3",
        name: "John Powell",
        img: "https://demoapus1.com/freeio/wp-content/uploads/2022/10/5-150x150.jpg",
        job: "Product Manager",
        rate: 4.8,
        reviews: 1,
        tags: ["Animation", "Creative"],
        location: "Los Angeles",
        hourlyRate: {
            min: 55,
            max: 60
        }
    }
]

const HighestRatedFreelancersList = () => {
    return (
        <div className="mt-4">
            <Slider isPagination slidesPerView={1} isAutoPlay={false}>
                {highestRatedFreelancerData.map((freelancer) =>
                    <SwiperSlide key={freelancer._id}>
                        <HighestRatedFreelancer freelancerInfo={freelancer} />
                    </SwiperSlide>
                )}
            </Slider>
        </div>
    )
}

export default HighestRatedFreelancersList