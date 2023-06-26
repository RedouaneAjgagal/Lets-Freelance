import TrendingService from "./TrendingService"
import { SwiperSlide } from "swiper/react";
import { Swiper } from "../../layouts/swiper";
import { BiArrowBack } from "react-icons/bi";

const dummyData = [
    {
        _id: "1",
        img: "https://demoapus1.com/freeio/wp-content/uploads/2022/11/service13-495x370.jpg",
        category: "Development & IT",
        title: "Management software to help you manage your mobile",
        rate: 4.5,
        reviews: 1,
        user: {
            img: "https://demoapus1.com/freeio/wp-content/uploads/2022/09/bg-video-150x150.png",
            name: "Ali Tufan"
        },
        price: 89
    },
    {
        _id: "2",
        img: "https://demoapus1.com/freeio/wp-content/uploads/2022/11/service12-495x370.jpg",
        category: "Design & Creative",
        title: "Developers dron the framework folder into a new parent",
        rate: 4.8,
        reviews: 3,
        user: {
            img: "https://demoapus1.com/freeio/wp-content/uploads/2022/10/12-150x150.jpg",
            name: "Ali Tufan"
        },
        price: 128
    },
    {
        _id: "3",
        img: "https://demoapus1.com/freeio/wp-content/uploads/2022/11/service13-495x370.jpg",
        category: "Development & IT",
        title: "Management software to help you manage your mobile",
        rate: 4.5,
        reviews: 1,
        user: {
            img: "https://demoapus1.com/freeio/wp-content/uploads/2022/09/bg-video-150x150.png",
            name: "Ali Tufan"
        },
        price: 89
    },
    {
        _id: "4",
        img: "https://demoapus1.com/freeio/wp-content/uploads/2022/11/service12-495x370.jpg",
        category: "Design & Creative",
        title: "Developers dron the framework folder into a new parent",
        rate: 4.8,
        reviews: 3,
        user: {
            img: "https://demoapus1.com/freeio/wp-content/uploads/2022/10/12-150x150.jpg",
            name: "Ali Tufan"
        },
        price: 128
    },
    {
        _id: "5",
        img: "https://demoapus1.com/freeio/wp-content/uploads/2022/11/service13-495x370.jpg",
        category: "Development & IT",
        title: "Management software to help you manage your mobile",
        rate: 4.5,
        reviews: 1,
        user: {
            img: "https://demoapus1.com/freeio/wp-content/uploads/2022/09/bg-video-150x150.png",
            name: "Ali Tufan"
        },
        price: 89
    },
]

const TrendingServicesList = () => {
    return (
        <div className="mt-4 relative">
            <button className="prevTrendingService absolute -left-3 top-[47%] -translate-y-1/2 z-20 w-9 h-9 flex justify-center items-center bg-white/90 rounded-full text-slate-500 shadow-lg">
                <BiArrowBack />
            </button>
            <Swiper spaceBetween={10} slidesPerView={1} navigation pagination nextEl="nextTrendingService" prevEl="prevTrendingService">
                {dummyData.map(service => <SwiperSlide tag="li" key={service._id}>
                    <TrendingService serviceInfo={service} />
                </SwiperSlide>)}
            </Swiper>
            <button className="nextTrendingService absolute -right-3 top-[47%] -translate-y-1/2 z-20 w-9 h-9 flex justify-center items-center bg-white/90 rounded-full text-slate-500 shadow-lg">
                <BiArrowBack className="rotate-180" />
            </button>
        </div>
    )
}

export default TrendingServicesList