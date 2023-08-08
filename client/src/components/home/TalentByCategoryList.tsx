import TalentByCategory from "./TalentByCategory";
import { SwiperSlide } from "swiper/react";
import Slider from "../Slider";

const telentCategory = [
    {
        _id: "1",
        img: "https://cdn-icons-png.flaticon.com/512/2010/2010990.png",
        services: 8,
        category: "Development & It"
    },
    {
        _id: "2",
        img: "https://cdn-icons-png.flaticon.com/512/3159/3159310.png",
        services: 11,
        category: "Design & Creative"
    },
    {
        _id: "3",
        img: "https://cdn-icons-png.flaticon.com/512/3141/3141158.png",
        services: 36,
        category: "Digital Marketing"
    },
    {
        _id: "4",
        img: "https://cdn-icons-png.flaticon.com/512/684/684831.png",
        services: 102,
        category: "Writing & Translation"
    },
    {
        _id: "5",
        img: "https://cdn-icons-png.flaticon.com/512/9453/9453463.png",
        services: 6,
        category: "Video & Animation"
    },
    {
        _id: "6",
        img: "https://cdn-icons-png.flaticon.com/512/1570/1570887.png",
        services: 2,
        category: "Finance & Accounting"
    },
]

const TalentByCategoryList = () => {
    return (
        <div className="mt-4">
            <Slider slidesPerView={2} isPagination isAutoPlay>
                {telentCategory.map((category) =>
                    <SwiperSlide key={category._id} tag="li">
                        <TalentByCategory categoryInfo={category} />
                    </SwiperSlide>
                )}
            </Slider>
        </div>
    )
}

export default TalentByCategoryList