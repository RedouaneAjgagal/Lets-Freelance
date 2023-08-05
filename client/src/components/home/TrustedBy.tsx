import amazonBrand from "/amazon.svg";
import nvidiaBrand from "/nvidia.svg";
import googleBrand from "/google.svg";
import facebookBrand from "/facebook.svg";
import { SwiperSlide } from "swiper/react";
import { BiArrowBack } from "react-icons/bi";
import { Swiper } from "../../layouts/swiper";
const TrustedBy = () => {
    return (
        <div className="flex justify-center relative">
            <button className="prevTrustedBrand absolute left-0 z-20 w-7 h-7 flex justify-center items-center bg-white/90 rounded-full text-slate-500 shadow-lg"><BiArrowBack /></button>
            <Swiper autoPlay={false} spaceBetween={20} slidesPerView={3} navigation pagination={false} nextEl="nextTrustedBrand" prevEl="prevTrustedBrand">
                <SwiperSlide>
                    <div className="flex justify-center items-center h-full select-none">
                        <img src={amazonBrand} alt="" className="w-full max-w-[6rem] h-full" />
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="flex justify-center items-center h-full select-none">
                        <img src={nvidiaBrand} alt="" className="w-full max-w-[6rem] h-full" />
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="flex justify-center items-center h-full select-none">
                        <img src={googleBrand} alt="" className="w-full max-w-[6rem] h-full" />
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="flex justify-center items-center h-full select-none">
                        <img src={facebookBrand} alt="" className="w-full max-w-[6rem] h-full" />
                    </div>
                </SwiperSlide>
            </Swiper>
            <button className="nextTrustedBrand absolute right-0 z-20 w-7 h-7 flex justify-center items-center bg-white/90 rounded-full text-slate-500 shadow-lg"><BiArrowBack className="rotate-180" /></button>
        </div>
    )
}

export default TrustedBy