import amazonBrand from "/amazon.svg";
import nvidiaBrand from "/nvidia.svg";
import googleBrand from "/google.svg";
import facebookBrand from "/facebook.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import { BiArrowBack } from "react-icons/bi";

import "swiper/css"
import 'swiper/css/navigation';
import "swiper/swiper-bundle.esm.js"

const TrustedBy = () => {
    return (
        <div className="flex justify-center relative">
            <button className="prev absolute left-0 z-20 w-7 h-7 flex justify-center items-center bg-white/90 rounded-full text-slate-500"><BiArrowBack /></button>
            <Swiper
                spaceBetween={20}
                slidesPerView={3}
                navigation={{ nextEl: ".next", prevEl: ".prev" }}

            >
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
            <button className="next absolute right-0 z-20 w-7 h-7 flex justify-center items-center bg-white/90 rounded-full text-slate-500"><BiArrowBack className="rotate-180" /></button>
        </div>
    )
}

export default TrustedBy